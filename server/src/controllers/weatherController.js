const axios = require('axios');
const weatherService = require('../services/weatherService.js');

CURRENT_WHEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
FORCATE_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast';

function getWeather(req, res) {
    const { location } = req.query;
  
    axios.get(`${CURRENT_WHEATHER_ENDPOINT}?q=${location}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`)
      .then(response => {
        res.status(200).json(weatherService.formatWeatherData(response.data));
      })
      .catch(error => {
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
    const { location } = req.query;
    axios.get(`${FORCATE_ENDPOINT}?q=${location}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`)
      .then(response => {
        // Map the list to the required format
        const forecastList = response.data.list.map(item => ({
          temp: Math.round(item.main.temp),
          wind: {
            speed: item.wind.speed,
            deg: item.wind.deg
          },
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          visibility: item.visibility,
          weather: item.weather && Array.isArray(item.weather) && item.weather.length > 0 ? item.weather[0].main : null
        }));
        res.status(200).json(forecastList);
      })
      .catch(error => {
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
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }
    if (!isNaN(parseInt(location))) {
        return res.status(400).json({ error: 'Invalid location' });
    }
    const currentWeatherPromise = axios.get(`${CURRENT_WHEATHER_ENDPOINT}?q=${location}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`);
    const forecastPromise = axios.get(`${FORCATE_ENDPOINT}?q=${location}&units=metric&APPID=${process.env.OPEN_WEATHER_API_KEY}`);

    Promise.all([currentWeatherPromise, forecastPromise])
        .then(([currentRes, forecastRes]) => {
            const current = weatherService.formatWeatherData(currentRes.data);
            const forecast = forecastRes.data.list.map(item => ({
                temp: Math.round(item.main.temp),
                wind: {
                    speed: item.wind.speed,
                    deg: item.wind.deg
                },
                humidity: item.main.humidity,
                pressure: item.main.pressure,
                visibility: item.visibility,
                weather: item.weather && Array.isArray(item.weather) && item.weather.length > 0 ? item.weather[0].main : null
            }));
            
            // Extract name from current weather data and restructure response
            const { name, ...currentWithoutName } = current;
            res.status(200).json({ 
                name, 
                current: currentWithoutName, 
                forecast 
            });
        })
        .catch(error => {
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