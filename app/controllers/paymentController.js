const { flightBookingStatusModel } = require('../models/Flight');

const notifications = async (req, res) => {
  const { transaction_status: transactionStatus, order_id: orderId } = req?.body;
  let inputStatus;

  if (transactionStatus === 'pending') {
    inputStatus = 'waiting';
    await flightBookingStatusModel({ inputStatus, orderId });
  }

  if (transactionStatus === 'expire ') {
    inputStatus = 'issued';
    await flightBookingStatusModel({ inputStatus, orderId });
  }

  if (transactionStatus === 'settlement ') {
    inputStatus = 'paid';
    await flightBookingStatusModel({ inputStatus, orderId });
  }

  res.status(200).send('Connected');
};

module.exports = { notifications };
