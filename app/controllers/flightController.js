/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const { snap } = require('../../configs/payment');
const { ErrorResponse } = require('../../utils/errorResponse');
const { flightTimeConverter, timestampConverter } = require('../../utils/timeConverter');
const { getUserById, getDetailBookingModel } = require('../models/User');
const {
  getFlightsInformation,
  getFlightInformationById,
  getDetailFlightInformation,
  createFlightInformation,
  editFlightInformation,
  deleteFlightInformation,
  flightFilterModel,
  flightBookingModel,
  flightBookingPaymentModel
} = require('../models/Flight');
const { getAirlineById } = require('../models/Airline');
const { getCountryModel } = require('../models/Country');

const getAllFlights = async (req, res) => {
  try {
    const getData = await getFlightsInformation();

    res.status(200).send({
      data: getData.rows,
      jumlahData: getData.rowCount
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send("Something's wrong");
  }
};

const getFlightsInformationById = async (req, res) => {
  try {
    const { flightId } = req.params;
    const getData = await getFlightInformationById(flightId);

    if (getData.rowCount > 0) {
      if (parseInt(flightId)) {
        res.send({ data: getData.rows, jumlahData: getData.rowCount });
      } else {
        res.status(400).send('Invalid number!');
      }
    } else { res.status(400).send('Flight id not found!'); };
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong');
  }
};

const createFlightsInformation = async (req, res) => {
  try {
    const { airline_id: airlinesId, originalId, destinationId } = req.body;
    const getAirlineData = await getAirlineById({ airlinesId });
    if (!getAirlineData?.rowCount) return res.status(404).send('Airline not found!');

    if (originalId === destinationId) return res.status(422).send('Original and destination should be different!');
    await Promise.all([originalId, destinationId]?.map(async (item) => {
      await getCountryModel({ countryId: item });
    }));

    await createFlightInformation({ ...req.body, original: originalId, destination: destinationId });
    res.status(200).send('Success create flight information');
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong!');
  }
};

const getDetailFlightsInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await getDetailFlightInformation(id);

    const detailFlightData = getData?.rows?.map((item) => ({
      flight_id: item?.flight_id,
      original: item?.original,
      original_city: item?.original_city,
      original_country: item?.original_country,
      original_image: item?.original_image,
      destination: item?.destination,
      destination_city: item?.destination_city,
      destination_country: item?.destination_country,
      destination_image: item?.destination_image,
      terminal: item?.terminal,
      gate: item?.gate,
      price: item?.price,
      total_child_ticket: item?.total_child_ticket,
      total_adult_ticket: item?.total_adult_ticket,
      departure_time: timestampConverter(item?.departure_time),
      arrival_time: timestampConverter(item?.arrival_time),
      wifi: item?.wifi,
      meal: item?.meal,
      luggage: item?.luggage,
      airline_id: item?.airline_id,
      airline_name: item?.airline_name,
      aieline_logo: item?.airline_logo,
      airline_pic: item?.airline_pic,
      airline_pic_phone_number: item?.airline_pic_phone_number
    }));

    res.status(200).json({
      DetailFlightInformation: detailFlightData,
      jumlahData: getData?.rowCount
    });
  } catch (error) {
    console.log('err', error);
    res.status(400).send('ada yang error');
  }
};

const editFlightsInformation = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { airline_id, originalId, destinationId, gate, terminal, price, total_child_ticket, total_adult_ticket, departure_time, arrival_time, wifi, meal, luggage } = req?.body;

    const flightChecker = await getFlightInformationById(flightId);
    if (!flightChecker?.rowCount) return res.status(404).send('Flight not found!');
    const flightData = flightChecker?.rows?.[0];

    if (originalId === destinationId) throw new ErrorResponse('Original and destination flight cannot be the same!', 404);
    await Promise.all([originalId, destinationId]?.map(async (item, index) => {
      try {
        await getCountryModel({ countryId: item });
      } catch (error) {
        if (index === 0) throw new ErrorResponse('Flight original not found!', 404);
        throw new ErrorResponse('Flight destination not found!', 404);
      }
    }));

    const requestData = {
      airline_id: airline_id || flightData?.airline_id,
      original: originalId || flightData?.original,
      destination: destinationId || flightData?.destination,
      gate: gate || flightData?.gate,
      terminal: terminal || flightData?.terminal,
      price: price || flightData?.price,
      total_child_ticket: total_child_ticket || flightData?.total_child_ticket,
      total_adult_ticket: total_adult_ticket || flightData?.total_adult_ticket,
      departure_time: departure_time || flightData?.departure_time,
      arrival_time: arrival_time || flightData?.arrival_time,
      wifi: wifi || flightData?.wifi,
      meal: meal || flightData?.meal,
      luggage: luggage || flightData?.luggage
    };

    const airlineChecker = await getAirlineById({ airlinesId: requestData?.airline_id });
    if (!airlineChecker.rowCount) return res.status(404).send('Airline not found!');

    await editFlightInformation(flightId, requestData);
    res.status(200).send('Success edit flight!');
  } catch (error) {
    res.status(error?.status || 500).send(error?.message || 'Something went wrong!');
  }
};

