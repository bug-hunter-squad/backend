const flightRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');
const {
  deletedFlightInformation,
  createFlightsInformation,
  editFlightsInformation,
  getDetailFlightsInformation,
  searchFilterFlight,
  flightBooking,
  trendingDestination
} = require('../app/controllers/flightController');

flightRoutes.get('/trending', asyncHandler(trendingDestination));

flightRoutes.post('/', urlencoded, createFlightsInformation)
  .get('/', asyncHandler(searchFilterFlight));

flightRoutes.patch('/:flightId', urlencoded, editFlightsInformation)
  .delete('/:flightId', deletedFlightInformation)
  .get('/:id', getDetailFlightsInformation);

flightRoutes.post('/:flightId/booking/profile/:userId', urlencoded, asyncHandler(flightBooking));

module.exports = flightRoutes;
