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

    // Adjust explosion radii based on yield (in kilotons)
    const fireballRadius = Math.pow(yieldValue, 1 / 3) * 10 * scalingFactor;
    const blastRadius = Math.pow(yieldValue, 1 / 3) * 50 * scalingFactor;
    const thermalRadius = Math.pow(yieldValue, 1 / 3) * 100 * scalingFactor;

    const detonationDetails = document.getElementById("detonation-details");
    detonationDetails.innerHTML = `
        <li>Fireball Radius: ${fireballRadius.toFixed(2)} m</li>
        <li>Thermal Radiation Radius (3rd degree burns): ${thermalRadius.toFixed(2)} m</li>
        <li>Moderate Blast Damage Radius (5 psi): ${blastRadius.toFixed(2)} m</li>
        <li>Light Blast Damage Radius (1 psi): ${(blastRadius * 2).toFixed(2)} m</li>
    `;

    // Show detonation details
    document.getElementById('detonation-info').style.display = 'block';

    // Clear previous explosions
    clearExplosionCircles();

    // Create and show explosion circles
    const fireballCircle = L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'red' }).addTo(map).bindPopup('Fireball Radius');
    const thermalCircle = L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'yellow' }).addTo(map).bindPopup('Thermal Radiation Radius');
    const blastCircle = L.circle(marker.getLatLng(), { radius: blastRadius, color: 'orange' }).addTo(map).bindPopup('Blast Damage Radius');

    // Store the circles for later removal
    explosionCircles.push(fireballCircle, thermalCircle, blastCircle);
}

// Handle preset selection to adjust bomb yield
document.getElementById('preset').addEventListener('change', function() {
    let presetYield = 20; // Default value

    if (this.value === 'hand_grenade') {
        presetYield = 0.02; // 0.02 kilotons for Hand Grenade
    } else if (this.value === 'c4') {
        presetYield = 0.1; // 0.1 kilotons for C4
    } else if (this.value === 'dynamite') {
        presetYield = 0.05; // 0.05 kilotons for Dynamite
    }

    // Update the yield input based on preset
    document.getElementById('yield').value = presetYield;
});

// Detonate button event listener
document.getElementById('detonate').addEventListener('click', detonate);

// Clear effects button event listener
document.getElementById('clear-effects').addEventListener('click', function() {
    clearExplosionCircles();
    document.getElementById('detonation-info').style.display = 'none';
});
