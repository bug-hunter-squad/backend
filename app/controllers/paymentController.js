const { flightBookingStatusModel } = require('../models/Flight');

const notifications = async (req, res) => {
  const { transaction_status: transactionStatus, order_id: orderId } = req?.body;

  if (transactionStatus === 'pending') {
    await flightBookingStatusModel({ inputStatus: 'waiting', orderId });
  }

  if (transactionStatus === 'settlement') {
    await flightBookingStatusModel({ inputStatus: 'paid', orderId });
  }

  if (transactionStatus === 'cancel') {
    await flightBookingStatusModel({ inputStatus: 'canceled', orderId });
  }

  res.status(200).send('Payment status updated');
};

module.exports = { notifications };
