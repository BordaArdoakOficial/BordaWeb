(function () {
  var el = document.getElementById('contact-map');
  if (!el) return;

  function initMap() {
    var store = [parseFloat(el.dataset.storeLat), parseFloat(el.dataset.storeLng)];
    var warehouse = [parseFloat(el.dataset.warehouseLat), parseFloat(el.dataset.warehouseLng)];

    var map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker(store).addTo(map).bindPopup(el.dataset.storeLabel);
    L.marker(warehouse).addTo(map).bindPopup(el.dataset.warehouseLabel);
    map.fitBounds([store, warehouse], { padding: [40, 40] });
  }

  if (typeof L !== 'undefined') { initMap(); return; }

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(css);

  var script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = initMap;
  document.head.appendChild(script);
})();
