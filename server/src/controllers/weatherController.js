const axios = require('axios');
const weatherService = require('../services/weatherService.js');
const locationService = require('../services/locationsService.js');

const CURRENT_WHEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const FORCATE_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast';

function buildCoordsQuery(lat, lon) {
  return `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
}

function getWeather(req, res) {
  const { lat, lon } = req.query;
  axios
    .get(`${CURRENT_WHEATHER_ENDPOINT}?${buildCoordsQuery(lat, lon)}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`)
    .then((response) => {
      const formatted = weatherService.formatWeatherData(response.data, lon, lat);
      res.status(200).json(formatted);
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          return res.status(404).json({ error: 'Location not found' });
        }
        return res.status(500).json({ error: 'Error fetching weather data' });
      } else if (error.request) {
        return res.status(503).json({ error: 'Weather service unavailable' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
}

function getForecast(req, res) {
  const { lat, lon } = req.query;
  axios
    .get(`${FORCATE_ENDPOINT}?${buildCoordsQuery(lat, lon)}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`)
    .then((response) => {
      const forecastData = weatherService.formatForecastData(response.data, lon, lat);
      res.status(200).json(forecastData);
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          return res.status(404).json({ error: 'Location not found' });
        }
        return res.status(500).json({ error: 'Error fetching weather data' });
      } else if (error.request) {
        return res.status(503).json({ error: 'Weather service unavailable' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
}

function getWeatherCombined(req, res) {
  const { lat, lon, name, lang, radius } = req.query;
  if (lat && lon) {
    return getWeatherCombinedCords(req, res, lat, lon, radius);
  } else if (name && lang) {
    return getWeatherCombinedName(req, res, name, lang);
  } else {
    return res.status(400).json({ error: 'Coordinates or name are required' });
  }
}

function getWeatherCombinedCords(req, res, lat, lon, radius) {
  const query = buildCoordsQuery(lat, lon);
  const currentWeatherPromise = axios.get(
    `${CURRENT_WHEATHER_ENDPOINT}?${query}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`
  );
  const forecastPromise = axios.get(
    `${FORCATE_ENDPOINT}?${query}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`
  );
  
  Promise.all([currentWeatherPromise, forecastPromise])
    .then(([currentRes, forecastRes]) => {
      const current = weatherService.formatWeatherDataWithoutLocation(currentRes.data);
      const forecast = weatherService.formatForecastDataWithoutLocation(forecastRes.data);
      const locationInfo = locationService.getLocationByCoordinates(lon, lat, radius);
      const responseData = {
        ...locationInfo,
        current: current,
        forecast: forecast
      };
      res.status(200).json(responseData);
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          return res.status(404).json({ error: 'Location not found' });
        }
        return res.status(500).json({ error: 'Error fetching weather data' });
      } else if (error.request) {
        return res.status(503).json({ error: 'Weather service unavailable' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
}

function getWeatherCombinedName(req, res, name, lang) {
  const location = locationService.getLocationByName(name, lang);
  if (!location) {
    return res.status(404).json({ error: 'Location not found' });
  }
  getWeatherCombinedCords(req, res, location.lat, location.lon, null);
}

module.exports = { getWeather, getForecast, getWeatherCombined };