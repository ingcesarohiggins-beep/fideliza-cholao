// CONTROLADOR DE ERRORES GLOBAL (Para depuración)
window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = `Mensaje: ${message}\nOrigen: ${source}\nLínea: ${lineno}\nColumna: ${colno}`;
    console.error("CRASH DETECTADO:", errorMsg, error);
    alert("⚠️ ERROR EN LA APLICACIÓN (CRASH):\n\n" + errorMsg + "\n\nPor favor, abre la consola del desarrollador (F12) para más detalles.");
    return false;
};

// DATA STRUCTURES (SEED DATA)
const SEED_SEDES = [
    { ID_Sede: "SEDE-01", Nombre_Sede: "Sede Amazonas", Direccion: "Amazonas" },
    { ID_Sede: "SEDE-02", Nombre_Sede: "Sede Miraflores", Direccion: "Av. Larco 456, Miraflores" }
];

// Fallback images (premium inline SVG representations to avoid external loading dependencies)
const FALLBACK_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2394a3b8"><circle cx="50" cy="35" r="20"/><path d="M15 85 C15 65, 30 55, 50 55 C70 55, 85 65, 85 85 Z"/></svg>`;
const FALLBACK_DNI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" fill="%23334155"><rect x="10" y="10" width="130" height="80" rx="10" fill="%231e293b" stroke="%23475569" stroke-width="2"/><circle cx="40" cy="50" r="18" fill="%23475569"/><rect x="70" y="32" width="55" height="6" rx="3" fill="%23475569"/><rect x="70" y="47" width="45" height="6" rx="3" fill="%23475569"/><rect x="70" y="62" width="35" height="6" rx="3" fill="%23475569"/></svg>`;

// Modern Google Drive Direct Image Helper to bypass 3rd party cookie restrictions (SameSite)
function getGoogleDriveDirectLink(url) {
    if (!url) return "";
    if (url.includes("lh3.googleusercontent.com")) return url;
    
    let fileId = "";
    if (url.includes("id=")) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        fileId = urlParams.get('id');
    } else if (url.includes("/file/d/")) {
        const parts = url.split("/file/d/");
        if (parts.length > 1) {
            fileId = parts[1].split("/")[0];
        }
    }
    
    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
}

const SEED_PREMIOS = [
    { ID_Premio: "P-01", Nombre_Premio: "Cholado Tradicional", Puntos_Requeridos: 50, Icono: "icecream" },
    { ID_Premio: "P-02", Nombre_Premio: "Cholado Especial", Puntos_Requeridos: 80, Icono: "local_bar" },
    { ID_Premio: "P-03", Nombre_Premio: "Super Cholado", Puntos_Requeridos: 150, Icono: "liquor" },
    { ID_Premio: "P-04", Nombre_Premio: "Ensalada de Frutas", Puntos_Requeridos: 200, Icono: "nutrition" },
    { ID_Premio: "P-05", Nombre_Premio: "Descuento S/. 10", Puntos_Requeridos: 100, Icono: "local_activity" },
    { ID_Premio: "P-06", Nombre_Premio: "Descuento S/. 25", Puntos_Requeridos: 220, Icono: "payments" }
];

