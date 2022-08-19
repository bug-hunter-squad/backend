const flightTimeConverter = (timestampDate) => {
  const flightTime = timestampDate;
  const flightTimeHours = flightTime.getUTCHours();
  const flightTimeMinutes = flightTime.getUTCMinutes();
  timestampDate = `${flightTimeHours} hours ${flightTimeMinutes} minutes`;
  if (!flightTimeMinutes) timestampDate = `${flightTimeHours} hours`;
  return timestampDate;
};

const timestampConverter = (timestampDate) => {
  const stringDeparture = timestampDate.toLocaleString('in-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' }).split(' ');
  stringDeparture[1] = stringDeparture[1].replace('.', ':');
  timestampDate = stringDeparture.join(' ');
  return timestampDate;
};

module.exports = { flightTimeConverter, timestampConverter };
