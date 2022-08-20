const airlineRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
// const { uploadAirlines } = require('../app/middlewares/upload.js');

const {
  getAirline,
  createAirlines,
  editAirlines,
  deleteAirlines
} = require('../app/controllers/airlineController');
// uploadAirlines,
airlineRoutes.get('/', getAirline);
airlineRoutes.post('/', urlencoded,  (createAirlines));
airlineRoutes.patch('/:airlinesId', urlencoded,  (editAirlines));
airlineRoutes.delete('/:airlinesId', deleteAirlines);

module.exports = airlineRoutes;
