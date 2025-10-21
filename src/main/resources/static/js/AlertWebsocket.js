// let stompClient = null;
// let baseUrl = "http://localhost:8085";

// helper para escapar strings vindas do backend (prevenção XSS)
// function escapeHtml(str) {
//     return String(str ?? "")
//         .replace(/&/g, "&amp;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#39;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;");
// }

// function connect() {
//     const socket = new SockJS('http://localhost:8085/ws-alerts');
//     stompClient = Stomp.over(socket);
//     stompClient.debug = null;
//
//     stompClient.connect({}, frame => {
//         console.log('✅ Conectado ao WebSocket: ' + frame);
//         stompClient.subscribe('/topic/alerts', message => {
//             try {
//                 const alert = JSON.parse(message.body);
//                 console.log("📢 Alerta recebido:", alert);
//                 showAlertCard(alert);
//             } catch (error) {
//                 console.error("Erro ao processar alerta:", error, message.body);
//             }
//         });
//     }, error => {
//         console.error("❌ Erro na conexão WebSocket:", error);
//         setTimeout(connect, 5000);
//     });
// }

/**
 * showAlertCard agora cria toasts no canto superior direito (não bloqueantes).
 * Cria automaticamente um container fixo no topo-direito se não existir.
 */
// function showAlertCard(alert) {
//     // garantir container de toasts no topo-direito
//     let toastsContainer = document.getElementById('alerts-toast-container');
//     if (!toastsContainer) {
//         toastsContainer = document.createElement('div');
//         toastsContainer.id = 'alerts-toast-container';
//         // estilos para posicionar toasts no topo-direito sem bloquear a UI
//         toastsContainer.style.position = 'fixed';
//         toastsContainer.style.top = '1rem';
//         toastsContainer.style.right = '1rem';
//         toastsContainer.style.display = 'flex';
//         toastsContainer.style.flexDirection = 'column';
//         toastsContainer.style.gap = '0.75rem';
//         toastsContainer.style.zIndex = '9999';
//         toastsContainer.style.pointerEvents = 'none'; // container não captura clicks
//         document.body.appendChild(toastsContainer);
//     }
//
//     // safe values
//     const safeId = escapeHtml(alert.id ?? String(Date.now()));
//     const safeLevel = escapeHtml(alert.alertLevel ?? alert.level ?? '');
//     const safeStatus = escapeHtml(alert.statusAlert ?? alert.status ?? '');
//     const safeDate = alert.alertDate ? escapeHtml(new Date(alert.alertDate).toLocaleString()) : '';
//     const safeDescription = escapeHtml(alert.description ?? '');
//
//     // criar card (toast)
//     const card = document.createElement('div');
//     card.className = 'alert-toast-card';
//     // permitir interações somente no card (container tem pointer-events none)
//     card.style.pointerEvents = 'auto';
//     card.style.background = '#ffffff';
//     card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
//     card.style.borderRadius = '8px';
//     card.style.padding = '12px';
//     card.style.width = '320px';
//     card.style.boxSizing = 'border-box';
//     card.style.border = '1px solid rgba(0,0,0,0.06)';
//     card.style.position = 'relative';
//     card.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
//
//     card.innerHTML = `
//         <button aria-label="Fechar alerta"
//                 class="close-alert-button"
//                 style="position:absolute; top:8px; right:8px; background:none; border:none; font-size:16px; cursor:pointer; color:#6b7280;">
//             ×
//         </button>
//         <div style="font-weight:700; margin-bottom:6px;">Alerta #${safeId}</div>
//         <div style="font-size:13px; margin-bottom:4px;"><strong>Nível:</strong> ${safeLevel}</div>
//         <div style="font-size:13px; margin-bottom:4px;"><strong>Status:</strong> ${safeStatus}</div>
//         <div style="font-size:12px; color:#4b5563; margin-bottom:8px;"><strong>Atualização:</strong> ${safeDate}</div>
//         ${ safeDescription ? `<div style="font-size:13px; margin-bottom:8px; color:#374151;"><strong>Descrição:</strong> ${safeDescription}</div>` : "" }
//         <div style="display:flex; gap:8px; justify-content:flex-end;">
//             <button class="btn-show-location" style="background:#3b82f6; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-size:13px;">Ver Localização</button>
//         </div>
//     `;
//
//     // anexar no topo (insere no topo do container para que o mais recente fique em cima)
//     toastsContainer.insertBefore(card, toastsContainer.firstChild);
//
//     // comportamento do botão fechar
//     const closeBtn = card.querySelector('.close-alert-button');
//     const removeCard = () => {
//         if (card && card.parentElement) card.parentElement.removeChild(card);
//         if (timeoutHandle) clearTimeout(timeoutHandle);
//         // se não existir mais toasts, remover container opcionalmente
//         if (toastsContainer && toastsContainer.childElementCount === 0) {
//             if (toastsContainer.parentElement) toastsContainer.parentElement.removeChild(toastsContainer);
//         }
//     };
//     closeBtn.addEventListener('click', removeCard);
//
//     // botão ver localização
//     const locBtn = card.querySelector('.btn-show-location');
//     locBtn.addEventListener('click', () => {
//         try {
//             showLocation(alert.id);
//         } catch (err) {
//             console.warn('showLocation não definida ou falhou:', err);
//         }
//         // opcional: não fechar automaticamente; se preferir fechar, chame removeCard();
//     });
//
//     // auto-remove após 20s
//     const timeoutHandle = setTimeout(() => {
//         try { if (card && card.parentElement) card.parentElement.removeChild(card); } catch (e) { /* ignore */ }
//         // remover container se vazio
//         if (toastsContainer && toastsContainer.childElementCount === 0) {
//             if (toastsContainer.parentElement) toastsContainer.parentElement.removeChild(toastsContainer);
//         }
//     }, 20000);
// }

