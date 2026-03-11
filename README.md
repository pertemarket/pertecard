# Te Card - PWA Loyalty Card System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-PWA-orange)

Applicazione **Progressive Web App (PWA)** per la gestione di carte fedeltà digitali in supermercati. Sistema completo con pannello amministrativo, integrazione con AI (Google Gemini), e personalizzazione dei colori.

---

## 🎯 Caratteristiche Principali

✅ **PWA Completa** - Installabile, offline-first, con cache intelligente  
✅ **Sistema Carte Fedeltà** - Codici EAN13, punti, storico transazioni  
✅ **Admin Panel Avanzato** - Gestione clienti, colori, versioni, backup  
✅ **Workshop IA** - Integrazione Google Gemini per analisi e chatbot  
✅ **Personalizzazione Totale** - Colori customizzabili in tempo reale  
✅ **Sicurezza** - Autenticazione, offline-first, storage crittografato  
✅ **Responsive Design** - Perfetto su mobile, tablet e desktop  

---

## 📋 Requisiti

- **Node.js** 16+ (per backend)
- **Browser moderno** (Chrome, Firefox, Safari, Edge)
- **Account Google** (per Gemini API)
- **Account Supabase** (per database)
- **Dominio** (pertemarket.it)

---

## 🚀 Quick Start

### 1. Clone del Repository

```bash
git clone https://github.com/pertemarket/pertecard.git
cd pertecard
```

### 2. Configurazione Ambiente

Copia il file `.env.example` in `.env` e inserisci le tue credenziali:

```bash
cp .env.example .env
```

Modifica `.env`:

```env
SUPABASE_URL=https://tuoprogetto.supabase.co
SUPABASE_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
GEMINI_API_KEY=AIza...
PORT=3000
NODE_ENV=development
```

### 3. Installa Dipendenze

```bash
cd backend
npm install
```

### 4. Avvia il Backend

```bash
npm run dev
```

Backend sarà disponibile su `http://localhost:3000`

### 5. Apri il Frontend

Apri il file `public/index.html` nel browser o servilo tramite:

```bash
npx http-server public -p 8000
```

Frontend sarà disponibile su `http://localhost:8000`

---

## 🔐 Configurazione API

### Google Gemini API

1. Vai su https://aistudio.google.com
2. Clicca "Get API Key"
3. Crea nuovo progetto
4. Copia la chiave
5. Incollala nel pannello admin (Workshop IA)

**Limite gratuito**: ~1.500 richieste/giorno

### Supabase

1. Vai su https://supabase.com
2. Sign up con email: `giordano.g1986@gmail.com`
3. Crea nuovo progetto: `Pertemarket`
4. Copia `Project URL` e `API Key`
5. Incolla nel file `.env`

---

## 🎨 Personalizzazione Colori

I colori sono personalizzabili dal pannello admin:

```
Navy Primario (60%):  #0d1333
Gold Accento (30%):   #D6a651
White Sfondo (10%):   #ffffff
```

**Come cambiare:**
1. Accedi al pannello admin (`/admin/index.html`)
2. Vai su **Colori**
3. Inserisci i codici esadecimali
4. Clicca **Salva**

---

## 📦 Struttura Progetto

```
pertecard/
├── public/
│   ├── index.html              # Home page PWA
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   ├── css/
│   │   └── styles.css          # Stili globali
│   ├── js/
│   │   ├── app.js              # Logica app utente
│   │   └── pwa.js              # Configurazione PWA
│   ├── admin/
│   │   ├── index.html          # Admin panel
│   │   ├── css/
│   │   │   └── admin.css       # Stili admin
│   │   └── js/
│   │       ├── admin.js        # Logica admin
│   │       └── workshop.js     # Workshop IA
│   └── assets/
│       └── images/             # Immagini e icone
├── backend/
│   ├── server.js               # Server Express
│   ├── package.json            # Dipendenze Node
│   ├── routes/
│   │   ├── auth.js             # Autenticazione
│   │   ├── admin.js            # API admin
│   │   └── workshop.js         # API IA
│   └── controllers/
├── .env.example                # Template variabili env
├── .gitignore                  # File ignorati git
├── LICENSE                     # MIT License
└── README.md                   # Questo file
```

