const usersRouters = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');

const { register, login ,forgotPassword} = require('../app/controllers/authController');

usersRouters.post('/register', urlencoded, asyncHandler(register));
usersRouters.post('/login', urlencoded, asyncHandler(login));
usersRouters.post('/forgot', urlencoded,(forgotPassword));

module.exports = usersRouters;
