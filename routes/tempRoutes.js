const tempRoutes = require('express').Router();
const { asyncHandler } = require('../app/middlewares/asyncHandler');
const searchFlight = require('../app/controllers/tempSearchFlight');

tempRoutes.get('/', asyncHandler(searchFlight));

module.exports = tempRoutes;
