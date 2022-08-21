const notifications = (req, res) => {
  const { transaction_status: transactionStatus, order_id: orderId } = req?.body;
  console.log('transactionStatus, orderId', transactionStatus, orderId);

  res.status(200).send('Connected');
};

module.exports = { notifications };
