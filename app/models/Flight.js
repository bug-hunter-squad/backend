const db = require('../../configs/database');
const { ErrorResponse } = require('../../utils/errorResponse');

const getFlightsInformation = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM flights ORDER BY id ASC', (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getFlightInformationById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM flights WHERE id = $1', [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getDetailFlightInformation = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT flights.*, flights.id as flight_id, airlines.* FROM flights FULL OUTER JOIN airlines ON flights.airline_id = airlines.id WHERE flights.id = ${id} ORDER BY flights.id DESC`, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const createFlightInformation = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO flights (airline_id, original, destination, gate, price, total_child_ticket, total_adult_ticket, departure_time, arrival_time, wifi, meal, luggage, terminal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        props.airline_id,
        props.original,
        props.destination,
        props.gate,
        props.price,
        props.total_child_ticket,
        props.total_adult_ticket,
        props.departure_time,
        props.arrival_time,
        props.wifi,
        props.meal,
        props.luggage,
        props.terminal
      ],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const editFlightInformation = (id, props) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE flights SET airline_id = $1, original = $2, destination = $3, gate = $4, price = $5, total_child_ticket = $6, total_adult_ticket = $7, departure_time = $8, arrival_time = $9, wifi = $10, meal = $11, luggage = $12, terminal = $13 WHERE id = $14',
      [
        props.airline_id,
        props.original,
        props.destination,
        props.gate,
        props.price,
        props.total_child_ticket,
        props.total_adult_ticket,
        props.departure_time,
        props.arrival_time,
        props.wifi,
        props.meal,
        props.luggage,
        props.terminal,
        id
      ],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteFlightInformation = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM flights WHERE id = $1', [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const flightFilterModel = (requestData) => {
  let conditionalPrice = 'AND (flights.price * 1.25) >= $8 AND (flights.price * 1.25) <= $9';
  if (requestData?.flightClass === 'business') conditionalPrice = 'AND (flights.price * 1.5) >= $8 AND (flights.price * 1.5) <= $9';
  if (requestData?.flightClass === 'first class') conditionalPrice = 'AND (flights.price * 2) >= $8 AND (flights.price * 2) <= $9';
  return new Promise((resolve, reject) => {
    db.query(`SELECT flights.id as flight_id, flights.*, airlines.*, 
    to_timestamp(EXTRACT(EPOCH FROM flights.arrival_time) - EXTRACT(EPOCH FROM flights.departure_time)) as flight_time 
    FROM flights 
    JOIN airlines
    ON flights.airline_id = airlines.id 
    WHERE 
    LOWER(flights.original) LIKE LOWER($1) 
    AND LOWER(flights.destination) LIKE LOWER($2)
    AND (flights.total_child_ticket >= $3 )
    AND (flights.total_adult_ticket >= $4 )
    AND (flights.luggage=$5 OR flights.meal=$6 OR flights.wifi=$7)
    ${conditionalPrice}
    ORDER BY flights.id`,
    [
        `%${requestData?.original}%`,
        `%${requestData?.destination}%`,
        requestData?.childPassenger,
        requestData?.adultPassenger,
        requestData?.luggage,
        requestData?.meal,
        requestData?.wifi,
        requestData?.minPrice,
        requestData?.maxPrice
    ],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const flightDetailModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM flights where id=$1',
      [requestData?.flightId],
      (error, result) => {
        if (error) return reject(error);
        if (result?.rowCount === 0) return reject(new ErrorResponse('Flights not found!'));
        resolve(result);
      });
  });
};

const flightBookingModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO bookings(user_id, flight_id, booking_status, booking_date, total_child_passenger, total_adult_passenger, flight_class, total_price)
    VALUES ($1, $2, 'waiting', $3, $4, $5, $6, $7) RETURNING *`,
    [requestData?.userId, requestData?.flightId, requestData?.bookingDate, requestData?.totalChildPassenger, requestData?.totalAdultPassenger, requestData?.flightClass, requestData?.totalPrice],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
    );
  });
};

const flightBookingPaymentModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE bookings SET payment_id=$1, payment_token=$2, payment_url=$3 WHERE id=$4',
      [requestData?.paymentId, requestData?.paymentToken, requestData?.paymentUrl, requestData?.bookingId],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

const flightBookingStatusModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE bookings SET booking_status=$1 WHERE payment_id=$2',
      [requestData?.transactionStatus, requestData?.orderId],
      (error, result) => {
        if (error) return reject(error);
        if (!result?.rowCount) return reject(new ErrorResponse('Missing payment credentials!'));
        resolve(result);
      });
  });
};

module.exports = {
  getFlightsInformation,
  getFlightInformationById,
  getDetailFlightInformation,
  createFlightInformation,
  editFlightInformation,
  deleteFlightInformation,
  flightFilterModel,
  flightDetailModel,
  flightBookingModel,
  flightBookingPaymentModel,
  flightBookingStatusModel
};
