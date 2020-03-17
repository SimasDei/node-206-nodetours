const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const document = await query;

    if (!document) return next(new AppError('No such document found', 404));

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) return next(new AppError('No such document found', 404));
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) return next(new AppError('No such document found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