---

## 🌐 Deploy su GitHub Pages

### 1. Configura GitHub Pages

1. Vai su **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Salva

### 2. Configura Dominio

1. Vai in **Settings** → **Pages** → **Custom domain**
2. Digita: `pertemarket.it`
3. Spunta **Enforce HTTPS**

### 3. Configura DNS

Nel tuo provider DNS (dove hai registrato il dominio), aggiungi:

**Record A:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Record CNAME (opzionale):**
```
www → pertemarket.github.io
```

Aspetta ~10 minuti per la propagazione DNS.

---

## 🛠️ Sviluppo

### Aggiungere Nuovi File

```bash
# Crea nuovo file HTML
nano public/pages/nuova-pagina.html

# Crea nuovo stile
nano public/css/nuovo-stile.css

# Crea nuovo script
nano public/js/nuovo-script.js
```

### Testing PWA

Apri DevTools (F12):
- **Application** → **Service Workers** per controllare SW
- **Application** → **Storage** per vedere localStorage
- **Network** → **Offline** per testare offline-first

### Aggiornamenti Codice

Ogni modifica a `sw.js` richiede cambio versione cache:

```javascript
const CACHE_NAME = 'tecard-v2'; // Aumenta numero versione
```

---

## 📊 Funzionalità Admin Panel

### Dashboard
- Statistiche clienti
- Punti totali
- Ultimo aggiornamento
- Versione app

### Gestione Clienti
- Aggiungi/modifica/elimina clienti
- Toggle visibilità sezione punti
- Visualizza EAN13

### Personalizzazione Colori
- Codice colore esadecimale
- Preview colore
- Anteprima area utente
- Salva in tempo reale

### Workshop IA
- Chat con Google Gemini
- Cronologia conversazioni
- Esporta conversazioni
- Backup/Ripristino

### Gestione Versioni
- Ultime 10 versioni modificate
- Ultime 5 versioni stabili
- Rollback a versione precedente
- Visualizza dettagli versione

### Impostazioni
- Logo aziendale (upload o URL esterno)
- Backup completo sistema
- Info sistema (versione, storage, ultimo backup)

---

## 🔄 Flusso Utente

```
1. ACCESSO
   └─ Login → Registrazione → Dashboard

2. AREA UTENTE
   ├─ Visualizza Carta Fedeltà
   │  └─ Tocca per mostrare EAN13
   ├─ Visualizza Punti
   ├─ Storico Transazioni
   └��� Profilo

3. OFFLINE
   ├─ Tutti i dati in cache
   ├─ Sincronizzazione al riconnessione
   └─ Notifiche quando online
```

---

## 🔐 Sicurezza

- ✅ Password hashate (bcryptjs)
- ✅ JWT per autenticazione
- ✅ HTTPS obbligatorio
- ✅ LocalStorage per dati sensibili
- ✅ Offline-first con IndexedDB
- ✅ CSP headers per XSS protection

---

## 🐛 Troubleshooting

### Service Worker non si registra
```javascript
// Svuota cache in DevTools
// Application → Storage → Clear site data
```

### Colori non cambiano
```javascript
// Forza reload
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### API Gemini non funziona
- Verifica che l'API Key sia valida
- Controlla quota giornaliera (1.500 richieste)
- Guarda console per errori CORS

### Supabase non connette
- Verifica URL e API Key in `.env`
- Controlla che il progetto esista
- Verifica permessi database

---

## 📚 Risorse

- [PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Gemini API](https://ai.google.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js](https://expressjs.com/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 👥 Team

- **Progetto**: Pertemarket - Te Card
- **Repository**: https://github.com/pertemarket/pertecard
- **Email**: giordano.g1986@gmail.com

---

## 📄 Licenza

MIT License - Vedi file [LICENSE](LICENSE) per dettagli

---

## 🎉 Fatto!

L'app è pronta per essere usata! 

**Prossimi step:**
1. ✅ Carica il logo aziendale
2. ✅ Configura i colori
3. ✅ Aggiungi i primi clienti
4. ✅ Testa la PWA offline
5. ✅ Pubblica su pertemarket.it

Buon lavoro! 🚀
