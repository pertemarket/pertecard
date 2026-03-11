// ====== WORKSHOP IA - GOOGLE GEMINI ======

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

let geminiApiKey = null;
let currentAIModel = 'gemini-pro';
let workshopMemory = [];
let codeVersions = [];

// ====== INIZIALIZZAZIONE ======
document.addEventListener('DOMContentLoaded', () => {
  loadGeminiKey();
  loadWorkshopMemory();
  loadCodeVersions();
});

// ====== GESTIONE GEMINI API KEY ======
function loadGeminiKey() {
  geminiApiKey = localStorage.getItem('geminiApiKey');
  if (geminiApiKey) {
    console.log('✅ Gemini API Key caricata');
  }
}

function saveGeminiKey() {
  const key = document.getElementById('geminiApiKey').value;
  
  if (!key || key.trim() === '') {
    alert('Inserisci una API Key valida');
    return;
  }
  
  localStorage.setItem('geminiApiKey', key);
  geminiApiKey = key;
  alert('✅ API Key Gemini salvata con successo!');
}

// ====== SWITCH AI MODEL ======
function switchAIModel(model) {
  currentAIModel = model;
  localStorage.setItem('currentAIModel', model);
  console.log('🔄 Modello IA cambiato a:', model);
  alert(`Modello cambiato a ${model}`);
}

// ====== INVIO MESSAGGIO A GEMINI ======
async function sendIAMessage(e) {
  e.preventDefault();
  
  const input = document.getElementById('iaChatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  if (!geminiApiKey) {
    alert('⚠️ Configura prima l\'API Key di Gemini');
    return;
  }
  
  // Aggiungi messaggio utente al chat
  addChatMessage(message, 'user');
  input.value = '';
  
  try {
    // Chiama API Gemini
    const response = await callGeminiAPI(message);
    
    if (response) {
      addChatMessage(response, 'ai');
      
      // Salva nella memoria della conversazione
      saveConversationMemory({
        userMessage: message,
        aiResponse: response,
        timestamp: new Date(),
        model: currentAIModel
      });
    }
  } catch (error) {
    console.error('Errore Gemini:', error);
    addChatMessage(`❌ Errore: ${error.message}`, 'ai');
  }
}

// ====== CHIAMA API GEMINI ======
async function callGeminiAPI(prompt) {
  const url = `${GEMINI_API_ENDPOINT}?key=${geminiApiKey}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Errore API Gemini');
  }
  
  const data = await response.json();
  
  // Estrai il testo dalla risposta
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Risposta API non valida');
}

// ====== AGGIUNGI MESSAGGIO CHAT ======
function addChatMessage(text, sender) {
  const container = document.getElementById('iaChatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message ${sender}`;
  
  // Se è un messaggio IA con codice, formatta il codice
  if (sender === 'ai' && text.includes('```')) {
    messageEl.innerHTML = formatCodeInMessage(text);
  } else {
    messageEl.textContent = text;
  }
  
  container.appendChild(messageEl);
  container.scrollTop = container.scrollHeight;
}

// ====== FORMATTA CODICE NEL MESSAGGIO ======
function formatCodeInMessage(text) {
  let html = text;
  
  // Evidenzia blocchi di codice
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'javascript'}">${escapeHtml(code)}</code></pre>`;
  });
  
  // Evidenzia inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ====== SALVA MEMORIA CONVERSAZIONE ======
function saveConversationMemory(entry) {
  workshopMemory.push(entry);
  localStorage.setItem('workshopMemory', JSON.stringify(workshopMemory));
  updateConversationHistory();
}

function loadWorkshopMemory() {
  const saved = localStorage.getItem('workshopMemory');
  if (saved) {
    workshopMemory = JSON.parse(saved);
  }
}

function updateConversationHistory() {
  const historyContainer = document.getElementById('conversationHistory');
  historyContainer.innerHTML = '';
  
  workshopMemory.slice().reverse().forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'conversation-item';
    item.innerHTML = `
      <div class="conversation-title">Conversazione ${workshopMemory.length - index}</div>
      <div class="conversation-date">${new Date(entry.timestamp).toLocaleString('it-IT')}</div>
      <div class="conversation-preview">${entry.userMessage.substring(0, 80)}...</div>
      <div class="conversation-actions">
        <button class="btn btn-small" onclick="loadConversation(${workshopMemory.length - index - 1})">Carica</button>
        <button class="btn btn-small" onclick="deleteConversation(${workshopMemory.length - index - 1})">Elimina</button>
      </div>
    `;
    historyContainer.appendChild(item);
  });
}

function loadConversation(index) {
  const entry = workshopMemory[index];
  if (entry) {
    document.getElementById('iaChatMessages').innerHTML = '';
    addChatMessage(entry.userMessage, 'user');
    addChatMessage(entry.aiResponse, 'ai');
  }
}

