// Define the radii and commentary for various yields
const radiusData = {
    "1": { // 1 Kiloton
        fireball: { radius: 88.4, description: "Maximum size of the nuclear fireball; relevance to damage on the ground depends on the height of detonation. If it touches the ground, the amount of radioactive fallout is significantly increased. Anything inside the fireball is effectively vaporized." },
        heavyBlast: { radius: 218, description: "At 20 psi overpressure, heavily built concrete buildings are severely damaged or demolished; fatalities approach 100%. Often used as a benchmark for heavy damage in cities." },
        moderateBlast: { radius: 458, description: "At 5 psi overpressure, most residential buildings collapse, injuries are universal, fatalities are widespread. The chances of a fire starting in commercial and residential damage are high, and buildings so damaged are at high risk of spreading fire. Often used as a benchmark for moderate damage in cities." },
        thermal: { radius: 500, description: "Third degree burns extend throughout the layers of skin, and are often painless because they destroy the pain nerves. They can cause severe scarring or disablement, and can require amputation. 100% probability for 3rd degree burns at this yield is 7 cal/cm²." },
        lightBlast: { radius: 1180, description: "At around 1 psi overpressure, glass windows can be expected to break. This can cause many injuries in a surrounding population who comes to a window after seeing the flash of a nuclear explosion (which travels faster than the pressure wave). Often used as a benchmark for light damage in cities." },
        noThermal: { radius: 1210, description: "The distance at which anybody beyond would definitely suffer no damage from thermal radiation (heat). 100% probability of no significant thermal damage at this yield is 1.15 cal/cm²." }
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

// Map Initialization
const map = L.map('map').setView([51.505, -0.09], 13); // Default location

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a circle to represent explosion radius (temporary circle for demonstration)
let explosionCircle = L.circle([51.505, -0.09], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 1000
}).addTo(map);

// Function to update commentary and circle based on selected yield
function updateExplosion() {
    const yieldSelector = document.getElementById("yield-selector").value;
    const customYield = document.getElementById("custom-yield").value;

    // Use custom yield or fallback to predefined yield
    const yieldValue = yieldSelector === "custom" ? parseFloat(customYield) : parseFloat(yieldSelector);
    const yieldKey = yieldSelector === "custom" ? "custom" : "1"; 

    // Adjust custom yield data based on the entered value
    if (yieldKey === "custom" && yieldValue > 0) {
        // Scale the radii based on the entered custom yield
        const scaleFactor = yieldValue / 1; // 1 Kiloton as baseline
        radiusData["custom"].fireball.radius = 88.4 * scaleFactor;
        radiusData["custom"].heavyBlast.radius = 218 * scaleFactor;
        radiusData["custom"].moderateBlast.radius = 458 * scaleFactor;
        radiusData["custom"].thermal.radius = 500 * scaleFactor;
        radiusData["custom"].lightBlast.radius = 1180 * scaleFactor;
        radiusData["custom"].noThermal.radius = 1210 * scaleFactor;
    }

    // Update the explosion details section
    const data = radiusData[yieldKey];
    document.getElementById("fireball-commentary").innerHTML = `Fireball radius: ${data.fireball.radius.toFixed(1)} m (${(data.fireball.radius / 1000).toFixed(2)} km²) <br>${data.fireball.description}`;
    document.getElementById("heavy-blast-commentary").innerHTML = `Heavy blast damage radius (20 psi): ${data.heavyBlast.radius.toFixed(1)} m (${(data.heavyBlast.radius / 1000).toFixed(2)} km²) <br>${data.heavyBlast.description}`;
    document.getElementById("moderate-blast-commentary").innerHTML = `Moderate blast damage radius (5 psi): ${data.moderateBlast.radius.toFixed(1)} m (${(data.moderateBlast.radius / 1000).toFixed(2)} km²) <br>${data.moderateBlast.description}`;
    document.getElementById("thermal-commentary").innerHTML = `Thermal radiation radius (3rd degree burns): ${data.thermal.radius.toFixed(1)} m (${(data.thermal.radius / 1000).toFixed(2)} km²) <br>${data.thermal.description}`;
    document.getElementById("light-blast-commentary").innerHTML = `Light blast damage radius (1 psi): ${data.lightBlast.radius.toFixed(1)} m (${(data.lightBlast.radius / 1000).toFixed(2)} km²) <br>${data.lightBlast.description}`;
    document.getElementById("no-thermal-commentary").innerHTML = `Thermal radiation radius (no harm): ${data.noThermal.radius.toFixed(1)} m (${(data.noThermal.radius / 1000).toFixed(2)} km²) <br>${data.noThermal.description}`;

    // Update the explosion circle's radius
    explosionCircle.setRadius(data.heavyBlast.radius);
}

// Function to simulate detonation
function detonate() {
    const yieldSelector = document.getElementById("yield-selector").value;
    if (yieldSelector !== "custom" && !document.getElementById("custom-yield").value) {
        alert("Please enter a custom yield or select a yield from the list.");
        return;
    }
    updateExplosion();  // Update the explosion details and radius
}

// Clear all the data (reset map and UI)
function clearAll() {
    explosionCircle.setRadius(0); // Remove the explosion circle
    document.getElementById("fireball-commentary").innerHTML = '';
    document.getElementById("heavy-blast-commentary").innerHTML = '';
    document.getElementById("moderate-blast-commentary").innerHTML = '';
    document.getElementById("thermal-commentary").innerHTML = '';
    document.getElementById("light-blast-commentary").innerHTML = '';
    document.getElementById("no-thermal-commentary").innerHTML = '';
    document.getElementById("yield-selector").value = '1'; // Reset the yield to 1 kiloton
    document.getElementById("custom-yield").value = ''; // Clear custom yield
}
