const { flightBookingStatusModel, flightTicketCalculation } = require('../models/Flight');
const { getBookingByPaymentIdModel } = require('../models/User');

const notifications = async (req, res) => {
  const { transaction_status: transactionStatus, order_id: orderId } = req?.body;

  if (transactionStatus === 'pending') {
    await flightBookingStatusModel({ inputStatus: 'waiting', orderId });
  }

  if (transactionStatus === 'settlement') {
    const getBookingResponse = await getBookingByPaymentIdModel({ orderId });
    const bookingData = getBookingResponse?.rows?.[0];

    await flightBookingStatusModel({ inputStatus: 'paid', orderId });
    await flightTicketCalculation({
      flightId: bookingData?.flight_id,
      totalChildTicket: bookingData?.total_child_passenger,
      totalAdultTicket: bookingData?.total_adult_passenger
    });
  }

  if (transactionStatus === 'cancel') {
    await flightBookingStatusModel({ inputStatus: 'canceled', orderId });
  }

  res.status(200).send('Payment status updated');
};

module.exports = { notifications };
