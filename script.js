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
    if (isNaN(yieldValue) || yieldValue <= 0) {
        alert("Please enter a valid Bomb Yield value.");
        return;
    }

    const scalingFactor = 0.533; // 1 pixel = 0.533 meters (scaled to map)

    // Define explosion radii based on yield (in kilotons)
    let fireballRadius, blastRadius, thermalRadius, lightBlastRadius;
    let descriptions = '';

    if (yieldValue === 0.001) { // Hand Grenade
        fireballRadius = 2 * scalingFactor;
        blastRadius = 6 * scalingFactor;
        thermalRadius = 10 * scalingFactor;
        lightBlastRadius = 25 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 2 m</span><br>A very small explosion with high heat.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 6 m</span><br>Severe damage in a small area.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 10 m</span><br>Moderate blast impact.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 25 m</span><br>Light blast effect and injury radius.</li>
        `;
    } else if (yieldValue === 0.05) { // C4
        fireballRadius = 10 * scalingFactor;
        blastRadius = 40 * scalingFactor;
        thermalRadius = 60 * scalingFactor;
        lightBlastRadius = 150 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 10 m</span><br>Intense fireball radius, burns in proximity.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 40 m</span><br>Significant damage from blast.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 60 m</span><br>Major impact in this zone.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 150 m</span><br>Light blast effects, broken windows, etc.</li>
        `;
    } else if (yieldValue === 0.1) { // Dynamite
        fireballRadius = 20 * scalingFactor;
        blastRadius = 100 * scalingFactor;
        thermalRadius = 150 * scalingFactor;
        lightBlastRadius = 300 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 20 m</span><br>Large fireball radius, dangerous burns within.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 100 m</span><br>Severe blast effects within this radius.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 150 m</span><br>Serious damage within this radius.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 300 m</span><br>Light blast effects, debris and windows shattering.</li>
        `;
    }

    // Add explosion circles to the map
    clearExplosionCircles();

    // Add fireball circle
    const fireballCircle = L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'red', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(fireballCircle);

    // Add blast damage circle
    const blastCircle = L.circle(marker.getLatLng(), { radius: blastRadius, color: 'orange', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(blastCircle);

    // Add thermal radiation circle
    const thermalCircle = L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'yellow', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(thermalCircle);

    // Add light blast damage circle
    const lightBlastCircle = L.circle(marker.getLatLng(), { radius: lightBlastRadius, color: 'green', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(lightBlastCircle);

    // Update detonation details
    document.getElementById('detonation-details').innerHTML = descriptions;
    document.getElementById('detonation-info').style.display = 'block';
}

// Event listener for preset selection
document.getElementById('preset').addEventListener('change', function () {
    const preset = this.value;

    if (preset === 'hand_grenade') {
        document.getElementById('yield').value = 0.001;
    } else if (preset === 'c4') {
        document.getElementById('yield').value = 0.05;
    } else if (preset === 'dynamite') {
        document.getElementById('yield').value = 0.1;
    }
});

// Event listener for detonate button
document.getElementById('detonate').addEventListener('click', detonate);
