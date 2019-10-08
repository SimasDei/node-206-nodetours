const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @route - users
 * @request - GET
 * @action  - Get all users
 */
/**
 * @route - users
 * @request - POST
 * @action - create a new user
 * @param {Object} newUser [newUser={}]
 */
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

/**
 * @route - users
 * @request - GET
 * @action - Get single user
 * @param {Number} id [id=3]  - user id
 */
/**
 * @route - users
 * @request - PATCH
 * @action - create a new user
 * @param {Number} id [id=33]
 * @param {Object} user [user={title:lol}]
 */
/**
 * @route - users
 * @request - DELETE
 * @action - delete a user
 * @param {Number} id [id=33]
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
