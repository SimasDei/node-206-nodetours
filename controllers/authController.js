const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const {
    headers: { authorization },
    cookies,
  } = req;
  let token;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (cookies && cookies.jwt) token = cookies.jwt;

  if (!token) return next(new AppError('Please login first', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const hydratedUser = await User.findById(decoded.id);
  if (!hydratedUser) {
    return next(new AppError('The user no longer exists', 401));
  }

  if (hydratedUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed their password', 401));
  }

  req.user = hydratedUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const { cookies } = req;

  if (cookies && cookies.jwt) {
    const decoded = await promisify(jwt.verify)(cookies.jwt, process.env.JWT_SECRET);

    const hydratedUser = await User.findById(decoded.id);
    if (!hydratedUser) {
      return next();
    }

    if (hydratedUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    res.locals.user = hydratedUser;
    return next();
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('User with the provided email was not found', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Use this link to reset your password. 👉 \n ${resetURL} \n If  you didn't request a password reset, ignore this email 🦮`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset (valid for 10 min ⏰)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Password reset token has been sent to provided email 👍',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending email 💥💥, please try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const {
    body: { passwordCurrent, password, passwordConfirm },
  } = req;
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('The provided password is not valid 😭', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
});
