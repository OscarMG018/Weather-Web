const request = require('supertest');
const app = require('./server');

describe('GET /locations/search', () => {
    it('should return a list of locations', async () => {
        const response = await request(app).get('/api/locations/search?name=london');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should be case insensitive', async () => {
        const response = await request(app).get('/api/locations/search?name=LONDON');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should return an empty array if no matches', async () => {
        const response = await request(app).get('/api/locations/search?name=invalid');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
});

describe('GET /locations/id/:id', () => {
    it('should return a location by id', async () => {
        for (let id = 1; id <= 5; id++) {
            const response = await request(app).get('/api/locations/id/' + id);
            expect(response.status).toBe(200);
            //id
            expect(typeof response.body.id).toBe('number');
            expect(response.body.id).toBe(id);
            //name
            expect(typeof response.body.name).toBe('object');
            expect(typeof response.body.name.es).toBe('string');
            expect(typeof response.body.name.en).toBe('string');
            expect(typeof response.body.name.fr).toBe('string');
            //lat and lon
            expect(typeof response.body.lat).toBe('number');
            expect(response.body.lat).toBeGreaterThanOrEqual(-90);
            expect(response.body.lat).toBeLessThanOrEqual(90);
            expect(typeof response.body.lon).toBe('number');
            expect(response.body.lon).toBeGreaterThanOrEqual(-180);
            expect(response.body.lon).toBeLessThanOrEqual(180);
        }
    });

    it('should return an error for an invalid id', async () => {
        const response = await request(app).get('/api/locations/id/55555');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Location not found');
    });
});

describe('GET /weather/current', () => {
    it('should return the weather for a location', async () => {
        const response = await request(app).get('/api/weather/current?location=London');
        expect(response.status).toBe(200);
        //name
        expect(typeof response.body.name).toBeDefined();
        expect(typeof response.body.name.es).toBe('string');
        expect(response.body.name.es).toBe('Londres');
        expect(typeof response.body.name.en).toBe('string');
        expect(response.body.name.en).toBe('London');
        expect(typeof response.body.name.fr).toBe('string');
        expect(response.body.name.fr).toBe('Londres');
        //temp
        expect(typeof response.body.temp.celsius).toBe('number');
        expect(Number.isInteger(response.body.temp.celsius)).toBe(true);
        expect(typeof response.body.temp.fahrenheit).toBe('number');
        expect(Number.isInteger(response.body.temp.fahrenheit)).toBe(true);
        //weather
        expect(typeof response.body.weather).toBe('string');
        expect(response.body.weather.length).toBeGreaterThan(0);
        //humidity
        expect(typeof response.body.humidity).toBe('number');
        expect(response.body.humidity).toBeGreaterThanOrEqual(0);
        //pressure
        expect(typeof response.body.pressure).toBe('number');
        expect(response.body.pressure).toBeGreaterThanOrEqual(0);
        //wind
        expect(typeof response.body.wind.speed).toBe('number');
        expect(response.body.wind.speed).toBeGreaterThanOrEqual(0);
        expect(typeof response.body.wind.deg).toBe('number');
        expect(response.body.wind.deg).toBeGreaterThanOrEqual(0);
        // visibility
        expect(typeof response.body.visibility).toBe('number');
        expect(response.body.visibility).toBeGreaterThanOrEqual(0);
        // clouds
        expect(typeof response.body.clouds).toBe('number');
        expect(response.body.clouds).toBeGreaterThanOrEqual(0);
        expect(response.body.clouds).toBeLessThanOrEqual(100);
        // rain
        expect(typeof response.body.rain).toBe('number');
        expect(response.body.rain).toBeGreaterThanOrEqual(0);
        //daylight
        expect(typeof response.body.day.sunrise).toBe('number');
        expect(typeof response.body.day.sunset).toBe('number');
    });

    it('should return an error for an invalid location', async () => {
        const response = await request(app).get('/api/weather/current?location=invalid');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Location not found');
    });

    it('should return an error for no location', async () => {
        const response = await request(app).get('/api/weather/current');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Location is required');
    });

    it('should return 400 for non-string location', async () => {
        const response = await request(app).get('/api/weather/current?location=12345');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid location');
    });
});

describe('GET /weather/forecast', () => {
    it('should return the forecast for a location', async () => {
        const response = await request(app).get('/api/weather/forecast?location=London');
        expect(response.status).toBe(200);
        //list of objects
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        //each object
        for (let i = 0; i < response.body.length; i++) {
            expect(typeof response.body[i].temp).toBe('number');
            expect(Number.isInteger(response.body[i].temp)).toBe(true);

            expect(typeof response.body[i].wind).toBe('object');
            expect(typeof response.body[i].wind.speed).toBe('number');
            expect(response.body[i].wind.speed).toBeGreaterThanOrEqual(0);
            expect(typeof response.body[i].wind.deg).toBe('number');
            expect(response.body[i].wind.deg).toBeGreaterThanOrEqual(0);

            expect(typeof response.body[i].humidity).toBe('number');
            expect(response.body[i].humidity).toBeGreaterThanOrEqual(0);
            expect(response.body[i].humidity).toBeLessThanOrEqual(100);

            expect(typeof response.body[i].pressure).toBe('number');
            expect(response.body[i].pressure).toBeGreaterThanOrEqual(0);
            expect(typeof response.body[i].visibility).toBe('number');
            expect(response.body[i].visibility).toBeGreaterThanOrEqual(0);
            expect(typeof response.body[i].weather).toBe('string');
            expect(response.body[i].weather.length).toBeGreaterThan(0);
        }
    });

    it('should return an error for an invalid location', async () => {
        const response = await request(app).get('/api/weather/forecast?location=invalid');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Location not found');
    });

    it('should return an error for no location', async () => {
        const response = await request(app).get('/api/weather/forecast');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Location is required');
    });

    it('should return 400 for non-string location', async () => {
        const response = await request(app).get('/api/weather/forecast?location=12345');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid location');
    });
});

describe('GET /weather/all', () => {
    it('should return both current and forecast weather for a location', async () => {
        const response = await request(app).get('/api/weather/all?location=London');
        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('current');
        expect(response.body).toHaveProperty('forecast');
        
        // name checks (now at top level)
        const name = response.body.name;
        expect(typeof name).toBe('object');
        expect(typeof name.en).toBe('string');
        expect(name.en).toBe('London');
        expect(typeof name.es).toBe('string');
        expect(name.es).toBe('Londres');
        expect(typeof name.fr).toBe('string');
        expect(name.fr).toBe('Londres');
        
        // current checks (without name)
        const current = response.body.current;
        expect(typeof current.temp.celsius).toBe('number');
        expect(Number.isInteger(current.temp.celsius)).toBe(true);
        expect(typeof current.temp.fahrenheit).toBe('number');
        expect(Number.isInteger(current.temp.fahrenheit)).toBe(true);
        expect(typeof current.humidity).toBe('number');
        expect(typeof current.pressure).toBe('number');
        expect(typeof current.wind).toBe('object');
        expect(typeof current.wind.speed).toBe('number');
        expect(typeof current.wind.deg).toBe('number');
        expect(typeof current.visibility).toBe('number');
        expect(typeof current.clouds).toBe('number');
        expect(typeof current.rain).toBe('number');
        expect(typeof current.day).toBe('object');
        expect(typeof current.day.sunrise).toBe('number');
        expect(typeof current.day.sunset).toBe('number');
        expect(typeof current.weather).toBe('string');
        expect(current.weather.length).toBeGreaterThan(0);
        // forecast checks (reuse from /forecast)
        const forecast = response.body.forecast;
        expect(Array.isArray(forecast)).toBe(true);
        expect(forecast.length).toBeGreaterThan(0);
        forecast.forEach(item => {
            expect(typeof item.temp).toBe('number');
            expect(Number.isInteger(item.temp)).toBe(true);
            expect(typeof item.wind).toBe('object');
            expect(typeof item.wind.speed).toBe('number');
            expect(typeof item.wind.deg).toBe('number');
            expect(typeof item.humidity).toBe('number');
            expect(typeof item.pressure).toBe('number');
            expect(typeof item.visibility).toBe('number');
            expect(typeof item.weather).toBe('string');
            expect(item.weather.length).toBeGreaterThan(0);
        });
    });
    it('should return an error for an invalid location', async () => {
        const response = await request(app).get('/api/weather/all?location=invalid');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Location not found');
    });
    it('should return an error for no location', async () => {
        const response = await request(app).get('/api/weather/all');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Location is required');
    });
    it('should return 400 for non-string location', async () => {
        const response = await request(app).get('/api/weather/all?location=12345');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid location');
    });
});