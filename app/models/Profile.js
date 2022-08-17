const db = require('../../configs/database');
const { ErrorResponse } = require('../../utils/errorResponse');

const getUserById = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT users.*, profile.*
        FROM users
        JOIN user_profiles as profile
        ON users.id = profile.user_id
        WHERE users.id=$1`,
    [requestData.userId],
    (error, result) => {
      if (error) return reject(error);
      if (result?.rowCount === 0) return reject(new ErrorResponse('User not found', 404));
      resolve(result);
    });
  });
};

module.exports = { getUserById };
