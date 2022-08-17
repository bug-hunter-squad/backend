const db = require('../../configs/database');

const flightFilter = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT flights.id as flight_id, flights.*, airlines.* FROM flights 
    JOIN airlines
    ON flights.airline_id = airlines.id 
    WHERE LOWER(flights.destination) LIKE LOWER($1)
    AND (flights.total_child_ticket >= $2 )
    AND (flights.total_adult_ticket >= $3 )
    AND (flights.luggage=$4 OR flights.meal=$5 OR flights.wifi=$6)
    AND flights.price >= $7 
    AND flights.price <= $8
    ORDER BY flights.id
    `,
    [`%${requestData?.destination}%`,
      requestData?.childPassenger,
      requestData?.adultPassenger,
      requestData?.luggage,
      requestData?.meal,
      requestData?.wifi,
      requestData?.minPrice,
      requestData?.maxPrice],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = { flightFilter };
