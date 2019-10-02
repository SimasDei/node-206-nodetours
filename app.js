const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

/**
 * @data - Tour data
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on port ${PORT} http://localhost:3000`
  );
});
