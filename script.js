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
    const yieldValue = parseFloat(document.getElementById('yield').value);
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
    }

    // Clear previous explosion circles
    clearExplosionCircles();
    explosionCircles.push(L.circle(marker.getLatLng(), fireballRadius, { color: textColor }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), blastRadius, { color: textColor }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), thermalRadius, { color: textColor }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), lightBlastRadius, { color: textColor }).addTo(map));

    // Update the detonation details section
    const details = `
        <h4>Explosion Details (Yield: ${yieldValue} KT)</h4>
        <ul>${descriptions}</ul>
    `;
    document.getElementById("detonation-details").innerHTML = details;
}

// Button click handler to trigger detonation
document.getElementById('detonate-btn').addEventListener('click', detonate);
