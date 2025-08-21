const request = require('supertest');
const app = require('./server');

describe('GET /locations/search', () => {
    it('should return a list of locations with lat/lon', async () => {
        const response = await request(app).get('/api/locations/search?name=london&lang=en');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const first = response.body[0];
        expect(typeof first.name).toBe('object');
        expect(typeof first.name.en).toBe('string');
        expect(typeof first.name.es).toBe('string');
        expect(typeof first.name.fr).toBe('string');
        expect(typeof first.name.original).toBe('string');
        expect(typeof first.lat).toBe('number');
        expect(typeof first.lon).toBe('number');
    });
    it('should be case insensitive', async () => {
        const response = await request(app).get('/api/locations/search?name=LONDON&lang=en');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const first = response.body[0];
        expect(typeof first.name).toBe('object');
        expect(typeof first.name.en).toBe('string');
        expect(typeof first.name.es).toBe('string');
        expect(typeof first.name.fr).toBe('string');
        expect(typeof first.name.original).toBe('string');
        expect(typeof first.lat).toBe('number');
        expect(typeof first.lon).toBe('number');
    });
    it('should return an empty array if no matches', async () => {
        const response = await request(app).get('/api/locations/search?name=notfound&lang=en');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
});

describe('GET /locations/lonlat/', () => {
    it('should return a location by coordinates', async () => {
        const response = await request(app).get('/api/locations/lonlat?lon=33.74417&lat=35.0181296');
        expect(response.status).toBe(200);
        const location = response.body;
        expect(typeof location.name).toBe('object');
        expect(typeof location.name.en).toBe('string');
        expect(typeof location.name.es).toBe('string');
        expect(typeof location.name.fr).toBe('string');
        expect(typeof location.name.original).toBe('string');
        expect(typeof location.lat).toBe('number');
        expect(typeof location.lon).toBe('number');
    });

    it('should return 404 for an invalid id', async () => {
        const response = await request(app).get('/api/locations/lonlat?lon=0&lat=0');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Location not found');
    });
});

describe('GET /weather/current', () => {
    it('should return the weather for coordinates', async () => {
        const response = await request(app).get('/api/weather/current?lon=33.74417&lat=35.0181296');
        expect(response.status).toBe(200);
        expect(typeof response.body.name).toBe('object');
        expect(typeof response.body.name.en).toBe('string');
        expect(typeof response.body.name.es).toBe('string');
        expect(typeof response.body.name.fr).toBe('string');
        expect(typeof response.body.name.original).toBe('string');
        expect(typeof response.body.lat).toBe('number');
        expect(typeof response.body.lon).toBe('number');
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
        const response = await request(app).get('/api/weather/forecast?lon=33.74417&lat=35.0181296');
        expect(response.status).toBe(200);
        expect(typeof response.body.name).toBe('object');
        expect(typeof response.body.name.en).toBe('string');
        expect(typeof response.body.name.es).toBe('string');
        expect(typeof response.body.name.fr).toBe('string');
        expect(typeof response.body.name.original).toBe('string');
        expect(typeof response.body.lat).toBe('number');
        expect(typeof response.body.lon).toBe('number');

        expect(Array.isArray(response.body.forecast)).toBe(true);
        expect(response.body.forecast.length).toBeGreaterThan(0);
        const forecast = response.body.forecast;
        for (let i = 0; i < forecast.length; i++) {
            expect(typeof forecast[i].temp).toBe('number');
            expect(Number.isInteger(forecast[i].temp)).toBe(true);
            expect(typeof forecast[i].wind).toBe('object');
            expect(typeof forecast[i].wind.speed).toBe('number');
            expect(typeof forecast[i].wind.deg).toBe('number');
            expect(typeof forecast[i].humidity).toBe('number');
            expect(typeof forecast[i].weather).toBe('string');
            expect(typeof forecast[i].time).toBe('number');
            expect(Number.isInteger(forecast[i].time)).toBe(true);
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
        const response = await request(app).get('/api/weather/all?lon=33.74417&lat=35.0181296');
        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
        
        expect(typeof response.body.name).toBe('object');
        expect(typeof response.body.name.en).toBe('string');
        expect(typeof response.body.name.es).toBe('string');
        expect(typeof response.body.name.fr).toBe('string');
        expect(typeof response.body.name.original).toBe('string');
        expect(typeof response.body.lat).toBe('number');
        expect(typeof response.body.lon).toBe('number');
      
        const current = response.body.current;
        expect(typeof current.temp).toBe('number');
        expect(Number.isInteger(current.temp)).toBe(true);
        expect(typeof current.weather).toBe('string');
        expect(typeof current.humidity).toBe('number');
        expect(typeof current.pressure).toBe('number');
        expect(typeof current.wind.speed).toBe('number');
        expect(typeof current.wind.deg).toBe('number');
        expect(typeof current.visibility).toBe('number');
        expect(typeof current.clouds).toBe('number');
        expect(typeof current.rain).toBe('number');
        expect(typeof current.day.sunrise).toBe('number');
        expect(typeof current.day.sunset).toBe('number');

        const forecast = response.body.forecast;
        expect(Array.isArray(forecast)).toBe(true);
        expect(forecast.length).toBeGreaterThan(0);
        for (let i = 0; i < forecast.length; i++) {
            expect(typeof forecast[i].temp).toBe('number');
            expect(Number.isInteger(forecast[i].temp)).toBe(true);
            expect(typeof forecast[i].wind).toBe('object');
            expect(typeof forecast[i].wind.speed).toBe('number');
            expect(typeof forecast[i].wind.deg).toBe('number');
            expect(typeof forecast[i].humidity).toBe('number');
            expect(typeof forecast[i].weather).toBe('string');
            expect(typeof forecast[i].time).toBe('number');
            expect(Number.isInteger(forecast[i].time)).toBe(true);
        }
    });

    it('should return both current and forecast weather for coordinates with radius', async () => {
        const response = await request(app).get('/api/weather/all?lon=33.744&lat=35.01812&radius=1000');
        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
        
        expect(typeof response.body.name).toBe('object');
        expect(typeof response.body.name.en).toBe('string');
        expect(typeof response.body.name.es).toBe('string');
        expect(typeof response.body.name.fr).toBe('string');
        expect(typeof response.body.name.original).toBe('string');
        expect(typeof response.body.lat).toBe('number');
        expect(typeof response.body.lon).toBe('number');
      
        const current = response.body.current;
        expect(typeof current.temp).toBe('number');
        expect(Number.isInteger(current.temp)).toBe(true);
        expect(typeof current.weather).toBe('string');
        expect(typeof current.humidity).toBe('number');
        expect(typeof current.pressure).toBe('number');
        expect(typeof current.wind.speed).toBe('number');
        expect(typeof current.wind.deg).toBe('number');
        expect(typeof current.visibility).toBe('number');
        expect(typeof current.clouds).toBe('number');
        expect(typeof current.rain).toBe('number');
        expect(typeof current.day.sunrise).toBe('number');
        expect(typeof current.day.sunset).toBe('number');

        const forecast = response.body.forecast;
        expect(Array.isArray(forecast)).toBe(true);
        expect(forecast.length).toBeGreaterThan(0);
        for (let i = 0; i < forecast.length; i++) {
            expect(typeof forecast[i].temp).toBe('number');
            expect(Number.isInteger(forecast[i].temp)).toBe(true);
            expect(typeof forecast[i].wind).toBe('object');
            expect(typeof forecast[i].wind.speed).toBe('number');
            expect(typeof forecast[i].wind.deg).toBe('number');
            expect(typeof forecast[i].humidity).toBe('number');
            expect(typeof forecast[i].weather).toBe('string');
            expect(typeof forecast[i].time).toBe('number');
            expect(Number.isInteger(forecast[i].time)).toBe(true);
        }
    });

    it('should return both current and forecast weather for name', async () => {
        const response = await request(app).get('/api/weather/all?name=London&lang=en');
        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
        
        expect(typeof response.body.name).toBe('object');
        expect(typeof response.body.name.en).toBe('string');
        expect(typeof response.body.name.es).toBe('string');
        expect(typeof response.body.name.fr).toBe('string');
        expect(typeof response.body.name.original).toBe('string');
        expect(typeof response.body.lat).toBe('number');
        expect(typeof response.body.lon).toBe('number');
      
        const current = response.body.current;
        expect(typeof current.temp).toBe('number');
        expect(Number.isInteger(current.temp)).toBe(true);
        expect(typeof current.weather).toBe('string');
        expect(typeof current.humidity).toBe('number');
        expect(typeof current.pressure).toBe('number');
        expect(typeof current.wind.speed).toBe('number');
        expect(typeof current.wind.deg).toBe('number');
        expect(typeof current.visibility).toBe('number');
        expect(typeof current.clouds).toBe('number');
        expect(typeof current.rain).toBe('number');
        expect(typeof current.day.sunrise).toBe('number');
        expect(typeof current.day.sunset).toBe('number');

        const forecast = response.body.forecast;
        expect(Array.isArray(forecast)).toBe(true);
        expect(forecast.length).toBeGreaterThan(0);
        for (let i = 0; i < forecast.length; i++) {
            expect(typeof forecast[i].temp).toBe('number');
            expect(Number.isInteger(forecast[i].temp)).toBe(true);
            expect(typeof forecast[i].wind).toBe('object');
            expect(typeof forecast[i].wind.speed).toBe('number');
            expect(typeof forecast[i].wind.deg).toBe('number');
            expect(typeof forecast[i].humidity).toBe('number');
            expect(typeof forecast[i].weather).toBe('string');
            expect(typeof forecast[i].time).toBe('number');
            expect(Number.isInteger(forecast[i].time)).toBe(true);
        }
    });

    it('should return an error for missing coordinates', async () => {
        const response = await request(app).get('/api/weather/all');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Coordinates or name are required');
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