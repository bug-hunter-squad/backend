const airlineRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { uploadAirlines } = require('../app/middlewares/upload.js');

const {
  getAirline,
  createAirlines,
  editAirlines,
  deleteAirlines
} = require('../app/controllers/airlineController');

airlineRoutes.get('/', getAirline);
airlineRoutes.post('/', urlencoded, uploadAirlines, (createAirlines));
airlineRoutes.patch('/:airlinesId', urlencoded, uploadAirlines, (editAirlines));
airlineRoutes.delete('/:airlinesId', deleteAirlines);

module.exports = airlineRoutes;
