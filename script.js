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
    const burstHeight = document.getElementById('burst').value;
    const scalingFactor = 0.533; // 1 pixel = 0.533 meters (scaled to map)

    // Adjust explosion radii based on yield (in kilotons)
    let fireballRadius, blastRadius, thermalRadius, lightBlastRadius;
    let descriptions = '';

    // Handle different yield and height of burst cases
    if (yieldValue === 0.02) {
        fireballRadius = 18.5 * scalingFactor;
        blastRadius = 59.1 * scalingFactor;
        thermalRadius = 136 * scalingFactor;
        lightBlastRadius = 319 * scalingFactor;

        descriptions = `
            <li><strong>Fireball radius:</strong> 18.5 m (1,070 m²)<br>Maximum size of the nuclear fireball; relevance to damage on the ground depends on the height of detonation. If it touches the ground, the amount of radioactive fallout is significantly increased. Anything inside the fireball is effectively vaporized.</li>
            <li><strong>Heavy blast damage radius (20 psi):</strong> 59.1 m (0.01 km²)<br>At 20 psi overpressure, heavily built concrete buildings are severely damaged or demolished; fatalities approach 100%. Often used as a benchmark for heavy damage in cities.</li>
            <li><strong>Moderate blast damage radius (5 psi):</strong> 124 m (0.05 km²)<br>At 5 psi overpressure, most residential buildings collapse, injuries are universal, fatalities are widespread. The chances of a fire starting in commercial and residential damage are high, and buildings so damaged are at high risk of spreading fire. Often used as a benchmark for moderate damage in cities.</li>
            <li><strong>Thermal radiation radius (3rd degree burns):</strong> 136 m (0.06 km²)<br>Third degree burns extend throughout the layers of skin, and are often painless because they destroy the pain nerves. They can cause severe scarring or disablement, and can require amputation. 100% probability for 3rd degree burns at this yield is 7.07 cal/cm².</li>
            <li><strong>Light blast damage radius (1 psi):</strong> 319 m (0.32 km²)<br>At around 1 psi overpressure, glass windows can be expected to break. This can cause many injuries in a surrounding population who comes to a window after seeing the flash of a nuclear explosion (which travels faster than the pressure wave). Often used as a benchmark for light damage in cities.</li>
            <li><strong>Thermal radiation radius (no harm):</strong> 329 m (0.34 km²)<br>The distance at which anybody beyond would definitely suffer no damage from thermal radiation (heat). 100% probability of no significant thermal damage at this yield is 0.13 cal/cm².</li>
        `;
    } else if (yieldValue === 0.5) {
        fireballRadius = 67 * scalingFactor;
        blastRadius = 173 * scalingFactor;
        thermalRadius = 399 * scalingFactor;
        lightBlastRadius = 929 * scalingFactor;

        descriptions = `
            <li><strong>Fireball radius:</strong> 67 m (0.01 km²)<br>Maximum size of the nuclear fireball; relevance to damage on the ground depends on the height of detonation. If it touches the ground, the amount of radioactive fallout is significantly increased. Anything inside the fireball is effectively vaporized.</li>
            <li><strong>Heavy blast damage radius (20 psi):</strong> 173 m (0.09 km²)<br>At 20 psi overpressure, heavily built concrete buildings are severely damaged or demolished; fatalities approach 100%. Often used as a benchmark for heavy damage in cities.</li>
            <li><strong>Moderate blast damage radius (5 psi):</strong> 363 m (0.41 km²)<br>At 5 psi overpressure, most residential buildings collapse, injuries are universal, fatalities are widespread. The chances of a fire starting in commercial and residential damage are high, and buildings so damaged are at high risk of spreading fire. Often used as a benchmark for moderate damage in cities.</li>
            <li><strong>Thermal radiation radius (3rd degree burns):</strong> 399 m (0.5 km²)<br>Third degree burns extend throughout the layers of skin, and are often painless because they destroy the pain nerves. They can cause severe scarring or disablement, and can require amputation. 100% probability for 3rd degree burns at this yield is 6.65 cal/cm².</li>
            <li><strong>Light blast damage radius (1 psi):</strong> 929 m (2.74 km²)<br>At around 1 psi overpressure, glass windows can be expected to break. This can cause many injuries in a surrounding population who comes to a window after seeing the flash of a nuclear explosion (which travels faster than the pressure wave). Often used as a benchmark for light damage in cities.</li>
            <li><strong>Thermal radiation radius (no harm):</strong> 960 m (2.91 km²)<br>The distance at which anybody beyond would definitely suffer no damage from thermal radiation (heat). 100% probability of no significant thermal damage at this yield is 1.05 cal/cm².</li>
        `;
    }

    // Add explosion circles to the map
    clearExplosionCircles();

    // Add fireball circle
    const fireballCircle = L.circle(marker.getLatLng(), { radius: fireballRadius, color: 'red', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(fireballCircle);

    // Add blast damage circles
    const blastCircle = L.circle(marker.getLatLng(), { radius: blastRadius, color: 'orange', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(blastCircle);

    // Add thermal radiation circles
    const thermalCircle = L.circle(marker.getLatLng(), { radius: thermalRadius, color: 'yellow', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(thermalCircle);

    // Add light blast damage circles
    const lightBlastCircle = L.circle(marker.getLatLng(), { radius: lightBlastRadius, color: 'green', fillOpacity: 0.2 }).addTo(map);
    explosionCircles.push(lightBlastCircle);

    // Display detonation details
    document.getElementById('detonation-details').innerHTML = descriptions;
    document.getElementById('detonation-info').style.display = 'block';
}

// Event listener for preset selection to update yield
document.getElementById('preset').addEventListener('change', function () {
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
document.getElementById('clear-effects').addEventListener('click', function () {
    clearExplosionCircles();
    document.getElementById('detonation-info').style.display = 'none';
});
