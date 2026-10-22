# SPEC.md: Time Tracker personale (v1)

App personale per tracciare il tempo, ispirata a Toggl Tracker. Uso esclusivamente privato.
Mobile (APK Android via Capacitor) + sito desktop, stesso codice, dati sincronizzati.

## Stack
- React + Vite + TypeScript + Tailwind (responsive, PWA)
- Capacitor per l'APK Android
- Supabase (Postgres + login) per i dati e la sincronizzazione
- UI progettata dalla prima AI (direzione estetica, design tokens e schermate), approvata dall'utente prima di scrivere il codice; poi nel codice si usano SOLO i design tokens (`design-tokens`), nessun valore inventato

## Schermate v1

### 1. Home (dashboard)
- In alto: selettore modalità (Libero / Pomodoro / Manuale) con il timer attivo
- Sotto: "Attività recente", elenco degli ultimi intervalli dal più recente
  - ogni riga: colore + nome progetto, descrizione (se presente), durata, orario
  - le voci create da Pomodoro hanno un'icona che le distingue
  - tap su una voce: modifica o riavvia
- Opzionale: riepilogo "oggi" con le ore totali
- "Attività recente" sta sotto un divisore con una piccola freccia: un tocco la espande verso l'alto, fino a coprire la parte del timer

### 2. Timer: tre modalità
- **Libero**: start, pausa e stop
- **Pomodoro**: vedi regole sotto
- **Manuale**: inserimento ora di inizio e ora di fine
- Ogni timer richiede un progetto; la descrizione è facoltativa

### 3. Progetti
- Creazione/modifica/archiviazione
- Sotto-progetti (un livello di annidamento: `parent_id`)

### 4. Report
- Vista mensile: grafico a barre con le ore di ogni giorno, impilate per progetto
- Ore totali del mese e ore per progetto

## Regole Pomodoro
- Impostazioni: durata focus, pausa breve, pausa lunga, ogni quanti cicli arriva la pausa lunga, suono a inizio e fine intervallo
- Una sessione = UNA sola voce in `time_entries`
- Contano solo i minuti di focus; le pause non vengono sommate
- Si può fermare in qualsiasi momento: la sessione viene salvata con tutto il focus accumulato fino a quel momento (compreso il focus parziale dell'intervallo in corso)
- Il totale della sessione è `active_seconds`

## Modello dati

**projects**
- `id`, `name`, `color`
- `parent_id` (vuoto = progetto principale)
- `archived` (bool)

**time_entries**
- `id`
- `project_id` (obbligatorio)
- `description` (facoltativa)
- `start_at`
- `end_at` (vuoto = timer in corso)
- `mode` (`free` | `pomodoro` | `manual`)
- `active_seconds` (Pomodoro: secondi di focus; Libero: secondi senza pause, solo se il timer è stato messo in pausa; altrimenti vuoto)

**pomodoro_settings** (una riga)
- `focus_min`, `short_break_min`, `long_break_min`
- `cycles_before_long_break`
- `sound_start`, `sound_end`

## Regola durata (per lista e report)
- se `active_seconds` è presente → `active_seconds` (sempre per Pomodoro)
- altrimenti → `end_at - start_at`

## Fuori dalla v1
Calendario, tariffe orarie, clienti, tag, fatturabile, stime di progetto, promemoria, esportazioni.

## Regole per l'AI
- Segui questo file e `design-tokens`; non inventare funzioni o valori di stile
- Un compito alla volta, commit piccoli
- Se manca un'informazione, chiedi invece di assumere
