const express = require('express');
const morgan = require('morgan');

const tourRouter = require(`./routes/tourRoutes.js`);
const userRouter = require(`./routes/userRoutes.js`);

const app = express();

app.use(express.json());

/**
 * @middlewares
 */
app.use(morgan('dev'));

/**
 * @server
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on http://localhost:${PORT}  ⛵`
  );
});
