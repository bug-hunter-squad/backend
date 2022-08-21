const notifications = (req, res) => {
  const { transaction_status: transactionStatus, order_id: orderId } = req?.body;

  res.status(200).send({ transactionStatus, orderId });
};

module.exports = { notifications };
