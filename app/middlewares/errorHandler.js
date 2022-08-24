const errorHandler = (error, req, res, next) => {
  console.log('error :>> ', error);
  // Error List
  if (error?.code === '23505' && error?.constraint === 'users_email_key') {
    error.message = 'Email is already taken';
  }

  if (error?.code === '23505' && error?.constraint === 'users_phone_number_key') {
    error.message = 'Phone number is already taken';
  }

  if (error?.code === '23505' && error?.constraint === 'flight_countries_city_key') {
    error.message = 'City is already exist!';
  }

  // Error Response
  res.status(error.status || 500).send({
    message: error?.message || 'Internal server error'
  });
};

module.exports = { errorHandler };
