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
    // Remove each circle from the map
    explosionCircles.forEach(circle => {
        map.removeLayer(circle);
    });
    explosionCircles = []; // Reset the array
}

// Function to detonate the bomb
function detonate() {
    const yield = parseFloat(document.getElementById('yield').value);
    const burst = document.getElementById('burst').value;
    const fallout = document.getElementById('fallout').checked;

    // Example formulas for radii
    const scalingFactor = 0.533; // 1 pixel = 0.533 meters (scaled to map)
    
    const fireballRadius = Math.pow(yield, 1 / 3) * 10 * scalingFactor; // Fireball radius (meters)
    const blastRadius = Math.pow(yield, 1 / 3) * 50 * scalingFactor;   // Blast damage radius (meters)
    const thermalRadius = Math.pow(yield, 1 / 3) * 100 * scalingFactor; // Thermal radiation radius (meters)

    // Log the results
    console.log(`Fireball Radius: ${fireballRadius.toFixed(2)} m`);
    console.log(`Blast Damage Radius: ${blastRadius.toFixed(2)} m`);
    console.log(`Thermal Radiation Radius: ${thermalRadius.toFixed(2)} m`);
    if (fallout) {
        console.log('Radioactive Fallout: Included');
    } else {
        console.log('Radioactive Fallout: Not included');
    }

    // Clear any existing explosions
    clearExplosionCircles();

    // Visualize the radii on the map
    const fireballCircle = L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'red' }).addTo(map).bindPopup('Fireball');
    const blastCircle = L.circle(marker.getLatLng(), { radius: blastRadius, color: 'orange' }).addTo(map).bindPopup('Blast Damage');
    const thermalCircle = L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'yellow' }).addTo(map).bindPopup('Thermal Radiation');

    // Store the new explosion circles
    explosionCircles.push(fireballCircle, blastCircle, thermalCircle);
}

// Set predefined explosive types
document.getElementById('preset').addEventListener('change', function() {
    const preset = this.value;
    switch(preset) {
        case 'hand_grenade':
            document.getElementById('yield').value = 0.02; // 20 tons (hand grenade)
            break;
        case 'c4':
            document.getElementById('yield').value = 0.5; // 500 tons (C4)
            break;
        case 'dynamite':
            document.getElementById('yield').value = 0.1; // 100 tons (dynamite)
            break;
        default:
            document.getElementById('yield').value = 20; // Default value (big bomb)
            break;
    }
});

// Event listener for detonation button
document.getElementById('detonate').addEventListener('click', detonate);
