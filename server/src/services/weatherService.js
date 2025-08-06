const locationsService = require('./locationsService.js');

function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function formatWeatherData(data) {
    const location = locationsService.getLocationByEnName(data.name);
    const responseData = {
        name: {
            en: data.name,
            es: location ? location.name.es : data.name,
            fr: location ? location.name.fr : data.name
        },
        temp: {
            celsius: Math.round(data.main.temp),
            fahrenheit: Math.round(celsiusToFahrenheit(data.main.temp))
        },
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: {
            speed: data.wind.speed,
            deg: data.wind.deg
        },
        visibility: data.visibility,
        clouds: data.clouds.all,
        rain: data.rain ? data.rain["1h"] : 0,
        day: {
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset
        },
        weather: data.weather && Array.isArray(data.weather) && data.weather.length > 0 ? data.weather[0].main : null
    };
    return responseData;
}

module.exports = { formatWeatherData };