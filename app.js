require('dotenv').config();

// MIDDLEWARES
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errorHandler } = require('./app/middlewares/errorHandler');

// CONFIG
const app = express();
const port = process.env.PORT || process.env.LOCAL_PORT;

// MIDDLEWARES USAGE
app.use(helmet());
app.use(bodyParser.json());

// ROUTES DECLARATION
const authRoutes = require('./routes/authRoutes');

// PUBLIC ROUTES
app.use('/auth', authRoutes);

// PRIVATE ROUTES
/* Routes list */

// ERROR HANDLER
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
