const map = L.map('map', {
    crs: L.CRS.Simple,  // Use simple coordinate system for an image-based map
    minZoom: -2,        // Zoom out limit for the image map
    maxZoom: 2,         // Zoom in limit for the image map
});

const bounds = [[0, 0], [2200, 2200]];  // Define bounds based on the image size
const image = L.imageOverlay('5-10-24.png', bounds).addTo(map);  // Your custom PNG image for the map

map.fitBounds(bounds);  // Fit map to the image bounds

// Add a draggable marker for explosion center (without popup text for better visibility)
const marker = L.marker([1100, 1100], { 
    draggable: true, 
    icon: L.divIcon({ className: 'marker' }) 
}).addTo(map);

// Store explosion circles
let explosionCircles = [];

// Function to clear previous explosion circles
function clearExplosionCircles() {
    explosionCircles.forEach(circle => map.removeLayer(circle));
    explosionCircles = [];
}

// Function to update marker position
marker.on('drag', function() {
    updateExplosion();
});

// Add click event to the map to move the marker when clicked
map.on('click', function(e) {
    marker.setLatLng(e.latlng);  // Move the marker to the clicked location
    updateExplosion();  // Update explosion effects based on new marker position
});

// Data for predefined explosion radii (in meters)
const radiusData = {
    "handGrenade": {
        fireball: { radius: 18.5, description: "Maximum size of the nuclear fireball; relevance to damage on the ground depends on the height of detonation. If it touches the ground, the amount of radioactive fallout is significantly increased. Anything inside the fireball is effectively vaporized." },
        heavyBlast: { radius: 59.1, description: "At 20 psi overpressure, heavily built concrete buildings are severely damaged or demolished; fatalities approach 100%. Often used as a benchmark for heavy damage in cities." },
        moderateBlast: { radius: 124, description: "At 5 psi overpressure, most residential buildings collapse, injuries are universal, fatalities are widespread. The chances of a fire starting in commercial and residential damage are high, and buildings so damaged are at high risk of spreading fire." },
        thermal: { radius: 136, description: "Third degree burns extend throughout the layers of skin, and are often painless because they destroy the pain nerves. They can cause severe scarring or disablement, and can require amputation. 100% probability for 3rd degree burns at this yield is 7.07 cal/cm²." },
        lightBlast: { radius: 319, description: "At around 1 psi overpressure, glass windows can be expected to break. This can cause many injuries in a surrounding population who comes to a window after seeing the flash of a nuclear explosion." },
        noThermal: { radius: 329, description: "The distance at which anybody beyond would definitely suffer no damage from thermal radiation (heat). 100% probability of no significant thermal damage at this yield is 0.13 cal/cm²." }
    },
    "dynamite": {
        fireball: { radius: 67, description: "Maximum size of the nuclear fireball; relevance to damage on the ground depends on the height of detonation. If it touches the ground, the amount of radioactive fallout is significantly increased. Anything inside the fireball is effectively vaporized." },
        heavyBlast: { radius: 173, description: "At 20 psi overpressure, heavily built concrete buildings are severely damaged or demolished; fatalities approach 100%. Often used as a benchmark for heavy damage in cities." },
        moderateBlast: { radius: 363, description: "At 5 psi overpressure, most residential buildings collapse, injuries are universal, fatalities are widespread. The chances of a fire starting in commercial and residential damage are high, and buildings so damaged are at high risk of spreading fire." },
        thermal: { radius: 399, description: "Third degree burns extend throughout the layers of skin, and are often painless because they destroy the pain nerves. They can cause severe scarring or disablement, and can require amputation. 100% probability for 3rd degree burns at this yield is 6.65 cal/cm²." },
        lightBlast: { radius: 930, description: "At around 1 psi overpressure, glass windows can be expected to break. This can cause many injuries in a surrounding population who comes to a window after seeing the flash of a nuclear explosion." },
        noThermal: { radius: 960, description: "The distance at which anybody beyond would definitely suffer no damage from thermal radiation (heat). 100% probability of no significant thermal damage at this yield is 1.05 cal/cm²." }
    }
};

// Function to update explosion details based on marker position and yield
function updateExplosion() {
    const preset = document.getElementById('preset-selector').value;
    const customYield = parseFloat(document.getElementById('custom-yield').value);

    let yieldData = radiusData[preset];

    if (preset === "custom" && customYield > 0) {
        const scaleFactor = customYield / 1; // Example: scale factor (custom yield vs 1.0 kiloton)
        yieldData = {
            fireball: { radius: round(customYield * 18.5), description: "Custom explosion (Fireball)" },
            heavyBlast: { radius: round(customYield * 59.1), description: "Custom explosion (Heavy Blast)" },
            moderateBlast: { radius: round(customYield * 124), description: "Custom explosion (Moderate Blast)" },
            thermal: { radius: round(customYield * 136), description: "Custom explosion (Thermal)" },
            lightBlast: { radius: round(customYield * 319), description: "Custom explosion (Light Blast)" },
            noThermal: { radius: round(customYield * 329), description: "Custom explosion (No Thermal)" }
        };
    }

    // Clear previous explosion circles
    clearExplosionCircles();

    // Place new explosion circles
    placeExplosionCircle(marker.getLatLng(), yieldData.fireball.radius, "Fireball Radius", yieldData.fireball.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.heavyBlast.radius, "Heavy Blast Radius", yieldData.heavyBlast.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.moderateBlast.radius, "Moderate Blast Radius", yieldData.moderateBlast.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.thermal.radius, "Thermal Radiation Radius", yieldData.thermal.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.lightBlast.radius, "Light Blast Radius", yieldData.lightBlast.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.noThermal.radius, "No Thermal Radiation Radius", yieldData.noThermal.description);

    // Update UI with radius descriptions
    document.getElementById('fireball-commentary').innerHTML = `Fireball radius: ${yieldData.fireball.radius} m (${Math.round(yieldData.fireball.radius ** 2)} m²) - ${yieldData.fireball.description}`;
    document.getElementById('heavy-blast-commentary').innerHTML = `Heavy blast radius (20 psi): ${yieldData.heavyBlast.radius} m - ${yieldData.heavyBlast.description}`;
    document.getElementById('moderate-blast-commentary').innerHTML = `Moderate blast radius (5 psi): ${yieldData.moderateBlast.radius} m - ${yieldData.moderateBlast.description}`;
    document.getElementById('thermal-commentary').innerHTML = `Thermal radiation radius (3rd degree burns): ${yieldData.thermal.radius} m - ${yieldData.thermal.description}`;
    document.getElementById('light-blast-commentary').innerHTML = `Light blast radius (1 psi): ${yieldData.lightBlast.radius} m - ${yieldData.lightBlast.description}`;
    document.getElementById('no-thermal-commentary').innerHTML = `No thermal radiation radius: ${yieldData.noThermal.radius} m - ${yieldData.noThermal.description}`;
}

// Function to round numbers to a fixed number of decimals
function round(num, decimals = 2) {
    return Number(num.toFixed(decimals));
}

// Function to place an explosion circle on the map
function placeExplosionCircle(center, radius, name, description) {
    const circle = L.circle(center, {
        radius: radius,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.2,
        weight: 1
    }).addTo(map);
    circle.bindPopup(`${name}: ${radius} meters - ${description}`);
    explosionCircles.push(circle);
}

// Event listener for detonating explosion
document.getElementById('detonate-button').addEventListener('click', updateExplosion);
