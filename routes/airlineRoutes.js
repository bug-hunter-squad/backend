const airlineRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const {UploadAirlines} = require('../app/middlewares/multer')

const {
  getAirline,
  createAirlines,
  editAirlines,
  deleteAirlines
} = require('../app/controllers/airlineController');

airlineRoutes.get('/', getAirline);
airlineRoutes.post('/', urlencoded, UploadAirlines, createAirlines);
airlineRoutes.patch('/:airlinesId', editAirlines);
airlineRoutes.delete('/:airlinesId', deleteAirlines);

module.exports = airlineRoutes;
