const { ErrorResponse } = require('../../utils/errorResponse');
const { flightFilter } = require('../models/TempFlights');

const searchFlight = async (req, res) => {
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

  const filterResponse = await flightFilter(requestData);

  const tempFlightInformation = filterResponse?.rows;
  tempFlightInformation?.map(item => {
    if (item.flight_time) {
      const flightTime = item.flight_time;
      const flightTimeHours = flightTime.getUTCHours();
      const flightTimeMinutes = flightTime.getUTCMinutes();
      item.flight_time = `${flightTimeHours} hours ${flightTimeMinutes} minutes`;
      if (!flightTimeMinutes) item.flight_time = `${flightTimeHours} hours`;
    }

    if (item.departure_time) {
      const stringDeparture = new Date(item?.departure_time).toLocaleString('in-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' }).split(' ');
      stringDeparture[1] = stringDeparture[1].replace('.', ':');
      item.departure_time = stringDeparture.join(' ');
    }

    if (item.arrival_time) {
      const stringArrival = new Date(item?.arrival_time).toLocaleString('in-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' }).split(' ');
      stringArrival[1] = stringArrival[1].replace('.', ':');
      item.arrival_time = stringArrival.join(' ');
    }

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

module.exports = searchFlight;
