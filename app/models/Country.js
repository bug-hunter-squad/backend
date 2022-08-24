const db = require('../../configs/database');
const { ErrorResponse } = require('../../utils/errorResponse');

const addCountryModel = async (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO flight_countries(city,country,country_img_url, country_img_url_id) VALUES($1, $2, $3, $4)',
      [requestData?.city, requestData?.country, requestData?.countryImageUrl, requestData?.countryImageUrlId],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

const getCountriesModel = async () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * from flight_countries',
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

const getCountryModel = async (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * from flight_countries where id=$1',
      [requestData?.countryId],
      (error, result) => {
        if (error) return reject(error);
        if (result?.rowCount === 0) return reject(new ErrorResponse('Country not found!', 404));
        resolve(result);
      });
  });
};

const editCountryModel = async (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE flight_countries SET city=$1, country=$2, country_img_url=$3, country_img_url_id=$4 where id=$5',
      [requestData?.city, requestData?.country, requestData?.countryImgUrl, requestData?.countryImgUrlId, requestData?.countryId],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

const deleteCountryModel = async (requestData) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE from flight_countries where id=$1',
      [requestData?.countryId],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
  });
};

module.exports = { addCountryModel, getCountriesModel, getCountryModel, editCountryModel, deleteCountryModel };