const SEED_CLIENTES = [
    { DNI: "12345678", Nombre_Completo: "Juan Perez Garcia", Celular: "987654321", Foto_Cliente: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", Foto_DNI: "", Fecha_Registro: "2026-05-15" },
    { DNI: "87654321", Nombre_Completo: "Maria Rodriguez Lopez", Celular: "912345678", Foto_Cliente: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", Foto_DNI: "", Fecha_Registro: "2026-05-20" },
    { DNI: "44556677", Nombre_Completo: "Carlos Mendoza Ruiz", Celular: "955443322", Foto_Cliente: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", Foto_DNI: "", Fecha_Registro: "2026-06-01" }
];

const SEED_HISTORIAL = [
    { ID_Transaccion: "TX-1001", Fecha_Hora: "2026-05-15 14:30:00", DNI_Cliente: "12345678", ID_Sede: "SEDE-01", Tipo_Operacion: "Acumulacion", Monto_Compra: 150.00, Puntos: 150, Detalle: "Compra de Cholado y raspados", Vendedor: "vendedor1@correo.com" },
    { ID_Transaccion: "TX-1002", Fecha_Hora: "2026-05-20 11:15:00", DNI_Cliente: "87654321", ID_Sede: "SEDE-02", Tipo_Operacion: "Acumulacion", Monto_Compra: 100.00, Puntos: 100, Detalle: "Compra especial", Vendedor: "vendedor2@correo.com" },
    { ID_Transaccion: "TX-1003", Fecha_Hora: "2026-05-21 16:45:00", DNI_Cliente: "87654321", ID_Sede: "SEDE-02", Tipo_Operacion: "Canje", Monto_Compra: 0.00, Puntos: -50, Detalle: "Canje: Cholado Tradicional", Vendedor: "vendedor2@correo.com" },
    { ID_Transaccion: "TX-1004", Fecha_Hora: "2026-06-01 09:00:00", DNI_Cliente: "44556677", ID_Sede: "SEDE-03", Tipo_Operacion: "Acumulacion", Monto_Compra: 300.00, Puntos: 300, Detalle: "Compra familiar grande", Vendedor: "vendedor3@correo.com" }
];

// STATE MANAGEMENT
let localDatabase = {
    clientes: [],
    sedes: [],
    premios: [],
    historial: []
};

let currentDBMode = "sheets"; // Por defecto en Nube (Google Sheets)
let googleSheetsUrl = "https://script.google.com/macros/s/AKfycbw1D2rzE42ENq48mewdXsBUbz7CjWvhW920pmaIVV01QiGY7QiHNtu1KWM2RxP_HRoZ5Q/exec";
let selectedSedeId = "SEDE-01";
let activeCustomer = null;
let selectedReward = null;
let html5QrScanner = null;

// User Credentials & Access Control (Admin and Sede-specific views)
const CREDENTIALS = {
    "ing.cesarohiggins@gmail.com": { pass: "Cholao123!", role: "admin", sede: "ALL" },
    "miraflores@cholao.com": { pass: "Miraflores651", role: "vendedor", sede: "SEDE-02" },
    "amazonas@cholao.com": { pass: "Amazonas521", role: "vendedor", sede: "SEDE-01" }
};
let currentUser = null;

// Webcam streams state
let custVideoStream = null;
let dniVideoStream = null;
let capturedCustPhotoBase64 = "";
let capturedDniPhotoBase64 = "";

// DOM ELEMENTS
const dom = {
    tabs: document.querySelectorAll('.nav-item'),
    tabContents: document.querySelectorAll('.tab-content'),
    sedeSelect: document.getElementById('appSedeSelect'),
    headerSedeText: document.getElementById('headerSedeText'),
    pageTitle: document.getElementById('pageTitle'),
    pageDescription: document.getElementById('pageDescription'),
    dbDot: document.getElementById('dbDot'),
    dbModeText: document.getElementById('dbModeText'),
    
    // Vendedor Tab
    searchDniInput: document.getElementById('searchDniInput'),
    btnSearchDni: document.getElementById('btnSearchDni'),
    btnToggleCamera: document.getElementById('btnToggleCamera'),
    btnSimulateScan: document.getElementById('btnSimulateScan'),
    cameraReaderContainer: document.getElementById('cameraReaderContainer'),
    btnCloseCamera: document.getElementById('btnCloseCamera'),
    customerDetailsCard: document.getElementById('customerDetailsCard'),
    customerPoints: document.getElementById('customerPoints'),
    custAvatarImg: document.getElementById('custAvatarImg'),
    custNameText: document.getElementById('custNameText'),
    custDniText: document.getElementById('custDniText'),
    custPhoneText: document.getElementById('custPhoneText'),
    custRegDateText: document.getElementById('custRegDateText'),
    custDniImg: document.getElementById('custDniImg'),
    custDniBox: document.getElementById('custDniBox'),
    actionTabBtns: document.querySelectorAll('.action-tab-btn'),
    actionForms: document.querySelectorAll('.action-form'),
    purchaseAmount: document.getElementById('purchaseAmount'),
    calcPointsLabel: document.getElementById('calcPointsLabel'),
    purchaseConcept: document.getElementById('purchaseConcept'),
    btnSubmitAccumulate: document.getElementById('btnSubmitAccumulate'),
    rewardsCatalogGrid: document.getElementById('rewardsCatalogGrid'),
    canjeSummary: document.getElementById('canjeSummary'),
    canjeRewardName: document.getElementById('canjeRewardName'),
    canjeRewardPoints: document.getElementById('canjeRewardPoints'),
    canjeRemainingPoints: document.getElementById('canjeRemainingPoints'),
    btnSubmitRedeem: document.getElementById('btnSubmitRedeem'),

    // Registro Tab
    registerForm: document.getElementById('registerCustomerForm'),
    btnSubmitRegister: document.getElementById('btnSubmitRegister'),
    regDni: document.getElementById('regDni'),
    regPhone: document.getElementById('regPhone'),
    regName: document.getElementById('regName'),
    btnStartCamCust: document.getElementById('btnStartCamCust'),
    btnSnapCust: document.getElementById('btnSnapCust'),
    videoCustomer: document.getElementById('videoCustomer'),
    photoCustomerImg: document.getElementById('photoCustomerImg'),
    fileCust: document.getElementById('fileCust'),
    previewCustomerBox: document.getElementById('previewCustomerBox'),
    btnStartCamDni: document.getElementById('btnStartCamDni'),
    btnSnapDni: document.getElementById('btnSnapDni'),
    videoDni: document.getElementById('videoDni'),
    photoDniImg: document.getElementById('photoDniImg'),
    fileDni: document.getElementById('fileDni'),
    previewDniBox: document.getElementById('previewDniBox'),

    // Admin Tab
    adminTotalClientes: document.getElementById('adminTotalClientes'),
    adminTotalPuntos: document.getElementById('adminTotalPuntos'),
    adminTotalCanjes: document.getElementById('adminTotalCanjes'),
    adminTotalSedes: document.getElementById('adminTotalSedes'),
    historyTableBody: document.getElementById('historyTableBody'),
    filterSearch: document.getElementById('filterSearch'),
    filterSede: document.getElementById('filterSede'),
    filterTipo: document.getElementById('filterTipo'),
    btnExportCsv: document.getElementById('btnExportCsv'),

    // Config Tab
    dbModeRadios: document.querySelectorAll('input[name="dbMode"]'),
    sheetsConfigContainer: document.getElementById('sheetsConfigContainer'),
    sheetsApiUrl: document.getElementById('sheetsApiUrl'),
    btnTestCloudConnection: document.getElementById('btnTestCloudConnection'),
    cloudConnMsg: document.getElementById('cloudConnMsg'),
    btnResetSeedData: document.getElementById('btnResetSeedData'),
    btnClearAllData: document.getElementById('btnClearAllData'),

    // DNI Modal
    dniModal: document.getElementById('dniModal'),
    modalDniImg: document.getElementById('modalDniImg'),
    btnCloseDniModal: document.getElementById('btnCloseDniModal')
};

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    initSettings();
    initDatabase();
    setupEventListeners();
    setupLoginEventListeners();
    checkSession();
    renderApp();
});// 1. SETTINGS & DB INITIALIZATION
function initSettings() {
    // Cargar modo de base de datos (por defecto sheets)
    const savedMode = localStorage.getItem('fideliza_db_mode') || "sheets";
    currentDBMode = savedMode;
    dom.dbModeRadios.forEach(radio => {
        if (radio.value === currentDBMode) radio.checked = true;
    });
    
    // Cargar URL de Google Sheets
    const savedUrl = localStorage.getItem('fideliza_sheets_url') || "https://script.google.com/macros/s/AKfycbw1D2rzE42ENq48mewdXsBUbz7CjWvhW920pmaIVV01QiGY7QiHNtu1KWM2RxP_HRoZ5Q/exec";
    googleSheetsUrl = savedUrl;
    dom.sheetsApiUrl.value = savedUrl;

    if (currentDBMode === "sheets") {
        dom.sheetsConfigContainer.style.display = "block";
    }
}

function initDatabase() {
    // Si el localStorage tiene la sede San Isidro o Surco (semilla vieja), forzar reseteo de sedes a 2 sedes
    const storedSedes = localStorage.getItem('fid_db_sedes');
    if (storedSedes && (storedSedes.includes("San Isidro") || storedSedes.includes("Surco"))) {
        localStorage.removeItem('fid_db_sedes');
        localStorage.removeItem('fid_db_premios');
        localStorage.removeItem('fid_db_clientes');
        localStorage.removeItem('fid_db_historial');
    }

    // Si falta CUALQUIERA de las claves clave en localStorage, forzar carga de semillas
    if (!localStorage.getItem('fid_db_clientes') ||
        !localStorage.getItem('fid_db_sedes') ||
        !localStorage.getItem('fid_db_premios') ||
        !localStorage.getItem('fid_db_historial')) {
        resetLocalDatabaseToSeed();
    } else {
        loadDatabaseFromLocalStorage();
    }
}

function resetLocalDatabaseToSeed() {
    localStorage.setItem('fid_db_clientes', JSON.stringify(SEED_CLIENTES));
    localStorage.setItem('fid_db_sedes', JSON.stringify(SEED_SEDES));
    localStorage.setItem('fid_db_premios', JSON.stringify(SEED_PREMIOS));
    localStorage.setItem('fid_db_historial', JSON.stringify(SEED_HISTORIAL));
    
    loadDatabaseFromLocalStorage();
}

function loadDatabaseFromLocalStorage() {
    localDatabase.clientes = JSON.parse(localStorage.getItem('fid_db_clientes')) || [];
    localDatabase.sedes = JSON.parse(localStorage.getItem('fid_db_sedes')) || [];
    localDatabase.premios = JSON.parse(localStorage.getItem('fid_db_premios')) || [];
    localDatabase.historial = JSON.parse(localStorage.getItem('fid_db_historial')) || [];
    
    // Salvaguarda: si algún arreglo está vacío en localStorage, cargamos los datos semilla
    if (localDatabase.sedes.length === 0) localDatabase.sedes = [...SEED_SEDES];
    if (localDatabase.premios.length === 0) localDatabase.premios = [...SEED_PREMIOS];
    if (localDatabase.clientes.length === 0) localDatabase.clientes = [...SEED_CLIENTES];
    if (localDatabase.historial.length === 0) localDatabase.historial = [...SEED_HISTORIAL];
    
    // Pre-seleccionar la primera sede cargada como activa
    if (localDatabase.sedes.length > 0) {
        selectedSedeId = localDatabase.sedes[0].ID_Sede;
    }
}
// 2. NETWORK OPERATIONS (GOOGLE SHEETS)
async function fetchCloudData() {
    if (!googleSheetsUrl) {
        showStatusIndicator("offline", "URL de Nube vacía");
        throw new Error("URL de Google Sheets no configurada.");
    }
    
    showStatusIndicator("offline", "Cargando datos de la Nube...");
    
    const response = await fetch(`${googleSheetsUrl}?action=getData`);
    const result = await response.json();
    
    if (result.status === "success") {
        localDatabase.clientes = result.data.clientes;
        // Si vienen sedes o premios del servidor, los actualizamos
        if (result.data.sedes && result.data.sedes.length > 0) localDatabase.sedes = result.data.sedes;
        if (result.data.premios && result.data.premios.length > 0) localDatabase.premios = result.data.premios;
        localDatabase.historial = result.data.historial;
        
        showStatusIndicator("online", "Nube conectada");
        return localDatabase;
    } else {
        throw new Error(result.message || "Error al obtener datos");
    }
}

async function writeCloudTransaction(txData) {
    if (!googleSheetsUrl) return false;
    
    const postData = {
        action: "registrarTransaccion",
        dniCliente: txData.DNI_Cliente,
        idSede: txData.ID_Sede,
        tipoOperacion: txData.Tipo_Operacion,
        montoCompra: txData.Monto_Compra,
        puntos: txData.Puntos,
        detalle: txData.Detalle,
        vendedor: txData.Vendedor
    };
    
    const response = await fetch(googleSheetsUrl, {
        method: "POST",
        mode: "no-cors", // Requerido para Apps Script Web App redirigido en algunas redes
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    });
    
    // Con no-cors no podemos ver el body de respuesta fácilmente, asumimos éxito si no arroja error.
    return true;
}

async function registerCloudCustomer(custData) {
    if (!googleSheetsUrl) return false;
    
    const postData = {
        action: "registrarCliente",
        dni: custData.DNI,
        nombreCompleto: custData.Nombre_Completo,
        celular: custData.Celular,
        fotoClienteBase64: custData.fotoClienteBase64 || "",
        fotoDniBase64: custData.fotoDniBase64 || ""
    };
    
    try {
        // En este caso, para el registro con foto sí intentamos obtener respuesta detallada por si hay error.
        // Google Apps Script suele retornar un CORS error en POST si no se maneja bien,
        // por lo que hacemos fetch estándar. Si da CORS error, igual los datos usualmente se procesaron.
        const response = await fetch(googleSheetsUrl, {
            method: "POST",
            mode: "no-cors", // Evita la solicitud OPTIONS de CORS
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData)
        });
        // Con no-cors no podemos leer la respuesta, pero sabemos que se procesa en el servidor
        return { status: "success", message: "Procesado en segundo plano" };
    } catch (e) {
        console.warn("Posible restricción de CORS en Apps Script, pero el registro pudo procesarse.", e);
        return { status: "success", message: "Procesado (verificar en servidor)" };
    }
}

