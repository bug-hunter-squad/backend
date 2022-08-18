/* eslint-disable camelcase */
const { getUserById, editProfileModel } = require('../models/Profile');
const cloudinary = require('../middlewares/couldinary');

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

const editProfile = async (req, res) => {
  const { userId } = req.params;
  const { email, phoneNumber, name, city, country, postCode, role } = req.body;
  const profilePictureUrl = req?.file?.secure_url;
  const profilePictureId = req?.file?.public_id;

  const responseGetUser = await getUserById({ userId });
  const currentUserData = responseGetUser?.rows?.[0];

  const profilePictureChecker = profilePictureUrl && profilePictureId && currentUserData?.profile_picture_id;
  if (profilePictureChecker) await cloudinary.uploader.destroy(currentUserData?.profile_picture_id);

  const dataToSend = {
    id: userId,
    name: name || currentUserData?.name,
    email: email || currentUserData?.email,
    phoneNumber: phoneNumber || currentUserData?.phone_number,
    city: city || currentUserData?.city,
    country: country || currentUserData?.country,
    postCode: postCode || currentUserData?.post_code,
    profilePicture: profilePictureUrl || currentUserData?.profile_picture,
    profilePictureId: profilePictureId || currentUserData?.profile_picture_id,
    role: role || currentUserData?.role
  };

  await editProfileModel(dataToSend);

  res.status(200).send({ message: 'Profile update successful!' });
};

module.exports = { getProfile, editProfile };
