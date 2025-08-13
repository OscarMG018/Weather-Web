const axios = require('axios');
const weatherService = require('../services/weatherService.js');

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
      // Return only the formatted current weather (no name translations here)
      const formatted = weatherService.formatWeatherData(response.data);
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
      const forecastList = response.data.list.map((item) => ({
        temp: Math.round(item.main.temp),
        wind: {
          speed: item.wind.speed,
          deg: item.wind.deg,
        },
        humidity: item.main.humidity,
        weather: item.weather && Array.isArray(item.weather) && item.weather.length > 0 ? item.weather[0].main : null,
        time: item.dt,
      }));
      res.status(200).json(forecastList);
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
  const { lat, lon } = req.query;
  const query = buildCoordsQuery(lat, lon);
  const currentWeatherPromise = axios.get(
    `${CURRENT_WHEATHER_ENDPOINT}?${query}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`
  );
  const forecastPromise = axios.get(
    `${FORCATE_ENDPOINT}?${query}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`
  );

  Promise.all([currentWeatherPromise, forecastPromise])
    .then(([currentRes, forecastRes]) => {
      const current = weatherService.formatWeatherData(currentRes.data);
      const forecast = forecastRes.data.list.map((item) => ({
        temp: Math.round(item.main.temp),
        wind: {
          speed: item.wind.speed,
          deg: item.wind.deg,
        },
        humidity: item.main.humidity,
        weather: item.weather && Array.isArray(item.weather) && item.weather.length > 0 ? item.weather[0].main : null,
        time: item.dt,
      }));

      // Keep name inside current for backward compatibility or move it up? Now we return as before: { name, current, forecast }
      const { name, ...currentWithoutName } = current;
      res.status(200).json({ name, current: currentWithoutName, forecast });
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

module.exports = { getWeather, getForecast, getWeatherCombined };