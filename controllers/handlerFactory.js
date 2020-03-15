const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) return next(new AppError('No such document found', 404));

    res.status(201).json({
      status: 'success',
      data: null,
    });
  });
