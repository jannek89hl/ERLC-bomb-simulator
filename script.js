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

    // Define explosion radii based on yield (in kilotons)
    let fireballRadius, blastRadius, thermalRadius, lightBlastRadius;
    let descriptions = '';
    let textColor = '';

    if (yieldValue === 0.001) { // Hand Grenade
        fireballRadius = 2 * scalingFactor;
        blastRadius = 6 * scalingFactor;
        thermalRadius = 10 * scalingFactor;
        lightBlastRadius = 25 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 2 m</span><br>A very small explosion.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 6 m</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 10 m</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 25 m</li>
        `;
    } else if (yieldValue === 0.05) { // C4
        fireballRadius = 10 * scalingFactor;
        blastRadius = 40 * scalingFactor;
        thermalRadius = 60 * scalingFactor;
        lightBlastRadius = 150 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 10 m</span><br>Small but concentrated explosion.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 40 m</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 60 m</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 150 m</li>
        `;
    } else if (yieldValue === 0.1) { // Dynamite
        fireballRadius = 20 * scalingFactor;
        blastRadius = 100 * scalingFactor;
        thermalRadius = 150 * scalingFactor;
        lightBlastRadius = 300 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 20 m</span><br>Large explosion with high heat.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 100 m</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 150 m</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 300 m</li>
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
    const customYieldContainer = document.getElementById('custom-yield-container');

    if (preset === 'custom') {
        customYieldContainer.style.display = 'block'; // Show custom yield input
    } else {
        customYieldContainer.style.display = 'none'; // Hide custom yield input
        // Optionally reset to the preset yield when another preset is selected
        if (preset === 'hand_grenade') {
            document.getElementById('yield').value = 0.001;
        } else if (preset === 'c4') {
            document.getElementById('yield').value = 0.05;
        } else if (preset === 'dynamite') {
            document.getElementById('yield').value = 0.1;
        }
    }
});
