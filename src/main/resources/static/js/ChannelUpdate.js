document.addEventListener("DOMContentLoaded", () => {
    // --- Helpers ---
    function safeNum(v) {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(v);
        return isNaN(n) ? null : n;
    }

    function escapeHtml(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    // endpoint base
    const API_BASE = "https://powercats-webservice.onrender.com";

    // array para guardar ids removidos (sensores que existiam no servidor e foram deletados no modal)
    const removedSensorIds = [];

    // --- Função para criar field no servidor (POST) ---
    async function createFieldOnServer(channelId, partialField) {
        const payload = {
            channelId: Number(channelId),
            name: partialField.name ?? "New sensor",
            type: partialField.type ?? "",
            referenceValues: {
                low: partialField.referenceValues?.low ?? null,
                moderate: partialField.referenceValues?.moderate ?? null,
                severe: partialField.referenceValues?.severe ?? null,
                critical: partialField.referenceValues?.critical ?? null
            }
        };

        const resp = await fetch(`${API_BASE}/api/v2/field-sensor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const txt = await resp.text().catch(() => null);
            throw new Error(txt || `Status ${resp.status}`);
        }
        return await resp.json();
    }

    // --- Função para atualizar field no servidor (PATCH) ---
    async function updateFieldOnServer(sensorId, channelId, partialField) {
        const dto = {
            channelId: Number(channelId),
            name: partialField.name ?? "",
            type: partialField.type ?? "",
            referenceValues: {
                low: partialField.referenceValues?.low ?? null,
                moderate: partialField.referenceValues?.moderate ?? null,
                severe: partialField.referenceValues?.severe ?? null,
                critical: partialField.referenceValues?.critical ?? null
            }
        };

        const resp = await fetch(`${API_BASE}/api/v2/field-sensor/${sensorId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (!resp.ok) {
            const txt = await resp.text().catch(() => null);
            throw new Error(txt || `Status ${resp.status}`);
        }
        return await resp.json();
    }

    // --- Função para deletar field no servidor (DELETE) ---
    async function deleteFieldOnServer(sensorId) {
        const resp = await fetch(`${API_BASE}/api/v2/field-sensor/${sensorId}`, {
            method: "DELETE"
        });

        // endpoint retorna 204 No Content em caso de sucesso
        if (!resp.ok) {
            const txt = await resp.text().catch(() => null);
            throw new Error(txt || `DELETE failed with status ${resp.status}`);
        }
        return;
    }

    // --- Preencher modal com dados do dispositivo selecionado ---
    function fillEditModal(device) {
        document.getElementById("edit-device-id").value = device.dataset.id;
        document.getElementById("edit-name").value = device.dataset.name || "";
        document.getElementById("edit-serial").value = device.dataset.serial || "";
        document.getElementById("edit-description").value = device.dataset.description || "";
        document.getElementById("edit-latitude").value = device.dataset.lat || "";
        document.getElementById("edit-longitude").value = device.dataset.lng || "";
        document.getElementById("edit-elevation").value = device.dataset.elevation || "";
        document.getElementById("edit-active").checked = device.dataset.active === 'true';

        // Limpar sensores existentes
        const container = document.getElementById("edit-sensors-container");
        container.innerHTML = "";

        // Preencher sensores do device (espera-se JSON colocado no data-fields pelo backend)
        if (device.dataset.fields) {
            try {
                const fields = JSON.parse(device.dataset.fields);
                if (Array.isArray(fields)) {
                    fields.forEach(f => {
                        const mapped = {
                            id: f.id ?? null,
                            name: f.name ?? "",
                            type: f.fieldType ?? f.type ?? "",
                            referenceValues: {
                                id: f.referenceValue?.id ?? null,
                                low: f.referenceValue?.low ?? null,
                                moderate: f.referenceValue?.moderate ?? null,
                                severe: f.referenceValue?.severe ?? null,
                                critical: f.referenceValue?.critical ?? null
                            }
                        };
                        addEditSensor(mapped, { createdOnServer: true });
                    });
                }
            } catch (err) {
                console.error("Erro ao parsear device.dataset.fields:", err, device.dataset.fields);
            }
        }
    }

    // --- Adicionar sensor no modal (se field === null => novo localmente, marcado isNew) ---
    function addEditSensor(field = null, options = {}) {
        const container = document.getElementById("edit-sensors-container");
        if (!container) return;

        const sensorId = field?.id ?? "";
        const refId = field?.referenceValues?.id ?? "";

        const div = document.createElement("div");
        div.classList.add("sensor-card", "row", "mb-2", "p-2", "border", "rounded");

        const isNew = options.createdOnServer ? "false" : "true";

        div.innerHTML = `
      <input type="hidden" class="sensorId" value="${escapeHtml(sensorId)}">
      <input type="hidden" class="refId" value="${escapeHtml(refId)}">
      <input type="hidden" class="isNew" value="${isNew}">
      <div class="col-md-3">
        <input type="text" class="form-control sensorName" placeholder="Nome" value="${escapeHtml(field?.name ?? 'New sensor')}" required>
      </div>
      <div class="col-md-2">
        <select class="form-control sensorType">
          <option value="">Tipo</option>
          <option value="TEMPERATURE" ${field?.type === 'TEMPERATURE' ? 'selected' : ''}>Temperature</option>
          <option value="HUMIDITY" ${field?.type === 'HUMIDITY' ? 'selected' : ''}>Humidity</option>
          <option value="LUMINOSITY" ${field?.type === 'LUMINOSITY' ? 'selected' : ''}>Luminosity</option>
          <option value="VIBRATION" ${field?.type === 'VIBRATION' ? 'selected' : ''}>Vibration</option>
          <option value="CURRENT" ${field?.type === 'CURRENT' ? 'selected' : ''}>Current</option>
        </select>
      </div>
      <div class="col-md-2"><input type="number" step="any" class="form-control refLow" placeholder="Low" value="${field?.referenceValues?.low ?? ''}"></div>
      <div class="col-md-2"><input type="number" step="any" class="form-control refModerate" placeholder="Moderate" value="${field?.referenceValues?.moderate ?? ''}"></div>
      <div class="col-md-2"><input type="number" step="any" class="form-control refSevere" placeholder="Severe" value="${field?.referenceValues?.severe ?? ''}"></div>
      <div class="col-md-2"><input type="number" step="any" class="form-control refCritical" placeholder="Critical" value="${field?.referenceValues?.critical ?? ''}"></div>
      <div class="col-md-1 d-flex align-items-center">
        <button type="button" class="btn btn-danger remove-sensor-btn">&times;</button>
      </div>
    `;

        const removeBtn = div.querySelector(".remove-sensor-btn");
        removeBtn.addEventListener("click", () => {
            const sid = div.querySelector(".sensorId")?.value;
            const newFlag = div.querySelector(".isNew")?.value === "true";
            if (sid && !newFlag) {
                // sensor existente: marcar para remoção no servidor (será feito no submit via DELETE)
                removedSensorIds.push(Number(sid));
            }
            div.remove();
        });

        container.appendChild(div);
    }

    // botao de adicionar sensor (apenas cria card localmente)
    const addEditSensorBtn = document.getElementById("addEditSensorBtn");
    if (addEditSensorBtn) addEditSensorBtn.addEventListener("click", () => addEditSensor());

    // abrir modal e seleção de device
    const openModalBtn = document.querySelector('[data-bs-target="#editDeviceModal"], [data-target="#editDeviceModal"]');
    if (openModalBtn) {
        openModalBtn.addEventListener("click", function () {
            const activeDevice = document.querySelector('.device-list-container li.active');
            if (activeDevice) {
                fillEditModal(activeDevice);
            } else {
                alert("Selecione um dispositivo antes de editar.");
            }
        });
    }

    document.querySelectorAll('.device-list-container li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('.device-list-container li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            if (typeof showDeviceDetails === 'function') showDeviceDetails(li);
        });
    });

    const form = document.getElementById("editDeviceForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("edit-device-id").value;
            if (!id) { alert("ID do dispositivo ausente."); return; }

            const submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const channelId = id;

                // snapshot dos cards atuais
                const sensorCards = Array.from(document.querySelectorAll("#edit-sensors-container .sensor-card"));

                // identificar quais EXISTIAM originalmente (isNew === false && tem id)
                const originalExistingCards = sensorCards.filter(div => {
                    const newFlag = div.querySelector(".isNew")?.value === "true";
                    const sid = div.querySelector(".sensorId")?.value;
                    return !newFlag && sid;
                });
                const originalExistingIds = new Set(originalExistingCards.map(div => div.querySelector(".sensorId").value));

                // 1) Criar novos sensores (isNew === true)
                const newCards = sensorCards.filter(div => div.querySelector(".isNew")?.value === "true");
                if (newCards.length > 0) {
                    const creations = newCards.map(async (div) => {
                        const name = div.querySelector(".sensorName").value || "New sensor";
                        const type = div.querySelector(".sensorType").value || "";
                        const low = safeNum(div.querySelector(".refLow").value);
                        const moderate = safeNum(div.querySelector(".refModerate").value);
                        const severe = safeNum(div.querySelector(".refSevere").value);
                        const critical = safeNum(div.querySelector(".refCritical").value);

                        const partial = { name, type, referenceValues: { low, moderate, severe, critical } };
                        const respField = await createFieldOnServer(channelId, partial);

                        const sid = respField.id ?? respField.fieldId ?? null;
                        const ref = respField.referenceValue ?? respField.referenceValues ?? null;

                        if (sid) div.querySelector(".sensorId").value = sid;
                        if (ref?.id) div.querySelector(".refId").value = ref.id;

                        if (respField.name) div.querySelector(".sensorName").value = respField.name;
                        const serverType = respField.fieldType ?? respField.type;
                        if (serverType) div.querySelector(".sensorType").value = serverType;

                        if (ref) {
                            if (typeof ref.low !== "undefined" && ref.low !== null) div.querySelector(".refLow").value = ref.low;
                            if (typeof ref.moderate !== "undefined" && ref.moderate !== null) div.querySelector(".refModerate").value = ref.moderate;
                            if (typeof ref.severe !== "undefined" && ref.severe !== null) div.querySelector(".refSevere").value = ref.severe;
                            if (typeof ref.critical !== "undefined" && ref.critical !== null) div.querySelector(".refCritical").value = ref.critical;
                        }

                        div.querySelector(".isNew").value = "false";
                    });

                    await Promise.all(creations);
                }

                // Re-ler cards após criações
                const allCardsAfterCreate = Array.from(document.querySelectorAll("#edit-sensors-container .sensor-card"));

                // 2) Atualizar sensores que existiam originalmente (PATCH por sensor)
                const updateTargets = allCardsAfterCreate.filter(div => {
                    const sid = div.querySelector(".sensorId")?.value;
                    return sid && originalExistingIds.has(sid);
                });

                if (updateTargets.length > 0) {
                    const updates = updateTargets.map(async (div) => {
                        const sid = div.querySelector(".sensorId").value;
                        const name = div.querySelector(".sensorName").value || "";
                        const type = div.querySelector(".sensorType").value || "";
                        const low = safeNum(div.querySelector(".refLow").value);
                        const moderate = safeNum(div.querySelector(".refModerate").value);
                        const severe = safeNum(div.querySelector(".refSevere").value);
                        const critical = safeNum(div.querySelector(".refCritical").value);

                        const partial = { name, type, referenceValues: { low, moderate, severe, critical } };
                        await updateFieldOnServer(sid, channelId, partial);
                    });

                    await Promise.all(updates);
                }

                // 3) Deletar sensores marcados (DELETE por id) - executa AFTER updates/creates
                if (removedSensorIds.length > 0) {
                    // criar cópia e limpar array para prevenir reuso
                    const toDelete = removedSensorIds.slice();
                    removedSensorIds.length = 0;

                    const deletes = toDelete.map(async (sid) => {
                        await deleteFieldOnServer(sid);
                    });

                    await Promise.all(deletes);
                }

                // 4) Montar lista final de sensors (após criações/atualizações/deleções)
                const finalSensors = Array.from(document.querySelectorAll("#edit-sensors-container .sensor-card")).map(div => {
                    const sid = div.querySelector(".sensorId")?.value || null;
                    const rid = div.querySelector(".refId")?.value || null;

                    return {
                        id: sid ? Number(sid) : undefined,
                        name: div.querySelector(".sensorName").value,
                        type: div.querySelector(".sensorType").value,
                        referenceValues: {
                            id: rid ? Number(rid) : undefined,
                            low: safeNum(div.querySelector(".refLow").value),
                            moderate: safeNum(div.querySelector(".refModerate").value),
                            severe: safeNum(div.querySelector(".refSevere").value),
                            critical: safeNum(div.querySelector(".refCritical").value)
                        }
                    };
                });

                // montar payload do device
                const payload = {
                    name: document.getElementById("edit-name").value,
                    serial: document.getElementById("edit-serial").value,
                    description: document.getElementById("edit-description").value,
                    latitude: safeNum(document.getElementById("edit-latitude").value),
                    longitude: safeNum(document.getElementById("edit-longitude").value),
                    elevation: safeNum(document.getElementById("edit-elevation").value),
                    active: document.getElementById("edit-active").checked,
                    fields: finalSensors
                };

                // 5) Enviar PATCH do dispositivo
                const resp = await fetch(`${API_BASE}/api/v2/channel-devices/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (resp.ok) {
                    const result = await resp.json().catch(() => null);
                    const modalEl = document.getElementById('editDeviceModal');
                    if (window.bootstrap && modalEl) {
                        const m = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
                        m.hide();
                    }
                    alert('Dispositivo atualizado com sucesso!');
                    location.reload();
                } else {
                    const errorText = await resp.text().catch(()=>null);
                    alert('Erro ao atualizar dispositivo: ' + (errorText || resp.status));
                }
            } catch (err) {
                console.error('Erro no salvamento:', err);
                alert('Erro ao salvar alterações: ' + (err?.message || err));
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});
