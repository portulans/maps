const map = L.map('map').setView([48.396288,-4.944447], 10)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
}).addTo(map)

const warpedMapLayer = new Allmaps.WarpedMapLayer(  
  'https://annotations.allmaps.org/manifests/9f443bcef0ec92ac'
).addTo(map)

  // I don't remember how Observable works...
  // Is this the best way to do it?
  function updateRenderOptions() {
    warpedMapLayer.setOpacity(opacity.value);
    warpedMapLayer.setRemoveColor({
      hexColor: backgroundColor.value,
      threshold: removeBackgroundColorThreshold.value
    });
  }

opacity.addEventListener("input", () => updateRenderOptions());
removeBackgroundColorThreshold.addEventListener("input", () =>
    updateRenderOptions()
  );
backgroundColor.addEventListener("input", () => updateRenderOptions());