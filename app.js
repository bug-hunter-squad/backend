require('dotenv').config();

// MIDDLEWARES
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errorHandler } = require('./app/middlewares/errorHandler');
const { ErrorResponse } = require('./utils/errorResponse');

// CONFIG
const app = express();
const port = process.env.PORT || process.env.LOCAL_PORT;

// MIDDLEWARES USAGE
app.use(helmet({ extends: false }));
app.use(bodyParser.json());

// CONTROLLER DECLARATION
/* Controller */

// PUBLIC ROUTES
app.get('/', (req, res) => {
  const firstNumber = 1;
  const secondNumber = 9;
  const counter = firstNumber + secondNumber;

  if ((counter % 2) !== 0) throw new ErrorResponse('Bukan bilangan genap!');
  res.status(200).send({ message: 'Bilangan genap!' });
});

// PRIVATE ROUTES
/* Routes list */

// ERROR HANDLER
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
