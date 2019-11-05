const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(201).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'No such tour'
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid request'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updateTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour: updateTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid request'
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);
    res.status(201).json({
      status: 'success',
      data: {
        tour: deletedTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid request'
    });
  }
};
