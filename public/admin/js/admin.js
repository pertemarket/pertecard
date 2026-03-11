// ====== STATO GLOBALE ADMIN ======
let adminUser = null;
let customers = [];
let versions = [];
let conversationHistory = [];
let currentColors = {
  primary: '#0d1333',
  accent: '#D6a651',
  background: '#ffffff'
};

// ====== INIZIALIZZAZIONE ======
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔐 Admin Panel inizializzato');
  
  // Controlla login admin
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
  
  setupAdminEventListeners();
  loadColors();
  loadCustomers();
  loadVersions();
});

// ====== SETUP EVENT LISTENERS ======
function setupAdminEventListeners() {
  // Login
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }
  
  // Logout
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleAdminLogout);
  }

  // Color inputs
  document.getElementById('colorPrimary')?.addEventListener('change', (e) => {
    document.getElementById('colorPrimaryPicker').value = e.target.value;
    updateColorPreview('primary', e.target.value);
  });

  document.getElementById('colorPrimaryPicker')?.addEventListener('change', (e) => {
    document.getElementById('colorPrimary').value = e.target.value;
    updateColorPreview('primary', e.target.value);
  });

  document.getElementById('colorAccent')?.addEventListener('change', (e) => {
    document.getElementById('colorAccentPicker').value = e.target.value;
    updateColorPreview('accent', e.target.value);
  });

  document.getElementById('colorAccentPicker')?.addEventListener('change', (e) => {
    document.getElementById('colorAccent').value = e.target.value;
    updateColorPreview('accent', e.target.value);
  });

  document.getElementById('colorBackground')?.addEventListener('change', (e) => {
    document.getElementById('colorBackgroundPicker').value = e.target.value;
    updateColorPreview('background', e.target.value);
  });

  document.getElementById('colorBackgroundPicker')?.addEventListener('change', (e) => {
    document.getElementById('colorBackground').value = e.target.value;
    updateColorPreview('background', e.target.value);
  });
}

// ====== LOGIN ADMIN ======
async function handleAdminLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  try {
    // Simulazione login (in produzione userai API reale)
    if (email && password) {
      adminUser = {
        id: 'admin_' + Math.random().toString(36).substr(2, 9),
        email: email,
        role: 'admin'
      };
      
      localStorage.setItem('adminToken', 'token_' + adminUser.id);
      localStorage.setItem('adminData', JSON.stringify(adminUser));
      
      document.getElementById('adminUserEmail').textContent = email;
      showAdminDashboard();
      document.getElementById('adminLoginForm').reset();
    }
  } catch (error) {
    console.error('Errore login admin:', error);
    alert('Errore durante il login');
  }
}

// ====== LOGOUT ADMIN ======
function handleAdminLogout() {
  if (confirm('Sei sicuro di voler uscire?')) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    adminUser = null;
    showAdminLogin();
  }
}

// ====== MOSTRA LOGIN ======
function showAdminLogin() {
  document.getElementById('adminLoginScreen').classList.add('active');
  document.getElementById('adminDashboard').classList.remove('active');
}

// ====== MOSTRA DASHBOARD ======
function showAdminDashboard() {
  document.getElementById('adminLoginScreen').classList.remove('active');
  document.getElementById('adminDashboard').classList.add('active');
}

// ====== SWITCH TAB ======
function switchAdminTab(tabName) {
  // Nascondi tutti i tab
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Mostra il tab selezionato
  document.getElementById(tabName + 'Tab').classList.add('active');
  
  // Aggiorna menu attivo
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  event.target.closest('.menu-item').classList.add('active');
}

// ====== GESTIONE CLIENTI ======
function loadCustomers() {
  // Simula caricamento clienti
  customers = [
    { id: 1, name: 'Mario Rossi', email: 'mario@email.com', ean13: '1234567890123', points: 500, pointsVisible: true },
    { id: 2, name: 'Anna Bianchi', email: 'anna@email.com', ean13: '2345678901234', points: 750, pointsVisible: true },
    { id: 3, name: 'Giovanni Verdi', email: 'giovanni@email.com', ean13: '3456789012345', points: 1200, pointsVisible: false }
  ];
  
  displayCustomersTable();
  updateStats();
}

