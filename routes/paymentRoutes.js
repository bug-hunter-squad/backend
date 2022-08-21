const paymentRoutes = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');

const { notifications } = require('../app/controllers/paymentController');

paymentRoutes.post('/notifications', urlencoded, asyncHandler(notifications));

module.exports = paymentRoutes;
