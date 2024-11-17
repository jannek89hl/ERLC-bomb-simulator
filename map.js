// Initial setup of the map
const map = L.map('map').setView([51.505, -0.09], 13); // Default to a location (London)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the marker and add it to the map
const marker = L.marker([51.505, -0.09], { draggable: true }).addTo(map);

// Example city areas with lat/lng and radius in meters
const cityAreas = [
    { name: "New York", latLng: { lat: 40.7128, lng: -74.0060 }, radius: 50000 },  // 50 km radius
    { name: "Los Angeles", latLng: { lat: 34.0522, lng: -118.2437 }, radius: 50000 },  // 50 km radius
    // Add more cities as needed
];

// Function to calculate distance between two lat/lng points (Haversine formula)
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to check if the marker is inside any city area
function isInsideCity(lat, lng) {
    for (let city of cityAreas) {
        const distance = getDistance(lat, lng, city.latLng.lat, city.latLng.lng);
        if (distance <= city.radius) {
            return city.name;
        }
    }
    return null;  // No city found
}

// Function to adjust the commentary based on the marker's location (city or rural)
function adjustCommentaryBasedOnLocation(lat, lng) {
    const city = isInsideCity(lat, lng);
    let commentary = '';

    if (city) {
        commentary = `
            <p><strong>Explosion Effects in ${city}:</strong></p>
            <ul>
                <li><span style="color:red;"><strong>Fireball radius:</strong> 67 m (0.01 km²)</span><br>Maximum size of the nuclear fireball; relevance to damage on the ground depends on the height of detonation.</li>
                <li><span style="color:orange;"><strong>Heavy blast damage (20 psi):</strong> 173 m (0.09 km²)</span><br>Heavily built concrete buildings are severely damaged or demolished.</li>
                <li><span style="color:yellow;"><strong>Moderate blast damage (5 psi):</strong> 363 m (0.41 km²)</span><br>Massive damage to residential areas, high casualties.</li>
                <li><span style="color:green;"><strong>Light blast damage (1 psi):</strong> 0.93 km (2.74 km²)</span><br>Glass windows are expected to break in surrounding areas.</li>
            </ul>
        `;
    } else {
        commentary = `
            <p><strong>Explosion Effects in Rural Area:</strong></p>
            <ul>
                <li><span style="color:red;"><strong>Fireball radius:</strong> 67 m (0.01 km²)</span><br>Smaller fireball compared to urban areas.</li>
                <li><span style="color:orange;"><strong>Heavy blast damage (20 psi):</strong> 173 m (0.09 km²)</span><br>Less impact on infrastructure in rural areas.</li>
                <li><span style="color:yellow;"><strong>Moderate blast damage (5 psi):</strong> 363 m (0.41 km²)</span><br>Lower casualty rates compared to urban zones.</li>
                <li><span style="color:green;"><strong>Light blast damage (1 psi):</strong> 0.93 km (2.74 km²)</span><br>Glass windows may break, but fewer injuries expected.</li>
            </ul>
        `;
    }

    // Update the detonation details container with the adjusted commentary
    $('#detonation-details').html(commentary);
}

// Update commentary when the marker is moved
marker.on('dragend', function () {
    const latLng = marker.getLatLng();
    adjustCommentaryBasedOnLocation(latLng.lat, latLng.lng);
});

// Initialize with the current marker location
adjustCommentaryBasedOnLocation(marker.getLatLng().lat, marker.getLatLng().lng);

// Resize map and UI dynamically to prevent overflow
$(window).on('resize', function () {
    const windowHeight = $(window).height();
    $('#map').height(windowHeight * 0.7);  // Map takes up 70% of window height
    $('#detonation-details').height(windowHeight * 0.3);  // Details take up 30% of window height
}).trigger('resize');  // Trigger resize to adjust on load
