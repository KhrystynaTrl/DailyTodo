# DailyTodo — WellnessApp

Applicazione mobile per il benessere personale sviluppata come **progetto didattico** con
**React Native + TypeScript + Expo**, navigazione **file-based** tramite **Expo Router**.
L'app permette di gestire attività giornaliere, appuntamenti, consumo d'acqua, statistiche
settimanali e una frase motivazionale del giorno, con autenticazione simulata e tema
chiaro/scuro.

> Progetto senza backend reale: tutti i dati provengono da **mock locali** e **servizi
> simulati** (con ritardo tramite `setTimeout`), tranne la frase del giorno che usa un'API
> pubblica reale (ZenQuotes). La persistenza avviene su **AsyncStorage**.

---

## Indice

- [Requisiti e versione di Node.js](#requisiti-e-versione-di-nodejs)
- [Installazione e avvio](#installazione-e-avvio)
- [Credenziali di prova](#credenziali-di-prova)
- [Librerie installate](#librerie-installate)
- [Schermate realizzate](#schermate-realizzate)
- [Funzionalità completate](#funzionalità-completate)
- [Funzionalità non completate / possibili estensioni](#funzionalità-non-completate--possibili-estensioni)
- [Scelte grafiche](#scelte-grafiche)
- [Struttura del progetto](#struttura-del-progetto)
- [Screenshot](#screenshot)
- [Repository Git](#repository-git)

---

## Requisiti e versione di Node.js

- **Node.js**: `v24.14.0` (versione usata in sviluppo)
- **npm**: `11.9.0`
- **Expo SDK**: `~54.0.35`
- **React Native**: `0.81.5` — **React**: `19.1.0`

Per provare l'app su dispositivo fisico è consigliata l'app **Expo Go**, oppure un
**emulatore Android** / **simulatore iOS**. È supportata anche l'esecuzione **web**.

---

## Installazione e avvio

```bash
# 1. Installare le dipendenze
npm install

# 2. Avviare il bundler Expo
npm start
# In alternativa, avvio diretto su piattaforma:
npm run android   # emulatore / dispositivo Android
npm run ios       # simulatore iOS (solo macOS)
npm run web       # browser
```

Dopo `npm start`, Expo mostra un **QR code**: scansionandolo con **Expo Go** l'app si apre
sul telefono. In alternativa premere `a` (Android), `i` (iOS) o `w` (web) nel terminale.

Comandi aggiuntivi:

```bash
npm run lint      # analisi statica con ESLint (config Expo)
```

---

## Credenziali di prova

L'autenticazione è **simulata** (nessun backend). Gli utenti di prova sono definiti in
`src/mocks/user.mock.ts`:

| Email                             | Password       |
|-----------------------------------|----------------|
| `k@k.it`                          | `12345678`     |
| `annarossi@prova.it`              | `12345678`     |
| `test@wellness.com`               | `Password1234` |
| `khrystyna.terletska@outlook.it`  | `12345678`     |

È inoltre possibile **registrare** un nuovo utente dalla schermata di registrazione: la
sessione viene salvata su AsyncStorage e ripristinata al riavvio dell'app.

---

## Librerie installate

### Dipendenze principali

| Libreria | Versione | Uso |
|---|---|---|
| `expo` | ~54.0.35 | Framework e toolchain |
| `expo-router` | ~6.0.24 | Navigazione file-based |
| `react` / `react-dom` | 19.1.0 | Libreria UI |
| `react-native` | 0.81.5 | Runtime mobile |
| `react-native-web` | ~0.21.0 | Supporto esecuzione web |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistenza locale |
| `@react-native-community/datetimepicker` | 8.4.4 | Selettore data nativo |
| `@react-navigation/native` / `bottom-tabs` / `elements` | ^7.x | Base navigazione (tab) |
| `@expo/vector-icons` | ^15.0.3 | Icone (Ionicons) |
| `expo-image` | ~3.0.11 | Rendering immagini ottimizzato |
| `expo-image-picker` | ~17.0.11 | Selezione immagine profilo |
| `expo-haptics` | ~15.0.8 | Feedback tattile |
| `react-native-safe-area-context` | ~5.6.0 | Gestione safe area |
| `react-native-screens` | ~4.16.0 | Ottimizzazione schermate native |
| `react-native-gesture-handler` | ~2.28.0 | Gesture |
| `react-native-reanimated` / `react-native-worklets` | ~4.1.1 / 0.5.1 | Animazioni |
| `expo-splash-screen`, `expo-status-bar`, `expo-system-ui`, `expo-constants`, `expo-font`, `expo-linking`, `expo-web-browser`, `expo-symbols` | varie | Utility Expo |

### Dipendenze di sviluppo

| Libreria | Versione | Uso |
|---|---|---|
| `typescript` | ~5.9.2 | Tipizzazione |
| `@types/react` | ~19.1.0 | Tipi React |
| `eslint` | ^9.25.0 | Linting |
| `eslint-config-expo` | ~10.0.0 | Configurazione ESLint Expo |

L'elenco completo e aggiornato è in [`package.json`](package.json).

---

## Schermate realizzate

### Area autenticazione — `src/app/(auth)/`
- **Login** — accesso con email e password, gestione errore credenziali non valide.
- **Registrazione** — creazione nuovo utente con validazione dei campi.
- **Password dimenticata** — form simulato per il recupero password.

### Area protetta — `src/app/(protected)/`

Navigazione principale a **tab** (`(tabs)/`):

- **Home** — panoramica della giornata: prossimo appuntamento, todo di oggi, accesso rapido
  alle sezioni.
- **Attività giornaliere** (`daily-activity`) — elenco attività con filtri, creazione,
  completamento ed eliminazione; lista attività recenti.
- **Appuntamenti** (`appointments`) — elenco appuntamenti e form per crearne di nuovi
  (`new.tsx`).
- **Acqua consumata** (`water-consumed`) — tracciamento dei bicchieri/quantità d'acqua con
  progresso verso l'obiettivo giornaliero.
- **Statistiche settimanali** (`weekly-statistics`) — riepilogo settimanale con grafico a
  barre.

Schermate accessorie (fuori dalle tab):

- **Profilo** (`profile`) — dati utente, modifica profilo, cambio password, immagine profilo.
- **Notifiche** (`notifications`) — elenco notifiche con conteggio non lette e gestione dei
  singoli elementi.
- **Preferenze** (`preferences`) — impostazioni per tema (chiaro/scuro/sistema), notifiche,
  lingua, accesso biometrico e dialog "Informazioni sull'app".
- **Frase del giorno** (`motivation`) — frasi motivazionali da **API reale** (ZenQuotes) con
  gestione di caricamento, timeout ed errori.

---

## Funzionalità completate

- ✅ Autenticazione **simulata** con più utenti di prova e messaggi d'errore.
- ✅ **Registrazione** di nuovi utenti.
- ✅ **Sessione persistente** su AsyncStorage (login mantenuto dopo il riavvio).
- ✅ **Route protette**: redirect a login se non autenticati, gestito nei `_layout.tsx`.
- ✅ **Attività giornaliere**: creazione, completamento, filtri, eliminazione, persistenza.
- ✅ **Appuntamenti**: elenco e creazione con campo data (`DateField`).
- ✅ **Consumo d'acqua**: tracciamento e progresso, persistenza.
- ✅ **Statistiche settimanali** con grafico a barre (`BarChart`).
- ✅ **Notifiche**: elenco, conteggio non lette, gestione elementi, persistenza.
- ✅ **Profilo utente**: modifica dati, cambio password, immagine profilo (image picker).
- ✅ **Preferenze** persistenti (tema salvato su AsyncStorage).
- ✅ **Tema chiaro/scuro/sistema** tramite `ThemeContext`, con palette dedicata.
- ✅ **Frase del giorno** da **API pubblica reale** con timeout ed errori tipizzati.
- ✅ **Toast** applicativi tramite `ToastContext`.
- ✅ Gestione stati **loading / error / empty / success** e componenti UI riutilizzabili.

---

## Funzionalità non completate / possibili estensioni

- ⚠️ **Backend reale assente**: tutti i dati sono mock/locali (scelta didattica). Login,
  appuntamenti, attività, ecc. non sono sincronizzati con un server.
- ⚠️ **Recupero password** solo simulato: nessun invio email effettivo.
- ⚠️ **Accesso biometrico** e **lingua** nelle preferenze sono presenti come impostazioni ma
  non collegati a un comportamento reale del dispositivo.
- ⚠️ **Modifica di un appuntamento esistente**: al momento è disponibile la sola creazione.
- ⚠️ Nessun **test automatico** incluso.
- ⚠️ Nessuna **build APK/IPA** di produzione fornita (no EAS, come da vincoli del progetto).

---

## Scelte grafiche

- **Design system centralizzato** in `src/theme/` (colori, spaziature, raggi, tipografia,
  ombre) — nessun colore hardcoded sparso nel codice, sempre via `useTheme()`.
- **Palette a tema "acqua/benessere"**: colore primario verde-acqua/teal
  (`#0C6C79` chiaro, `#45C0CD` scuro), sfondi tenui e superfici pulite, coerente con il tema
  del benessere personale.
- **Tema chiaro, scuro e "sistema"**: ogni componente supporta entrambe le modalità; il tema
  scelto viene salvato e ripristinato.
- **Navigazione a tab** con icone Ionicons e una tab **Home centrale evidenziata** (pill
  circolare colorata quando attiva).
- **TopBar fissa** sulle schermate principali; i form interni usano un proprio header con
  tasto "indietro".
- **Componenti UI riutilizzabili** (`src/components/ui/`) — bottoni, card, campi, stati
  vuoti/caricamento, barre di progresso, grafico a barre — per un aspetto coerente.
- Attenzione a **safe area**, **tastiera** e **scroll**, con feedback aptico dove utile.

### Token colore (estratto)

| Token | Light | Dark |
|---|---|---|
| `primary` | `#0C6C79` | `#45C0CD` |
| `background` | `#EFF5F6` | `#0F1D20` |
| `surface` | `#FFFFFF` | `#17262A` |
| `text` | `#14262A` | `#E7F2F3` |

---

## Struttura del progetto

```text
src/
├── app/                      # Route (Expo Router, file-based)
│   ├── (auth)/               # Login, registrazione, recupero password
│   ├── (protected)/          # Area autenticata
│   │   ├── (tabs)/           # Home, attività, appuntamenti, acqua, statistiche
│   │   ├── motivation.tsx    # Frase del giorno (API reale)
│   │   ├── notifications.tsx
│   │   ├── preferences.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx           # Provider (Auth, Theme, Toast)
│   └── index.tsx
├── components/               # Componenti riutilizzabili (ui, auth, activity, ...)
├── context/                  # AuthContext, ThemeContext, ToastContext
├── services/                 # Servizi simulati + API motivation
├── storage/                  # Wrapper AsyncStorage (sessione, attività, acqua, ...)
├── mocks/                    # Dati di prova (utenti)
├── theme/                    # Design system (colori, spacing, tipografia, ...)
└── hooks/ · utils/           # Hook e utility (es. formattazione date)
```

Le regole di sviluppo dettagliate sono documentate in [`.claude-context/`](.claude-context/).

### Persistenza locale (AsyncStorage)

Vengono salvati: **sessione utente**, **preferenza tema**, **attività**, **consumo d'acqua**,
**notifiche** e **preferenze**. I relativi wrapper sono in `src/storage/`.

---

## Screenshot

Inserire qui almeno **cinque** screenshot dell'applicazione (es. cartella `docs/screenshots/`):

| Schermata | Immagine |
|---|---|
| Login | `docs/screenshots/01-login.png` |
| Home | `docs/screenshots/02-home.png` |
| Attività giornaliere | `docs/screenshots/03-daily-activity.png` |
| Acqua consumata | `docs/screenshots/04-water.png` |
| Statistiche settimanali | `docs/screenshots/05-weekly-statistics.png` |

> Suggerimento: catturare gli screenshot sia in **tema chiaro** che **scuro** per mostrare il
> design system. Esempio di inserimento immagine in Markdown:
> `![Home](docs/screenshots/02-home.png)`

---

## Repository Git

Il progetto è versionato con Git e presenta una cronologia di commit incrementali, coerente
con lo sviluppo per feature. Estratto:

```text
feat: implement TopBar component and update layout for tab screens
feat: update app icons and colors, implement toast notifications
feat: add motivation feature with quotes fetching, error handling, and UI components
feat: implement preferences screen with settings for notifications, theme, language, biometric
feat: implement notifications feature with unread count, notification list, item management
feat: implement water tracking feature with storage, state management, and UI components
feat: add profile management features (profile form, change password modal, appointment card)
feat: implement tab navigation and activity management features
feat: implement DailyActivity component with activity management features
feat: restructure app components and implement authentication context
Initial commit
```

Cronologia completa: `git log --oneline`.
