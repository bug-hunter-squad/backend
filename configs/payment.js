const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.PAYMENT_SERVER_KEY,
  clientKey: process.env.PAYMENT_CLIENT_KEY
});

module.exports = { snap };
