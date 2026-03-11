# 🚀 Guida Completa di Configurazione - Te Card PWA

Questa guida ti accompagnerà passo-passo nella configurazione completa del progetto Te Card.

---

## 📋 Indice

1. [Prerequisiti](#prerequisiti)
2. [Configurazione Google Gemini](#configurazione-google-gemini)
3. [Configurazione Supabase](#configurazione-supabase)
4. [Setup Locale](#setup-locale)
5. [Configurazione File .env](#configurazione-file-env)
6. [Deploy su GitHub Pages](#deploy-su-github-pages)
7. [Configurazione Dominio](#configurazione-dominio)
8. [Testing e Troubleshooting](#testing-e-troubleshooting)

---

## 📦 Prerequisiti

Prima di iniziare, assicurati di avere:

- ✅ **Git** installato - [Scarica qui](https://git-scm.com/)
- ✅ **Node.js 16+** - [Scarica qui](https://nodejs.org/)
- ✅ **npm** (viene con Node.js)
- ✅ **Browser moderno** (Chrome, Firefox, Safari, Edge)
- ✅ **Account GitHub** - [Crea qui](https://github.com/signup)
- ✅ **Editor di testo** (VS Code consigliato)

### Verifica Installazione

Apri terminale/prompt dei comandi e scrivi:

```bash
node --version
# Dovresti vedere: v16.x.x o superiore

npm --version
# Dovresti vedere: 8.x.x o superiore

git --version
# Dovresti vedere: git version 2.x.x
```

---

## 🤖 Configurazione Google Gemini

### Step 1: Accedi a Google AI Studio

1. Vai su **https://aistudio.google.com**
2. Clicca il bottone **Sign In** (in alto a destra)
3. Accedi con il tuo account Google (o creane uno)

### Step 2: Crea una nuova API Key

1. Nel menu a sinistra, clicca **"Get API Key"**
2. Clicca **"Create API key in new project"**
3. Aspetta il caricamento (circa 30 secondi)
4. Verrà mostrata la tua API Key (inizia con `AIza...`)

### Step 3: Copia la Chiave

1. **CLICCA** il bottone **"Copy"** accanto alla chiave
2. **INCOLLA** in un file di testo sicuro (es: `gemini-key.txt`)
3. **NON CONDIVIDERE** questa chiave con nessuno!

### Step 4: Verifica il Limite Gratuito

- **Limite gratuito**: 1.500 richieste al giorno
- **Modello**: `gemini-pro` (quello configurato)
- **Costo**: Completamente gratuito

---

## 💾 Configurazione Supabase

### Step 1: Sign Up Supabase

1. Vai su **https://supabase.com**
2. Clicca **"Start your project"** (verde in alto)
3. Clicca **"Sign up with GitHub"** (usa il tuo account GitHub)
4. Autorizza Supabase

### Step 2: Crea un Nuovo Progetto

1. Clicca **"New Project"** (in alto a sinistra)
2. Compila il modulo:
   - **Name**: `Pertemarket`
   - **Password**: Crea una password sicura (es: `Abc123!@#SecurePassword`)
   - **Region**: Scegli la più vicina (es: `Europe - Ireland`)
3. Clicca **"Create new project"**
4. Aspetta 2-3 minuti il caricamento

### Step 3: Copia le Credenziali

Una volta caricato:

1. Vai a **Settings** → **API** (menu sinistra)
2. Copia questi dati:
   - **Project URL** (es: `https://xxxxx.supabase.co`)
   - **Anon Public** (under "Project API keys")
3. **INCOLLA** in un file di testo sicuro

### Step 4: Crea le Tabelle

1. Vai a **SQL Editor** (menu sinistra)
2. Clicca **"New Query"**
3. **COPIA E INCOLLA** questo SQL:

```sql
-- Tabella Utenti
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  ean13 VARCHAR(13) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Punti
CREATE TABLE points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Transazioni
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_points INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Admin
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. Clicca **"Run"** (tasto blu)
5. Se vedi "Success" → ✅ Perfetto!

---

## 🖥️ Setup Locale

### Step 1: Clona il Repository

Apri il terminale e scrivi:

```bash
git clone https://github.com/pertemarket/pertecard.git
cd pertecard
```

### Step 2: Installa le Dipendenze

```bash
npm install
```

Questo scarica tutte le librerie necessarie (ci vorrà 1-2 minuti).

### Step 3: Crea il File .env

Nella cartella principale del progetto, crea un file chiamato `.env`:

```bash
# Copia il file template
cp .env.example .env
```

Se sei su Windows e il comando non funziona:
1. Apri **Esplora file**
2. Copia il file `.env.example`
3. Rinominalo in `.env`

---

## 🔐 Configurazione File .env

Apri il file `.env` che hai appena creato e **SOSTITUISCI** con i tuoi dati:

```env
# ====== SUPABASE ======
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...

# ====== GOOGLE GEMINI ======
GEMINI_API_KEY=AIza...

# ====== PORT ======
PORT=3000

# ====== NODE ENV ======
NODE_ENV=development
```

### Dove Trovare i Dati?

**SUPABASE_URL**: 
- Vai su Supabase → **Settings** → **API**
- Copia "Project URL"

**SUPABASE_KEY**:
- Stessa pagina → Copia "anon public" sotto "Project API keys"

**GEMINI_API_KEY**:
- Dalla configurazione Google Gemini sopra

### ⚠️ IMPORTANTE

- **NON CONDIVIDERE** il file `.env` con nessuno!
- Il file `.env` è nel `.gitignore` (non sarà caricato su GitHub)
- Mantieni le credenziali al sicuro

---

## ▶️ Avvia l'Applicazione

### Terminal 1: Avvia il Backend

```bash
npm run dev
```

Dovresti vedere:
```
🚀 Server running on port 3000
```

### Terminal 2: Apri il Frontend

In un **nuovo terminale** (non chiudere il primo):

```bash
cd pertecard
npx http-server public -p 8000
```

Dovresti vedere:
```
Starting up http-server, serving public
Available on:
  http://127.0.0.1:8000
```

### Accedi all'App

Apri il browser e vai su:

```
http://localhost:8000
```

✅ Dovresti vedere la pagina di login!

---

## 📱 Test PWA Offline

### Abilita Service Worker

1. Apri **DevTools** (F12)
2. Vai su **Application** (tab in alto)
3. Clicca **Service Workers** (menu sinistra)
4. Dovresti vedere lo SW registrato ✅

### Testa Offline

1. Apri **DevTools** (F12)
2. Vai su **Network** (tab in alto)
3. Spunta **"Offline"** (checkbox in alto a destra)
4. Ricarica la pagina
5. ✅ L'app dovrebbe funzionare comunque!

---

## 🌐 Deploy su GitHub Pages

### Step 1: Attiva GitHub Pages

1. Vai su **https://github.com/pertemarket/pertecard**
2. Clicca **Settings** (tab in alto)
3. Clicca **Pages** (menu sinistra)
4. Sotto "Build and deployment":
   - **Source**: Seleziona "Deploy from a branch"
   - **Branch**: Seleziona "main"
   - **Folder**: Seleziona "/ (root)"
5. Clicca **Save**

### Step 2: Configura Dominio su GitHub

1. Stessa pagina (**Settings → Pages**)
2. Sotto "Custom domain", scrivi: `pertemarket.it`
3. Clicca **Save**
4. Spunta **"Enforce HTTPS"**

---

## 🔗 Configurazione Dominio

### Dove hai Registrato il Dominio?

Devi accedere al tuo **provider DNS** (dove hai comprato il dominio).

**Provider comuni:**
- Namecheap
- GoDaddy
- Register.it
- Aruba
- Altervista

### Aggiungi Record A

1. Accedi al tuo account del provider
2. Vai su **DNS Management** o **DNS Settings**
3. Aggiungi questi **Record A**:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

4. Salva

### (Opzionale) Aggiungi CNAME per www

1. Stessa pagina
2. Aggiungi **Record CNAME**:

```
www → pertemarket.github.io
```

3. Salva

### Aspetta la Propagazione

- Propagazione DNS: **10 minuti - 48 ore**
- Durante l'attesa, puoi fare test su `http://localhost:8000`

### Verifica il Dominio

Dopo 10 minuti, apri il browser e vai su:

```
https://pertemarket.it
```

✅ Dovresti vedere la tua app!

---

## 🧪 Testing e Troubleshooting

### Problema: Service Worker non si registra

**Soluzione:**

1. Apri DevTools (F12)
2. Vai su **Application** → **Storage**
3. Clicca **"Clear site data"**
4. Ricarica la pagina (Ctrl+Shift+R)

### Problema: Colori non cambiano

**Soluzione:**

1. Cache del browser:
```bash
Ctrl+Shift+R  # Windows/Linux
Cmd+Shift+R   # Mac
```

2. Pulisci cache:
   - DevTools → Application → Storage → Clear all

### Problema: API Gemini non funziona

**Controlla:**

1. ✅ API Key è copiata correttamente (senza spazi)
2. ✅ Sei sotto il limite gratuito (1.500 richieste/giorno)
3. ✅ Apri Console (F12 → Console) e guarda errori

**Errore comune**: `403 API not enabled`
- Soluzione: Aspetta 5 minuti dopo aver creato la chiave

### Problema: Supabase non connette

**Controlla:**

1. ✅ URL ha formato: `https://xxxxx.supabase.co`
2. ✅ API Key è lunga almeno 100 caratteri
3. ✅ Progetto Supabase esiste ancora (non è stato cancellato)
4. ✅ Apri Console e guarda errori CORS

---

## ✅ Checklist Finale

Quando hai finito, verifica:

- [ ] Git clonato localmente
- [ ] Node.js e npm installati
- [ ] File `.env` creato e compilato
- [ ] Supabase progetto creato e tabelle create
- [ ] Google Gemini API Key ottenuta
- [ ] Backend avviato (npm run dev)
- [ ] Frontend aperto (http://localhost:8000)
- [ ] Service Worker registrato
- [ ] Login/Registrazione funzionano
- [ ] Admin panel accessibile
- [ ] Offline-first testato
- [ ] GitHub Pages attivato
- [ ] Dominio configurato

---

## 🆘 Hai Problemi?

1. **Leggi la Console** (F12 → Console) per errori
2. **Controlla il README.md** per ulteriori dettagli
3. **Guarda i Log del Server** nel terminale dove hai avviato `npm run dev`
4. **Svuota Cache** del browser
5. **Riavvia il Server** (Ctrl+C e poi `npm run dev` di nuovo)

---

## 🎉 Sei Pronto!

Se hai seguito tutti i step:

✅ **PWA funzionante localmente**  
✅ **Admin Panel accessibile**  
✅ **Workshop IA configurato**  
✅ **Dominio puntato**  

Adesso puoi:

1. **Caricare il logo** nel pannello admin
2. **Customizzare i colori**
3. **Aggiungere clienti**
4. **Usare l'AI per migliorare l'app**

Buon lavoro! 🚀

---

**Hai domande?** Controlla il README.md o apri un Issue su GitHub.
