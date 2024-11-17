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

    // Pipe Bomb (0.01 kt)
    if (yieldValue === 0.01) {
        fireballRadius = 3 * scalingFactor; // Small fireball radius
        blastRadius = 10 * scalingFactor;   // Small but intense blast radius
        thermalRadius = 20 * scalingFactor; // Heat can cause burns within 20m
        lightBlastRadius = 50 * scalingFactor; // Minor blast damage further out
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 3 m</span><br>
            The fireball from a pipe bomb is small but can cause severe burns. The intense heat can ignite nearby materials such as clothing or paper.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 10 m</span><br>
            The blast can severely injure or kill anyone within this radius. Shrapnel is dangerous and can cause penetrating wounds. In urban environments, shrapnel can ricochet off structures, increasing the danger.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 20 m</span><br>
            Damage to infrastructure, including shattered windows and cracked walls. People within this range are likely to suffer concussive injuries. Some structural collapse may occur.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 50 m</span><br>
            Structures like vehicles or buildings may suffer minor damage, such as broken windows. Civilians in this radius may experience minor injuries or trauma.</li>
        `;
    }

    // C4 (0.2 kt)
    else if (yieldValue === 0.2) {
        fireballRadius = 10 * scalingFactor; // Larger fireball due to higher yield
        blastRadius = 30 * scalingFactor;   // Significant blast damage within range
        thermalRadius = 50 * scalingFactor; // Larger thermal radius, can ignite fires
        lightBlastRadius = 100 * scalingFactor; // Further out blast damage
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 10 m</span><br>
            The fireball from C4 is powerful, capable of igniting nearby vehicles or structures. The intense heat could cause burns to anyone in the vicinity.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 30 m</span><br>
            A larger blast radius with the potential for widespread destruction. Buildings can collapse or suffer severe damage, with a high chance of fatal injuries to people within this zone.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 50 m</span><br>
            While buildings remain standing, structural damage will be extensive. Civilians can sustain severe injuries from the blast and flying debris. Vehicles within this radius can be destroyed.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 100 m</span><br>
            Damage to structures further out may include broken windows, fallen debris, and minor trauma to civilians. This zone is more likely to see damage to vehicles and outdoor structures.</li>
        `;
    }

    // Landmine (0.3 kt)
    else if (yieldValue === 0.3) {
        fireballRadius = 5 * scalingFactor;  // Moderate fireball, due to explosive nature
        blastRadius = 15 * scalingFactor;   // Heavy blast in a smaller area
        thermalRadius = 25 * scalingFactor; // Thermal burns are possible at this range
        lightBlastRadius = 60 * scalingFactor; // Lesser but still impactful outside
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 5 m</span><br>
            The fireball is smaller but still powerful enough to cause significant burns. It may ignite combustible materials nearby, including vehicles.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 15 m</span><br>
            The explosion will severely injure or kill anyone within this radius. Structural damage is inevitable, and shrapnel will cause puncture wounds or death. It is a highly dangerous area.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 25 m</span><br>
            The blast will likely cause injuries to civilians within this area, though death is less certain. Buildings will experience significant damage like cracks, shattered windows, and collapsing walls.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 60 m</span><br>
            Structural damage may be limited to broken windows, knocked-over signs, or shattered glass. Civilians further out may experience minor injuries from debris or shockwaves.</li>
        `;
    }

    // TNT Block (1.0 kt)
    else if (yieldValue === 1.0) {
        fireballRadius = 20 * scalingFactor;  // Large fireball due to substantial yield
        blastRadius = 60 * scalingFactor;    // Large blast radius with devastating effects
        thermalRadius = 100 * scalingFactor; // Larger thermal zone that ignites most flammable materials
        lightBlastRadius = 200 * scalingFactor; // Extensive blast effect over a wide area
        descriptions = `
            <li><span style="color:red;"><strong>Fireball radius:</strong> 20 m</span><br>
            The fireball from TNT will be extensive, with a large radius causing burns, fires, and explosions in nearby areas. Buildings, vehicles, and structures within this zone will likely catch fire.</li>
            <li><span style="color:orange;"><strong>Heavy blast damage radius:</strong> 60 m</span><br>
            The blast will cause catastrophic destruction in a large radius. Buildings and vehicles will be obliterated, and casualties are highly likely. People within this zone will either be killed or severely injured.</li>
            <li><span style="color:yellow;"><strong>Moderate blast damage radius:</strong> 100 m</span><br>
            Severe damage to structures, including collapsed buildings, shattered windows, and extensive shrapnel injuries. Civilians are at significant risk of death or injury from the explosion and debris.</li>
            <li><span style="color:green;"><strong>Light blast damage radius:</strong> 200 m</span><br>
            Light damage in this radius includes broken windows, damaged vehicles, and minor injuries. The blast will cause noticeable trauma, but fatalities are less likely outside the immediate blast zone.</li>
        `;
    }

    // Display detonation information
    document.getElementById("explosionDescription").innerHTML = descriptions;

    // Create and display explosion circles based on radius values
    const explosionCircle1 = L.circle(marker.getLatLng(), {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.2,
        radius: fireballRadius
    }).addTo(map);
    explosionCircles.push(explosionCircle1);

    const explosionCircle2 = L.circle(marker.getLatLng(), {
        color: 'orange',
        fillColor: 'orange',
        fillOpacity: 0.2,
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
        fillOpacity: 0.2,
        radius: lightBlastRadius
    }).addTo(map);
    explosionCircles.push(explosionCircle4);
}
