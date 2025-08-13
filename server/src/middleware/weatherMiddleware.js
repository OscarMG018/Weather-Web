function validateCoords(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return { valid: false, error: 'Invalid coordinates' };
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Coordinates out of range' };
  }
  return { valid: true };
}

function getWeather(req, res, next) {
  const { lat, lon } = req.query;
  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'Coordinates are required' });
  }
  const { valid, error } = validateCoords(lat, lon);
  if (!valid) return res.status(400).json({ error });
  next();
}

function getWeatherAll(req, res, next) {
  const { lat, lon } = req.query;
  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'Coordinates are required' });
  }
  const { valid, error } = validateCoords(lat, lon);
  if (!valid) return res.status(400).json({ error });
  next();
}

module.exports = { getWeather, getWeatherAll };