const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

/**
 * @route - tours
 * @request - GET
 * @action  - Get all tours
 */
/**
 * @route - tours
 * @request - POST
 * @action - create a new tour
 * @param {Object} newTour [newTour={}]
 */
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

/**
 * @route - tours
 * @request - GET
 * @action - Get single tour
 * @param {Number} id [id=3]  - tour id
 */
/**
 * @route - tours
 * @request - PATCH
 * @action - create a new tour
 * @param {Number} id [id=33]
 * @param {Object} tour [tour={title:lol}]
 */
/**
 * @route - tours
 * @request - DELETE
 * @action - delete a tour
 * @param {Number} id [id=33]
 */
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
