# ARCHITECTURE.md: come funziona l'app (file vivo)

> Ogni AI che modifica il progetto DEVE aggiornare questo file a fine lavoro.
> Descrivi lo stato reale del codice, non quello pianificato. Se una sezione non esiste ancora, lasciala "Non ancora implementato".

Ultimo aggiornamento: 2026-10-22 da Antigravity. Implementata la Zona Timer della schermata Home in modalità Libero (ModeSelector a pillola, RingTimer circolare da 220px con display mm:ss/hh:mm, tasti pausa/stop a sinistra e divisore con freccia), fedele a design/01-home.png.

## 1. Struttura delle cartelle

```
time-tracker/
├── AGENTS.md                  # Regole per tutte le AI
├── SPEC.md                    # Specifiche funzionali (fonte di verità)
├── ARCHITECTURE.md            # Questo file (stato reale del codice)
├── CHANGELOG.md               # Registro delle sessioni
├── design/                    # Schermate approvate di riferimento
├── design-tokens.json         # Unici valori di stile consentiti (bloccati)
├── package.json               # Dipendenze e script npm
├── tsconfig.json              # Configurazione TypeScript (strict attivo)
├── vite.config.ts             # Configurazione Vite (React + Tailwind + alias @/)
├── index.html                 # Entry point HTML (viewport-fit=cover)
├── scripts/
│   └── generate-theme.js      # Genera src/theme.generated.css da design-tokens.json
└── src/
    ├── main.tsx               # Punto di ingresso React (monta App nel DOM)
    ├── App.tsx                # App shell: stato scheda attiva e layout viewport
    ├── index.css              # Stili globali: importa Tailwind, tema e font Inter
    ├── theme.generated.css    # ⚙ Generato automaticamente, non versionato (.gitignore)
    ├── vite-env.d.ts          # Dichiarazioni di tipo per Vite
    ├── components/            # Componenti UI riutilizzabili
    │   ├── BottomNav.tsx      # Barra inferiore a 3 icone (Home, Progetti, Report)
    │   ├── ModeSelector.tsx   # Selettore a pillola delle 3 modalità (Libero, Pomodoro, Manuale)
    │   └── RingTimer.tsx      # Timer circolare da 220px con comandi pausa/stop a sinistra
    ├── data/                  # Livello dati: tipi, durate, accesso DB (separato dalla UI)
    │   ├── types.ts           # Tipi di dominio (Project, TimeEntry, PomodoroSettings, TimerMode)
    │   ├── duration.ts        # Funzione unica per il calcolo delle durate (calculateEntryDuration)
    │   └── index.ts           # Barrel export del modulo dati
    ├── pages/                 # Schermate principali
    │   └── HomePage.tsx       # Schermata Home: zona timer (404px) e divisore espandibile
    └── utils/                 # Utilità condivise
        └── formatTime.ts      # Formattazione display orario timer (mm:ss / hh:mm)
```

### Convenzioni
- **`components/`**: componenti UI usati in più schermate (bottoni, card, timer, navbar). Un file per componente.
- **`data/`**: tutta la logica di accesso ai dati, separata dall'interfaccia (regola AGENTS.md). Nessun componente UI accede direttamente al database.
- **`pages/`**: ogni schermata ha una sotto-cartella (es. `pages/home/`). Componenti usati solo in una schermata stanno nella sua sotto-cartella.
- **`utils/`**: funzioni pure e costanti condivise (es. calcolo durata, formattazione orari).
- **`theme.generated.css`**: file generato dallo script `scripts/generate-theme.js`, NON versionato. Viene rigenerato automaticamente prima di `dev` e `build`.

### Flusso dei design tokens
`design-tokens.json` → `scripts/generate-theme.js` → `src/theme.generated.css` (blocco `@theme` Tailwind v4) → classi Tailwind usabili in tutta l'app.

I valori predefiniti di Tailwind vengono **sostituiti** (non estesi) dal blocco `@theme`, quindi non si possono usare colori, spaziature, raggi o ombre inventati. L'unica famiglia di font disponibile è Inter.

