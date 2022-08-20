const { getFlightsInformation, getFlightInformationById, getDetailFlightInformation, createFlightInformation, editFlightInformation, deleteFlightInformation } = require('../models/Flight');

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
    await createFlightInformation({
      ...req.body
    });
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
    res.status(200).json({
      DetailFlightInformation: getData?.rows,
      jumlahData: getData?.rowCount
    });
  } catch (error) {
    console.log('err', error);
    res.status(400).send('ada yang error');
  }
};

const editFlightsInformation = async (req, res) => {
  try {
    const {
      flightId
    } = req.params;
    await editFlightInformation(flightId, {
      ...req.body
    });
    res.status(200).send('Success edit airline');
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong!');
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

module.exports = {
  getAllFlights,
  getFlightsInformationById,
  getDetailFlightsInformation,
  createFlightsInformation,
  editFlightsInformation,
  deletedFlightInformation
};
