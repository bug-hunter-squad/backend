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

const editProfileModel = (requestData) => {
  return new Promise((resolve, reject) => {
    db.query(`WITH updateUserCredentials AS (
      UPDATE users SET name=$1, email=$2, phone_number=$3, role=$4 
      WHERE id=$5 RETURNING id) 
      UPDATE user_profiles SET city=$6, country=$7, post_code=$8, profile_picture=$9, profile_picture_id=$10
      WHERE user_id in (SELECT id FROM updateUserCredentials)`,
    [
      requestData?.name,
      requestData?.email,
      requestData?.phoneNumber,
      requestData?.role,
      requestData?.id,
      requestData?.city,
      requestData?.country,
      requestData?.postCode,
      requestData?.profilePicture,
      requestData?.profilePictureId
    ],
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
    );
  });
};
module.exports = { getUserById, editProfileModel };
