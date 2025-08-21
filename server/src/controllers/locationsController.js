const locationsService = require('../services/locationsService.js');

async function getLocationByCoordinates(req, res) {
    try {
        const { lon, lat } = req.query;
        const location = await locationsService.getLocationByCoordinates(lon, lat);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.status(200).json(location); 
    } catch (err) {
        res.status(500).json({ error: 'Error fetching location' });
    }
}

async function getMatchingLocations(req, res) {
    try {
        const { name, lang } = req.query;
        const results = await locationsService.getMatchingLocations(name, lang);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error searching locations' });
    }
}

module.exports = { getLocationByCoordinates, getMatchingLocations };