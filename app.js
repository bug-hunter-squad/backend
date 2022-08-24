require('dotenv').config();
const cors = require('cors');
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
app.use('/public', express.static('public'));

// cors
const allowlist = ['http://localhost:3000', 'https://client-bug-hunter.vercel.app'];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

// ROUTES DECLARATION
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const airlineRoutes = require('./routes/airlineRoutes');
const flightRoutes = require('./routes/flightRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// PUBLIC ROUTES
app.use('/auth', authRoutes);
app.use('/profile', userRoutes);
app.use('/airlines', airlineRoutes);
app.use('/flight', flightRoutes);
app.use('/payment', paymentRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ERROR HANDLER
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
