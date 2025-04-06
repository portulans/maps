// Function to create a custom rotated icon based on azimuth
function createRotatedIcon(orientation, type) {
    var angle = orientation;  // Orientation angle from GeoJSON (in degrees)
    var t = type
    // Create a custom divIcon using the arrow image (JPEG of an arrow)
    var iconUrl = ''
    if (t === 'mer') {
        iconUrl = './img/fleche-mer.png';  // Replace with the path to your arrow image
    } else if (t === 'oblique') {
        iconUrl = './img/fleche-oblique.png';
    } else {
        iconUrl = './img/fleche-sol2.png';  // Default icon for other types
    }

    // Create a custom divIcon and apply the rotation
    var icon = L.divIcon({
        className: 'rotated-icon',
        /*html: '<img src="' + iconUrl + '" style="transform: rotate(' + angle + 'deg); width: 32px; height: 32px;" />',*/
        html: `<div style="width: 15px; height: 15px; 
                            background-color: white; 
                            border-radius: 50%; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            transform: rotate(${angle}deg);">
                    <img src="${iconUrl}" style="width: 12px; height: 12px;" />
                </div>`,
        iconSize: [12, 12],  // Adjust the size as necessary
    });

    return icon;
}