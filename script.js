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
    const scalingFactor = 0.533; // 1 pixel = 0.533 meters (scaled to map)

    // Adjust explosion radii based on yield (in kilotons)
    let fireballRadius, blastRadius, thermalRadius, lightBlastRadius;
    let descriptions = '';

    // Validate yield input
    if (isNaN(yieldValue) || yieldValue <= 0) {
        alert('Please enter a valid yield value.');
        return;
    }

    // Adjust radii based on yield
    if (yieldValue <= 0.001) { // Very small yield (like hand grenade)
        fireballRadius = 2 * scalingFactor;
        blastRadius = 6 * scalingFactor;
        thermalRadius = 10 * scalingFactor;
        lightBlastRadius = 25 * scalingFactor;

        descriptions = `
            <li><span style="color: orange;"><strong>Fireball radius:</strong> 2 m (12 m²)</span><br>A very small explosion, just a small fireball.</li>
            <li><span style="color: red;"><strong>Heavy blast damage radius (20 psi):</strong> 6 m (0.01 km²)</span><br>Some walls may crack or collapse at this radius; highly localized damage.</li>
            <li><span style="color: lighterorange;"><strong>Moderate blast damage radius (5 psi):</strong> 10 m (0.03 km²)</span><br>Minor damage to small structures, possible injuries to those close by.</li>
            <li><span style="color: gray;"><strong>Light blast damage radius (1 psi):</strong> 25 m (0.2 km²)</span><br>Glass windows may break, few injuries likely.</li>
        `;
    } else if (yieldValue <= 0.05) { // Small yield (like C4)
        fireballRadius = 10 * scalingFactor;
        blastRadius = 40 * scalingFactor;
        thermalRadius = 60 * scalingFactor;
        lightBlastRadius = 150 * scalingFactor;

        descriptions = `
            <li><span style="color: orange;"><strong>Fireball radius:</strong> 10 m (30 m²)</span><br>Small but concentrated explosion with high energy.</li>
            <li><span style="color: red;"><strong>Heavy blast damage radius (20 psi):</strong> 40 m (0.05 km²)</span><br>Concrete buildings may suffer damage; fatalities are possible for those near.</li>
            <li><span style="color: lighterorange;"><strong>Moderate blast damage radius (5 psi):</strong> 60 m (0.11 km²)</span><br>Heavy damage to small structures and injury risk is significant.</li>
            <li><span style="color: gray;"><strong>Light blast damage radius (1 psi):</strong> 150 m (0.07 km²)</span><br>Widespread glass breakage, significant risk of injuries from flying debris.</li>
        `;
    } else if (yieldValue <= 0.1) { // Medium yield (like dynamite)
        fireballRadius = 20 * scalingFactor;
        blastRadius = 100 * scalingFactor;
        thermalRadius = 150 * scalingFactor;
        lightBlastRadius = 300 * scalingFactor;

        descriptions = `
            <li><span style="color: orange;"><strong>Fireball radius:</strong> 20 m (120 m²)</span><br>Large but not catastrophic fireball with high heat.</li>
            <li><span style="color: red;"><strong>Heavy blast damage radius (20 psi):</strong> 100 m (0.03 km²)</span><br>Widespread severe damage to buildings, fatalities near the blast center.</li>
            <li><span style="color: lighterorange;"><strong>Moderate blast damage radius (5 psi):</strong> 150 m (0.07 km²)</span><br>Major structural damage in urban areas, casualties and fires.</li>
            <li><span style="color: gray;"><strong>Light blast damage radius (1 psi):</strong> 300 m (0.28 km²)</span><br>Widespread damage to windows and doors, possible injuries across a large area.</li>
        `;
    }

    // Add explosion circles to the map
    clearExplosionCircles();

    // Add fireball circle (color = orange)
    const fireballCircle = L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'orange', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(fireballCircle);

    // Add blast damage circle (color = red)
    const blastCircle = L.circle(marker.getLatLng(), { radius: blastRadius, color: 'red', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(blastCircle);

    // Add thermal radiation circle (color = lighter orange)
    const thermalCircle = L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'lightorange', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(thermalCircle);

    // Add light blast damage circle (color = gray)
    const lightBlastCircle = L.circle(marker.getLatLng(), { radius: lightBlastRadius, color: 'gray', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(lightBlastCircle);

    // Display detonation details
    document.getElementById('detonation-details').innerHTML = descriptions;
    document.getElementById('detonation-info').style.display = 'block';
}

// Event listener for preset selection to update yield
document.getElementById('preset').addEventListener('change', function () {
    let presetYield = 0; // Default for custom preset

    if (this.value === 'hand_grenade') {
        presetYield = 0.001; // Hand Grenade (0.001 kilotons)
    } else if (this.value === 'c4') {
        presetYield = 0.05; // C4 (0.05 kilotons)
    } else if (this.value === 'dynamite') {
        presetYield = 0.1; // Dynamite (0.1 kilotons)
    } else if (this.value === 'none') {
        presetYield = parseFloat(document.getElementById('yield').value); // Custom
    }

    // Update the bomb yield input field when a preset is selected
    document.getElementById('yield').value = presetYield;
});

// Event listener for detonate button
document.getElementById('detonate').addEventListener('click', detonate);
