const express = require('express');
const weatherController = require('../controllers/weatherController.js');
const weatherMiddleware = require('../middleware/weatherMiddleware.js');

const router = express.Router();

router.get('/current', weatherMiddleware.getWeather, weatherController.getWeather);
router.get('/forecast', weatherMiddleware.getWeather, weatherController.getForecast);
router.get('/all', weatherMiddleware.getWeatherAll, weatherController.getWeatherCombined);

module.exports = router;