const axios = require('axios');

function extractNames(geoNamesObj) {
    const baseName = geoNamesObj.name;
    let nameEn = baseName;
    let nameEs = baseName;
    let nameFr = baseName;
    const alts = geoNamesObj.alternateNames || [];
    for (const alt of alts) {
        if (alt.lang === 'en') nameEn = alt.name;
        else if (alt.lang === 'es') nameEs = alt.name;
        else if (alt.lang === 'fr') nameFr = alt.name;
    }
    return { en: nameEn, es: nameEs, fr: nameFr };
}

async function getMatchingLocations(searchName) {
    const username = process.env.GEONAMES_USERNAME;
    if (!username) {
        throw new Error('Missing GEONAMES_USERNAME env var');
    }
    const url = `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(searchName)}&featureClass=P&maxRows=4&username=${username}&style=full`;
    const response = await axios.get(url);
    const data = response.data || {};
    const results = Array.isArray(data.geonames) ? data.geonames : [];
    return results.map(place => ({
        id: place.geonameId,
        name: extractNames(place),
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lng)
    }));
}

async function getLocationById(id) {
    const username = process.env.GEONAMES_USERNAME;
    if (!username) {
        throw new Error('Missing GEONAMES_USERNAME env var');
    }
    const url = `http://api.geonames.org/getJSON?geonameId=${encodeURIComponent(id)}&username=${username}&style=full`;
    const { data } = await axios.get(url);
    if (!data || !data.geonameId) return null;
    return {
        id: data.geonameId,
        name: extractNames(data),
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lng)
    };
}

module.exports = { getMatchingLocations, getLocationById };