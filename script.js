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

    // **Bomb Types**
    if (yieldValue === 0.01) {
        // Pipe Bomb (0.01 kt)
        fireballRadius = 3 * scalingFactor;
        blastRadius = 10 * scalingFactor;
        thermalRadius = 20 * scalingFactor;
        lightBlastRadius = 50 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 3 m</span><br>
            Small fireball with intense heat that can ignite nearby materials, including clothing and vehicles.</li>
            <li><span style="color:orange;"><strong>Blast damage radius:</strong> 10 m</span><br>
            Severe injuries and potential fatalities in this radius. Shrapnel can cause penetrating wounds.</li>
            <li><span style="color:yellow;"><strong>Moderate damage radius:</strong> 20 m</span><br>
            Heavy structural damage, shattered windows, and injuries to people within this range.</li>
            <li><span style="color:green;"><strong>Light damage radius:</strong> 50 m</span><br>
            Damage is less severe, but structures like windows and vehicles will be affected.</li>
        `;
    } else if (yieldValue === 0.02) {
        // M67 Grenade (0.015 kt)
        fireballRadius = 4 * scalingFactor;
        blastRadius = 12 * scalingFactor;
        thermalRadius = 15 * scalingFactor;
        lightBlastRadius = 40 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 4 m</span><br>
            A small but intense fireball. Can ignite nearby clothing, fuel, or other flammable materials.</li>
            <li><span style="color:orange;"><strong>Heavy blast radius:</strong> 12 m</span><br>
            A deadly zone with a high probability of fatalities and severe injury. Shrapnel will cause penetrating injuries.</li>
            <li><span style="color:yellow;"><strong>Moderate blast radius:</strong> 15 m</span><br>
            Moderate structural damage. Injuries to civilians and possible vehicle damage.</li>
            <li><span style="color:green;"><strong>Light blast radius:</strong> 40 m</span><br>
            Light damage, mainly affecting glass, vehicles, and outdoor structures.</li>
        `;
    } else if (yieldValue === 0.05) {
        // Time Bomb (0.05 kt)
        fireballRadius = 6 * scalingFactor;
        blastRadius = 18 * scalingFactor;
        thermalRadius = 30 * scalingFactor;
        lightBlastRadius = 70 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 6 m</span><br>
            A fireball with sufficient power to ignite and burn nearby objects, including structures and vehicles.</li>
            <li><span style="color:orange;"><strong>Heavy blast radius:</strong> 18 m</span><br>
            Major destruction and potential fatalities. Buildings collapse and debris causes serious injuries.</li>
            <li><span style="color:yellow;"><strong>Moderate blast radius:</strong> 30 m</span><br>
            Serious structural damage, window shattering, and injuries to people in the vicinity.</li>
            <li><span style="color:green;"><strong>Light blast radius:</strong> 70 m</span><br>
            Minimal damage, mainly broken glass and minor injuries from flying debris.</li>
        `;
    } else if (yieldValue === 0.1) {
        // C4 (0.1 kt)
        fireballRadius = 8 * scalingFactor;
        blastRadius = 25 * scalingFactor;
        thermalRadius = 45 * scalingFactor;
        lightBlastRadius = 100 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 8 m</span><br>
            A larger fireball that can ignite buildings, vehicles, and outdoor debris. Severe heat impact.</li>
            <li><span style="color:orange;"><strong>Heavy blast radius:</strong> 25 m</span><br>
            Significant destruction. Casualties are likely, and large structures like walls and fences will be heavily damaged.</li>
            <li><span style="color:yellow;"><strong>Moderate blast radius:</strong> 45 m</span><br>
            Heavy damage to nearby infrastructure. Likely injuries and structural collapse within the zone.</li>
            <li><span style="color:green;"><strong>Light blast radius:</strong> 100 m</span><br>
            Moderate damage to buildings and vehicles further out. Potential injuries from debris.</li>
        `;
    } else if (yieldValue === 0.2) {
        // TNT Block (0.2 kt)
        fireballRadius = 12 * scalingFactor;
        blastRadius = 40 * scalingFactor;
        thermalRadius = 60 * scalingFactor;
        lightBlastRadius = 150 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 12 m</span><br>
            A large fireball capable of igniting vehicles, buildings, and other combustible materials.</li>
            <li><span style="color:orange;"><strong>Heavy blast radius:</strong> 40 m</span><br>
            A strong blast radius causing massive destruction. Fatalities are highly likely within this range.</li>
            <li><span style="color:yellow;"><strong>Moderate damage radius:</strong> 60 m</span><br>
            Serious damage to infrastructure. Injuries and structural collapse are likely in this zone.</li>
            <li><span style="color:green;"><strong>Light damage radius:</strong> 150 m</span><br>
            Damage to buildings, vehicles, and trees, with possible minor injuries from flying debris.</li>
        `;
    } else if (yieldValue === 0.5) {
        // Gasoline Bomb (0.5 kt)
        fireballRadius = 15 * scalingFactor;
        blastRadius = 50 * scalingFactor;
        thermalRadius = 75 * scalingFactor;
        lightBlastRadius = 175 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 15 m</span><br>
            A large fireball that ignites fuel, buildings, and other flammable objects in the immediate area.</li>
            <li><span style="color:orange;"><strong>Heavy blast radius:</strong> 50 m</span><br>
            Major destruction with high risk of fatalities. Buildings are leveled, and debris can cause severe injuries.</li>
            <li><span style="color:yellow;"><strong>Moderate blast radius:</strong> 75 m</span><br>
            Significant damage to structures and vehicles, with injuries to people in the blast zone.</li>
            <li><span style="color:green;"><strong>Light blast radius:</strong> 175 m</span><br>
            Moderate to light damage to buildings and vehicles. Some injuries may occur from flying debris.</li>
        `;
    } else if (yieldValue === 1) {
        // Car Bomb (1.0 kt)
        fireballRadius = 20 * scalingFactor;
        blastRadius = 60 * scalingFactor;
        thermalRadius = 90 * scalingFactor;
        lightBlastRadius = 200 * scalingFactor;
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 20 m</span><br>
            A very large fireball with extensive burning, destroying vehicles, buildings, and igniting all nearby materials.</li>
            <li><span style="color:orange;"><strong>Heavy blast radius:</strong> 60 m</span><br>
            Heavy destruction within this radius. There are likely fatalities and severe injuries.</li>
            <li><span style="color:yellow;"><strong>Moderate blast radius:</strong> 90 m</span><br>
            Serious damage to structures. Injuries likely to those within the range.</li>
            <li><span style="color:green;"><strong>Light blast radius:</strong> 200 m</span><br>
            Light damage to buildings, vehicles, and minor injuries from flying debris.</li>
        `;
    }

    // Clear previous explosions and calculate new ones
    clearExplosionCircles();

    // Create explosion circles for visual representation
    const explosionCircle1 = L.circle(marker.getLatLng(), {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.4,
        radius: fireballRadius
    }).addTo(map);
    explosionCircles.push(explosionCircle1);

    const explosionCircle2 = L.circle(marker.getLatLng(), {
        color: 'orange',
        fillColor: 'orange',
        fillOpacity: 0.3,
        radius: blastRadius
    }).addTo(map);
    explosionCircles.push(explosionCircle2);

    const explosionCircle3 = L.circle(marker.getLatLng(), {
        color: 'yellow',
        fillColor: 'yellow',
        fillOpacity: 0.2,
        radius: thermalRadius
    }).addTo(map);
    explosionCircles.push(explosionCircle3);

    const explosionCircle4 = L.circle(marker.getLatLng(), {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.1,
        radius: lightBlastRadius
    }).addTo(map);
    explosionCircles.push(explosionCircle4);

    // Display detonation details
    document.getElementById('detonation-details').innerHTML = descriptions;
    document.getElementById('detonation-info').style.display = 'block';
}
