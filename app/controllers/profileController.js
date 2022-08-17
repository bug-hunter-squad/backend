/* eslint-disable camelcase */
const { getUserById } = require('../models/Profile');

const getProfile = async (req, res) => {
  const { userId } = req?.params;
  const userProfileResponse = await getUserById({ userId });

  const { id, name, email, phone_number, city, country, post_code, profile_picture, role } = userProfileResponse?.rows?.[0];
  const responseData = {
    id,
    name,
    email,
    phoneNumber: phone_number,
    city,
    country,
    postCode: post_code,
    profilePicture: profile_picture,
    role
  };

  res.status(200).send(responseData);
};

module.exports = { getProfile };
