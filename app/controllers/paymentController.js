const { flightBookingStatusModel } = require('../models/Flight');

const notifications = async (req, res) => {
  let { transaction_status: transactionStatus, order_id: orderId } = req?.body;
  console.log('This is status :>> ', transactionStatus);
  console.log('This is payment id :>> ', orderId);

  if (transactionStatus === 'pending') {
    transactionStatus = 'waiting';
    await flightBookingStatusModel({ transactionStatus, orderId });
  }

  if (transactionStatus === 'settlement ') {
    transactionStatus = 'paid';
    await flightBookingStatusModel({ transactionStatus, orderId });
  }

  res.status(200).send('Connected');
};

module.exports = { notifications };