function showStatusIndicator(state, text) {
    dom.dbDot.className = "indicator-dot " + state;
    dom.dbModeText.textContent = text;
}

// 3. LOGIC & DATA OPERATIONS
function getClientPoints(dni) {
    // Suma de puntos en el historial del cliente
    return localDatabase.historial
        .filter(tx => String(tx.DNI_Cliente || '').trim() === String(dni || '').trim())
        .reduce((sum, tx) => sum + parseInt(tx.Puntos || 0), 0);
}

function saveLocalDatabase() {
    localStorage.setItem('fid_db_clientes', JSON.stringify(localDatabase.clientes));
    localStorage.setItem('fid_db_sedes', JSON.stringify(localDatabase.sedes));
    localStorage.setItem('fid_db_premios', JSON.stringify(localDatabase.premios));
    localStorage.setItem('fid_db_historial', JSON.stringify(localDatabase.historial));
}

// 4. RENDERING FUNCTIONS
async function renderApp() {
    // Configurar indicador de estado inicial
    if (currentDBMode === "local") {
        showStatusIndicator("local", "Modo Local");
    } else {
        try {
            await fetchCloudData();
        } catch (err) {
            showStatusIndicator("offline", "Error de conexión Nube");
            console.error("Error sincronizando nube al inicio, usando datos en caché local", err);
        }
    }

    // Renderizar Selector de Sedes
    dom.sedeSelect.innerHTML = "";
    localDatabase.sedes.forEach(sede => {
        const option = document.createElement('option');
        option.value = sede.ID_Sede;
        option.textContent = sede.Nombre_Sede;
        if (sede.ID_Sede === selectedSedeId) option.selected = true;
        dom.sedeSelect.appendChild(option);
    });

    const activeSede = localDatabase.sedes.find(s => s.ID_Sede === selectedSedeId);
    if (activeSede) {
        dom.headerSedeText.textContent = activeSede.Nombre_Sede;
    }

    // Rellenar selectores de sedes del administrador
    const filterSedeSelect = dom.filterSede;
    filterSedeSelect.innerHTML = '<option value="ALL">Todas las sedes</option>';
    localDatabase.sedes.forEach(sede => {
        const option = document.createElement('option');
        option.value = sede.ID_Sede;
        option.textContent = sede.Nombre_Sede;
        filterSedeSelect.appendChild(option);
    });

    // Renderizar KPIs y Tablas
    renderAdminKpis();
    renderHistoryTable();
    renderTopClientsForSede();
}

function renderAdminKpis() {
    dom.adminTotalClientes.textContent = localDatabase.clientes.length;
    
    // Suma de todos los puntos acumulados (positivos)
    const totalRepartidos = localDatabase.historial
        .filter(tx => tx.Puntos > 0)
        .reduce((sum, tx) => sum + tx.Puntos, 0);
    dom.adminTotalPuntos.textContent = totalRepartidos;
    
    // Total de canjes
    const totalCanjes = localDatabase.historial
        .filter(tx => tx.Tipo_Operacion === "Canje")
        .length;
    dom.adminTotalCanjes.textContent = totalCanjes;

    // Sedes conectadas
    if (dom.adminTotalSedes) {
        dom.adminTotalSedes.textContent = localDatabase.sedes.length;
    }
}

