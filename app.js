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
const profileRoutes = require('./routes/profileRoutes');
const airlineRoutes = require('./routes/airlineRoutes');
const flightRoutes = require('./routes/flightRoutes');

// PUBLIC ROUTES
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/airlines', airlineRoutes);
app.use('/flight', flightRoutes);

// PRIVATE ROUTES
/* Routes list */

// ERROR HANDLER
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
