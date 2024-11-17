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

// Calculate damage radii and effects
document.getElementById('detonate').addEventListener('click', function () {
    const yield = parseFloat(document.getElementById('yield').value);
    const burst = document.getElementById('burst').value;
    const fallout = document.getElementById('fallout').checked;

    // Example formulas for radii
    const fireballRadius = 100 * Math.pow(yield, 1 / 3); // Fireball radius (m)
    const blastRadius = 500 * Math.pow(yield, 1 / 3);   // Blast damage radius (m)
    const thermalRadius = 1000 * Math.pow(yield, 1 / 3); // Thermal radiation radius (m)

    // Log the results
    console.log(`Fireball Radius: ${fireballRadius.toFixed(2)} m`);
    console.log(`Blast Damage Radius: ${blastRadius.toFixed(2)} m`);
    console.log(`Thermal Radiation Radius: ${thermalRadius.toFixed(2)} m`);
    if (fallout) {
        console.log('Radioactive Fallout: Included');
    } else {
        console.log('Radioactive Fallout: Not included');
    }

    // Visualize the radii on the map
    L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'red' }).addTo(map).bindPopup('Fireball');
    L.circle(marker.getLatLng(), { radius: blastRadius, color: 'orange' }).addTo(map).bindPopup('Blast Damage');
    L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'yellow' }).addTo(map).bindPopup('Thermal Radiation');
});