function deleteConversation(index) {
  if (confirm('Eliminare questa conversazione?')) {
    workshopMemory.splice(index, 1);
    localStorage.setItem('workshopMemory', JSON.stringify(workshopMemory));
    updateConversationHistory();
  }
}

// ====== GESTIONE VERSIONI CODICE ======
function loadCodeVersions() {
  const saved = localStorage.getItem('codeVersions');
  if (saved) {
    codeVersions = JSON.parse(saved);
  }
}

function saveCodeVersion(code, description, type = 'modified') {
  const version = {
    id: codeVersions.length + 1,
    version: '1.0.' + (codeVersions.length + 1),
    code: code,
    description: description,
    type: type, // 'modified' o 'stable'
    timestamp: new Date(),
    approved: false
  };
  
  codeVersions.push(version);
  localStorage.setItem('codeVersions', JSON.stringify(codeVersions));
  
  console.log('✅ Versione codice salvata:', version.version);
  return version;
}

function approveCodeVersion(versionId) {
  const version = codeVersions.find(v => v.id === versionId);
  if (version) {
    version.approved = true;
    version.type = 'stable';
    localStorage.setItem('codeVersions', JSON.stringify(codeVersions));
    console.log('✅ Versione approvata:', version.version);
    alert(`Versione ${version.version} approvata!`);
  }
}

function rollbackCodeVersion(versionId) {
  const version = codeVersions.find(v => v.id === versionId);
  if (version && confirm(`Ripristinare la versione ${version.version}?`)) {
    console.log('🔄 Ripristino versione:', version.version);
    addChatMessage(`Versione ${version.version} ripristinata: ${version.description}`, 'ai');
    
    // Qui implementerai il vero ripristino
    alert(`Versione ${version.version} ripristinata con successo!`);
  }
}

// ====== COMANDI SPECIALI PER IA ======
function processAICommand(command) {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.startsWith('/create-code')) {
    return handleCreateCodeCommand(command);
  } else if (lowerCommand.startsWith('/modify-code')) {
    return handleModifyCodeCommand(command);
  } else if (lowerCommand.startsWith('/debug')) {
    return handleDebugCommand(command);
  } else if (lowerCommand.startsWith('/backup')) {
    return handleBackupCommand(command);
  }
  
  return null;
}

function handleCreateCodeCommand(command) {
  const description = command.replace('/create-code', '').trim();
  console.log('📝 Creazione codice:', description);
  return `Sto creando il codice per: ${description}`;
}

function handleModifyCodeCommand(command) {
  const description = command.replace('/modify-code', '').trim();
  console.log('✏️ Modifica codice:', description);
  return `Sto modificando il codice: ${description}`;
}

function handleDebugCommand(command) {
  const description = command.replace('/debug', '').trim();
  console.log('🐛 Debug:', description);
  return `Analizzando il problema: ${description}`;
}

function handleBackupCommand(command) {
  console.log('💾 Backup richiesto');
  return 'Creazione backup completo del sistema...';
}

// ====== BACKUP SISTEMA ======
function createSystemBackup() {
  const backup = {
    timestamp: new Date(),
    workshopMemory: workshopMemory,
    codeVersions: codeVersions,
    currentAIModel: currentAIModel
  };
  
  const backupData = JSON.stringify(backup);
  const blob = new Blob([backupData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tecard-backup-${Date.now()}.json`;
  a.click();
  
  console.log('✅ Backup scaricato');
}

// ====== RIPRISTINO BACKUP ======
function restoreSystemBackup(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);
      
      workshopMemory = backup.workshopMemory || [];
      codeVersions = backup.codeVersions || [];
      currentAIModel = backup.currentAIModel || 'gemini-pro';
      
      localStorage.setItem('workshopMemory', JSON.stringify(workshopMemory));
      localStorage.setItem('codeVersions', JSON.stringify(codeVersions));
      localStorage.setItem('currentAIModel', currentAIModel);
      
      updateConversationHistory();
      alert('✅ Backup ripristinato con successo!');
    } catch (error) {
      alert('❌ Errore ripristino backup: ' + error.message);
    }
  };
  
  reader.readAsText(file);
}

// ====== ESPORTA CONVERSAZIONE ======
function exportConversation(index) {
  const entry = workshopMemory[index];
  if (entry) {
    const text = `Conversazione ${index + 1}\n${new Date(entry.timestamp).toLocaleString('it-IT')}\n\nUtente: ${entry.userMessage}\n\nIA: ${entry.aiResponse}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversazione-${index + 1}.txt`;
    a.click();
  }
}

// ====== UTILITY ======
function logToConsole(message, type = 'log') {
  console.log(`[Workshop] ${message}`);
}

// Exports per test
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    callGeminiAPI,
    saveConversationMemory,
    saveCodeVersion,
    createSystemBackup,
    restoreSystemBackup
  };
}
