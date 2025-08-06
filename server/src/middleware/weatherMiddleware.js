
function getWeather(req, res, next) {

  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }
  if (!isNaN(parseInt(location))) {
    return res.status(400).json({ error: 'Invalid location' });
  }
  next();
}

module.exports = { getWeather };