function displayCustomersTable() {
  const tbody = document.getElementById('customersTableBody');
  tbody.innerHTML = '';
  
  customers.forEach(customer => {
    const row = document.createElement('tr');
    
    const toggleId = 'toggle-' + customer.id;
    const toggleClass = customer.pointsVisible ? 'active' : '';
    
    row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.email}</td>
      <td><code>${customer.ean13}</code></td>
      <td>${customer.points}</td>
      <td>
        <div class="toggle-switch ${toggleClass}" id="${toggleId}" onclick="togglePointsVisibility(${customer.id})"></div>
      </td>
      <td>
        <button class="btn btn-small" onclick="editCustomer(${customer.id})">Modifica</button>
        <button class="btn btn-small" onclick="deleteCustomer(${customer.id})">Elimina</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

function togglePointsVisibility(customerId) {
  const customer = customers.find(c => c.id === customerId);
  if (customer) {
    customer.pointsVisible = !customer.pointsVisible;
    const toggle = document.getElementById('toggle-' + customerId);
    toggle.classList.toggle('active');
  }
}

function openCustomerModal() {
  document.getElementById('customerModal').classList.remove('hidden');
}

function closeCustomerModal() {
  document.getElementById('customerModal').classList.add('hidden');
}

function saveCustomer(e) {
  e.preventDefault();
  
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;
  
  const newCustomer = {
    id: customers.length + 1,
    name: name,
    email: email,
    ean13: generateEAN13(),
    points: 0,
    pointsVisible: true
  };
  
  customers.push(newCustomer);
  displayCustomersTable();
  updateStats();
  closeCustomerModal();
  
  document.getElementById('customerForm').reset();
}

function editCustomer(customerId) {
  console.log('Modifica cliente:', customerId);
  // Implementazione futura
}

function deleteCustomer(customerId) {
  if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
    customers = customers.filter(c => c.id !== customerId);
    displayCustomersTable();
    updateStats();
  }
}

function generateEAN13() {
  let code = '';
  for (let i = 0; i < 13; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// ====== GESTIONE COLORI ======
function loadColors() {
  const saved = localStorage.getItem('appColors');
  if (saved) {
    currentColors = JSON.parse(saved);
  }
  
  document.getElementById('colorPrimary').value = currentColors.primary;
  document.getElementById('colorPrimaryPicker').value = currentColors.primary;
  document.getElementById('colorAccent').value = currentColors.accent;
  document.getElementById('colorAccentPicker').value = currentColors.accent;
  document.getElementById('colorBackground').value = currentColors.background;
  document.getElementById('colorBackgroundPicker').value = currentColors.background;
  
  updateColorPreviews();
}

function updateColorPreview(type, value) {
  currentColors[type] = value;
  updateColorPreviews();
}

function updateColorPreviews() {
  document.getElementById('colorPrimaryPreview').style.backgroundColor = currentColors.primary;
  document.getElementById('colorAccentPreview').style.backgroundColor = currentColors.accent;
  document.getElementById('colorBackgroundPreview').style.backgroundColor = currentColors.background;
  
  // Aggiorna anteprima simulata
  const preview = document.querySelector('.user-preview');
  if (preview) {
    preview.style.background = `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.primary} 100%)`;
  }
}

function saveColors() {
  const primary = document.getElementById('colorPrimary').value;
  const accent = document.getElementById('colorAccent').value;
  const background = document.getElementById('colorBackground').value;
  
  currentColors = {
    primary: primary,
    accent: accent,
    background: background
  };
  
  localStorage.setItem('appColors', JSON.stringify(currentColors));
  
  // Applica colori a tutta l'app
  applyColorsToApp(currentColors);
  
  alert('Colori salvati con successo!');
}

function applyColorsToApp(colors) {
  document.documentElement.style.setProperty('--navy-primary', colors.primary);
  document.documentElement.style.setProperty('--gold-accent', colors.accent);
  document.documentElement.style.setProperty('--white-pure', colors.background);
}

// ====== WORKSHOP IA ======
function saveGeminiKey() {
  const key = document.getElementById('geminiApiKey').value;
  if (key) {
    localStorage.setItem('geminiApiKey', key);
    alert('API Key Gemini salvata!');
  }
}

function sendIAMessage(e) {
  e.preventDefault();
  
  const message = document.getElementById('iaChatInput').value;
  if (!message.trim()) return;
  
  // Aggiungi messaggio utente
  addChatMessage(message, 'user');
  
  // Simula risposta IA
  setTimeout(() => {
    const aiResponse = 'Analizzando il tuo comando... [risposta IA simulata]';
    addChatMessage(aiResponse, 'ai');
  }, 1000);
  
  document.getElementById('iaChatInput').value = '';
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById('iaChatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message ${sender}`;
  messageEl.textContent = text;
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Salva in cronologia
  conversationHistory.push({ text, sender, timestamp: new Date() });
}

// ====== VERSIONI ======
function loadVersions() {
  // Simula versioni
  versions = [
    { version: '1.0.5', date: '2026-03-10', type: 'modified', status: 'pending' },
    { version: '1.0.4', date: '2026-03-09', type: 'modified', status: 'pending' },
    { version: '1.0.3', date: '2026-03-08', type: 'stable', status: 'approved' },
    { version: '1.0.2', date: '2026-03-07', type: 'modified', status: 'pending' },
    { version: '1.0.1', date: '2026-03-06', type: 'stable', status: 'approved' }
  ];
  
  displayVersions();
}

function displayVersions() {
  const modifiedList = document.getElementById('modifiedVersionsList');
  const stableList = document.getElementById('stableVersionsList');
  
  modifiedList.innerHTML = '';
  stableList.innerHTML = '';
  
  versions.filter(v => v.type === 'modified').slice(0, 10).forEach(version => {
    modifiedList.appendChild(createVersionElement(version));
  });
  
  versions.filter(v => v.type === 'stable').slice(0, 5).forEach(version => {
    stableList.appendChild(createVersionElement(version));
  });
}

function createVersionElement(version) {
  const div = document.createElement('div');
  div.className = 'version-item';
  div.innerHTML = `
    <div class="version-info">
      <div class="version-number">v${version.version}</div>
      <div class="version-date">${version.date}</div>
    </div>
    <div class="version-actions">
      <button class="btn btn-small" onclick="rollbackVersion('${version.version}')">Ripristina</button>
      <button class="btn btn-small" onclick="viewVersionDetails('${version.version}')">Dettagli</button>
    </div>
  `;
  return div;
}

function rollbackVersion(version) {
  if (confirm(`Ripristinare la versione ${version}?`)) {
    alert(`Versione ${version} ripristinata!`);
  }
}

function viewVersionDetails(version) {
  console.log('Dettagli versione:', version);
}

// ====== IMPOSTAZIONI ======
function uploadLogo() {
  const file = document.getElementById('logoUpload').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('logoPreview');
      preview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
      localStorage.setItem('appLogo', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

function loadLogoFromUrl() {
  const url = document.getElementById('logoUrl').value;
  if (url) {
    const preview = document.getElementById('logoPreview');
    preview.innerHTML = `<img src="${url}" alt="Logo" onerror="alert('Errore nel caricamento dell\\'immagine')">`;
    localStorage.setItem('appLogoUrl', url);
  }
}

function backupSystem() {
  if (confirm('Creare un backup completo del sistema?')) {
    const backup = {
      timestamp: new Date(),
      customers: customers,
      versions: versions,
      colors: currentColors,
      conversationHistory: conversationHistory
    };
    
    localStorage.setItem('systemBackup_' + Date.now(), JSON.stringify(backup));
    document.getElementById('lastBackup').textContent = new Date().toLocaleTimeString('it-IT');
    
    alert('Backup completato!');
  }
}

function openAdminTestWindow() {
  window.open('/admin/index.html', 'adminTest', 'width=800,height=600');
}

// ====== STATISTICHE ======
function updateStats() {
  document.getElementById('statTotalCustomers').textContent = customers.length;
  document.getElementById('statTotalPoints').textContent = customers.reduce((sum, c) => sum + c.points, 0);
  document.getElementById('statLastUpdate').textContent = new Date().toLocaleTimeString('it-IT');
  document.getElementById('statVersion').textContent = '1.0.0';
}

// ====== UTILITY ======
function formatDate(date) {
  return new Date(date).toLocaleDateString('it-IT');
}
