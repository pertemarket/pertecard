// ====== CONFIGURAZIONE API ======
const API_URL = 'https://tuo-backend.vercel.app/api'; // Cambierai questo dopo
const SUPABASE_URL = 'https://tuoprogetto.supabase.co';
const SUPABASE_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGc...'; // Cambierai questo

// ====== STATO GLOBALE ======
let currentUser = null;
let userPoints = 0;
let userEAN13 = null;
let isPointsVisible = true;

// ====== INIZIALIZZAZIONE ======
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App inizializzata');
  
  // Controlla se l'utente è già loggato
  const token = localStorage.getItem('authToken');
  if (token) {
    await loadUserData();
    showScreen('userScreen');
  } else {
    showScreen('loginScreen');
  }
  
  // Event listeners
  setupEventListeners();
  
  // Simula fine caricamento
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.remove('active');
  }, 1500);
});

// ====== SETUP EVENT LISTENERS ======
function setupEventListeners() {
  // Login
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  
  // Registrazione
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// ====== LOGIN ======
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    // Simula login (dopo configurerai con backend vero)
    if (email && password) {
      currentUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        ean13: generateEAN13()
      };
      
      localStorage.setItem('authToken', 'token_' + currentUser.id);
      localStorage.setItem('userData', JSON.stringify(currentUser));
      
      userEAN13 = currentUser.ean13;
      userPoints = Math.floor(Math.random() * 1000); // Simulazione punti
      
      await loadUserData();
      showScreen('userScreen');
      
      // Reset form
      document.getElementById('loginForm').reset();
    }
  } catch (error) {
    console.error('Errore login:', error);
    alert('Errore durante il login');
  }
}

// ====== REGISTRAZIONE ======
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const surname = document.getElementById('registerSurname').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const password2 = document.getElementById('registerPassword2').value;
  
  if (password !== password2) {
    alert('Le password non corrispondono');
    return;
  }
  
  try {
    // Simula registrazione
    currentUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: name + ' ' + surname,
      email: email,
      ean13: generateEAN13()
    };
    
    localStorage.setItem('authToken', 'token_' + currentUser.id);
    localStorage.setItem('userData', JSON.stringify(currentUser));
    
    userEAN13 = currentUser.ean13;
    userPoints = 0;
    
    await loadUserData();
    showScreen('userScreen');
    
    // Reset form
    document.getElementById('registerForm').reset();
  } catch (error) {
    console.error('Errore registrazione:', error);
    alert('Errore durante la registrazione');
  }
}

// ====== LOGOUT ======
function handleLogout() {
  if (confirm('Sei sicuro di voler uscire?')) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    userPoints = 0;
    userEAN13 = null;
    
    document.getElementById('loginForm').reset();
    showScreen('loginScreen');
  }
}

// ====== CARICA DATI UTENTE ======
async function loadUserData() {
  const userData = localStorage.getItem('userData');
  if (userData) {
    currentUser = JSON.parse(userData);
    document.getElementById('welcomeText').textContent = `Benvenuto, ${currentUser.name}!`;
    document.getElementById('cardName').textContent = currentUser.name;
    document.getElementById('pointsTotal').textContent = userPoints;
    document.getElementById('ean13Code').textContent = currentUser.ean13;
  }
}

// ====== MOSTRA SCHERMATA ======
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ====== MOSTRA/NASCONDI FORM ======
function showLogin() {
  showScreen('loginScreen');
}

function showRegister() {
  showScreen('registerScreen');
}

// ====== MOSTRA CODICE BARCODE ======
function showCardCode() {
  const modal = document.getElementById('barcodeModal');
  modal.classList.remove('hidden');
  
  // Aumenta luminosità dello schermo al 100%
  if (navigator.wakeLock) {
    navigator.wakeLock.request('screen').catch(() => {
      console.log('Wake Lock non disponibile');
    });
  }
  
  // Aumenta brightness se possibile
  try {
    if (screen.orientation && screen.orientation.type) {
      screen.orientation.lock('portrait').catch(() => {});
    }
  } catch (error) {
    console.log('Orientation lock non disponibile');
  }
}

// ====== CHIUDI MODALE BARCODE ======
function closeBarcodeModal() {
  const modal = document.getElementById('barcodeModal');
  modal.classList.add('hidden');
}

// ====== MOSTRA TAB ======
function showTab(tabName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  event.target.closest('.nav-item').classList.add('active');
  
  // Qui aggiungerai le logiche per storico e profilo
  console.log('Tab selezionato:', tabName);
}

// ====== GENERA CODICE EAN13 ======
function generateEAN13() {
  let code = '';
  for (let i = 0; i < 13; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// ====== UTILITY FUNZIONI ======
function formatDate(date) {
  return new Date(date).toLocaleDateString('it-IT');
}

function showAlert(message, type = 'success') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Qui implementerai notifiche reali dopo
}
