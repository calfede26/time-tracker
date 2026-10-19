# AGENTS.md: regole per tutte le AI (Claude, Codex, Antigravity)

Leggi questo file PRIMA di fare qualsiasi cosa. Poi leggi `SPEC.md` e `ARCHITECTURE.md`.

## File del progetto
- `SPEC.md`: cosa deve fare l'app. Fonte di verità sulle funzioni e sul modello dati. Non si cambia senza richiesta esplicita dell'utente.
- `ARCHITECTURE.md`: come funziona l'app oggi. Va aggiornato ad ogni modifica (vedi sotto).
- `design-tokens`: unici valori di colori, font, spaziature, raggi, ombre consentiti. Li crea la prima AI nella fase di design; dopo l'approvazione dell'utente sono bloccati e si modificano solo su richiesta esplicita.
- `CHANGELOG.md`: registro breve di cosa ha fatto ogni sessione.

## Flusso di lavoro (obbligatorio)
1. Leggi `AGENTS.md`, `SPEC.md`, `ARCHITECTURE.md` e le ultime righe di `CHANGELOG.md`.
2. Fai SOLO il compito richiesto. Niente funzioni extra, niente refactor non richiesti.
3. Se manca un'informazione o c'è un dubbio, chiedi all'utente invece di assumere.
4. A fine lavoro aggiorna `ARCHITECTURE.md` e aggiungi una riga a `CHANGELOG.md` (data, strumento usato, cosa è stato fatto).
5. Commit piccoli, con messaggi chiari.

## Regola desktop + mobile (obbligatoria per OGNI modifica)
Il sito desktop è l'ambiente principale di sviluppo; il mobile deriva da quello.
1. Sviluppa e verifica prima la modifica nella vista **desktop**, riferimento: browser **Firefox**.
2. Poi apri la vista **mobile**, riferimento: **Samsung Galaxy S24**, viewport 360x780 (pixel CSS, verticale). Controlla se la modifica va adattata: layout, dimensioni dei tocchi, testo non tagliato, niente scroll orizzontale.
3. Se serve, adatta il mobile nella stessa modifica. Se non serve, dichiaralo.
4. Non considerare finita una modifica finché non è verificata su entrambe le viste.
5. Nel riepilogo finale scrivi: "Desktop: verificato. Mobile: verificato / adattato / non necessario (motivo)".
6. Se non riesci a verificare una delle due viste, dillo esplicitamente invece di assumere che vada bene.

## Aree di sistema del telefono (mobile)
- Il contenuto non deve mai finire sotto la barra di stato in alto (icone, notifiche, batteria) né sotto la barra di navigazione/gesti in basso.
- Nell'HTML usa `viewport-fit=cover` e lascia spazio con `env(safe-area-inset-top)` in alto e `env(safe-area-inset-bottom)` in basso. Questi margini si applicano all'intera app (header, barre di navigazione, schermate a tutto schermo), non componente per componente.
- Nel browser desktop questi valori sono 0: l'AI non può verificarli lì. Deve scriverlo nel riepilogo, e il controllo reale si fa sul telefono (APK Capacitor).
- Non inserire valori fissi in pixel per l'altezza della barra di stato.

## Regole estetiche

### Direzione estetica (indicata dall'utente)
- Stile: app moderna e abbastanza minimalista (molto spazio libero, pochi bordi, pochi elementi per schermata).
- Colori: palette ricca, non monocromatica. I colori servono a rendere riconoscibile ogni funzione ed elemento a colpo d'occhio.
- I colori hanno un significato fisso e coerente in tutta l'app: ogni modalità del timer (libero, pomodoro, manuale) ha il suo colore, ogni stato (timer attivo, pausa, errore) il suo, e ogni progetto usa il colore scelto dall'utente. Lo stesso elemento ha sempre lo stesso colore in ogni schermata.
- Il minimalismo viene dalla struttura (spazio, gerarchia), non dalla rinuncia al colore: pochi elementi, ma ben distinguibili.
- Tema: SOLO scuro, su mobile e su desktop. Nessun tema chiaro e nessun cambio automatico. I colori dei tokens sono pensati per sfondo scuro (contrasto testo/sfondo leggibile).
- Font: **Inter** per tutta l'app, in tutti i pesi necessari. Non usare altri font. Inter va incluso nel progetto (self-hosted, es. pacchetto `@fontsource/inter`), non caricato da internet, così funziona anche offline nell'APK. Questa è l'unica libreria extra già approvata per il font.
- L'utente non sa descrivere lo stile nei dettagli: l'AI deve proporre opzioni concrete e farle scegliere, non chiedere descrizioni.
- Usa SOLO i valori in `design-tokens`. Vietato inventare colori, font, spaziature, raggi o ombre.
- Niente valori "a occhio" (es. `padding: 13px`). Se serve un valore che non esiste, chiedi all'utente.
- Fase di design (prima di scrivere codice dell'app): l'AI propone la direzione estetica (2-3 opzioni a confronto), l'utente ne sceglie una, poi l'AI scrive `design-tokens` e le schermate principali. Nessuna schermata si implementa prima dell'approvazione dell'utente.
- Dopo l'approvazione, rispetta fedelmente le schermate e i tokens approvati. Se qualcosa è in conflitto, fermati e chiedi.
- Cura estetica: allineamenti precisi, spaziature coerenti, gerarchia tipografica chiara, nessun elemento decorativo casuale.
- Componenti riutilizzabili: se un elemento compare in più schermate, crea un componente unico.
- Stati da prevedere sempre: vuoto, caricamento, errore.
- Layout responsive: stesso codice per mobile e desktop.

## Regole di logica
- La durata di una voce si calcola come da `SPEC.md` (Pomodoro: `active_seconds`; altrimenti `end_at - start_at`). Una sola funzione condivisa per questo calcolo, mai duplicata.
- I report derivano sempre da `time_entries`; non salvare totali già calcolati.
- Un solo timer attivo alla volta.
- Tutta la logica di accesso ai dati sta in un solo livello dedicato, non sparsa nei componenti UI.
- TypeScript rigoroso: niente `any`.
- Niente nuove librerie senza chiedere all'utente.

## Regole sui commenti nel codice
- Ogni file inizia con un commento breve: cosa fa e con quali altri file/sezioni si collega.
- Ogni sezione, componente e funzione non banale ha un commento che spiega cosa fa e perché.
- Commenta il "perché", non ripetere il "cosa" riga per riga.
- Quando modifichi una sezione, aggiorna il suo commento.
- Commenti in italiano.

## Regole di sicurezza
- Mai scrivere chiavi o password nel codice: si usano variabili d'ambiente (`.env`, già escluso da Git).
- Non cancellare dati dell'utente senza chiedere.
