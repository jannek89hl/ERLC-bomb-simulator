// Predefined radii for different explosion types (hand grenade, dynamite, etc.)
const radiusData = {
    "hand_grenade": {
        fireball: { radius: 18.5, description: "Maximum size of the nuclear fireball... (Hand Grenade)" },
        heavyBlast: { radius: 59.1, description: "Heavy blast damage... (Hand Grenade)" },
        moderateBlast: { radius: 124, description: "Moderate blast damage... (Hand Grenade)" },
        thermal: { radius: 136, description: "Thermal radiation... (Hand Grenade)" },
        lightBlast: { radius: 319, description: "Light blast damage... (Hand Grenade)" },
        noThermal: { radius: 329, description: "Thermal radiation no harm... (Hand Grenade)" }
    },
    "dynamite": {
        fireball: { radius: 67, description: "Maximum size of the nuclear fireball... (Dynamite)" },
        heavyBlast: { radius: 173, description: "Heavy blast damage... (Dynamite)" },
        moderateBlast: { radius: 363, description: "Moderate blast damage... (Dynamite)" },
        thermal: { radius: 399, description: "Thermal radiation... (Dynamite)" },
        lightBlast: { radius: 930, description: "Light blast damage... (Dynamite)" },
        noThermal: { radius: 960, description: "Thermal radiation no harm... (Dynamite)" }
    },
    "c4": {
        fireball: { radius: 100, description: "Maximum size of the nuclear fireball... (C4)" },
        heavyBlast: { radius: 200, description: "Heavy blast damage... (C4)" },
        moderateBlast: { radius: 450, description: "Moderate blast damage... (C4)" },
        thermal: { radius: 500, description: "Thermal radiation... (C4)" },
        lightBlast: { radius: 1200, description: "Light blast damage... (C4)" },
        noThermal: { radius: 1300, description: "Thermal radiation no harm... (C4)" }
    },
    "custom": {
        fireball: { radius: 0, description: "" },
        heavyBlast: { radius: 0, description: "" },
        moderateBlast: { radius: 0, description: "" },
        thermal: { radius: 0, description: "" },
        lightBlast: { radius: 0, description: "" },
        noThermal: { radius: 0, description: "" }
    }
};

// Function to toggle the custom yield input field visibility
function toggleCustomYield() {
    const preset = document.getElementById('preset-selector').value;
    const customYieldContainer = document.getElementById('custom-yield-container');

    if (preset === 'custom') {
        customYieldContainer.style.display = 'block';
    } else {
        customYieldContainer.style.display = 'none';
    }

    // Update explosion if a custom yield is already entered
    updateExplosion();
}

// Function to update the explosion based on user selection
function updateExplosion() {
    const preset = document.getElementById('preset-selector').value;
    const customYield = parseFloat(document.getElementById('custom-yield').value);
    let yieldData = radiusData[preset];

    // If "Custom" is selected, apply the custom yield values
    if (preset === "custom" && customYield > 0) {
        const scaleFactor = customYield / 1; // Example: scale factor (custom yield vs 1.0 kiloton)
        yieldData = {
            fireball: { radius: 88.4 * scaleFactor, description: "Custom explosion (Fireball)" },
            heavyBlast: { radius: 218 * scaleFactor, description: "Custom explosion (Heavy Blast)" },
            moderateBlast: { radius: 458 * scaleFactor, description: "Custom explosion (Moderate Blast)" },
            thermal: { radius: 500 * scaleFactor, description: "Custom explosion (Thermal)" },
            lightBlast: { radius: 1180 * scaleFactor, description: "Custom explosion (Light Blast)" },
            noThermal: { radius: 1210 * scaleFactor, description: "Custom explosion (No Thermal)" }
        };
    }

    // Update UI with calculated radii
    document.getElementById('fireball-commentary').innerHTML = `Fireball radius: ${yieldData.fireball.radius} m`;
    document.getElementById('heavy-blast-commentary').innerHTML = `Heavy blast damage radius: ${yieldData.heavyBlast.radius} m`;
    document.getElementById('moderate-blast-commentary').innerHTML = `Moderate blast damage radius: ${yieldData.moderateBlast.radius} m`;
    document.getElementById('thermal-commentary').innerHTML = `Thermal radiation radius: ${yieldData.thermal.radius} m`;
    document.getElementById('light-blast-commentary').innerHTML = `Light blast damage radius: ${yieldData.lightBlast.radius} m`;
    document.getElementById('no-thermal-commentary').innerHTML = `No thermal radiation radius: ${yieldData.noThermal.radius} m`;

    clearExplosionCircles();
    updateExplosionCircles(yieldData);
}

// Update the circles based on the explosion data
function updateExplosionCircles(yieldData) {
    explosionCircles.push(L.circle(marker.getLatLng(), yieldData.fireball.radius, { color: 'red', fillColor: '#f00', fillOpacity: 0.2 }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), yieldData.heavyBlast.radius, { color: 'orange', fillColor: '#f90', fillOpacity: 0.2 }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), yieldData.moderateBlast.radius, { color: 'yellow', fillColor: '#ff0', fillOpacity: 0.2 }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), yieldData.thermal.radius, { color: 'blue', fillColor: '#00f', fillOpacity: 0.2 }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), yieldData.lightBlast.radius, { color: 'green', fillColor: '#0f0', fillOpacity: 0.2 }).addTo(map));
    explosionCircles.push(L.circle(marker.getLatLng(), yieldData.noThermal.radius, { color: 'gray', fillColor: '#888', fillOpacity: 0.2 }).addTo(map));
}

// Detonate button action
function detonate() {
    updateExplosion();  // Recalculate and update radii
}

// Clear all markers and circles
function clearAll() {
    marker.setLatLng([1100, 1100]);  // Reset marker to center
    clearExplosionCircles();         // Clear explosion circles
}