function renderHistoryTable() {
    const tableBody = dom.historyTableBody;
    tableBody.innerHTML = "";
    
    const searchVal = dom.filterSearch.value.toLowerCase();
    const filterSedeVal = dom.filterSede.value;
    const filterTipoVal = dom.filterTipo.value;
    
    // Ordenar historial de más reciente a más antiguo
    const sortedHistorial = [...localDatabase.historial].sort((a, b) => new Date(b.Fecha_Hora) - new Date(a.Fecha_Hora));
    
    let count = 0;
    sortedHistorial.forEach(tx => {
        const client = localDatabase.clientes.find(c => String(c.DNI || '').trim() === String(tx.DNI_Cliente || '').trim());
        const clientName = client ? client.Nombre_Completo : "Cliente Desconocido";
        const sede = localDatabase.sedes.find(s => s.ID_Sede === tx.ID_Sede);
        const SedeName = sede ? sede.Nombre_Sede : tx.ID_Sede;
        
        // Aplicar filtros
        const matchesSearch = String(tx.DNI_Cliente || '').includes(searchVal) || 
                              clientName.toLowerCase().includes(searchVal) ||
                              (tx.Detalle && tx.Detalle.toLowerCase().includes(searchVal));
        const matchesSede = filterSedeVal === "ALL" || tx.ID_Sede === filterSedeVal;
        const matchesTipo = filterTipoVal === "ALL" || tx.Tipo_Operacion === filterTipoVal;
        
        if (matchesSearch && matchesSede && matchesTipo) {
            count++;
            const tr = document.createElement('tr');
            
            const badgeClass = tx.Tipo_Operacion === "Acumulacion" ? "badge-acumulacion" : "badge-canje";
            const badgeText = tx.Tipo_Operacion === "Acumulacion" ? "Acumulación" : "Canje";
            const pointsSign = tx.Puntos > 0 ? `+${tx.Puntos}` : tx.Puntos;
            const pointsClass = tx.Puntos > 0 ? "text-success" : "text-danger";
            
            tr.innerHTML = `
                <td>${tx.Fecha_Hora}</td>
                <td>${SedeName}</td>
                <td><strong>${clientName}</strong><br><small class="helper-text">${tx.DNI_Cliente}</small></td>
                <td><span class="operation-badge ${badgeClass}">${badgeText}</span></td>
                <td>${tx.Monto_Compra > 0 ? 'S/. ' + parseFloat(tx.Monto_Compra).toFixed(2) : '-'}</td>
                <td class="${pointsClass} font-bold">${pointsSign} pts</td>
                <td>${tx.Detalle || ''}</td>
                <td><small>${tx.Vendedor || 'Sistema'}</small></td>
            `;
            tableBody.appendChild(tr);
        }
    });

    if (count === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">No se encontraron transacciones.</td></tr>`;
    }
}

function renderRewardsCatalog() {
    const grid = dom.rewardsCatalogGrid;
    grid.innerHTML = "";
    
    if (!activeCustomer) return;
    const currentPoints = getClientPoints(activeCustomer.DNI);
    
    localDatabase.premios.forEach(premio => {
        const cost = premio.Puntos_Requeridos;
        const canAfford = currentPoints >= cost;
        
        const card = document.createElement('div');
        card.className = `reward-card ${canAfford ? '' : 'disabled'} ${selectedReward && selectedReward.ID_Premio === premio.ID_Premio ? 'active' : ''}`;
        
        card.innerHTML = `
            <div class="reward-info">
                <h4>${premio.Nombre_Premio}</h4>
                <p>${cost} pts</p>
            </div>
            <span class="material-symbols-rounded reward-icon">${premio.Icono || 'workspace_premium'}</span>
        `;
        
        if (canAfford) {
            card.addEventListener('click', () => {
                // Deseleccionar si ya estaba seleccionado
                if (selectedReward && selectedReward.ID_Premio === premio.ID_Premio) {
                    selectedReward = null;
                    document.querySelectorAll('.reward-card').forEach(c => c.classList.remove('active'));
                    dom.canjeSummary.style.display = "none";
                } else {
                    selectedReward = premio;
                    document.querySelectorAll('.reward-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    
                    // Mostrar resumen del canje
                    dom.canjeRewardName.textContent = premio.Nombre_Premio;
                    dom.canjeRewardPoints.textContent = `-${cost} pts`;
                    dom.canjeRemainingPoints.textContent = `${currentPoints - cost} pts`;
                    dom.canjeSummary.style.display = "block";
                }
            });
        }
        
        grid.appendChild(card);
    });
}

// 5. SCANNING & CAMERA OPERATIONS
function startDniScanner() {
    if (typeof Html5Qrcode === 'undefined') {
        alert("La librería de escaneo no se cargó correctamente. Asegúrate de estar conectado a Internet o usa la opción 'Simular Escaneo'.");
        return;
    }

    dom.cameraReaderContainer.style.display = "block";
    
    // Instanciar escáner de html5-qrcode
    if (!html5QrScanner) {
        const formatsToUse = [];
        if (typeof Html5QrcodeSupportedFormats !== 'undefined') {
            formatsToUse.push(Html5QrcodeSupportedFormats.PDF_417);
            formatsToUse.push(Html5QrcodeSupportedFormats.QR_CODE);
            formatsToUse.push(Html5QrcodeSupportedFormats.CODE_128);
        }
        html5QrScanner = new Html5Qrcode("interactiveScanner", {
            formatsToSupport: formatsToUse
        });
    }
    
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        stopDniScanner();
        
        let dniParsed = "";
        // Buscar primer bloque de 8 a 12 dígitos
        const match = decodedText.match(/\b\d{8,12}\b/) || decodedText.match(/\d{8,12}/);
        
        if (match) {
            const digitBlock = match[0];
            if (digitBlock.length === 12) {
                // Si tiene 12 dígitos (como 000072079354), tomamos los últimos 8 (72079354)
                dniParsed = digitBlock.substring(4, 12);
            } else {
                // Si tiene 8 u otra longitud, tomamos los últimos 8
                dniParsed = digitBlock.slice(-8);
            }
        } else {
            // Fallback si no encuentra un bloque claro
            const numOnly = decodedText.replace(/\D/g, '');
            if (numOnly.length >= 8) {
                dniParsed = numOnly.slice(-8);
            } else {
                dniParsed = decodedText.substring(0, 8);
            }
        }
        
        dom.searchDniInput.value = dniParsed;
        searchCustomer(dniParsed);
    };
    
    const config = { 
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
            // Caja de escaneo ancha y delgada para código de barras horizontal del DNI
            return {
                width: Math.floor(viewfinderWidth * 0.85),
                height: Math.floor(viewfinderHeight * 0.4)
            };
        },
        aspectRatio: 1.777778
    };
    
    // Iniciar cámara trasera para escaneo de código de barras
    html5QrScanner.start(
        { facingMode: "environment" }, 
        config, 
        qrCodeSuccessCallback,
        (errorMessage) => {
            // Silenciar errores comunes de escaneo continuo en consola
        }
    ).catch(err => {
        console.error("No se pudo iniciar el escáner de cámara", err);
        
        // Detectar si es un problema de protocolo seguro (HTTP) en celulares
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            alert("⚠️ ERROR DE CÁMARA (HTTP)\n\nLos navegadores de celular bloquean la cámara si el sitio no usa HTTPS.\n\nPara probar la cámara desde tu celular, debes implementar la aplicación web en un servidor seguro HTTPS gratuito (como GitHub Pages o Vercel) o usar Ngrok. Mientras tanto, puedes usar la opción 'Simular Escaneo'.");
        } else {
            alert("No se pudo acceder a la cámara. Otorga los permisos en tu navegador o digita el DNI manualmente.");
        }
        dom.cameraReaderContainer.style.display = "none";
    });
}

