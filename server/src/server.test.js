const request = require('supertest');
const app = require('./server');
const axios = require('axios');

jest.mock('axios');

function mockGeoNamesSearch(results) {
    axios.get.mockImplementationOnce((url) => {
        if (url.includes('api.geonames.org/searchJSON')) {
            return Promise.resolve({ data: { geonames: results } });
        }
        return Promise.reject(new Error('Unexpected URL: ' + url));
    });
}

function mockGeoNamesGet(geo) {
    axios.get.mockImplementationOnce((url) => {
        if (url.includes('api.geonames.org/getJSON')) {
            return Promise.resolve({ data: geo });
        }
        return Promise.reject(new Error('Unexpected URL: ' + url));
    });
}

function buildGeoName({ id = 3117735, name = 'Madrid', lat = '40.4168', lng = '-3.7038', alts = [] } = {}) {
    return {
        geonameId: id,
        name,
        lat,
        lng,
        alternateNames: alts.length ? alts : [
            { lang: 'en', name },
            { lang: 'es', name },
            { lang: 'fr', name }
        ]
    };
}

function mockOpenWeatherCurrent(payload) {
    axios.get.mockImplementationOnce((url) => {
        if (url.includes('api.openweathermap.org/data/2.5/weather')) {
            return Promise.resolve({ data: payload });
        }
        return Promise.reject(new Error('Unexpected URL: ' + url));
    });
}

function mockOpenWeatherForecast(list) {
    axios.get.mockImplementationOnce((url) => {
        if (url.includes('api.openweathermap.org/data/2.5/forecast')) {
            return Promise.resolve({ data: { list } });
        }
        return Promise.reject(new Error('Unexpected URL: ' + url));
    });
}

function buildCurrentWeather({ name = 'Madrid' } = {}) {
    return {
        name,
        main: {
            temp: 20.6,
            humidity: 55,
            pressure: 1012
        },
        wind: { speed: 5.1, deg: 200 },
        visibility: 10000,
        clouds: { all: 20 },
        rain: { '1h': 0 },
        sys: { sunrise: 1700000000, sunset: 1700040000 },
        weather: [{ main: 'Clear' }]
    };
}

function buildForecastItems(count = 5) {
    const base = Math.floor(Date.now() / 1000);
    return Array.from({ length: count }, (_, i) => ({
        main: { temp: 18 + i, humidity: 50 + i },
        wind: { speed: 4 + i, deg: 180 + i },
        weather: [{ main: 'Clouds' }],
        dt: base + i * 3600
    }));
}

beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || 'testuser';
    process.env.OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY || 'testkey';
});

