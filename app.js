const express = require('express');
const morgan = require('morgan');

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

app.use(express.json());

/**
 * @middlewares
 */
app.use(morgan('dev'));

/**
 * @routes
 */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/**
 * @server
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on http://localhost:${PORT}  ⛵`
  );
});
