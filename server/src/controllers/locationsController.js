const axios = require('axios');
const locationsService = require('../services/locationsService.js');

function getLocationById(req, res) {
    const { id } = req.params;
    const location = locationsService.getLocationById(id);
    if (!location) {
        return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json(location);
}

function getMatchingLocations(req, res) {
    const { name } = req.query;
    res.status(200).json(locationsService.getMatchingLocations(name));
}

module.exports = { getLocationById, getMatchingLocations };