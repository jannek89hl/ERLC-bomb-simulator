// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Simple coordinate system
    minZoom: -2,
    maxZoom: 2,
});

// Image bounds (adjust according to your PNG image size)
const bounds = [[0, 0], [2200, 2200]];  // Example size of your PNG image
const image = L.imageOverlay('10-5-24.png', bounds).addTo(map);  // Add your map image

map.fitBounds(bounds);

// Marker setup for explosion point
const marker = L.marker([1100, 1100], { draggable: true }).addTo(map);
marker.bindPopup("Explosion Point").openPopup();

// Store explosion circles
let explosionCircles = [];

// Clear previous explosion circles
function clearExplosionCircles() {
    explosionCircles.forEach(circle => map.removeLayer(circle));
    explosionCircles = [];
}

// Detonate the bomb and calculate explosion effects
function detonate() {
    let yieldValue = parseFloat(document.getElementById('yield').value);
    if (document.getElementById('custom-yield').value) {
        yieldValue = parseFloat(document.getElementById('custom-yield').value);  // Custom yield
    }

    const burstHeight = document.getElementById('burst').value;
    const scalingFactor = 0.533;  // Scaling factor for image-based map

    let fireballRadius, blastRadius, thermalRadius, lightBlastRadius;
    let descriptions = '';
    let textColor = "red";

    // Define explosion effects for different yields
    if (yieldValue === 0.001) {  // 1 Ton handheld nuke
        fireballRadius = 67 * scalingFactor;
        blastRadius = 173 * scalingFactor;
        thermalRadius = 363 * scalingFactor;
        lightBlastRadius = 930 * scalingFactor;
        descriptions = `
            <li style="color: orange;"><strong>Fireball radius:</strong> 67 m</li>
            <li style="color: red;"><strong>Heavy blast damage (20 psi):</strong> 173 m</li>
            <li style="color: yellow;"><strong>Moderate blast damage (5 psi):</strong> 363 m</li>
            <li style="color: pink;"><strong>Light blast damage (1 psi):</strong> 930 m</li>
        `;
    } else if (yieldValue === 0.02) {  // Grenade
        fireballRadius = 13 * scalingFactor;
        blastRadius = 33 * scalingFactor;
        thermalRadius = 69 * scalingFactor;
        lightBlastRadius = 174 * scalingFactor;
        descriptions = `
            <li style="color: orange;"><strong>Fireball radius:</strong> 13 m</li>
            <li style="color: red;"><strong>Heavy blast damage (20 psi):</strong> 33 m</li>
            <li style="color: yellow;"><strong>Moderate blast damage (5 psi):</strong> 69 m</li>
            <li style="color: pink;"><strong>Light blast damage (1 psi):</strong> 174 m</li>
        `;
    } else if (yieldValue === 0.03) {  // C4
        fireballRadius = 20 * scalingFactor;
        blastRadius = 50 * scalingFactor;
        thermalRadius = 103 * scalingFactor;
        lightBlastRadius = 258 * scalingFactor;
        descriptions = `
            <li style="color: orange;"><strong>Fireball radius:</strong> 20 m</li>
            <li style="color: red;"><strong>Heavy blast damage (20 psi):</strong> 50 m</li>
            <li style="color: yellow;"><strong>Moderate blast damage (5 psi):</strong> 103 m</li>
            <li style="color: pink;"><strong>Light blast damage (1 psi):</strong> 258 m</li>
        `;
    } else if (yieldValue === 0.1) {  // Dynamite
        fireballRadius = 35 * scalingFactor;
        blastRadius = 88 * scalingFactor;
        thermalRadius = 183 * scalingFactor;
        lightBlastRadius = 460 * scalingFactor;
        descriptions = `
            <li style="color: orange;"><strong>Fireball radius:</strong> 35 m</li>
            <li style="color: red;"><strong>Heavy blast damage (20 psi):</strong> 88 m</li>
            <li style="color: yellow;"><strong>Moderate blast damage (5 psi):</strong> 183 m</li>
            <li style="color: pink;"><strong>Light blast damage (1 psi):</strong> 460 m</li>
        `;
    } else {
        fireballRadius = 100 * scalingFactor;
        blastRadius = 250 * scalingFactor;
        thermalRadius = 500 * scalingFactor;
        lightBlastRadius = 1250 * scalingFactor;
    }

    // Clear previous explosion circles
    clearExplosionCircles();

    // Add explosion circles with distinct colors for each effect
    explosionCircles.push(L.circle(marker.getLatLng(), fireballRadius, { color: "orange" }).addTo(map));  // Fireball
    explosionCircles.push(L.circle(marker.getLatLng(), blastRadius, { color: "red" }).addTo(map));     // Blast
    explosionCircles.push(L.circle(marker.getLatLng(), thermalRadius, { color: "yellow" }).addTo(map)); // Thermal
    explosionCircles.push(L.circle(marker.getLatLng(), lightBlastRadius, { color: "pink" }).addTo(map)); // Light blast

    // Update the detonation details section
    const details = `
        <h4>Explosion Details (Yield: ${yieldValue} KT)</h4>
        <ul>${descriptions}</ul>
    `;
    document.getElementById("detonation-details").innerHTML = details;
}

// Button click handler to trigger detonation
document.getElementById('detonate-btn').addEventListener('click', detonate);
