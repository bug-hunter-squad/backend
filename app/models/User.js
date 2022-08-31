const db = require('../../configs/database');
const { ErrorResponse } = require('../../utils/errorResponse');

const getUserById = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT users.*, profile.*
        FROM users
        JOIN user_profiles as profile
        ON users.id = profile.user_id
        WHERE users.id=$1`,
    [requestData.userId],
    (error, result) => {
      if (error) return reject(error);
      if (result?.rowCount === 0) return reject(new ErrorResponse('User not found', 404));
      resolve(result);
    });
  });
};

const editProfileModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`WITH updateUserCredentials AS (
      UPDATE users SET name=$1, email=$2, phone_number=$3, role=$4 
      WHERE id=$5 RETURNING id) 
      UPDATE user_profiles SET city=$6, country=$7, post_code=$8, profile_picture=$9, profile_picture_id=$10
      WHERE user_id in (SELECT id FROM updateUserCredentials)`,
    [
      requestData?.name,
      requestData?.email,
      requestData?.phoneNumber,
      requestData?.role,
      requestData?.id,
      requestData?.city,
      requestData?.country,
      requestData?.postCode,
      requestData?.profilePicture,
      requestData?.profilePictureId
    ],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
    );
  });
};

const getAllBookingsModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT bookings.*, 
    flights.original, original.city as original_city, original.country as original_country,
    flights.destination, destination.city as destination_city, destination.country as destination_country, 
    flights.terminal, flights.gate, flights.departure_time, flights.arrival_time, 
    airlines.airline_name, airlines.airline_logo, airlines.airline_pic, airlines.airline_pic_phone_number,
    to_timestamp(EXTRACT(EPOCH FROM flights.arrival_time) - EXTRACT(EPOCH FROM flights.departure_time)) as flight_time
    FROM bookings
    JOIN flights ON bookings.flight_id = flights.id
    JOIN airlines ON flights.airline_id = airlines.id
    JOIN flight_countries as original ON flights.original = original.id
    JOIN flight_countries as destination ON flights.destination = destination.id
    WHERE bookings.user_id=$1
    ORDER BY bookings.id DESC`,
    [requestData?.userId],
    (error, result) => {
      if (error) return reject(error);
      if (result?.rowCount === 0) return reject(new ErrorResponse("Couldn't found booking list information!", 404));
      resolve(result);
    });
  });
};

const getDetailBookingModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT bookings.*, 
    flights.original, flights.destination, flights.terminal, flights.gate, flights.departure_time, flights.arrival_time, 
    airlines.airline_name, airlines.airline_logo, airlines.airline_pic, airlines.airline_pic_phone_number,
    to_timestamp(EXTRACT(EPOCH FROM flights.arrival_time) - EXTRACT(EPOCH FROM flights.departure_time)) as flight_time
    FROM bookings
    JOIN flights ON bookings.flight_id = flights.id
    JOIN airlines ON flights.airline_id = airlines.id
    WHERE bookings.id=$1
    AND bookings.user_id=$2`,
    [requestData?.bookingId, requestData?.userId],
    (error, result) => {
      if (error) return reject(error);
      if (result?.rowCount === 0) return reject(new ErrorResponse("Couldn't found booking information", 404));
      resolve(result);
    });
  });
};

const getBookingByPaymentIdModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM bookings where payment_id = $1',
      [requestData?.orderId],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

const rateFlightModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE bookings SET rating=$1 WHERE id=$2 AND user_id=$3',
      [requestData?.rating, requestData?.bookingId, requestData?.userId],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

const getFlightReviewsModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT bookings.*, 
    flights.original, original.city as original_city, original.country as original_country ,
    flights.destination, destination.city as destination_city, destination.country as destination_country, 
    flights.terminal, flights.gate, flights.departure_time, flights.arrival_time, 
    airlines.airline_name, airlines.airline_logo, airlines.airline_pic, airlines.airline_pic_phone_number,
    to_timestamp(EXTRACT(EPOCH FROM flights.arrival_time) - EXTRACT(EPOCH FROM flights.departure_time)) as flight_time
    FROM bookings
    JOIN flights ON bookings.flight_id = flights.id
    JOIN airlines ON flights.airline_id = airlines.id
    JOIN flight_countries as original ON flights.original = original.id
    JOIN flight_countries as destination ON flights.destination = destination.id
     WHERE user_id=$1 
     AND bookings.booking_status='paid' 
     AND flights.arrival_time < $2`,
    [requestData?.userId, requestData?.currentDate],
    (error, result) => {
      if (error) return reject(error);
      if (result?.rowCount === 0) return reject(new ErrorResponse("You don't have flight history to see!", 404));
      resolve(result);
    });
  });
};

module.exports = {
  getUserById,
  editProfileModel,
  getAllBookingsModel,
  getDetailBookingModel,
  rateFlightModel,
  getFlightReviewsModel,
  getBookingByPaymentIdModel
};
