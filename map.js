const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate system for an image-based map
    minZoom: -2,       // Zoom out limit for the image map
    maxZoom: 2,        // Zoom in limit for the image map
});

const bounds = [[0, 0], [2200, 2200]];  // Define bounds based on the image size
const image = L.imageOverlay('5-10-24.png', bounds).addTo(map);  // Your custom PNG image for the map

map.fitBounds(bounds);  // Fit map to the image bounds

// Add a draggable marker for explosion center (without popup text for better visibility)
const marker = L.marker([1100, 1100], { draggable: true, icon: L.divIcon({className: 'marker'}) }).addTo(map);

// Store explosion circles
let explosionCircles = [];

// Function to clear previous explosion circles
function clearExplosionCircles() {
    explosionCircles.forEach(circle => map.removeLayer(circle));
    explosionCircles = [];
}

// Function to update marker position
marker.on('drag', function() {
    updateExplosion();
});
