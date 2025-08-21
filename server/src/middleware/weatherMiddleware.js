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
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordinates are required' });
  }
  const { valid, error } = validateCoords(lat, lon);
  if (!valid) return res.status(400).json({ error });
  next();
}

function getWeatherAll(req, res, next) {
  const { lat, lon, name, lang, radius } = req.query;
  if (!name && !lang && (!lat || !lon)) {
    return res.status(400).json({ error: 'Coordinates or name are required' });
  }
  else if (!lat && !lon && (!name || !lang)) {
    return res.status(400).json({ error: 'Coordinates or name are required' });
  }
  if (!name && !lang) {
    const { valid, error } = validateCoords(lat, lon);
    if (!valid) return res.status(400).json({ error });
  }
  if (radius) {
    const radiusNum = parseFloat(radius);
    if (isNaN(radiusNum) || radiusNum <= 0) {
      return res.status(400).json({ error: 'Radius must be a positive number' });
    }
  }
  next();
}

module.exports = { getWeather, getWeatherAll };