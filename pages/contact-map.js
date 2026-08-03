document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('contact-map');
  if (!el || typeof L === 'undefined') return;

  const store = [parseFloat(el.dataset.storeLat), parseFloat(el.dataset.storeLng)];
  const warehouse = [parseFloat(el.dataset.warehouseLat), parseFloat(el.dataset.warehouseLng)];

  const map = L.map(el, { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  L.marker(store).addTo(map).bindPopup(el.dataset.storeLabel);
  L.marker(warehouse).addTo(map).bindPopup(el.dataset.warehouseLabel);

  map.fitBounds([store, warehouse], { padding: [40, 40] });
});
