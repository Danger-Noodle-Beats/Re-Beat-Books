const path = require('path');
const express = require('express');
const app = express();
//require api router
const apiRouter = require('./routes/api');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
/**
 * Handle parsing request body
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * handle requests for static files
 */

if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
  app.get('/', (req, res) =>
    res.status(200).sendFile(path.join(__dirname, '../dist/index.html'))
  );
}
/**
 * Define route handlers
 *
 */
app.use('/api/', apiRouter);

/**
 * Catch-all for unknown routes
 */
app.use((req, res) => {
  res.status(404).send('This is not the albumBook you are looking for...');
});

/**
 * Express Error Handler
 */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 *
 * Start server
 */
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}...`));

module.exports = app;
