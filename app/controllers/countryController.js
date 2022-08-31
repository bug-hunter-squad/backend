const { ErrorResponse } = require('../../utils/errorResponse');
const cloudinary = require('../../utils/couldinary');

const { addCountryModel, getCountriesModel, getCountryModel, editCountryModel, deleteCountryModel } = require('../models/Country');

const addCountry = async (req, res) => {
  const { city, country } = req?.body;
  const countryImage = req?.file?.path;
  let countryImageUrl;
  let countryImageUrlId;

  if (!city || !country) throw new ErrorResponse('City and country is required', 400);

  if (countryImage) {
    const imageUpload = await cloudinary.uploader.upload(countryImage, { folder: 'Countries' });
    countryImageUrl = imageUpload.secure_url;
    countryImageUrlId = imageUpload.public_id;
  }
  const requestData = {
    city,
    country,
    countryImageUrl,
    countryImageUrlId
  };

  await addCountryModel(requestData);

  res.status(200).send({ message: 'New city & country has been added!' });
};

const getCountries = async (req, res) => {
  const getCountriesResponse = await getCountriesModel();
  res.status(200).send(getCountriesResponse?.rows);
};

const getCountriesById = async (req, res) =>{
  const { countryId } = req?.params;
  const dataCountry = await getCountryModel({ countryId });
  res.send(dataCountry?.rows?.[0]);
}

const editCountry = async (req, res) => {
  const { city, country } = req?.body;
  const { countryId } = req?.params;
  const countryImage = req?.file?.path;
  let countryImgUrl;
  let countryImgUrlId;

  const currentCountryResponse = await getCountryModel({ countryId });
  const currentCountry = currentCountryResponse?.rows?.[0];

  if (countryImage) {
    if (currentCountry?.country_img_url_id) await cloudinary.uploader.destroy(currentCountry?.country_img_url_id);
    const imageUpload = await cloudinary.uploader.upload(countryImage, { folder: 'Countries' });
    countryImgUrl = imageUpload?.secure_url;
    countryImgUrlId = imageUpload?.public_id;
  }

  const requestData = {
    countryId,
    city: city || currentCountry?.city,
    country: country || currentCountry?.city,
    countryImgUrl: countryImgUrl || currentCountry?.country_img_url,
    countryImgUrlId: countryImgUrlId || currentCountry?.country_img_url_id
  };

  await editCountryModel(requestData);
  res.status(200).send({ message: 'Edit country success!' });
};

const deleteCountry = async (req, res) => {
  const { countryId } = req?.params;

  const getCountryResponse = await getCountryModel({ countryId });
  const countryData = getCountryResponse?.rows?.[0];

  if (countryData?.country_img_url_id) await cloudinary.uploader.destroy(countryData?.country_img_url_id);
  await deleteCountryModel({ countryId });

  res.status(200).send({ message: 'Country has been deleted!' });
};
module.exports = { addCountry, getCountries, editCountry, deleteCountry, getCountriesById };
