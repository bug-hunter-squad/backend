const { deletedFlightInformation, createFlightsInformation, editFlightsInformation, getDetailFlightsInformation, searchFilterFlight, flightBooking } = require('../app/controllers/flightController');
const flightRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');

flightRoutes.get('/:id', getDetailFlightsInformation);
flightRoutes.post('/', urlencoded, createFlightsInformation);
flightRoutes.patch('/:flightId', urlencoded, editFlightsInformation);
flightRoutes.delete('/:flightId', deletedFlightInformation);
flightRoutes.get('/', asyncHandler(searchFilterFlight));
flightRoutes.post('/:flightId/booking/profile/:userId', urlencoded, asyncHandler(flightBooking));

module.exports = flightRoutes;
