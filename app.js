const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

app.use(express.json());

/**
 * @middlewares
 */
app.use(morgan('dev'));

/**
 * @resource - Tour data
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/**
 * 
 * @resource - Users data
 */
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));


/**
 * @routes
 */

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ success: true, results: tours.length, data: { tours } });
};
const getTour = (req, res) => {
  const { id } = req.params;
  if (id > tours.length) {
    return res.status(404).json({ success: false, msg: 'No tour found' });
  }

  const tour = tours.find(tour => tour.id === parseInt(id, 10));
  res.status(200).json({ success: true, data: { tour } });
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res
        .status(201)
        .json({ success: true, results: tours.length, data: { tours } });
    }
  );
};
const updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(tour => tour.id === parseInt(id, 10));

  if (tour) {
    return res.status(200).json({ success: true, data: { tour } });
  } else
    return res.status(404).json({ success: false, msg: 'No such tour found' });
};
const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(tour => tour.id === parseInt(id, 10));

  if (tour) {
    return res.status(200).json({ success: true, data: null });
  } else
    return res.status(404).json({ success: false, msg: 'No such tour found' });
};

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
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res
        .status(201)
        .json({ success: true, results: users.length, data: { users } });
    }
  );
};

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
app.route('/api/v1/tours').get(getAllTours).post(createTour)

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
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)


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
app.route('/api/v1/users').get(getAllUsers).post(createUser)

/**
 * @server
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on http://localhost:${PORT}  ⛵`
  );
});