// function showLocation(alertId) {
//     alert("Exibir localização do alerta " + alertId);
// }

// conecta automaticamente quando a página carregar
window.addEventListener("load", connect);

let currentAlertId = null; // guardaremos o ID do alerta atualmente aberto

function openAlertDetails(button) {
    currentAlertId = button.dataset.id;
    document.getElementById('modal-id').textContent = button.dataset.id;
    document.getElementById('modal-level').textContent = button.dataset.level;
    document.getElementById('modal-status').textContent = button.dataset.status;
    document.getElementById('modal-date').textContent = button.dataset.date;
    document.getElementById('modal-description').textContent = button.dataset.description;
    document.getElementById('modal-status-select').value = button.dataset.status;
    document.getElementById('alert-details-modal').style.display = 'flex';
    const modal = document.getElementById('alert-details-modal');
    modal.classList.add('show');
}

function closeAlertDetails() {
    document.getElementById('alert-details-modal').style.display = 'none';
    const modal = document.getElementById('alert-details-modal');
    modal.classList.remove('show');
}

function updateAlertStatus() {
    if (!currentAlertId) return;
    const newStatus = document.getElementById('modal-status-select').value;
    console.log('Enviando status:', newStatus);

    fetch(`${baseUrl}/api/v2/alerts/${currentAlertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('modal-status').textContent = newStatus;
                const statusTd = document.querySelector(`#alert-status-${currentAlertId}`);
                if (statusTd) statusTd.textContent = newStatus;
                closeAlertDetails();
                location.reload();
            } else {
                alert('Falha ao atualizar o status.');
            }
        })
        .catch(err => console.error('Erro ao atualizar status:', err));
}

let stompClient = null;
let baseUrl = "http://localhost:8085";

// ajuste aqui se a página de monitoramento tiver outra rota
const MONITORING_URL = `http://localhost:8084/monitoramento`;

// helper para escapar strings vindas do backend (prevenção XSS)
function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function connect() {
    const socket = new SockJS(`${baseUrl}/ws-alerts`);
    stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, frame => {
        console.log('✅ Conectado ao WebSocket: ' + frame);
        stompClient.subscribe('/topic/alerts', message => {
            try {
                const alert = JSON.parse(message.body);
                console.log("📢 Alerta recebido:", alert);
                showAlertCard(alert);
            } catch (error) {
                console.error("Erro ao processar alerta:", error, message.body);
            }
        });
    }, error => {
        console.error("❌ Erro na conexão WebSocket:", error);
        setTimeout(connect, 5000);
    });
}

/**
 * Tenta selecionar um device na lista (se estiver nesta página).
 * Retorna true se conseguiu selecionar, false caso contrário.
 */
function selectDeviceById(channelId) {
    if (!channelId && channelId !== 0) return false;
    const listContainer = document.querySelector('.device-list-container');
    if (!listContainer) return false;

    // procurar li com data-id igual ao channelId (string compare)
    const selector = `[data-id="${channelId}"]`;
    const li = listContainer.querySelector(selector);
    if (!li) {
        // tentar procurar valor numérico/sem formatação
        const all = Array.from(listContainer.querySelectorAll('li'));
        const found = all.find(el => String(el.dataset.id) === String(channelId));
        if (!found) return false;
        found.click ? found.click() : showDeviceDetails(found);
        found.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
    }
    // aciona clique/handler atual para renderizar detalhes
    li.click ? li.click() : (typeof showDeviceDetails === 'function' ? showDeviceDetails(li) : null);
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
}

/**
 * Navega para a página de monitoramento com query param channelId.
 * Se já estiver na página e conseguir selecionar localmente, apenas seleciona.
 */
function navigateToMonitoring(channelId) {
    // primeiro tenta selecionar na página atual
    if (selectDeviceById(channelId)) {
        return; // já selecionado sem navegação
    }

    // senão, redireciona para a página de monitoramento com query string
    // você pode ajustar MONITORING_URL se necessário
    const url = new URL(MONITORING_URL, window.location.origin);
    url.searchParams.set('channelId', channelId);
    window.location.href = url.toString();
}

/**
 * showAlertCard (toast no canto superior direito). Quando exibir, usa channelId do alerta
 * para o botão 'Ver Localização'. Não altera lógica existente além do uso de channelId.
 */
