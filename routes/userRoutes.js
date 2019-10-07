const express = require('express');
const fs = require('fs');

const router = express.Router();

/**
 * @resource - Users data
 */
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const getAllUsers = (req, res) => {
  res
    .status(200)
    .json({ success: true, results: users.length, data: { users } });
};
const createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);

  users.push(newUser);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res
        .status(201)
        .json({ success: true, results: users.length, data: { users } });
    }
  );
};
const getUser = (req, res) => {
  const { id } = req.params;
  if (id > users.length) {
    return res.status(404).json({ success: false, msg: 'No user found' });
  }

  const user = users.find(user => user._id === id);
  res.status(200).json({ success: true, data: { user } });
};
const updateUser = (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user._id === id);

  if (user) {
    return res.status(200).json({ success: true, data: { user } });
  } else
    return res.status(404).json({ success: false, msg: 'No such user found' });
};
const deleteUser = (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user._id === id);

  if (user) {
    return res.status(200).json({ success: true, data: null });
  } else
    return res.status(404).json({ success: false, msg: 'No such user found' });
};

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
  .get(getAllUsers)
  .post(createUser);

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
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

  module.exports = router;