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

/**
 * @route - tours
 * @request - GET
 * @action  - Get all tours
 */
app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ success: true, results: tours.length, data: { tours } });
});

/**
 * @route - tours
 * @request - GET
 * @action - Get single tour
 * @param {Number} id [id=3]  - tour id
 */
app.get('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;
  if (id > tours.length) {
    return res.status(404).json({ success: false, msg: 'No tour found' });
  }

  const tour = tours.find(tour => tour.id === parseInt(id, 10));
  res.status(200).json({ success: true, data: { tour } });
});

/**
 * @route - tours
 * @request - POST
 * @action - create a new tour
 */
app.post('/api/v1/tours', (req, res) => {
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
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on port ${PORT} http://localhost:3000`
  );
});