describe('GET /locations/search', () => {
    it('should return a list of locations with lat/lon', async () => {
        mockGeoNamesSearch([
            buildGeoName({ id: 1, name: 'London', lat: '51.5074', lng: '-0.1278' }),
            buildGeoName({ id: 2, name: 'Londonderry', lat: '54.997', lng: '-7.309' })
        ]);
        const response = await request(app).get('/api/locations/search?name=london');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        const first = response.body[0];
        expect(typeof first.id).toBe('number');
        expect(typeof first.name).toBe('object');
        expect(typeof first.name.en).toBe('string');
        expect(typeof first.name.es).toBe('string');
        expect(typeof first.name.fr).toBe('string');
        expect(typeof first.lat).toBe('number');
        expect(typeof first.lon).toBe('number');
    });
    it('should be case insensitive', async () => {
        mockGeoNamesSearch([ buildGeoName({ name: 'LONDON' }) ]);
        const response = await request(app).get('/api/locations/search?name=LONDON');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should return an empty array if no matches', async () => {
        mockGeoNamesSearch([]);
        const response = await request(app).get('/api/locations/search?name=invalid');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
});

describe('GET /locations/id/:id', () => {
    it('should return a location by id including coordinates', async () => {
        const geo = buildGeoName({ id: 42, name: 'Testville', lat: '10.1', lng: '20.2' });
        mockGeoNamesGet(geo);
        const response = await request(app).get('/api/locations/id/42');
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(42);
        expect(response.body.name.en).toBe('Testville');
        expect(typeof response.body.lat).toBe('number');
        expect(typeof response.body.lon).toBe('number');
    });

    it('should return 404 for an invalid id', async () => {
        mockGeoNamesGet({});
        const response = await request(app).get('/api/locations/id/55555');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Location not found');
    });
});

describe('GET /weather/current', () => {
    it('should return the weather for coordinates', async () => {
        mockOpenWeatherCurrent(buildCurrentWeather({ name: 'Madrid' }));
        const response = await request(app).get('/api/weather/current?lat=40.4168&lon=-3.7038');
        expect(response.status).toBe(200);
        expect(typeof response.body.name).toBeDefined();
        expect(typeof response.body.name.es).toBe('string');
        expect(typeof response.body.temp).toBe('number');
        expect(Number.isInteger(response.body.temp)).toBe(true);
        expect(typeof response.body.weather).toBe('string');
        expect(typeof response.body.humidity).toBe('number');
        expect(typeof response.body.pressure).toBe('number');
        expect(typeof response.body.wind.speed).toBe('number');
        expect(typeof response.body.wind.deg).toBe('number');
        expect(typeof response.body.visibility).toBe('number');
        expect(typeof response.body.clouds).toBe('number');
        expect(typeof response.body.rain).toBe('number');
        expect(typeof response.body.day.sunrise).toBe('number');
        expect(typeof response.body.day.sunset).toBe('number');
    });

    it('should return an error for missing coordinates', async () => {
        const response = await request(app).get('/api/weather/current');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Coordinates are required');
    });

    it('should return 400 for invalid coordinates', async () => {
        const response = await request(app).get('/api/weather/current?lat=abc&lon=def');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid coordinates');
    });
});

describe('GET /weather/forecast', () => {
    it('should return the forecast for coordinates', async () => {
        mockOpenWeatherForecast(buildForecastItems(6));
        const response = await request(app).get('/api/weather/forecast?lat=51.5074&lon=-0.1278');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        for (let i = 0; i < response.body.length; i++) {
            expect(typeof response.body[i].temp).toBe('number');
            expect(Number.isInteger(response.body[i].temp)).toBe(true);
            expect(typeof response.body[i].wind).toBe('object');
            expect(typeof response.body[i].wind.speed).toBe('number');
            expect(typeof response.body[i].wind.deg).toBe('number');
            expect(typeof response.body[i].humidity).toBe('number');
            expect(typeof response.body[i].weather).toBe('string');
            expect(typeof response.body[i].time).toBe('number');
            expect(Number.isInteger(response.body[i].time)).toBe(true);
        }
    });

    it('should return an error for missing coordinates', async () => {
        const response = await request(app).get('/api/weather/forecast');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Coordinates are required');
    });
});

describe('GET /weather/all', () => {
    it('should return both current and forecast weather for coordinates', async () => {
        mockOpenWeatherCurrent(buildCurrentWeather({ name: 'Madrid' }));
        mockOpenWeatherForecast(buildForecastItems(3));
        const response = await request(app).get('/api/weather/all?lat=51.5074&lon=-0.1278');
        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('current');
        expect(response.body).toHaveProperty('forecast');

        const name = response.body.name;
        expect(typeof name.en).toBe('string');
        expect(typeof name.es).toBe('string');
        expect(typeof name.fr).toBe('string');

        const current = response.body.current;
        expect(typeof current.temp).toBe('number');
        expect(Number.isInteger(current.temp)).toBe(true);
        expect(typeof current.humidity).toBe('number');
        expect(typeof current.pressure).toBe('number');
        expect(typeof current.wind.speed).toBe('number');
        expect(typeof current.wind.deg).toBe('number');
        expect(typeof current.visibility).toBe('number');
        expect(typeof current.clouds).toBe('number');
        expect(typeof current.rain).toBe('number');
        expect(typeof current.day.sunrise).toBe('number');
        expect(typeof current.day.sunset).toBe('number');
        expect(typeof current.weather).toBe('string');

        const forecast = response.body.forecast;
        expect(Array.isArray(forecast)).toBe(true);
        expect(forecast.length).toBeGreaterThan(0);
        forecast.forEach(item => {
            expect(typeof item.temp).toBe('number');
            expect(Number.isInteger(item.temp)).toBe(true);
            expect(typeof item.wind.speed).toBe('number');
            expect(typeof item.wind.deg).toBe('number');
            expect(typeof item.humidity).toBe('number');
            expect(typeof item.weather).toBe('string');
            expect(typeof item.time).toBe('number');
            expect(Number.isInteger(item.time)).toBe(true);
        });
    });

    it('should return an error for missing coordinates', async () => {
        const response = await request(app).get('/api/weather/all');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Coordinates are required');
    });

    it('should return 400 for invalid coordinates', async () => {
        const response = await request(app).get('/api/weather/all?lat=abc&lon=def');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid coordinates');
    });

    it('should return 400 for out-of-range coordinates', async () => {
        const response = await request(app).get('/api/weather/all?lat=200&lon=0');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Coordinates out of range');
    });
});