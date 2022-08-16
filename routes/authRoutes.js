const usersRouters = require('express').Router();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const { asyncHandler } = require('../app/middlewares/asyncHandler');

const { register, login } = require('../app/controllers/authController');

usersRouters.post('/register', urlencoded, asyncHandler(register));
usersRouters.post('/login', urlencoded, asyncHandler(login));

module.exports = usersRouters;
