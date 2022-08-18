const db = require('../../configs/database');

const flightFilter = (requestData) => {
  let conditionalPrice = 'AND (flights.price * 1.25) >= $8 AND (flights.price * 1.25) <= $9';
  if (requestData?.flightClass === 'business') conditionalPrice = 'AND (flights.price * 1.5) >= $8 AND (flights.price * 1.5) <= $9';
  if (requestData?.flightClass === 'first class') conditionalPrice = 'AND (flights.price * 2) >= $8 AND (flights.price * 2) <= $9';
  return new Promise((resolve, reject) => {
    db.query(`SELECT flights.id as flight_id, flights.*, (flights.price * 2) as multiple_price, airlines.*, 
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

module.exports = { flightFilter };