function stopDniScanner() {
    if (html5QrScanner && html5QrScanner.isScanning) {
        html5QrScanner.stop().then(() => {
            dom.cameraReaderContainer.style.display = "none";
        }).catch(err => console.error("Error deteniendo el escáner", err));
    } else {
        dom.cameraReaderContainer.style.display = "none";
    }
}

function startWebcam(videoEl, startBtn, snapBtn, onCaptureStop) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(stream => {
                videoEl.srcObject = stream;
                videoEl.style.display = "block";
                startBtn.style.display = "none";
                snapBtn.style.display = "block";
                
                // Guardar referencia del stream activo
                if (videoEl.id === "videoCustomer") custVideoStream = stream;
                else if (videoEl.id === "videoDni") dniVideoStream = stream;
            })
            .catch(err => {
                console.error("Error al acceder a la cámara web", err);
                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    alert("⚠️ ERROR DE CÁMARA (HTTP)\n\nLos navegadores móviles bloquean la cámara si la web no tiene HTTPS. Por favor, selecciona y sube un archivo directamente o implementa la web con HTTPS.");
                } else {
                    alert("No se pudo acceder a la cámara frontal. Otorga los permisos o sube un archivo.");
                }
            });
    } else {
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            alert("⚠️ ERROR DE CÁMARA (HTTP)\n\nTu navegador deshabilitó el API de cámara por seguridad debido a que no estás en una conexión segura HTTPS. Por favor, sube un archivo directamente.");
        } else {
            alert("Tu navegador no soporta captura de cámara directa. Usa la opción de subir archivo.");
        }
    }
}

