const notifications = (req, res) => {
  console.log('req :>> ', req);
  res.status(200).send('NGIENG');
};

module.exports = { notifications };