## 2. Moduli principali
Per ogni modulo: cosa fa, da chi viene usato, cosa usa.

| Modulo | Cosa fa | Usa | Usato da |
|---|---|---|---|
| `scripts/generate-theme.js` | Legge `design-tokens.json` e genera il CSS del tema Tailwind | `design-tokens.json` | npm scripts (`dev`, `build`) |
| `src/main.tsx` | Monta il componente radice React nel DOM | `App.tsx`, `index.css` | `index.html` |
| `src/App.tsx` | App shell: gestisce lo stato della pagina attiva ('home', 'projects', 'reports') e il layout | `BottomNav`, `HomePage` | `main.tsx` |
| `src/index.css` | Importa Tailwind, tema generato e font Inter | `theme.generated.css`, `@fontsource/inter` | `main.tsx` |
| `src/components/BottomNav.tsx` | Barra di navigazione a 3 icone inline (Home, Progetti, Report) fedele a `design/` | `design-tokens.json` (classi Tailwind) | `App.tsx` |
| `src/components/ModeSelector.tsx` | Selettore pillola a 3 modalità (Libero, Pomodoro, Manuale) | `design-tokens.json` (classi Tailwind) | `HomePage` |
| `src/components/RingTimer.tsx` | Timer circolare da 220px con comandi pausa/stop a sinistra e display interno | `formatTime.ts`, `design-tokens.json` | `HomePage` |
| `src/pages/HomePage.tsx` | Schermata Home: ospita la timerZone (404px), divisore con freccia e attività | `ModeSelector`, `RingTimer` | `App.tsx` |
| `src/data/types.ts` | Definizioni di tipo TypeScript per il modello dati (strict) | — | `duration.ts`, componenti UI |
| `src/data/duration.ts` | Calcolo unificato durata voci (`calculateEntryDuration`) | `types.ts` | Lista recente (Home), Report |
| `src/utils/formatTime.ts` | Formattazione display orario timer (mm:ss se < 1h, hh:mm se >= 1h) | — | `RingTimer` |

## 3. Flusso dei dati
Come un'azione dell'utente arriva al database e torna all'interfaccia.
Non ancora implementato.

## 4. Schermate e collegamenti
Per ogni schermata: da dove si raggiunge, quali dati mostra, quali azioni può fare.
- Stato globale delle schermate gestito in `src/App.tsx` via `useState<PageId>('home')`.
- Al click sulle icone della `BottomNav` l'interfaccia aggiorna la vista attiva:
  - **Home**: attiva con prima icona (casetta outline). Mostra la `HomePage` con la zona superiore del timer (`timerZone: 404px`) in modalità Libero con timer attivo, controlli pausa/stop e divisore con freccia verso l'alto (`^`).
  - **Progetti**: attiva con seconda icona (cartella outline). Mostra lo spazio vuoto con il nome "Progetti" (contenuto schermata non ancora implementato).
  - **Report**: attiva con terza icona (grafico a tre barre outline). Mostra lo spazio vuoto con il nome "Report" (contenuto schermata non ancora implementato).

## 5. Logica del Pomodoro
Come funziona la macchina a stati (focus, pausa breve, pausa lunga), come si calcola `active_seconds`, cosa succede allo stop.
Non ancora implementato.

## 6. Calcolo di durate e report
Dove si trova la funzione condivisa per le durate e come la usano lista recente e report.
- Funzione unica: `calculateEntryDuration(entry: TimeEntry, now?: string): number` in `src/data/duration.ts`.
- Logica:
  - Se `entry.active_seconds` è definito (non null/undefined), restituisce `active_seconds` (inclusivo di focus parziale in Pomodoro o tempo effettivo netto nel Libero).
  - Altrimenti calcola la differenza in secondi tra `end_at` e `start_at` (o rispetto a `now`/istante corrente se il timer è attivo).
  - Restituisce sempre un numero intero di secondi non negativo (`Math.max(0, ...)`).