const deletedFlightInformation = async (req, res) => {
  try {
    const { flightId } = req.params;
    const getData = await getFlightInformationById(flightId);

    if (getData.rowCount > 0) {
      const deleteCompany = await deleteFlightInformation(flightId);

      if (deleteCompany) {
        res.send(`Successfully deleted flight : ${flightId}`);
      } else {
        res.status(400).send('Flight failed to delete!');
      }
    } else {
      res.status(400).send('Flight not found!');
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('Something went wrong!');
  }
};

const searchFilterFlight = async (req, res) => {
  let {
    originalId,
    destinationId,
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

  if (!originalId || !destinationId) throw new ErrorResponse('Please select original and destination flight!');
  if (originalId === destinationId) throw new ErrorResponse('Please select different place between original and destination flight!');
  await Promise.all([originalId, destinationId]?.map(async (item, index) => {
    try {
      await getCountryModel({ countryId: item });
    } catch (error) {
      if (index === 0) throw new ErrorResponse('Flight original not found!', 404);
      throw new ErrorResponse('Flight destination not found!', 404);
    }
  }));

  // Default value for filtering
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
    originalId,
    destinationId,
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
    flightOriginalId: item?.original,
    flightOriginalCity: item?.original_city,
    flightOriginalCountry: item?.original_country,
    flightOriginalImage: item?.original_image,
    flightDestinationId: item?.destination,
    flightDestinationCity: item?.destination_city,
    flightDestinationCountry: item?.destination_country,
    flightDestinationImage: item?.destination_image,
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

  const getUserResponse = await getUserById({ userId });
  const getFlightResponse = await getDetailFlightInformation(flightId);
  if (!getFlightResponse.rowCount) throw new ErrorResponse('Flight not found!', 404);

  const userData = getUserResponse?.rows?.[0];
  const flightData = getFlightResponse?.rows?.[0];
  flightData.id = flightData?.flight_id;

  const bookingResponse = await flightBookingModel({ ...req.params, totalChildPassenger, totalAdultPassenger, flightClass, totalPrice, bookingDate });
  const bookingData = bookingResponse?.rows?.[0];

  const paymentPayload = {
    transaction_details: {
      order_id: uuidv4(),
      gross_amount: totalPrice
    },
    item_details: [{
      id: bookingData?.id,
      price: Math.round(totalPrice / (Number(totalChildPassenger) + (Number(totalAdultPassenger)))),
      quantity: (Number(totalChildPassenger) + Number(totalAdultPassenger)),
      name: `${flightData?.original} to ${flightData?.destination} Flight Ticket`,
      brand: flightData?.airline_name,
      category: 'Flight Ticket',
      merchant_name: 'Ankasa Ticketing'
    }],
    customer_details: {
      first_name: userData?.name,
      email: userData?.email,
      phone: userData?.phone_number
    }
  };

  const paymentProcess = await snap.createTransaction(paymentPayload);
  const requestData = {
    bookingId: bookingData?.id,
    paymentId: paymentPayload?.transaction_details?.order_id,
    paymentToken: paymentProcess?.token,
    paymentUrl: paymentProcess?.redirect_url
  };

  await getDetailBookingModel({ bookingId: bookingData?.id, userId });
  await flightBookingPaymentModel(requestData);

  res.status(200).send({ message: 'Booking Success' });
};

module.exports = {
  getAllFlights,
  getFlightsInformationById,
  getDetailFlightsInformation,
  createFlightsInformation,
  editFlightsInformation,
  deletedFlightInformation,
  searchFilterFlight,
  flightBooking
};
