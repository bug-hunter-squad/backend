const profileRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');
// const { uploadProfile } = require('../app/middlewares/upload');
const { getProfile, editProfile, getBookings, getDetailBooking, rateFlight, getReviews } = require('../app/controllers/userController');
//  uploadProfile,
profileRoutes.get('/:userId', asyncHandler(getProfile))
  .patch('/:userId', asyncHandler(editProfile));

profileRoutes.get('/:userId/booking', asyncHandler(getBookings));
profileRoutes.get('/:userId/booking/:bookingId', asyncHandler(getDetailBooking));

profileRoutes.get('/:userId/my-review', asyncHandler(getReviews))
  .patch('/:userId/my-review/booking/:bookingId', urlencoded, asyncHandler(rateFlight));

module.exports = profileRoutes;
