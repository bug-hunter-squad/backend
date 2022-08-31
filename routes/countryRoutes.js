const countryRoutes = require('express').Router();
const { asyncHandler } = require('../app/middlewares/asyncHandler');
const { UploadCountry } = require('../app/middlewares/multer');

const { addCountry, getCountries, editCountry, deleteCountry, getCountriesById } = require('../app/controllers/countryController');

countryRoutes.get('/', asyncHandler(getCountries)).get('/:countryId', asyncHandler(getCountriesById))
  .post('/', UploadCountry, asyncHandler(addCountry))
  .patch('/:countryId', UploadCountry, asyncHandler(editCountry))
  .delete('/:countryId', asyncHandler(deleteCountry));

module.exports = countryRoutes;
