
function getLocationById(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  next();
}

function getMatchingLocations(req, res, next) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  next();
}

module.exports = { getLocationById, getMatchingLocations };