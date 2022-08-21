const db = require('../../configs/database');

const getAirlineById = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM airlines
            WHERE id=$1`,
      [requestData.airlinesId],
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

const getAirlines = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM airlines ORDER BY id ASC', (error, result) => {
      if (error) {
        console.log('error', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const createAirline = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO airlines (airline_name, airline_logo, airline_pic, airline_pic_phone_number, airline_status, airline_logo_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        props.airline_name,
        props.airline_logo,
        props.airline_pic,
        props.airline_pic_phone_number,
        props.airline_status,
        props.airline_logo_id
      ],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const editAirline = (id, requestData) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE airlines SET airline_name = $1, airline_logo = $2, airline_pic = $3, airline_pic_phone_number = $4, airline_status = $5, airline_logo_id = $6 WHERE id = $7',
      [
        requestData.airline_name,
        requestData.airline_logo,
        requestData.airline_pic,
        requestData.airline_pic_phone_number,
        requestData.airline_status,
        requestData.airline_logo_id,
        id
      ],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteAirline = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM airlines WHERE id = $1', [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAirlineById,
  getAirlines,
  createAirline,
  editAirline,
  deleteAirline
};
