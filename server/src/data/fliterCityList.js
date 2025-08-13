fs = require('fs').promises;

async function processCityList() {
    // After downloading city.list.json.gz and extracting it
    const cities = JSON.parse(await fs.readFile('city.list.json', 'utf-8'));

    // Filter by specific countries
    const targetCountries = ['US', 'ES', 'FR', 'GB', 'DE', 'IT', 'CA', 'MX'];
    
    const filteredCities = cities
        .filter(city => targetCountries.includes(city.country))
        .map(city => ({
        id: city.id,
        name: city.name,
        country: city.country,
        coord: {
            lat: city.coord.lat,
            lon: city.coord.lon
        },
        state: city.state || null
    }));
      
    return filteredCities;
}

async function overwriteCityList(cities) {
    const cityData = JSON.stringify(cities, null, 2);
    await fs.writeFile('city.list.json', cityData);
}


processCityList().then( cities => 
    overwriteCityList(cities).then(() => console.log('City list updated'))
);