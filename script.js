// Initial setup for handling marker drag and updating commentary

const map = L.map('map', {
    crs: L.CRS.Simple, // Simple coordinate system
    minZoom: -2,       // Zoom out limit
    maxZoom: 2,        // Zoom in limit
});

// Map image settings (assuming you've uploaded your image)
const bounds = [[0, 0], [2200, 2200]];  // Map image size (adjust to match your PNG size)
const image = L.imageOverlay('10-5-24.png', bounds).addTo(map);  // Map image

map.fitBounds(bounds);  // Fit the map to the image bounds

// Create a draggable marker
const marker = L.marker([1100, 1100], { draggable: true }).addTo(map);
marker.bindPopup("Explosion Point").openPopup();

// Function to calculate distance (Haversine formula)
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
    // Example cities with lat, lng and radius
    const cityAreas = [
        { name: "New York", latLng: { lat: 40.7128, lng: -74.0060 }, radius: 50000 },  // 50 km radius
        { name: "Los Angeles", latLng: { lat: 34.0522, lng: -118.2437 }, radius: 50000 },  // 50 km radius
    ];

    for (let city of cityAreas) {
        const distance = getDistance(lat, lng, city.latLng.lat, city.latLng.lng);
        if (distance <= city.radius) {
            return city.name;
        }
    }
    return null;
}

// Function to update commentary based on location
function adjustCommentaryBasedOnLocation(lat, lng) {
    const city = isInsideCity(lat, lng);
    let commentary = '';

    if (city) {
        commentary = `
            <p><strong>Explosion Effects in ${city}:</strong></p>
            <ul>
                <li><strong>Fireball radius:</strong> 67 m</li>
                <li><strong>Heavy blast damage (20 psi):</strong> 173 m</li>
                <li><strong>Moderate blast damage (5 psi):</strong> 363 m</li>
                <li><strong>Light blast damage (1 psi):</strong> 930 m</li>
            </ul>
        `;
    } else {
        commentary = `
            <p><strong>Explosion Effects in Unpopulated Area:</strong></p>
            <ul>
                <li><strong>Fireball radius:</strong> 67 m</li>
                <li><strong>Heavy blast damage (20 psi):</strong> 173 m</li>
            </ul>
        `;
    }

    // Update the commentary section
    document.getElementById("detonation-details").innerHTML = commentary;
}

// Call this function when the marker is moved
marker.on('move', function() {
    const latLng = marker.getLatLng();
    adjustCommentaryBasedOnLocation(latLng.lat, latLng.lng);
});
