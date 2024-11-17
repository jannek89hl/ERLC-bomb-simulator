// Define the radii and commentary for various yields
const radiusData = {
    "1": { // 1 Kiloton
        fireball: { radius: 88.4, description: "Maximum size of the nuclear fireball..." },
        heavyBlast: { radius: 218, description: "At 20 psi overpressure..." },
        moderateBlast: { radius: 458, description: "At 5 psi overpressure..." },
        thermal: { radius: 500, description: "Third degree burns..." },
        lightBlast: { radius: 1180, description: "At around 1 psi overpressure..." },
        noThermal: { radius: 1210, description: "The distance at which..." }
    },
    "custom": { // Custom yields - to be calculated
        fireball: { radius: 0, description: "" },
        heavyBlast: { radius: 0, description: "" },
        moderateBlast: { radius: 0, description: "" },
        thermal: { radius: 0, description: "" },
        lightBlast: { radius: 0, description: "" },
        noThermal: { radius: 0, description: "" }
    }
};

// Custom PNG map overlay settings
const imageUrl = 'path/to/your/5-10-24.png';  // Replace with your correct PNG path
const imageBounds = [
    [50.0, -0.2], // Bottom left corner (Latitude, Longitude)
    [51.5, 0.5]   // Top right corner (Latitude, Longitude)
];

// Map Initialization (simplified)
const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate system for an image-based map
    minZoom: -2,       // Zoom out limit for the image map
    maxZoom: 2         // Zoom in limit for the image map
}).setView([51.0, 0], 13);  // Set initial center to cover your map area

// Add custom PNG image as an overlay
L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Fit the map view to image bounds
map.fitBounds(imageBounds);

// Create a circle to represent explosion radius
let explosionCircle = L.circle([51.0, 0], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 1000
}).addTo(map);

// Function to update explosion details based on yield
function updateExplosion() {
    const yieldSelector = document.getElementById("yield-selector").value;
    const customYield = document.getElementById("custom-yield").value;

    const yieldValue = yieldSelector === "custom" ? parseFloat(customYield) : parseFloat(yieldSelector);
    const yieldKey = yieldSelector === "custom" ? "custom" : "1"; 

    if (yieldKey === "custom" && yieldValue > 0) {
        const scaleFactor = yieldValue / 1;  // 1 Kiloton as baseline
        radiusData["custom"].fireball.radius = 88.4 * scaleFactor;
        radiusData["custom"].heavyBlast.radius = 218 * scaleFactor;
        radiusData["custom"].moderateBlast.radius = 458 * scaleFactor;
        radiusData["custom"].thermal.radius = 500 * scaleFactor;
        radiusData["custom"].lightBlast.radius = 1180 * scaleFactor;
        radiusData["custom"].noThermal.radius = 1210 * scaleFactor;
    }

    // Update explosion details
    const data = radiusData[yieldKey];
    document.getElementById("fireball-commentary").innerHTML = `Fireball radius: ${data.fireball.radius.toFixed(1)} m <br>${data.fireball.description}`;
    document.getElementById("heavy-blast-commentary").innerHTML = `Heavy blast damage radius (20 psi): ${data.heavyBlast.radius.toFixed(1)} m <br>${data.heavyBlast.description}`;
    document.getElementById("moderate-blast-commentary").innerHTML = `Moderate blast damage radius (5 psi): ${data.moderateBlast.radius.toFixed(1)} m <br>${data.moderateBlast.description}`;
    document.getElementById("thermal-commentary").innerHTML = `Thermal radiation radius (3rd degree burns): ${data.thermal.radius.toFixed(1)} m <br>${data.thermal.description}`;
    document.getElementById("light-blast-commentary").innerHTML = `Light blast damage radius (1 psi): ${data.lightBlast.radius.toFixed(1)} m <br>${data.lightBlast.description}`;
    document.getElementById("no-thermal-commentary").innerHTML = `Thermal radiation radius (no harm): ${data.noThermal.radius.toFixed(1)} m <br>${data.noThermal.description}`;

    // Update explosion circle
    explosionCircle.setRadius(data.heavyBlast.radius);
}

// Function to simulate detonation
function detonate() {
    const yieldSelector = document.getElementById("yield-selector").value;
    if (yieldSelector !== "custom" && !document.getElementById("custom-yield").value) {
        alert("Please enter a custom yield or select a yield from the list.");
        return;
    }
    updateExplosion();  // Update explosion details
}

// Function to clear all data (reset map and UI)
function clearAll() {
    explosionCircle.setRadius(0); // Remove the explosion circle
    document.getElementById("fireball-commentary").innerHTML = '';
    document.getElementById("heavy-blast-commentary").innerHTML = '';
    document.getElementById("moderate-blast-commentary").innerHTML = '';
    document.getElementById("thermal-commentary").innerHTML = '';
    document.getElementById("light-blast-commentary").innerHTML = '';
    document.getElementById("no-thermal-commentary").innerHTML = '';
    document.getElementById("yield-selector").value = '1'; // Reset yield
    document.getElementById("custom-yield").value = ''; // Clear custom yield
}
