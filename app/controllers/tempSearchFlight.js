const { ErrorResponse } = require('../../utils/errorResponse');
const { flightFilter } = require('../models/TempFlights');

const searchFlight = async (req, res) => {
  let { destination, wifi, meal, luggage, childPassenger, adultPassenger, minPrice, maxPrice } = req.query;

  // Default value for filtering
  destination = destination || '';
  childPassenger = childPassenger || 0;
  adultPassenger = adultPassenger || 0;

  if (!meal && !wifi && !luggage) {
    meal = meal || 'true';
    wifi = wifi || 'true';
    luggage = luggage || 'true';
  }
  minPrice = minPrice || 0;
  maxPrice = maxPrice || 2147483647;

  if (minPrice > maxPrice) throw new ErrorResponse('Min price should be greater than max price!', 422);

  const requestData = {
    destination,
    childPassenger,
    adultPassenger,
    wifi,
    meal,
    luggage,
    minPrice,
    maxPrice
  };

  const filterResponse = await flightFilter(requestData);
  const flightInformation = filterResponse?.rows;

  const flightTotal = flightInformation?.length;

  res.status(200).send({ flightTotal, flightInformation });
};

module.exports = searchFlight;