function showAlertCard(alert) {
    // garantir container de toasts no topo-direito
    let toastsContainer = document.getElementById('alerts-toast-container');
    if (!toastsContainer) {
        toastsContainer = document.createElement('div');
        toastsContainer.id = 'alerts-toast-container';
        toastsContainer.style.position = 'fixed';
        toastsContainer.style.top = '1rem';
        toastsContainer.style.right = '1rem';
        toastsContainer.style.display = 'flex';
        toastsContainer.style.flexDirection = 'column';
        toastsContainer.style.gap = '0.75rem';
        toastsContainer.style.zIndex = '9999';
        toastsContainer.style.pointerEvents = 'none';
        document.body.appendChild(toastsContainer);
    }

    // safe values
    const safeId = escapeHtml(alert.id ?? String(Date.now()));
    const safeLevel = escapeHtml(alert.alertLevel ?? alert.level ?? '');
    const safeStatus = escapeHtml(alert.statusAlert ?? alert.status ?? '');
    const safeDate = alert.alertDate ? escapeHtml(new Date(alert.alertDate).toLocaleString()) : '';
    const safeDescription = escapeHtml(alert.description ?? '');

    // determine channelId (prefer field channelId enviado no WS; fallback para id)
    const channelId = alert.channelId ?? alert.deviceId ?? alert.id;

    const card = document.createElement('div');
    card.className = 'alert-toast-card';
    card.style.pointerEvents = 'auto';
    card.style.background = '#ffffff';
    card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    card.style.borderRadius = '8px';
    card.style.padding = '12px';
    card.style.width = '320px';
    card.style.boxSizing = 'border-box';
    card.style.border = '1px solid rgba(0,0,0,0.06)';
    card.style.position = 'relative';
    card.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';

    card.innerHTML = `
        <button aria-label="Fechar alerta"
                class="close-alert-button"
                style="position:absolute; top:8px; right:8px; background:none; border:none; font-size:16px; cursor:pointer; color:#6b7280;">×</button>
        <div style="font-weight:700; margin-bottom:6px;">Alerta #${safeId}</div>
        <div style="font-size:13px; margin-bottom:4px;"><strong>Nível:</strong> ${safeLevel}</div>
        <div style="font-size:13px; margin-bottom:4px;"><strong>Status:</strong> ${safeStatus}</div>
        <div style="font-size:12px; color:#4b5563; margin-bottom:8px;"><strong>Atualização:</strong> ${safeDate}</div>
        ${ safeDescription ? `<div style="font-size:13px; margin-bottom:8px; color:#374151;"><strong>Descrição:</strong> ${safeDescription}</div>` : "" }
        <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn-show-location" data-channel-id="${escapeHtml(channelId)}"
                    style="background:#3b82f6; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-size:13px;">Ver Localização</button>
        </div>
    `;

    toastsContainer.insertBefore(card, toastsContainer.firstChild);

    const closeBtn = card.querySelector('.close-alert-button');
    const removeCard = () => {
        if (card && card.parentElement) card.parentElement.removeChild(card);
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (toastsContainer && toastsContainer.childElementCount === 0) {
            if (toastsContainer.parentElement) toastsContainer.parentElement.removeChild(toastsContainer);
        }
    };
    closeBtn.addEventListener('click', removeCard);

    // botão ver localização - usa navigateToMonitoring(channelId)
    const locBtn = card.querySelector('.btn-show-location');
    locBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const cid = locBtn.dataset.channelId;
        if (!cid) {
            console.warn('channelId ausente no alerta; usando id do alerta.');
        }
        navigateToMonitoring(cid ?? alert.id);
        // opcional: fechar toast
        removeCard();
    });

    const timeoutHandle = setTimeout(() => {
        try { if (card && card.parentElement) card.parentElement.removeChild(card); } catch (e) { /* ignore */ }
        if (toastsContainer && toastsContainer.childElementCount === 0) {
            if (toastsContainer.parentElement) toastsContainer.parentElement.removeChild(toastsContainer);
        }
    }, 20000);
}

/**
 * Quando já na página de monitoramento, ao carregar checar ?channelId=... e selecionar
 */
function trySelectFromQueryString() {
    try {
        const params = new URLSearchParams(window.location.search);
        const cid = params.get('channelId');
        if (cid) {
            // pequena espera para garantir que o DOM esteja pronto (ou chame isso no window.load)
            setTimeout(() => {
                selectDeviceById(cid);
                // opcional: limpar o param da URL sem recarregar
                // const url = new URL(window.location);
                // url.searchParams.delete('channelId');
                // window.history.replaceState({}, '', url.toString());
            }, 250);
        }
    } catch (err) {
        // noop
    }
}

// expose showLocation para compatibilidade anterior (caso alguém chame diretamente)
function showLocation(alertIdOrChannelId) {
    navigateToMonitoring(alertIdOrChannelId);
}

// inicia conexão e tenta selecionar se houver query param
window.addEventListener("load", () => {
    connect();
    trySelectFromQueryString();
});
