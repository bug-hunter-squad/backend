const { ErrorResponse } = require("../../utils/errorResponse");
const { registerUser, getUserByEmail } = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("../middlewares/sendForgotPassword");
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, role } = req?.body;
  let { password } = req?.body;

  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  const fieldValidation = !name || !email || !password || !role;
  if (fieldValidation)
    throw new ErrorResponse("Please, do not leave anything blank!", 422);

  const roleValidation = role !== "customer" && role !== "admin";
  if (roleValidation)
    throw new ErrorResponse("Something wrong, please contact us!", 422);

  await registerUser({ name, email, role, password });
  res.status(200).send({ message: "Registration successful!" });
};

const login = async (req, res) => {
  const { email, password } = req?.body;

  const userDataResponse = await getUserByEmail({ email });

  const passwordChecker = bcrypt.compareSync(
    password,
    userDataResponse?.rows?.[0]?.password
  );
  if (!passwordChecker) throw new ErrorResponse("Invalid password", 401);

  const userData = userDataResponse?.rows?.[0];
  const tokenPayload = {
    id: userData?.id,
    name: userData?.name,
    email: userData?.email,
    role: userData?.role,
    city: userData?.city,
    country: userData?.country,
    profilePicture: userData?.profile_picture,
  };

  const token = jwt.sign(tokenPayload, process.env.PRIVATE_KEY, {
    expiresIn: "24h",
  });
  res.status(200).send({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const findUserByEmail = await getUserByEmail({ email });
    if (!findUserByEmail) return res.send(404, { message: "Email not found" });
    const userData = findUserByEmail?.rows?.[0];
    const tokenPayload = {
      id: userData?.id,
      name: userData?.name,
      email: userData?.email,
      role: userData?.role,
      city: userData?.city,
      country: userData?.country,
      profilePicture: userData?.profile_picture,
    };
    const token = jwt.sign(tokenPayload, process.env.PRIVATE_KEY, {
      expiresIn: "24h",
    });
    const templateEmail = {
      from: process.env.FROM_SEND_OTP,
      to: email,
      subject: "Forgot Password",
      html: `<p>Hey ${email} To forget the password, enter this link reset password </p></br><strong>${token}</strong>`,
    };
    await sendOtp(templateEmail);
    res.send({ message: "OTP code sent to email" });
  } catch (error) {
    console.log(error);
    res.send(404, { error: error.message });
  }
};

module.exports = { register, login, forgotPassword };