- Tutte le schermate (lista recente in Home e aggregazioni in Report) devono importare e usare esclusivamente questa funzione, senza calcolare durate localmente.

## 7. Sincronizzazione e login
Come funzionano Supabase, il login e la sincronizzazione tra telefono e PC.
Non ancora implementato.

## 8. Decisioni importanti e perché
Registra qui le scelte non ovvie, così le altre AI non le annullano.
- Una sessione Pomodoro = una sola voce, conta solo il focus.
- Design approvato (direzione "Slate", solo scuro, Inter, pastello): niente titoli di pagina, navigazione in basso con sole icone (Home, Progetti, Report), timer solo ad anello con tasti pausa e stop a fianco.
- Nell'anello: sotto 1 ora si mostrano minuti:secondi, da 1 ora in poi ore:minuti, mai tutti e tre i numeri.
- I colori delle modalità (libero menta, pomodoro pesca, manuale lilla) e degli stati (pausa ambra, errore rosso) sono riservati: i progetti usano solo `projectPalette`.
- Nelle tre schermate timer cambia solo la parte alta (altezza fissa `timerZone`); "Attività recente" resta sempre nella stessa posizione sotto il divisore espandibile.
- Simboli del ciclo Pomodoro: cerchio = focus, quadrato = pausa breve, stella = pausa lunga.
- Progetti: linee ad albero per mostrare i sotto-progetti. Report: barre per giorno impilate per progetto (nessun calendario).
- **Tema Tailwind generato da script**: i valori di `design-tokens.json` vengono trasformati in un blocco `@theme` di Tailwind v4 dallo script `scripts/generate-theme.js`. Il file generato (`src/theme.generated.css`) non è versionato; viene rigenerato prima di ogni `dev` e `build`. Questo garantisce che `design-tokens.json` resti l'unica fonte di verità, senza duplicazione manuale.
- **Spaziature indicizzate**: le spaziature del token `space` (array) diventano `--spacing-0` a `--spacing-12` (indice, non valore), perché Tailwind v4 usa indici per le classi `p-*`, `m-*`, ecc. Mappa: `p-0` = 2px, `p-1` = 3px, `p-2` = 4px, `p-3` = 6px, `p-4` = 8px, `p-5` = 10px, `p-6` = 12px, `p-7` = 14px, `p-8` = 16px, `p-9` = 18px, `p-10` = 20px, `p-11` = 24px, `p-12` = 32px.
- **Dimensioni componenti come custom properties**: i valori `size` dei token (touchMin, navBar, ringTimer, ecc.) sono esposti come `--size-*` nel tema ma NON come classi dirette di spaziatura. Si usano con valori arbitrari di Tailwind: `w-[var(--size-ring-timer)]`.
- **BottomNav fedele alle schermate design/**: replicata con 3 icone SVG inline con contorno lineare morbido e angoli arrotondati, altezza barra `size.navBar` (48px) più `env(safe-area-inset-bottom, 0px)`, touch target minimo `size.touchMin` (44px) per ogni icona, colore attivo `text` e inattivo `textMuted`. Nessuna scritta o bordo marcato.
- **Zona Timer Home fedele a design/01-home.png**:
  - Altezza fissa: `size.timerZone` (404px).
  - In alto: `ModeSelector` a capsula (`size.button`: 52px), con segmento attivo pieno e colorato in base alla modalità, testo `onAccent`, e segmenti inattivi con testo `textMuted`.
  - Timer: anello SVG di 220px (`size.ringTimer`), tratto 12px (`size.ringStroke`), raggio 104px, display interno con cifre `mm:ss` / `hh:mm` e riga con pallino colorato del progetto.
  - Comandi a sinistra: colonna con tasto Pausa (`size.pauseButton`: 56px) con barre ambra (`state.paused`) e tasto Stop (`size.stopButton`: 64px) con quadrato nero (`onAccent`) su fondo color menta (`mode.free`).
  - Divisore sottile con freccia centrale verso l'alto (`^`) a delimitazione della zona timer prima dell'attività recente.

## 9. Problemi noti / da fare
- (vuoto)
