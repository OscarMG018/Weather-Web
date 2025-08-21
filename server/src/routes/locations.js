const express = require('express');
const locationsController = require('../controllers/locationsController.js');
const locationsMiddleware = require('../middleware/locationsMiddleware.js');

const router = express.Router();

router.get('/lonlat', locationsMiddleware.getLocationByCoordinates, locationsController.getLocationByCoordinates);
router.get('/search', locationsMiddleware.getMatchingLocations, locationsController.getMatchingLocations);

module.exports = router;