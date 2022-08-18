const profileRoutes = require('express').Router();
const { asyncHandler } = require('../app/middlewares/asyncHandler');
const { uploadProfile } = require('../app/middlewares/upload');

const { getProfile, editProfile } = require('../app/controllers/profileController');

profileRoutes.get('/:userId', asyncHandler(getProfile))
  .patch('/:userId', uploadProfile, asyncHandler(editProfile));

module.exports = profileRoutes;
