const db = require('../../configs/database');

const getFlightsInformation = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM flights ORDER BY id ASC', (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getFlightInformationById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM flights WHERE id = $1', [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getDetailFlightInformation = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM flights FULL OUTER JOIN airlines ON flights.id = airlines.id WHERE flights.id = ${id} ORDER BY flights.id DESC`, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const createFlightInformation = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO flights (airline_id, original, destination, gate, price, total_child_ticket, total_adult_ticket, departure_time, arrival_time, wifi, meal, luggage, terminal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        props.airline_id,
        props.original,
        props.destination,
        props.gate,
        props.price,
        props.total_child_ticket,
        props.total_adult_ticket,
        props.departure_time,
        props.arrival_time,
        props.wifi,
        props.meal,
        props.luggage,
        props.terminal
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

const editFlightInformation = (id, props) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE flights SET airline_id = $1, original = $2, destination = $3, gate = $4, price = $5, total_child_ticket = $6, total_adult_ticket = $7, departure_time = $8, arrival_time = $9, wifi = $10, meal = $11, luggage = $12, terminal = $13 WHERE id = $14',
      [
        props.airline_id,
        props.original,
        props.destination,
        props.gate,
        props.price,
        props.total_child_ticket,
        props.total_adult_ticket,
        props.departure_time,
        props.arrival_time,
        props.wifi,
        props.meal,
        props.luggage,
        props.terminal,
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

const deleteFlightInformation = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM flights WHERE id = $1', [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getFlightsInformation,
  getFlightInformationById,
  getDetailFlightInformation,
  createFlightInformation,
  editFlightInformation,
  deleteFlightInformation
};
