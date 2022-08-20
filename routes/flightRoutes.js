const { getAllFlights, deletedFlightInformation, createFlightsInformation, editFlightsInformation, getDetailFlightsInformation } = require('../app/controllers/flightController');
const flightRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });

flightRoutes.get('/', getAllFlights);
// flightRoutes.get('/:flightId', getFlightsInformationById);
flightRoutes.get('/:id', getDetailFlightsInformation);
flightRoutes.post('/', urlencoded, createFlightsInformation);
flightRoutes.patch('/:flightId', urlencoded, editFlightsInformation);
flightRoutes.delete('/:flightId', deletedFlightInformation);

module.exports = flightRoutes;
