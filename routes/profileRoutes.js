const profileRoutes = require('express').Router();
const { asyncHandler } = require('../app/middlewares/asyncHandler');

const { getProfile } = require('../app/controllers/profileController');

profileRoutes.get('/:userId', asyncHandler(getProfile));

module.exports = profileRoutes;
