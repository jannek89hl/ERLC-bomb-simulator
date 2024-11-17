// Ensure the 'detonate-button' and other input elements exist
document.addEventListener('DOMContentLoaded', function () {
    const presetSelector = document.getElementById('preset-selector');
    const customYieldInput = document.getElementById('custom-yield');
    const detonateButton = document.getElementById('detonate-button');

    // Event listener to handle preset selection change
    presetSelector.addEventListener('change', function () {
        if (presetSelector.value === "custom") {
            customYieldInput.disabled = false;  // Enable custom yield input for custom explosion
        } else {
            customYieldInput.disabled = true;  // Disable custom yield input when a preset is selected
            customYieldInput.value = '';  // Reset custom yield input
            updateExplosion();  // Update explosion with the selected preset
        }
    });

    // Event listener for detonate button click
    detonateButton.addEventListener('click', function () {
        updateExplosion();  // Trigger explosion update
    });

    // Initial update in case a preset is already selected
    updateExplosion();
});
