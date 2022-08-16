const jwt = require('jsonwebtoken');

const authorizationTokenHandler = (req, res, next) => {
  const authorizationToken = req.headers?.authorization;
  jwt.verify(authorizationToken?.substring(7, authorizationToken?.length), process.env.PRIVATE_KEY);
  next();
};

module.exports = { authorizationTokenHandler };
