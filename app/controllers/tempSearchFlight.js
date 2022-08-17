const { ErrorResponse } = require('../../utils/errorResponse');
const { flightFilter } = require('../models/TempFlights');

const searchFlight = async (req, res) => {
  let { destination, wifi, meal, luggage, childPassenger, adultPassenger, minPrice, maxPrice, departureDate } = req.query;

  const tempDepartureDate = new Date(departureDate).toLocaleString('in-ID', { timeZone: 'Asia/Jakarta' }).split(' ');

  departureDate = tempDepartureDate[0];

  // Default value for filtering
  destination = destination || '';
  childPassenger = childPassenger || 0;
  adultPassenger = adultPassenger || 0;
  minPrice = minPrice || 0;
  maxPrice = maxPrice || 2147483647;

  if (!meal && !wifi && !luggage) {
    meal = meal || 'true';
    wifi = wifi || 'true';
    luggage = luggage || 'true';
  }

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

  const tempFlightInformation = filterResponse?.rows;
  tempFlightInformation?.map(item => {
    item.departure_time = new Date(item?.departure_time).toLocaleString('in-ID', { timeZone: 'Asia/Jakarta' });
    item.arrival_time = new Date(item?.arrival_time).toLocaleString('in-ID', { timeZone: 'Asia/Jakarta' });
    return item;
  });

  const flightInformation = tempFlightInformation?.map(item => ({
    flightId: item?.flight_id,
    flightOriginal: item?.original,
    flightDestination: item?.destination,
    flightTerminal: item?.terminal,
    flightGate: item?.gate,
    flightDeparture: item?.departure_time,
    flightArrival: item?.arrival_time,
    totalChildTicket: item?.total_child_ticket,
    totalAdultTicket: item?.total_adult_ticket,
    wifi: item?.wifi,
    meal: item?.meal,
    luggage: item?.luggage,
    flightPrice: item?.price,
    airlineId: item?.airline_id,
    airlineName: item?.airline_name,
    airlineLogo: item?.airline_logo,
    airlinePIC: item?.airline_pic,
    airlinePICPhone: item?.airline_pic_phone_number
  }));

  const dateFilter = flightInformation?.filter(item => item.flightDeparture.split(' ').includes(departureDate));
  // console.log('dateFilter', dateFilter);

  const flightTotal = dateFilter?.length;
  res.status(200).send({ flightTotal, dateFilter });
};

module.exports = searchFlight;