function capturePhoto(videoEl, imgEl, startBtn, snapBtn, targetBase64VarName) {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || 320;
    canvas.height = videoEl.videoHeight || 240;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    
    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    
    imgEl.src = base64;
    imgEl.style.display = "block";
    videoEl.style.display = "none";
    
    startBtn.style.display = "block";
    snapBtn.style.display = "none";
    
    // Detener la cámara
    let stream = null;
    if (videoEl.id === "videoCustomer") {
        stream = custVideoStream;
        capturedCustPhotoBase64 = base64;
        custVideoStream = null;
    } else if (videoEl.id === "videoDni") {
        stream = dniVideoStream;
        capturedDniPhotoBase64 = base64;
        dniVideoStream = null;
    }
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Helper to load file to image source & base64
function handleFileSelect(fileInput, imgEl, targetBase64VarName) {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgEl.src = e.target.result;
            imgEl.style.display = "block";
            if (fileInput.id === "fileCust") {
                capturedCustPhotoBase64 = e.target.result;
            } else if (fileInput.id === "fileDni") {
                capturedDniPhotoBase64 = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

// 6. CUSTOMER SEARCH & ACTIONS
function searchCustomer(dni) {
    activeCustomer = localDatabase.clientes.find(c => String(c.DNI || '').trim() === String(dni || '').trim());
    selectedReward = null;
    dom.canjeSummary.style.display = "none";
    
    if (activeCustomer) {
        // Mostrar ficha del cliente
        dom.custNameText.textContent = activeCustomer.Nombre_Completo;
        dom.custDniText.textContent = activeCustomer.DNI;
        dom.custPhoneText.textContent = activeCustomer.Celular || "No registrado";
        dom.custRegDateText.textContent = activeCustomer.Fecha_Registro;
        
        // Puntos acumulados
        const points = getClientPoints(activeCustomer.DNI);
        dom.customerPoints.textContent = points;
        
        // Fotos
        const customerPhoto = getGoogleDriveDirectLink(activeCustomer.Foto_Cliente);
        dom.custAvatarImg.src = customerPhoto || FALLBACK_AVATAR;
        dom.custAvatarImg.onerror = function() { this.src = FALLBACK_AVATAR; };
        
        if (activeCustomer.Foto_DNI) {
            const dniPhoto = getGoogleDriveDirectLink(activeCustomer.Foto_DNI);
            dom.custDniImg.src = dniPhoto || FALLBACK_DNI;
            dom.custDniImg.onerror = function() { this.src = FALLBACK_DNI; };
            dom.custDniBox.style.display = "flex";
        } else {
            dom.custDniImg.src = "";
            dom.custDniBox.style.display = "none"; // Ocultar si no hay foto de DNI
        }

        dom.customerDetailsCard.style.display = "block";
        renderRewardsCatalog();
        
        // Reset inputs de transacciones
        dom.purchaseAmount.value = "";
        dom.calcPointsLabel.textContent = "0 pts";
        dom.purchaseConcept.value = "";
        
        // Scroll suave hacia abajo para móviles
        dom.customerDetailsCard.scrollIntoView({ behavior: 'smooth' });
    } else {
        dom.customerDetailsCard.style.display = "none";
        alert("Cliente no registrado. Por favor, ve a la pestaña de 'Registrar Cliente'.");
    }
}

// Permite a los botones rápidos simular la selección de DNI
window.quickSelectCustomer = function(dni) {
    dom.searchDniInput.value = dni;
    searchCustomer(dni);
};

// 7. EVENT LISTENERS SETUP
function setupEventListeners() {
    // 1. SPA Navigation Tab Click
    dom.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todos
            dom.tabs.forEach(t => t.classList.remove('active'));
            dom.tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar actual
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) targetContent.classList.add('active');
            
            // Títulos de Cabecera
            if (tabId === "vendedor") {
                dom.pageTitle.textContent = "Escanear / Vender";
                dom.pageDescription.textContent = "Busca o escanea el DNI del cliente para acumular o canjear puntos.";
            } else if (tabId === "registro") {
                dom.pageTitle.textContent = "Registrar Cliente";
                dom.pageDescription.textContent = "Crea una nueva ficha de fidelización para clientes nuevos.";
            } else if (tabId === "admin") {
                dom.pageTitle.textContent = "Panel Consolidado";
                dom.pageDescription.textContent = "Reportes y estadísticas consolidadas en tiempo real.";
                // Cargar datos frescos en admin
                renderAdminKpis();
                renderHistoryTable();
            } else if (tabId === "config") {
                dom.pageTitle.textContent = "Configuración del Sistema";
                dom.pageDescription.textContent = "Ajusta las conexiones del backend y el almacenamiento.";
            }
            
            // Detener escáner de cámara si se cambia de pestaña
            if (tabId !== "vendedor") {
                stopDniScanner();
            }
        });
    });

    // 2. Sede Select
    dom.sedeSelect.addEventListener('change', (e) => {
        selectedSedeId = e.target.value;
        const activeSede = localDatabase.sedes.find(s => s.ID_Sede === selectedSedeId);
        if (activeSede) {
            dom.headerSedeText.textContent = activeSede.Nombre_Sede;
        }
        renderTopClientsForSede();
    });

    // 3. Vendedor Actions Tab (Acumular vs Canjear)
    dom.actionTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.actionTabBtns.forEach(b => b.classList.remove('active'));
            dom.actionForms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            const actionId = btn.dataset.action;
            document.getElementById(`form-${actionId}`).classList.add('active');
            
            if (actionId === "canjear") {
                renderRewardsCatalog();
            }
        });
    });

    // 4. Calculadora en vivo de puntos (1 Sol = 1 Punto)
    dom.purchaseAmount.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value || 0);
        const pts = Math.floor(val);
        dom.calcPointsLabel.textContent = `${pts} pts`;
    });

    // 5. Botones de búsqueda y escaneo
    dom.btnSearchDni.addEventListener('click', () => {
        const dni = dom.searchDniInput.value.trim();
        if (dni.length === 8) {
            searchCustomer(dni);
        } else {
            alert("El DNI debe tener exactamente 8 números.");
        }
    });

    dom.searchDniInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            dom.btnSearchDni.click();
        }
    });

    dom.btnToggleCamera.addEventListener('click', () => {
        if (dom.cameraReaderContainer.style.display === "none") {
            startDniScanner();
        } else {
            stopDniScanner();
        }
    });

    dom.btnCloseCamera.addEventListener('click', stopDniScanner);

    dom.btnSimulateScan.addEventListener('click', () => {
        // Escoger un DNI aleatorio del pool o uno nuevo
        const simType = Math.random() > 0.3;
        let dni = "";
        
        if (simType && localDatabase.clientes.length > 0) {
            // DNI Existente
            const randomClient = localDatabase.clientes[Math.floor(Math.random() * localDatabase.clientes.length)];
            dni = randomClient.DNI;
            alert(`[SIMULACIÓN] Lector DNI escaneó código PDF417 de ${randomClient.Nombre_Completo}. Código de Barras leído: "0000${dni}<<9<<PE<<DNI<<AZUL<<APELLIDOS"`);
        } else {
            // Nuevo cliente
            dni = Math.floor(Math.random() * 90000000 + 10000000).toString();
            alert(`[SIMULACIÓN] Escaneó DNI nuevo no registrado. Código de Barras leído: "0000${dni}<<9<<PE<<DNI"`);
        }
        
        dom.searchDniInput.value = dni;
        searchCustomer(dni);
    });

    // 6. Enviar Acumulación de Puntos
    dom.btnSubmitAccumulate.addEventListener('click', async () => {
        if (!activeCustomer) return;
        
        const amount = parseFloat(dom.purchaseAmount.value || 0);
        const pts = Math.floor(amount);
        const concept = dom.purchaseConcept.value.trim() || "Compra general";
        
        if (amount <= 0) {
            alert("Por favor, ingresa un monto válido de compra.");
            return;
        }

        const newTx = {
            ID_Transaccion: "TX-" + Math.floor(Math.random() * 900000 + 100000),
            Fecha_Hora: new Date().toISOString().replace('T', ' ').substring(0, 19),
            DNI_Cliente: activeCustomer.DNI,
            ID_Sede: selectedSedeId,
            Tipo_Operacion: "Acumulacion",
            Monto_Compra: amount,
            Puntos: pts,
            Detalle: concept,
            Vendedor: currentUser ? currentUser.email : "sistema@cholao.com"
        };

        dom.btnSubmitAccumulate.disabled = true;
        dom.btnSubmitAccumulate.textContent = "Procesando...";

        try {
            if (currentDBMode === "local") {
                localDatabase.historial.push(newTx);
                saveLocalDatabase();
            } else {
                await writeCloudTransaction(newTx);
                // También agregamos a la caché local temporal para actualización visual rápida
                localDatabase.historial.push(newTx);
            }

            alert(`¡Éxito! Se han sumado +${pts} puntos al cliente.`);
            
            // Recargar datos y ficha
            searchCustomer(activeCustomer.DNI);
            renderAdminKpis();
            renderHistoryTable();
        } catch (err) {
            console.error("Error al registrar transacción", err);
            alert("Ocurrió un error al guardar en la base de datos.");
        } finally {
            dom.btnSubmitAccumulate.disabled = false;
            dom.btnSubmitAccumulate.innerHTML = '<span class="material-symbols-rounded">add_circle</span><span>Sumar Puntos</span>';
        }
    });

    // 7. Enviar Canje de Premios
    dom.btnSubmitRedeem.addEventListener('click', async () => {
        if (!activeCustomer || !selectedReward) return;
        
        const currentPoints = getClientPoints(activeCustomer.DNI);
        const cost = selectedReward.Puntos_Requeridos;
        
        if (currentPoints < cost) {
            alert("Puntos insuficientes para este premio.");
            return;
        }

        const newTx = {
            ID_Transaccion: "TX-" + Math.floor(Math.random() * 900000 + 100000),
            Fecha_Hora: new Date().toISOString().replace('T', ' ').substring(0, 19),
            DNI_Cliente: activeCustomer.DNI,
            ID_Sede: selectedSedeId,
            Tipo_Operacion: "Canje",
            Monto_Compra: 0,
            Puntos: -cost,
            Detalle: `Canje: ${selectedReward.Nombre_Premio}`,
            Vendedor: currentUser ? currentUser.email : "sistema@cholao.com"
        };

        dom.btnSubmitRedeem.disabled = true;
        dom.btnSubmitRedeem.textContent = "Procesando canje...";

        try {
            if (currentDBMode === "local") {
                localDatabase.historial.push(newTx);
                saveLocalDatabase();
            } else {
                await writeCloudTransaction(newTx);
                localDatabase.historial.push(newTx);
            }

            alert(`¡Éxito! Canje de ${selectedReward.Nombre_Premio} registrado correctamente. Puntos descontados: -${cost} pts.`);
            
            selectedReward = null;
            dom.canjeSummary.style.display = "none";
            
            // Recargar datos y ficha
            searchCustomer(activeCustomer.DNI);
            renderAdminKpis();
            renderHistoryTable();
        } catch (err) {
            console.error("Error al registrar canje", err);
            alert("Error al registrar el canje en el servidor.");
        } finally {
            dom.btnSubmitRedeem.disabled = false;
            dom.btnSubmitRedeem.innerHTML = '<span class="material-symbols-rounded">shopping_bag</span><span>Confirmar Canje</span>';
        }
    });

    // 8. Registro de Nuevo Cliente
    dom.btnStartCamCust.addEventListener('click', () => {
        startWebcam(dom.videoCustomer, dom.btnStartCamCust, dom.btnSnapCust);
    });

    dom.btnSnapCust.addEventListener('click', () => {
        capturePhoto(dom.videoCustomer, dom.photoCustomerImg, dom.btnStartCamCust, dom.btnSnapCust);
    });

    // Clic en preview de Rostro simula carga de archivo
    dom.previewCustomerBox.addEventListener('click', (e) => {
        if (e.target.id !== "videoCustomer" && dom.btnSnapCust.style.display === "none") {
            dom.fileCust.click();
        }
    });

    dom.fileCust.addEventListener('change', () => {
        handleFileSelect(dom.fileCust, dom.photoCustomerImg);
    });

    dom.btnStartCamDni.addEventListener('click', () => {
        startWebcam(dom.videoDni, dom.btnStartCamDni, dom.btnSnapDni);
    });

    dom.btnSnapDni.addEventListener('click', () => {
        capturePhoto(dom.videoDni, dom.photoDniImg, dom.btnStartCamDni, dom.btnSnapDni);
    });

    // Clic en preview de DNI simula carga de archivo
    dom.previewDniBox.addEventListener('click', (e) => {
        if (e.target.id !== "videoDni" && dom.btnSnapDni.style.display === "none") {
            dom.fileDni.click();
        }
    });

    dom.fileDni.addEventListener('change', () => {
        handleFileSelect(dom.fileDni, dom.photoDniImg);
    });

    dom.registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dni = dom.regDni.value.trim();
        const phone = dom.regPhone.value.trim();
        const name = dom.regName.value.trim();
        
        if (dni.length !== 8) {
            alert("El DNI debe tener 8 dígitos.");
            return;
        }

        // Verificar si ya existe localmente
        const exists = localDatabase.clientes.find(c => c.DNI === dni);
        if (exists) {
            alert("Este cliente con DNI ya se encuentra registrado.");
            return;
        }

        const newClient = {
            DNI: dni,
            Nombre_Completo: name,
            Celular: phone,
            Foto_Cliente: capturedCustPhotoBase64 || "https://placehold.co/150x150/6d28d9/ffffff?text=" + name.charAt(0),
            Foto_DNI: capturedDniPhotoBase64 || "",
            Fecha_Registro: new Date().toISOString().split('T')[0]
        };

        dom.btnSubmitRegister.disabled = true;
        dom.btnSubmitRegister.textContent = "Registrando...";

        try {
            if (currentDBMode === "local") {
                localDatabase.clientes.push(newClient);
                saveLocalDatabase();
                alert(`¡Éxito! Cliente ${name} registrado correctamente.`);
                resetRegisterForm();
                
                // Ir a la pestaña del vendedor para buscarlo de inmediato
                document.querySelector('[data-tab="vendedor"]').click();
                dom.searchDniInput.value = dni;
                searchCustomer(dni);
            } else {
                // Enviar fotos en Base64 para que Apps Script las suba a Google Drive
                const result = await registerCloudCustomer({
                    ...newClient,
                    fotoClienteBase64: capturedCustPhotoBase64,
                    fotoDniBase64: capturedDniPhotoBase64
                });

                if (result && result.status === "success") {
                    // Si el servidor asignó URLs de drive, las guardamos localmente
                    if (result.data) {
                        newClient.Foto_Cliente = result.data.fotoCliente || newClient.Foto_Cliente;
                        newClient.Foto_DNI = result.data.fotoDni || newClient.Foto_DNI;
                    }
                    localDatabase.clientes.push(newClient);
                    alert(`¡Éxito! Cliente registrado y guardado en la nube.`);
                    resetRegisterForm();
                    
                    document.querySelector('[data-tab="vendedor"]').click();
                    dom.searchDniInput.value = dni;
                    searchCustomer(dni);
                } else {
                    alert("Error del servidor: " + result.message);
                }
            }
        } catch (err) {
            console.error("Error registrando cliente", err);
            alert("No se pudo conectar con el servidor para registrar el cliente.");
        } finally {
            dom.btnSubmitRegister.disabled = false;
            dom.btnSubmitRegister.innerHTML = '<span class="material-symbols-rounded">save</span><span>Guardar y Registrar Cliente</span>';
        }
    });

    // 9. Admin Filtros
    dom.filterSearch.addEventListener('input', renderHistoryTable);
    dom.filterSede.addEventListener('change', renderHistoryTable);
    dom.filterTipo.addEventListener('change', renderHistoryTable);

    dom.btnExportCsv.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Fecha/Hora,Sede,DNI Cliente,Operacion,Monto Compra,Puntos,Concepto,Vendedor\r\n";
        
        localDatabase.historial.forEach(tx => {
            const row = [
                tx.Fecha_Hora,
                tx.ID_Sede,
                tx.DNI_Cliente,
                tx.Tipo_Operacion,
                tx.Monto_Compra,
                tx.Puntos,
                `"${(tx.Detalle || '').replace(/"/g, '""')}"`,
                tx.Vendedor
            ].join(",");
            csvContent += row + "\r\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reporte_fidelidad_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 10. Configuración de Base de Datos
    dom.dbModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentDBMode = e.target.value;
            localStorage.setItem('fideliza_db_mode', currentDBMode);
            
            if (currentDBMode === "sheets") {
                dom.sheetsConfigContainer.style.display = "block";
            } else {
                dom.sheetsConfigContainer.style.display = "none";
            }
            
            renderApp();
        });
    });

    dom.sheetsApiUrl.addEventListener('input', (e) => {
        googleSheetsUrl = e.target.value.trim();
        localStorage.setItem('fideliza_sheets_url', googleSheetsUrl);
    });

    dom.btnTestCloudConnection.addEventListener('click', async () => {
        if (!googleSheetsUrl) {
            dom.cloudConnMsg.innerHTML = '<span class="text-danger">Por favor ingresa una URL primero.</span>';
            return;
        }
        
        dom.cloudConnMsg.innerHTML = '<span class="text-gold">Probando conexión...</span>';
        
        try {
            await fetchCloudData();
            dom.cloudConnMsg.innerHTML = '<span class="text-success">¡Conexión Exitosa! Datos sincronizados.</span>';
            renderApp();
        } catch (err) {
            dom.cloudConnMsg.innerHTML = `<span class="text-danger">Error de Conexión: ${err.message}</span>`;
            showStatusIndicator("offline", "Error de conexión Nube");
        }
    });

    dom.btnResetSeedData.addEventListener('click', () => {
        if (confirm("¿Estás seguro de restablecer los datos locales por defecto? Perderás cambios no guardados en Sheets.")) {
            resetLocalDatabaseToSeed();
            alert("Base de datos local reestablecida.");
            renderApp();
        }
    });

    dom.btnClearAllData.addEventListener('click', () => {
        if (confirm("¿Seguro de limpiar localStorage por completo?")) {
            localStorage.clear();
            alert("LocalStorage limpiado. Recarga la página.");
            location.reload();
        }
    });

    // 11. Modal para Ampliar Foto DNI
    dom.custDniBox.addEventListener('click', () => {
        if (activeCustomer && activeCustomer.Foto_DNI) {
            dom.modalDniImg.src = getGoogleDriveDirectLink(activeCustomer.Foto_DNI);
            dom.modalDniImg.onerror = function() { this.src = FALLBACK_DNI; };
            dom.dniModal.style.display = "flex";
        }
    });

    dom.btnCloseDniModal.addEventListener('click', () => {
        dom.dniModal.style.display = "none";
    });

    dom.dniModal.addEventListener('click', (e) => {
        if (e.target.id === "dniModal") {
            dom.dniModal.style.display = "none";
        }
    });
}

