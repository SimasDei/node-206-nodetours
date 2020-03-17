const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

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

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    /**
     * @summary - enables GET reviews on Tour
     */
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;

    res.status(201).json({
      status: 'success',
      results: document.length,
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
