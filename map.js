// Initialize the map with simple coordinate system (image-based)
const map = L.map('map', {
    crs: L.CRS.Simple,  // Use simple coordinate system for the image-based map
    minZoom: -2,        // Zoom out limit for the image map
    maxZoom: 2,         // Zoom in limit for the image map
});

// Define the bounds of the map based on the image size (2200 x 2200)
const bounds = [[0, 0], [2200, 2200]];  // Image size is 2200 x 2200 pixels
const image = L.imageOverlay('10-5-24.png', bounds).addTo(map);  // Load the correct PNG file

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Create a draggable marker to represent the explosion center
const marker = L.marker([1100, 1100], { 
    draggable: true, 
    icon: L.divIcon({ className: 'marker' })  // Marker style
}).addTo(map);

// Store explosion circles
let explosionCircles = [];

// Clear previous explosion circles when updating the explosion
function clearExplosionCircles() {
    explosionCircles.forEach(circle => map.removeLayer(circle));
    explosionCircles = [];
}

// Update explosion when marker is dragged
marker.on('drag', function() {
    updateExplosion();
});

// Add click event to move the marker to clicked location
map.on('click', function(e) {
    marker.setLatLng(e.latlng);  // Move the marker to clicked point
    updateExplosion();  // Update the explosion effects
});

// Data for predefined explosion presets (radius values in meters)
const radiusData = {
    "handGrenade": {
        fireball: { radius: 18.5, description: "Maximum size of the fireball; anything inside is vaporized." },
        heavyBlast: { radius: 59.1, description: "Heavy blast damage, concrete buildings severely damaged." },
        moderateBlast: { radius: 124, description: "Moderate blast; residential buildings collapse." },
        thermal: { radius: 136, description: "Thermal radiation causing 3rd-degree burns." },
        lightBlast: { radius: 319, description: "Light blast; glass windows break, causing injuries." },
        noThermal: { radius: 329, description: "Beyond this range, no significant thermal damage." }
    },
    "dynamite": {
        fireball: { radius: 67, description: "Fireball size, vaporizing everything inside." },
        heavyBlast: { radius: 173, description: "Heavy blast damage, severe destruction." },
        moderateBlast: { radius: 363, description: "Moderate blast; significant damage to buildings." },
        thermal: { radius: 399, description: "Thermal radiation causing severe burns." },
        lightBlast: { radius: 930, description: "Light blast; widespread window damage." },
        noThermal: { radius: 960, description: "Beyond this point, no significant thermal damage." }
    }
};

// Function to update explosion effect (calculates the radii and displays)
function updateExplosion() {
    const preset = document.getElementById('preset-selector').value;
    const customYield = parseFloat(document.getElementById('custom-yield').value);

    let yieldData = radiusData[preset];

    // If custom yield is chosen, calculate new radii
    if (preset === "custom" && customYield > 0) {
        const scaleFactor = customYield / 1; // Custom scaling factor (1 kiloton as reference)
        yieldData = {
            fireball: { radius: round(customYield * 18.5), description: "Custom explosion (Fireball)" },
            heavyBlast: { radius: round(customYield * 59.1), description: "Custom explosion (Heavy Blast)" },
            moderateBlast: { radius: round(customYield * 124), description: "Custom explosion (Moderate Blast)" },
            thermal: { radius: round(customYield * 136), description: "Custom explosion (Thermal)" },
            lightBlast: { radius: round(customYield * 319), description: "Custom explosion (Light Blast)" },
            noThermal: { radius: round(customYield * 329), description: "Custom explosion (No Thermal)" }
        };
    }

    // Clear previous explosion circles before drawing new ones
    clearExplosionCircles();

    // Create explosion circles with radius and description based on the selected preset or custom yield
    placeExplosionCircle(marker.getLatLng(), yieldData.fireball.radius, "Fireball Radius", yieldData.fireball.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.heavyBlast.radius, "Heavy Blast Radius", yieldData.heavyBlast.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.moderateBlast.radius, "Moderate Blast Radius", yieldData.moderateBlast.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.thermal.radius, "Thermal Radiation Radius", yieldData.thermal.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.lightBlast.radius, "Light Blast Radius", yieldData.lightBlast.description);
    placeExplosionCircle(marker.getLatLng(), yieldData.noThermal.radius, "No Thermal Radiation Radius", yieldData.noThermal.description);

    // Update UI with the calculated radius descriptions
    document.getElementById('fireball-commentary').innerHTML = `Fireball radius: ${yieldData.fireball.radius} m - ${yieldData.fireball.description}`;
    document.getElementById('heavy-blast-commentary').innerHTML = `Heavy blast radius: ${yieldData.heavyBlast.radius} m - ${yieldData.heavyBlast.description}`;
    document.getElementById('moderate-blast-commentary').innerHTML = `Moderate blast radius: ${yieldData.moderateBlast.radius} m - ${yieldData.moderateBlast.description}`;
    document.getElementById('thermal-commentary').innerHTML = `Thermal radiation radius: ${yieldData.thermal.radius} m - ${yieldData.thermal.description}`;
    document.getElementById('light-blast-commentary').innerHTML = `Light blast radius: ${yieldData.lightBlast.radius} m - ${yieldData.lightBlast.description}`;
    document.getElementById('no-thermal-commentary').innerHTML = `No thermal damage radius: ${yieldData.noThermal.radius} m - ${yieldData.noThermal.description}`;
}

// Function to round numbers to a reasonable precision
function round(num, decimals = 2) {
    return Number(num.toFixed(decimals));
}

// Function to place explosion circles with radius and description
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

// Event listener for detonating the explosion when the button is clicked
document.getElementById('detonate-button').addEventListener('click', updateExplosion);
