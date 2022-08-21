const { ErrorResponse } = require('../../utils/errorResponse');
const { flightTimeConverter, timestampConverter } = require('../../utils/timeConverter');
const { flightFilterModel, flightDetailModel, flightBookingModel } = require('../models/TempFlights');
const { getUserById } = require('../models/User');

const searchFilterFlight = async (req, res) => {
  let {
    original,
    destination,
    flightClass,
    wifi,
    meal,
    luggage,
    childPassenger,
    adultPassenger,
    minPrice, maxPrice,
    departureDate,
    airlines,
    departureTime,
    arrivalTime
  } = req.query;

  // Default value for filtering
  original = original || '';
  destination = destination || '';
  flightClass = flightClass || 'economy';
  childPassenger = childPassenger || 0;
  adultPassenger = adultPassenger || 0;
  minPrice = Number(minPrice) || 0;
  maxPrice = Number(maxPrice) || 2147483647;
  airlines = JSON.parse(airlines || '[]');
  departureTime = JSON.parse(departureTime || '[]');
  arrivalTime = JSON.parse(arrivalTime || '[]');

  if (!meal && !wifi && !luggage) {
    meal = meal || 'true';
    wifi = wifi || 'true';
    luggage = luggage || 'true';
  }

  if (minPrice > maxPrice) throw new ErrorResponse('Max price should be greater than max price!', 422);

  const requestData = {
    original,
    destination,
    flightClass,
    childPassenger,
    adultPassenger,
    wifi,
    meal,
    luggage,
    minPrice,
    maxPrice
  };

  const filterResponse = await flightFilterModel(requestData);
  const tempFlightInformation = filterResponse?.rows;

  tempFlightInformation?.map(item => {
    if (item.flight_time) item.flight_time = flightTimeConverter(item?.flight_time);
    if (item.departure_time) item.departure_time = timestampConverter(item?.departure_time);
    if (item.arrival_time) item.arrival_time = timestampConverter(item?.arrival_time);
    return item;
  });

  let flightInformation = tempFlightInformation?.map(item => ({
    flightId: item?.flight_id,
    flightOriginal: item?.original,
    flightDestination: item?.destination,
    flightTerminal: item?.terminal,
    flightGate: item?.gate,
    flightDeparture: item?.departure_time,
    flightArrival: item?.arrival_time,
    flightTime: item?.flight_time,
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

  if (departureDate) {
    const tempDepartureDate = new Date(departureDate).toLocaleString('in-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' }).split(' ');
    departureDate = tempDepartureDate[0];
    flightInformation = flightInformation?.filter(item => item.flightDeparture.split(' ').includes(departureDate));
  }

  if (airlines?.length) {
    const tempData = [];
    airlines?.map(reqAirlineId => flightInformation?.filter(item => item.airlineId === reqAirlineId ? tempData?.push(item) : null));
    flightInformation = tempData;
  }

  if (departureTime?.length) {
    const tempResult = [];
    departureTime?.map(time => {
      const splitter = time.split('-').map(timeToTrim => timeToTrim.trim());
      const timeStart = splitter[0];
      const timeEnd = splitter[1];
      flightInformation?.filter(data => {
        const timeTarget = data?.flightDeparture?.split(' ')?.[1];
        if ((timeTarget >= timeStart) && (timeTarget <= timeEnd)) tempResult?.push(data);
        return null;
      });
      return null;
    });
    flightInformation = tempResult;
  }

  if (arrivalTime?.length) {
    const tempResult = [];
    arrivalTime?.map(time => {
      const splitter = time.split('-').map(timeToTrim => timeToTrim.trim());
      const timeStart = splitter[0];
      const timeEnd = splitter[1];
      flightInformation?.filter(data => {
        const timeTarget = data?.flightArrival?.split(' ')?.[1];
        if ((timeTarget >= timeStart) && (timeTarget <= timeEnd)) tempResult?.push(data);
        return null;
      });
      return null;
    });
    flightInformation = tempResult;
  }

  const flightTotal = flightInformation?.length;
  res.status(200).send({ flightTotal, flightInformation });
};

const flightBooking = async (req, res) => {
  const { userId, flightId } = req.params;
  const { totalChildPassenger, totalAdultPassenger, flightClass, totalPrice } = req.body;
  const bookingDate = new Date();

  // Validator user & flight checker
  await getUserById({ userId });
  await flightDetailModel({ flightId });
  await flightBookingModel({ ...req.params, totalChildPassenger, totalAdultPassenger, flightClass, totalPrice, bookingDate });

  res.status(200).send({ message: 'Flight booking successful!' });
};

module.exports = { searchFilterFlight, flightBooking };