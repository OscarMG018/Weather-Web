const axios = require('axios');
const locations = require('../data/cities_with_names.json');

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getLocationByCoordinates(lon, lat, radius=0) {
    for (const loc of locations) {
        if (!loc || !loc.name || !loc.name["original"] || !loc.lon || !loc.lat) continue;
        if (radius > 0 && getDistance(loc.lat, loc.lon, lat, lon) <= radius) {
            return loc;
        } else if (loc.lon == lon && loc.lat == lat) {
            return loc;
        }

    }
    return null;
}

function getLocationByName(name, lang) {
    for (const loc of locations) {
        if (!loc || !loc.name || !loc.name[lang] || !loc.name["original"] || !loc.lon || !loc.lat) continue;
        if (loc.name[lang].toLowerCase() === name.toLowerCase()) {
            return loc;
        }
    }
    return null;
}

function getMatchingLocations(searchName, lang) {
    const results = [];
    for (const location of locations) {
        if (!location || !location.name || !location.name[lang] || !location.name["original"] || !location.lon || !location.lat) continue;
        if (results.find(loc => loc.name[lang] === location.name[lang])) continue;
        if (location.name[lang].toLowerCase().startsWith(searchName.toLowerCase())) {
            results.push(location);
        }
        if (results.length >= 5) break;
    }
    return results;
}


module.exports = { getMatchingLocations, getLocationByName, getLocationByCoordinates };