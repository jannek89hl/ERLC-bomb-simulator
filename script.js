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
            <li><span style="color:red;"><strong>Fireball radius:</strong> 2 m</span><br>A small but intense fireball that can cause severe burns to anyone within its immediate vicinity.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 6 m</span><br>Severe concussive force, potentially causing injuries like ruptured eardrums, internal damage, and knockdowns.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 10 m</span><br>Light structural damage, broken windows, and injuries from flying debris, including concussions or minor injuries.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 25 m</span><br>Light damage to structures and potential for non-lethal injuries like minor cuts from debris, glass shattering.</li>
        `;
    } else if (yieldValue === 0.05) { // C4
        fireballRadius = 10 * scalingFactor;
        blastRadius = 40 * scalingFactor;
        thermalRadius = 60 * scalingFactor;
        lightBlastRadius = 150 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 10 m</span><br>A powerful fireball capable of igniting anything flammable in its vicinity and causing severe burns to people within this radius.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 40 m</span><br>Severe damage to structures, with significant injuries from flying debris, collapsed walls, and windows shattering.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 60 m</span><br>Destruction of nearby buildings, with windows blown out, cars overturned, and potential for serious injuries or fatalities due to flying debris and shockwaves.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 150 m</span><br>Damage to vehicles, window shattering, and debris scattered, with some injuries possible from the shockwave and flying glass.</li>
        `;
    } else if (yieldValue === 0.1) { // Dynamite
        fireballRadius = 20 * scalingFactor;
        blastRadius = 100 * scalingFactor;
        thermalRadius = 150 * scalingFactor;
        lightBlastRadius = 300 * scalingFactor;

        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 20 m</span><br>A massive fireball capable of causing third-degree burns to anyone within range and igniting nearby objects, including trees, cars, and buildings.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 100 m</span><br>Severe structural damage, complete destruction of buildings, and catastrophic injuries including blunt force trauma, internal bleeding, and amputations from the blast.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 150 m</span><br>Major structural collapse, severe injuries from debris impact, fires spreading from destroyed buildings, and a high risk of death from flying shrapnel.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 300 m</span><br>Moderate damage to structures, broken windows, and injuries such as cuts and concussions, along with the possibility of fires starting from debris or broken electrical lines.</li>
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
