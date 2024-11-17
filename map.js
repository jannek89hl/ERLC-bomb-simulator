// Set up the map, we'll use a custom image for the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate system for an image-based map
    minZoom: -2,       // Zoom out limit for the image map
    maxZoom: 2,        // Zoom in limit for the image map
});

// Define map image bounds (adjust based on the actual size of your PNG image)
const bounds = [[0, 0], [2200, 2200]];  // Example size of the PNG map
const image = L.imageOverlay('10-5-24.png', bounds).addTo(map);  // Use your custom PNG file for the map

// Fit the map to the image bounds
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
    const burstHeight = document.getElementById('burst').value;
    const scalingFactor = 0.533; // 1 pixel = 0.533 meters (scaling based on map image)

    // Adjust explosion radii based on yield (in kilotons)
    let fireballRadius, blastRadius, thermalRadius, lightBlastRadius;
    let descriptions = '';
    let textColor = '';

    // Handle different yield and height of burst cases
    if (yieldValue === 0.001) { // Handheld Nuke for 1 ton
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
        textColor = "red";
    }

    // Create explosion circles
    clearExplosionCircles();
    explosionCircles.push(L.circle(marker.getLatLng(), fireballRadius, { color: textColor }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), blastRadius, { color: textColor }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), thermalRadius, { color: textColor }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), lightBlastRadius, { color: textColor }).addTo(map));

    // Dynamically display details of the explosion
    const details = `
        <h4>Explosion Details (Yield: ${yieldValue} KT)</h4>
        <ul>${descriptions}</ul>
    `;
    document.getElementById("detonation-details").innerHTML = details;
}
