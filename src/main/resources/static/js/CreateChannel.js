
const sensorTypes = ["LUMINOSITY","TEMPERATURE","VIBRATION","CURRENT","HUMIDITY"];
const sensorLabels = ["Luminosity","Temperature","Vibration","Current","Humidity"];

document.getElementById('addSensorBtn').addEventListener('click', function() {
    const container = document.getElementById('sensorsContainer');
    const card = document.createElement('div');
    card.classList.add('sensor-card','row','align-items-center','mb-3','p-2','border','rounded');
    card.innerHTML = `
        <div class="col-lg-3 mb-2">
            <input type="text" class="form-control borda sensorName" placeholder="Nome do Sensor" required>
        </div>
        <div class="col-lg-2 mb-2">
            <select class="form-control borda sensorType">
                <option value="">Tipo do Sensor</option>
                ${sensorTypes.map((type,i) => `<option value="${type}">${sensorLabels[i]}</option>`).join('')}
            </select>
        </div>
        <div class="col-lg-2 mb-2">
            <input type="number" class="form-control refLow" placeholder="Low">
        </div>
        <div class="col-lg-2 mb-2">
            <input type="number" class="form-control refModerate" placeholder="Moderate">
        </div>
        <div class="col-lg-2 mb-2">
            <input type="number" class="form-control refSevere" placeholder="Severe">
        </div>
        <div class="col-lg-2 mb-2">
            <input type="number" class="form-control refCritical" placeholder="Critical">
        </div>
        <div class="col-lg-1 mb-2 d-flex align-items-center">
            <button type="button" class="remove-sensor-btn btn btn-danger">&times;</button>
        </div>
    `;
    container.appendChild(card);

    card.querySelector('.remove-sensor-btn').addEventListener('click', function(){
        card.remove();
    });
});

// Remove sensores já existentes
document.querySelectorAll('.remove-sensor-btn').forEach(btn => {
    btn.addEventListener('click', function(){
        btn.closest('.sensor-card').remove();
    });
});



document.getElementById('deviceForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Monta o objeto com o padrão desejado
    const payload = {
        name: document.getElementById('name').value,
        serial: document.getElementById('serial').value,
        description: document.getElementById('description').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        elevation: parseInt(document.getElementById('elevation').value),
        fields: Array.from(document.querySelectorAll('.sensor-card')).map(card => ({
            name: card.querySelector('.sensorName').value,
            type: card.querySelector('.sensorType').value,
            referenceValues: {
                low: parseFloat(card.querySelector('.refLow')?.value || 0),
                moderate: parseFloat(card.querySelector('.refModerate')?.value || 0),
                severe: parseFloat(card.querySelector('.refSevere')?.value || 0),
                critical: parseFloat(card.querySelector('.refCritical')?.value || 0)
            }
        }))
    };

    try {
        const response = await fetch('https://powercats-webservice.onrender.com/api/v2/channel-devices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Dispositivo cadastrado com sucesso!');
            console.log(result);
            document.getElementById('deviceForm').reset();
        } else {
            const errorText = await response.text();
            alert('Erro ao cadastrar dispositivo: ' + errorText);
            console.error(errorText);
        }
    } catch (err) {
        console.error('Falha na requisição:', err);
        alert('Erro de conexão com o servidor.');
    }
});
