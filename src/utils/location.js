import stationData from "../content/mrt_stations.json";

// Shown until an address is picked from the suggestions (or if the search isn't working)
export const DEFAULT_PICKUPS = ["At the house block", "Nearest MRT station", "Nearest bus stop"];

// "ANG MO KIO AVENUE 6" -> "Ang Mo Kio Avenue 6" (a new word starts after a space, bracket, slash or dash)
const toTitleCase = (text = "") =>
    text.toLowerCase().replace(/(^|[\s(/-])([a-z])/g, (match, before, letter) => before + letter.toUpperCase());

// Free Singapore address search by OneMap (gov.sg); returns [] if it fails or is busy
export async function searchAddress(text) {
    try {
        const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(text)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();
        return (data.results || []).slice(0, 5).map((result) => ({
            address: toTitleCase(result.ADDRESS),
            block: result.BLK_NO,
            road: toTitleCase(result.ROAD_NAME),
            building: result.BUILDING !== "NIL" ? toTitleCase(result.BUILDING) : "",
            lat: Number(result.LATITUDE),
            lng: Number(result.LONGITUDE)
        }));
    } catch (error) {
        return [];
    }
}

// Straight-line distance; good enough to compare places within Singapore
const distance = (a, b) => {
    const x = (a.lng - b.lng) * Math.cos((a.lat * Math.PI) / 180);
    const y = a.lat - b.lat;
    return Math.sqrt(x * x + y * y);
};

export const findNearestStation = (place) =>
    stationData.stations.reduce((nearest, station) => (distance(place, station) < distance(place, nearest) ? station : nearest));

// Three pickup choices for a chosen address: at the place itself, the nearest MRT/LRT station, and a bus stop
export function getPickupOptions(place) {
    const hasBlock = place.block && place.block !== "NIL";

    // A named building (e.g. a mall) reads better than its block number
    let atPlace = `At ${place.address}`;
    if (place.building) {
        atPlace = `At ${place.building}`;
    } else if (hasBlock) {
        atPlace = `At Blk ${place.block} ${place.road}`;
    }

    return [atPlace, findNearestStation(place).name, "Nearest bus stop"];
}
