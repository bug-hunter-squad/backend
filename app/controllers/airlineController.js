/* eslint-disable camelcase */
const {
  ErrorResponse
} = require('../../utils/errorResponse');

const {
  getAirlines,
  getAirlineById,
  createAirline,
  editAirline,
  deleteAirline
} = require('../models/Airline');

const getAirline = async (req, res) => {
  try {
    const getData = await getAirlines();

    res.status(200).send({
      data: getData.rows,
      jumlahData: getData.rowCount
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).send("Something's wrong");
  }
};

const createAirlines = async (req, res) => {
  try {
    await createAirline({
      ...req.body,
      airline_logo: req.file.url
    });
    res.status(200).send('Success create airline');
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong!');
  }
};

const editAirlines = async (req, res) => {
  try {
    const {
      airlinesId
    } = req.params;
    await editAirline(airlinesId, {
      ...req.body,
      airline_logo: req.file.url
    });
    res.status(200).send('Success edit airline');
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong!');
  }
};

const deleteAirlines = async (req, res) => {
  const {
    airlinesId
  } = req.params;
  const getData = await getAirlineById({
    airlinesId
  });
  if (!getData?.rowCount) throw new ErrorResponse('data tidak ada', 400);
  await deleteAirline(airlinesId);
  res.send(`data id ke-${airlinesId} berhasil dihapus`);
  //   if (getData?.rowCount) {
  //     await deleteAirline(airlinesId);
  //     res.send(`data id ke-${airlinesId} berhasil dihapus`);
  //   } else {
  //     res.status(400).send('data tidak ditemukan');
  //   }
};

module.exports = {
  getAirline,
  createAirlines,
  editAirlines,
  deleteAirlines
};
