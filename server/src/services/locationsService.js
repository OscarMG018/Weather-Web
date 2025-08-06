
//TODO: make a json file with the locations
const locations = [
    {
        id: 1,
        name: {
            en: 'London',
            es: 'Londres',
            fr: 'Londres'
        },
        lat: 52.5200,
        lon: 13.4050
    },
    {      
        id: 2,
        name: {
            en: 'Berlin',
            es: 'Berlín',
            fr: 'Berlin'
        },
        lat: 51.5074,
        lon: -0.1278
    },
    {
        id: 3,
        name: {
            en: 'New York',
            es: 'Nueva York',
            fr: 'New York'
        },
        lat: 40.7128,
        lon: -74.0060
    },
    {
        id: 4,
        name: {
            en: 'Paris',
            es: 'París',
            fr: 'Paris'
        },
        lat: 48.8566,
        lon: 2.3522
    },
    {
        id: 5,
        name: {
            en: 'Tokyo',
            es: 'Tokio',
            fr: 'Tokyo'
        },
        lat: 35.6895,
        lon: 139.6917
    }
];

function getMatchingLocations(name) {
    const responseData = [];
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].name.es.toLowerCase().includes(name.toLowerCase()) || 
            locations[i].name.en.toLowerCase().includes(name.toLowerCase()) ||
            locations[i].name.fr.toLowerCase().includes(name.toLowerCase())) {
            responseData.push(locations[i]);
            if (responseData.length === 5) {
                break;
            }
        }
    }
    return responseData;
}

function getLocationById(id) {
    return locations.find(location => location.id == id);
}

function getLocationByEnName(name) {
    return locations.find(location => location.name.en.toLowerCase() == name.toLowerCase());
}

module.exports = { getMatchingLocations, getLocationById, getLocationByEnName };