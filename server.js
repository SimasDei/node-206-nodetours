const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to the Database 🎉. ✨.'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on  http://localhost:${port} 🎈.  🎆.  🎇.`);
});
