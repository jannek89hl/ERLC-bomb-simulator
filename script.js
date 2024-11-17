/* General Styles */
body {
    margin: 0;
    font-family: Arial, sans-serif;
}

/* Map Container */
#map {
    height: 100vh; /* Full-screen height */
}

/* Sidebar UI */
#sidebar {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    min-width: 200px;
    resize: both;
    overflow: hidden;
    cursor: move;
}

/* Add styling for draggable area */
#sidebar-header {
    cursor: move;
    padding: 5px;
    background-color: #f0f0f0;
    border-radius: 5px;
}

/* Inputs and buttons styling */
#sidebar label {
    display: block;
    margin-top: 10px;
}

#sidebar input, #sidebar select, #sidebar button {
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
}

/* Marker shadow styling */
.marker-shadow {
    background-color: rgba(0, 0, 0, 0.5);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
}
