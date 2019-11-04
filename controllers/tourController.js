const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

    const tours = await query;

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
      message: 'No tours found'
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
