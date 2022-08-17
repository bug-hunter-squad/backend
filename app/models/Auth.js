const db = require('../../configs/database');
const { ErrorResponse } = require('../../utils/errorResponse');

const registerUser = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`WITH insertCredentials AS (INSERT INTO users(name, email, password, role)
        VALUES($1, $2, $3, $4) RETURNING id)
        INSERT INTO user_profiles(user_id)
        SELECT id from insertCredentials`,
    [requestData?.name, requestData?.email, requestData?.password, requestData?.role],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const getUserByEmail = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT users.*, user_profiles.* FROM users 
    JOIN user_profiles 
    ON users.id=user_profiles.user_id
    WHERE users.email=$1`,
    [requestData.email],
    (error, result) => {
      if (error) return reject(error);
      if (result?.rowCount === 0) return reject(new ErrorResponse('Email not found', 404));
      resolve(result);
    });
  });
};

module.exports = { registerUser, getUserByEmail };
