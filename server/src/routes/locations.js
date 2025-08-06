const express = require('express');
const locationsController = require('../controllers/locationsController.js');
const locationsMiddleware = require('../middleware/locationsMiddleware.js');

const router = express.Router();

router.get('/id/:id', locationsMiddleware.getLocationById, locationsController.getLocationById);
router.get('/search', locationsMiddleware.getMatchingLocations, locationsController.getMatchingLocations);

module.exports = router;