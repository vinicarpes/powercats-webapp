let map = L.map('map').setView([-23.55052, -46.633308], 13); // posição inicial

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function showDeviceDetails(element) {
    // Atualiza os detalhes do device
    document.getElementById("device-name").textContent = element.textContent;
    document.getElementById("device-serial").textContent = element.dataset.serial;
    document.getElementById("device-description").textContent = element.dataset.description;
    document.getElementById("device-created").textContent = element.dataset.created;
    document.getElementById("device-updated").textContent = element.dataset.updated;
    document.getElementById("device-activated").textContent = element.dataset.activated;
    document.getElementById("device-active").textContent = element.dataset.active === 'true' ? 'Sim' : 'Não';

    document.querySelectorAll('.device-list-container li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');

    // Atualiza marcador no mapa se tiver coordenadas
    var lat = parseFloat(element.dataset.lat); // deve vir do Channel.location.latitude
    var lng = parseFloat(element.dataset.lng); // Channel.location.longitude
    if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 15);
        if (window.deviceMarker) map.removeLayer(window.deviceMarker);
        window.deviceMarker = L.marker([lat, lng]).addTo(map).bindPopup(element.textContent).openPopup();
    }
}