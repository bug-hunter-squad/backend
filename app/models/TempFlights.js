const db = require('../../configs/database');

const flightFilter = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT flights.*, airlines.* FROM flights
    JOIN airlines 
    ON flights.airline_id = airlines.id 
    WHERE LOWER(destination) LIKE LOWER($1)
    AND (total_child_ticket >= $2 )
    AND (total_adult_ticket >= $3 )
    AND (luggage=$4
    OR meal=$5
    OR wifi=$6)
    AND price >= $7 
    AND price <= $8
    `,
    [`%${requestData?.destination}%`, requestData?.childPassenger, requestData?.adultPassenger, requestData?.luggage, requestData?.meal, requestData?.wifi, requestData?.minPrice, requestData?.maxPrice],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = { flightFilter };
