const locationService = require('./locationsService.js');

function formatWeatherData(data, lon, lat) {
    const locationInfo = locationService.getLocationByCoordinates(lon, lat);
    const responseData = {
        ...locationInfo,
        temp: Math.round(data.main.temp),
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

function formatForecastData(data, lon, lat) {
    const locationInfo = locationService.getLocationByCoordinates(lon, lat);
    const responseData = {
        ...locationInfo,
        forecast: data.list.map((item) => ({
            temp: Math.round(item.main.temp),
            wind: {
                speed: item.wind.speed,
                deg: item.wind.deg,
            },
            humidity: item.main.humidity,
            weather: item.weather && Array.isArray(item.weather) && item.weather.length > 0 
                ? item.weather[0].main 
                : null,
            time: item.dt,
        })),
    };
    return responseData;
}

function formatWeatherDataWithoutLocation(data) {
    return {
        temp: Math.round(data.main.temp),
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
}

function formatForecastDataWithoutLocation(data) {
    return data.list.map((item) => ({
        temp: Math.round(item.main.temp),
        wind: {
            speed: item.wind.speed,
            deg: item.wind.deg,
        },
        humidity: item.main.humidity,
        weather: item.weather && Array.isArray(item.weather) && item.weather.length > 0 
            ? item.weather[0].main 
            : null,
        time: item.dt,
    }));

}

module.exports = { formatWeatherData, formatForecastData, formatWeatherDataWithoutLocation, formatForecastDataWithoutLocation };