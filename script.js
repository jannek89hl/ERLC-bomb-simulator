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
    const yieldValue = parseFloat(document.getElementById('yield').value) || parseFloat(document.getElementById('custom-yield').value);
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
            <li><strong>Fireball radius:</strong> 67 m</li>
            <li><strong>Heavy blast damage (20 psi):</strong> 173 m</li>
            <li><strong>Moderate blast damage (5 psi):</strong> 363 m</li>
            <li><strong>Light blast damage (1 psi):</strong> 930 m</li>
        `;
    } else if (yieldValue === 0.1) {  // 100 Tons
        fireballRadius = 210 * scalingFactor;
        blastRadius = 430 * scalingFactor;
        thermalRadius = 870 * scalingFactor;
        lightBlastRadius = 2000 * scalingFactor;
        descriptions = `
            <li><strong>Fireball radius:</strong> 210 m</li>
            <li><strong>Heavy blast damage (20 psi):</strong> 430 m</li>
            <li><strong>Moderate blast damage (5 psi):</strong> 870 m</li>
            <li><strong>Light blast damage (1 psi):</strong> 2000 m</li>
        `;
    } else if (yieldValue === 1) {  // 1 Kiloton
        fireballRadius = 670 * scalingFactor;
        blastRadius = 1730 * scalingFactor;
        thermalRadius = 3630 * scalingFactor;
        lightBlastRadius = 9300 * scalingFactor;
        descriptions = `
            <li><strong>Fireball radius:</strong> 670 m</li>
            <li><strong>Heavy blast damage (20 psi):</strong> 1730 m</li>
            <li><strong>Moderate blast damage (5 psi):</strong> 3630 m</li>
            <li><strong>Light blast damage (1 psi):</strong> 9300 m</li>
        `;
    } else if (yieldValue === 10) {  // 10 Kilotons
        fireballRadius = 2100 * scalingFactor;
        blastRadius = 4300 * scalingFactor;
        thermalRadius = 8700 * scalingFactor;
        lightBlastRadius = 20000 * scalingFactor;
        descriptions = `
            <li><strong>Fireball radius:</strong> 2100 m</li>
            <li><strong>Heavy blast damage (20 psi):</strong> 4300 m</li>
            <li><strong>Moderate blast damage (5 psi):</strong> 8700 m</li>
            <li><strong>Light blast damage (1 psi):</strong> 20000 m</li>
        `;
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
