/* eslint-disable camelcase */
const cloudinary = require('../../utils/couldinary');

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
    const pathImage = req.file.path;
    const pictureData = await cloudinary.uploader.upload(pathImage, {
      folder: 'Airlines'
    });
    await createAirline({
      ...req.body,
      airline_logo: pictureData.secure_url
    });
    res.status(200).send('Success create airline');
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong!');
  }
};

const editAirlines = async (req, res) => {
  try {
    const { airlinesId } = req.params;
    const { airline_name, airline_pic, airline_pic_phone_number, airline_status } = req.body;
    const pathImage = req?.file?.path;
    let pictureUrl;
    let pictureUrlId;

    const getAirlineResponse = await getAirlineById({ airlinesId });
    if (!getAirlineResponse.rowCount) return res.status(404).send('Airline not found!');
    const currentAirlineData = getAirlineResponse?.rows?.[0];

    if (pathImage) {
      if (currentAirlineData?.airline_logo_id) await cloudinary.uploader.destroy(currentAirlineData?.airline_logo_id);
      const pictureData = await cloudinary.uploader.upload(pathImage, { folder: 'Airlines' });
      pictureUrl = pictureData.secure_url;
      pictureUrlId = pictureData.public_id;
    }

    const requestData = {
      airline_name: airline_name || currentAirlineData?.airline_name,
      airline_pic: airline_pic || currentAirlineData?.airline_pic,
      airline_pic_phone_number: airline_pic_phone_number || currentAirlineData?.airline_pic_phone_number,
      airline_status: airline_status || currentAirlineData?.airline_status,
      airline_logo: pictureUrl || currentAirlineData?.airline_logo,
      airline_logo_id: pictureUrlId || currentAirlineData?.airline_logo_id
    };

    await editAirline(airlinesId, requestData);
    res.status(200).send('Success edit airline');
  } catch (error) {
    console.log('error', error);
    res.status(400).send('Something went wrong!');
  }
};

const deleteAirlines = async (req, res) => {
  const { airlinesId } = req.params;

  const getData = await getAirlineById({ airlinesId });
  if (!getData?.rowCount) return res.status(404).send('Data tidak ada');

  await deleteAirline(airlinesId);
  res.send(`data id ke-${airlinesId} berhasil dihapus`);
};

module.exports = {
  getAirline,
  createAirlines,
  editAirlines,
  deleteAirlines
};