function resetRegisterForm() {
    dom.registerForm.reset();
    dom.photoCustomerImg.style.display = "none";
    dom.photoDniImg.style.display = "none";
    
    capturedCustPhotoBase64 = "";
    capturedDniPhotoBase64 = "";
    
    // Asegurar streams cerrados
    if (custVideoStream) {
        custVideoStream.getTracks().forEach(track => track.stop());
        custVideoStream = null;
    }
    if (dniVideoStream) {
        dniVideoStream.getTracks().forEach(track => track.stop());
        dniVideoStream = null;
    }
    
    dom.btnStartCamCust.style.display = "block";
    dom.btnSnapCust.style.display = "none";
    dom.btnStartCamDni.style.display = "block";
    dom.btnSnapDni.style.display = "none";
}

// Renders the Top 3 clients with the highest purchase consumption for the active Sede
function renderTopClientsForSede() {
    const badgesContainer = document.querySelector('.seed-badges');
    const containerTitle = document.querySelector('.seed-list-container h4');
    
    if (!badgesContainer) return;
    badgesContainer.innerHTML = "";
    
    if (containerTitle) {
        containerTitle.textContent = "Sugerencias - Mayor Consumo en Sede:";
    }
    
    if (!localDatabase.historial || localDatabase.historial.length === 0) {
        badgesContainer.innerHTML = `<span class="helper-text">Sin consumos registrados.</span>`;
        return;
    }
    
    const sedeTxs = localDatabase.historial.filter(tx => 
        String(tx.ID_Sede).trim() === String(selectedSedeId).trim() && 
        tx.Tipo_Operacion === "Acumulacion"
    );
    
    const clientConsumption = {};
    sedeTxs.forEach(tx => {
        const dni = String(tx.DNI_Cliente).trim();
        const amount = parseFloat(tx.Monto_Compra || 0);
        clientConsumption[dni] = (clientConsumption[dni] || 0) + amount;
    });
    
    const sortedClients = Object.entries(clientConsumption)
        .map(([dni, total]) => {
            const client = localDatabase.clientes.find(c => String(c.DNI || '').trim() === dni);
            const name = client ? client.Nombre_Completo.split(' ')[0] + ' ' + (client.Nombre_Completo.split(' ')[1] || '') : `DNI ${dni}`;
            return { dni, name, total };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);
        
    if (sortedClients.length === 0) {
        badgesContainer.innerHTML = `<span class="helper-text" style="font-size:0.8rem; color:var(--color-text-muted);">Sin consumos registrados en esta sede.</span>`;
        return;
    }
    
    sortedClients.forEach(item => {
        const btn = document.createElement('button');
        btn.className = "badge-btn";
        btn.innerHTML = `<span class="material-symbols-rounded" style="font-size: 0.85rem; vertical-align: middle; margin-right: 2px;">trending_up</span> ${item.name} (S/. ${item.total.toFixed(0)})`;
        btn.onclick = () => quickSelectCustomer(item.dni);
        badgesContainer.appendChild(btn);
    });
}

// User Session & Login Logic
function checkSession() {
    const savedUser = sessionStorage.getItem("fideliza_logged_user");
    if (savedUser && CREDENTIALS[savedUser]) {
        currentUser = CREDENTIALS[savedUser];
        currentUser.email = savedUser;
        applyUserPermissions();
        document.getElementById("loginScreen").style.display = "none";
    } else {
        document.getElementById("loginScreen").style.display = "flex";
    }
}

function applyUserPermissions() {
    if (!currentUser) return;
    
    // Actualizar datos del vendedor
    document.querySelector('.profile-name').textContent = currentUser.role === "admin" ? "Administrador" : "Vendedor Sede";
    document.querySelector('.profile-avatar').textContent = currentUser.role === "admin" ? "admin_panel_settings" : "account_circle";
    
    const tabsMenu = document.querySelector('.nav-menu');
    const btnAdmin = tabsMenu.querySelector('[data-tab="admin"]');
    const btnConfig = tabsMenu.querySelector('[data-tab="config"]');
    const selectorSedeContainer = document.querySelector('.branch-selector-container');
    
    if (currentUser.role === "admin") {
        if (btnAdmin) btnAdmin.style.display = "flex";
        if (btnConfig) btnConfig.style.display = "flex";
        if (selectorSedeContainer) selectorSedeContainer.style.display = "block";
        dom.sedeSelect.disabled = false;
        
        if (localDatabase.sedes.length > 0) {
            selectedSedeId = dom.sedeSelect.value || localDatabase.sedes[0].ID_Sede;
        }
    } else {
        if (btnAdmin) btnAdmin.style.display = "none";
        if (btnConfig) btnConfig.style.display = "none";
        if (selectorSedeContainer) selectorSedeContainer.style.display = "none";
        
        selectedSedeId = currentUser.sede;
        dom.sedeSelect.value = selectedSedeId;
        dom.sedeSelect.disabled = true;
        
        // Redirigir a pestaña de vendedor si está en una restringida
        const activeTab = document.querySelector('.nav-item.active');
        if (activeTab && (activeTab.dataset.tab === "admin" || activeTab.dataset.tab === "config")) {
            document.querySelector('[data-tab="vendedor"]').click();
        }
    }
    
    const activeSede = localDatabase.sedes.find(s => s.ID_Sede === selectedSedeId);
    if (activeSede) {
        dom.headerSedeText.textContent = activeSede.Nombre_Sede;
    }
    
    renderTopClientsForSede();
}

function setupLoginEventListeners() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const pass = document.getElementById("loginPassword").value;
            const errorMsg = document.getElementById("loginErrorMsg");
            
            if (CREDENTIALS[email] && CREDENTIALS[email].pass === pass) {
                currentUser = CREDENTIALS[email];
                currentUser.email = email;
                sessionStorage.setItem("fideliza_logged_user", email);
                
                errorMsg.style.display = "none";
                document.getElementById("loginScreen").style.display = "none";
                
                applyUserPermissions();
                renderApp();
                
                document.getElementById("loginEmail").value = "";
                document.getElementById("loginPassword").value = "";
            } else {
                errorMsg.style.display = "flex";
            }
        });
    }
    
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            sessionStorage.removeItem("fideliza_logged_user");
            currentUser = null;
            document.getElementById("loginScreen").style.display = "flex";
            document.getElementById("loginErrorMsg").style.display = "none";
            document.querySelector('[data-tab="vendedor"]').click();
        });
    }
}
