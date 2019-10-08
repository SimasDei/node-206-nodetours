const app = require('./app');

/**
 * @server
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Ahoy Sailor o/. Server is runnin' on http://localhost:${PORT}  ⛵`
  );
});
