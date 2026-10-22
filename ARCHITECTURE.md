# ARCHITECTURE.md: come funziona l'app (file vivo)

> Ogni AI che modifica il progetto DEVE aggiornare questo file a fine lavoro.
> Descrivi lo stato reale del codice, non quello pianificato. Se una sezione non esiste ancora, lasciala "Non ancora implementato".

Ultimo aggiornamento: 2026-10-21 da Claude (chat). Nessun codice ancora: solo fase di design completata.

## 1. Struttura delle cartelle
Non ancora implementato.

## 2. Moduli principali
Per ogni modulo: cosa fa, da chi viene usato, cosa usa.

| Modulo | Cosa fa | Usa | Usato da |
|---|---|---|---|
| (esempio) `timerService` | Avvia/ferma i timer e crea le voci | livello dati | Home, Timer |

## 3. Flusso dei dati
Come un'azione dell'utente arriva al database e torna all'interfaccia.
Non ancora implementato.

## 4. Schermate e collegamenti
Per ogni schermata: da dove si raggiunge, quali dati mostra, quali azioni può fare.
- Home: non ancora implementato
- Timer (libero, pomodoro, manuale): non ancora implementato
- Progetti: non ancora implementato
- Report: non ancora implementato

## 5. Logica del Pomodoro
Come funziona la macchina a stati (focus, pausa breve, pausa lunga), come si calcola `active_seconds`, cosa succede allo stop.
Non ancora implementato.

## 6. Calcolo di durate e report
Dove si trova la funzione condivisa per le durate e come la usano lista recente e report.
Non ancora implementato.

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

## 9. Problemi noti / da fare
- (vuoto)
