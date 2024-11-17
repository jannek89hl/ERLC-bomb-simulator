// Initialize the Leaflet map
const map = L.map('map', {
    crs: L.CRS.Simple, // Simple coordinate system for the Roblox map
    minZoom: -2,       // Zoom out limit
    maxZoom: 2,        // Zoom in limit
});

// Map dimensions and image overlay
const bounds = [[0, 0], [2200, 2200]]; // Adjust based on map size
const image = L.imageOverlay('10-5-24.png', bounds).addTo(map);
map.fitBounds(bounds);

// Add a draggable marker for the explosion point
const marker = L.marker([1100, 1100], { draggable: true }).addTo(map);
marker.bindPopup("Explosion Point").openPopup();

// Store existing explosion circles
let explosionCircles = [];

// Function to clear previous explosions
function clearExplosionCircles() {
    explosionCircles.forEach(circle => map.removeLayer(circle));
    explosionCircles = [];
}

// Function to detonate the bomb and calculate explosion radii
function detonate() {
    const yieldValue = parseFloat(document.getElementById('yield').value);
    const burstHeight = parseFloat(document.getElementById('burst-height').value);

    const scalingFactor = 0.533; // 1 pixel = 0.533 meters (scaled to map)

    const fireballRadius = Math.pow(yieldValue, 1 / 3) * 10 * scalingFactor;
    const blastRadius = Math.pow(yieldValue, 1 / 3) * 50 * scalingFactor;
    const thermalRadius = Math.pow(yieldValue, 1 / 3) * 100 * scalingFactor;

    console.log(`Fireball Radius: ${fireballRadius.toFixed(2)} m`);
    console.log(`Blast Damage Radius: ${blastRadius.toFixed(2)} m`);
    console.log(`Thermal Radiation Radius: ${thermalRadius.toFixed(2)} m`);

    clearExplosionCircles();

    const fireballCircle = L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'red' }).addTo(map);
    const blastCircle = L.circle(marker.getLatLng(), { radius: blastRadius, color: 'orange' }).addTo(map);
    const thermalCircle = L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'yellow' }).addTo(map);

    explosionCircles.push(fireballCircle, blastCircle, thermalCircle);
}

// Event listeners
document.getElementById('detonate').addEventListener('click', detonate);

document.getElementById('clear-effects').addEventListener('click', function() {
    clearExplosionCircles();
    document.getElementById('burst').disabled = false;
    document.getElementById('advanced-options').style.display = 'none';
});
