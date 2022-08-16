const errorHandler = (error, req, res, next) => {
  // Error List

  // Error Response
  res.status(error.status || 500).send({
    message: error?.message || 'Internal server error'
  });
};

module.exports = { errorHandler };
