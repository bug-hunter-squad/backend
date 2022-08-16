const { ErrorResponse } = require('../../utils/errorResponse');
const { registerUser, getUserByEmail } = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, role } = req?.body;
  let { password } = req?.body;

  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  const fieldValidation = !name || !email || !password || !role;
  if (fieldValidation) throw new ErrorResponse('Please, do not leave anything blank!', 422);

  const roleValidation = (role !== 'customer') && (role !== 'admin');
  if (roleValidation) throw new ErrorResponse('Something wrong, please contact us!', 422);

  await registerUser({ name, email, role, password });
  res.status(200).send({ message: 'Registration successful!' });
};

const login = async (req, res) => {
  const { email, password } = req?.body;

  const userDataResponse = await getUserByEmail({ email });

  const passwordChecker = bcrypt.compareSync(password, userDataResponse?.rows?.[0]?.password);
  if (!passwordChecker) throw new ErrorResponse('Invalid password', 401);

  const userData = userDataResponse?.rows?.[0];
  const tokenPayload = {
    id: userData?.id,
    name: userData?.name,
    email: userData?.email,
    role: userData?.role,
    city: userData?.city,
    country: userData?.country,
    profilePicture: userData?.profile_picture

  };

  const token = jwt.sign(tokenPayload, process.env.PRIVATE_KEY, { expiresIn: '24h' });
  res.status(200).send({ token });
};

module.exports = { register, login };
