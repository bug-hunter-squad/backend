const profileRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');
const { UploadProfile } = require('../app/middlewares/multer');
const { getProfile, editProfile, getBookings, getDetailBooking, rateFlight, getReviews, bookingCancel } = require('../app/controllers/userController');

profileRoutes.get('/:userId', asyncHandler(getProfile))
  .patch('/:userId', UploadProfile, asyncHandler(editProfile));

profileRoutes.get('/:userId/booking', asyncHandler(getBookings));
profileRoutes.get('/:userId/booking/:bookingId', asyncHandler(getDetailBooking))
  .patch('/:userId/booking/:bookingId', asyncHandler(bookingCancel));

profileRoutes.get('/:userId/my-review', asyncHandler(getReviews))
  .patch('/:userId/my-review/booking/:bookingId', urlencoded, asyncHandler(rateFlight));

module.exports = profileRoutes;
