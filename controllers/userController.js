const fs = require('fs');

/**
 * @resource - Users data
 */
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = (req, res) => {
  res
    .status(200)
    .json({ success: true, results: users.length, data: { users } });
};
exports.createUser = (req, res) => {
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
exports.getUser = (req, res) => {
  const { id } = req.params;
  if (id > users.length) {
    return res.status(404).json({ success: false, msg: 'No user found' });
  }

  const user = users.find(user => user._id === id);
  res.status(200).json({ success: true, data: { user } });
};
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user._id === id);

  if (user) {
    return res.status(200).json({ success: true, data: { user } });
  } else
    return res.status(404).json({ success: false, msg: 'No such user found' });
};
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user._id === id);

  if (user) {
    return res.status(200).json({ success: true, data: null });
  } else
    return res.status(404).json({ success: false, msg: 'No such user found' });
};