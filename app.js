const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

/**
 * @data - Tour data
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
);

/**
 * @route - tours
 * @request - GET
 */
app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ success: true, results: tours.length, data: { tours } });
});

/**
 * @route - tours
 * @request - POST
 */
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({ success: true, results: tours.length, data: { tours } });
    }
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on port ${PORT} http://localhost:3000`
  );
});
