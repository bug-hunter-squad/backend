const tempRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');
const { searchFilterFlight, flightBooking } = require('../app/controllers/tempFlightController');

tempRoutes.get('/', asyncHandler(searchFilterFlight));
tempRoutes.post('/:flightId/booking/profile/:userId', urlencoded, asyncHandler(flightBooking));

module.exports = tempRoutes;
