
function getLocationByCoordinates(req, res, next) {
  const { lon, lat } = req.query;
  if (!lon || !lat) {
    return res.status(400).json({ error: 'Coordinates are required' });
  }
  next();
}

function getMatchingLocations(req, res, next) {
  const { name, lang } = req.query;
  if (!name || !lang) {
    return res.status(400).json({ error: 'Name is required' });
  }
  next();
}

module.exports = { getLocationByCoordinates, getMatchingLocations };