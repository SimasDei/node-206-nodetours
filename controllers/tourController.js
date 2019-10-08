const fs = require('fs');

/**
 * @resource - Tour data
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ success: true, results: tours.length, data: { tours } });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res
        .status(201)
        .json({ success: true, results: tours.length, data: { tours } });
    }
  );
};
exports.getTour = (req, res) => {
  const { id } = req.params;
  if (id > tours.length) {
    return res.status(404).json({ success: false, msg: 'No tour found' });
  }

  const tour = tours.find(tour => tour.id === parseInt(id, 10));
  res.status(200).json({ success: true, data: { tour } });
};
exports.updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(tour => tour.id === parseInt(id, 10));

  if (tour) {
    return res.status(200).json({ success: true, data: { tour } });
  } else
    return res.status(404).json({ success: false, msg: 'No such tour found' });
};
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(tour => tour.id === parseInt(id, 10));

  if (tour) {
    return res.status(200).json({ success: true, data: null });
  } else
    return res.status(404).json({ success: false, msg: 'No such tour found' });
};