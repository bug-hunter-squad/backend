/* eslint-disable camelcase */
const { getUserById, editProfileModel, getAllBookingsModel, getDetailBookingModel, rateFlightModel, getFlightReviewsModel } = require('../models/User');
const { flightTimeConverter, timestampConverter } = require('../../utils/timeConverter');
const cloudinary = require('../middlewares/couldinary');
const { ErrorResponse } = require('../../utils/errorResponse');

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

const getBookings = async (req, res) => {
  const { userId } = req.params;

  const getBookingsResponse = await getAllBookingsModel({ userId });
  const bookingsData = getBookingsResponse?.rows;

  bookingsData?.map(item => {
    if (item.flight_time) item.flight_time = flightTimeConverter(item?.flight_time);
    if (item.booking_date) item.booking_date = timestampConverter(item?.booking_date);
    if (item.departure_time) item.departure_time = timestampConverter(item?.departure_time);
    if (item.arrival_time) item.arrival_time = timestampConverter(item?.arrival_time);
    return item;
  });

  const bookingsInformation = bookingsData?.map(item => ({
    bookingId: item?.id,
    userId: item?.user_id,
    flightId: item?.flight_id,
    bookingStatus: item?.booking_status,
    bookingDate: item?.booking_date,
    totalChildPassenger: item?.total_child_passenger,
    totalAdultPassenger: item?.total_adult_passenger,
    flightClass: item?.flight_class,
    totalPrice: item?.total_price,
    rating: item?.rating,
    flightOriginal: item?.original,
    flightDestination: item?.destination,
    terminal: item?.terminal,
    gate: item?.gate,
    departureTime: item?.departure_time,
    arrivalTime: item?.arrival_time,
    flightTime: item?.flight_time,
    airlineName: item?.airline_name,
    airlineLogo: item?.airline_logo,
    airlinePic: item?.airline_pic,
    airlinePicPhoneNumber: item?.airline_pic_phone_number
  }));

  res.status(200).send(bookingsInformation);
};

const getDetailBooking = async (req, res) => {
  const { userId, bookingId } = req.params;

  await getUserById({ userId });
  const detailBookingResponse = await getDetailBookingModel({ bookingId, userId });
  const detailBookingData = detailBookingResponse?.rows;

  detailBookingData?.map(item => {
    if (item.flight_time) item.flight_time = flightTimeConverter(item?.flight_time);
    if (item.booking_date) item.booking_date = timestampConverter(item?.booking_date);
    if (item.departure_time) item.departure_time = timestampConverter(item?.departure_time);
    if (item.arrival_time) item.arrival_time = timestampConverter(item?.arrival_time);
    return item;
  });

  const detailBookingInformation = detailBookingData?.map(item => ({
    bookingId: item?.id,
    userId: item?.user_id,
    flightId: item?.flight_id,
    bookingStatus: item?.booking_status,
    bookingDate: item?.booking_date,
    totalChildPassenger: item?.total_child_passenger,
    totalAdultPassenger: item?.total_adult_passenger,
    flightClass: item?.flight_class,
    totalPrice: item?.total_price,
    rating: item?.rating,
    flightOriginal: item?.original,
    flightDestination: item?.destination,
    terminal: item?.terminal,
    gate: item?.gate,
    departureTime: item?.departure_time,
    arrivalTime: item?.arrival_time,
    flightTime: item?.flight_time,
    airlineName: item?.airline_name,
    airlineLogo: item?.airline_logo,
    airlinePic: item?.airline_pic,
    airlinePicPhoneNumber: item?.airline_pic_phone_number
  }));
  res.status(200).send(detailBookingInformation?.[0]);
};

const rateFlight = async (req, res) => {
  const { userId, bookingId } = req.params;
  let { rating } = req.body;

  await getUserById({ userId });
  const getDetailBookingResponse = await getDetailBookingModel({ bookingId, userId });

  rating = rating || getDetailBookingResponse?.rows?.[0]?.rating;
  if (rating < 0 || rating > 5) throw new ErrorResponse('Sorry, accepted rating range is 1 - 5');

  await rateFlightModel({ userId, bookingId, rating });
  res.status(200).send({ message: 'Thankyou for rating our flight!' });
};

const getReviews = async (req, res) => {
  const { userId } = req.params;

  // Validator
  await getUserById({ userId });

  const currentDate = new Date();
  const flightReviewsResponse = await getFlightReviewsModel({ userId, currentDate });
  const flightReviewsData = flightReviewsResponse?.rows;
  flightReviewsData?.map(item => {
    if (item.flight_time) item.flight_time = flightTimeConverter(item?.flight_time);
    if (item.booking_date) item.booking_date = timestampConverter(item?.booking_date);
    if (item.departure_time) item.departure_time = timestampConverter(item?.departure_time);
    if (item.arrival_time) item.arrival_time = timestampConverter(item?.arrival_time);
    return item;
  });

  const flightReviewsInformation = flightReviewsData?.map(item => ({
    bookingId: item?.id,
    userId: item?.user_id,
    flightId: item?.flight_id,
    bookingStatus: item?.booking_status,
    bookingDate: item?.booking_date,
    totalChildPassenger: item?.total_child_passenger,
    totalAdultPassenger: item?.total_adult_passenger,
    flightClass: item?.flight_class,
    totalPrice: item?.total_price,
    rating: item?.rating,
    flightOriginal: item?.original,
    flightDestination: item?.destination,
    terminal: item?.terminal,
    gate: item?.gate,
    departureTime: item?.departure_time,
    arrivalTime: item?.arrival_time,
    flightTime: item?.flight_time,
    airlineName: item?.airline_name,
    airlineLogo: item?.airline_logo,
    airlinePic: item?.airline_pic,
    airlinePicPhoneNumber: item?.airline_pic_phone_number
  }));

  res.status(200).send(flightReviewsInformation);
};

module.exports = { getProfile, editProfile, getBookings, getDetailBooking, rateFlight, getReviews };
