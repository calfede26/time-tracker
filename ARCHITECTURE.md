# ARCHITECTURE.md: come funziona l'app (file vivo)

> Ogni AI che modifica il progetto DEVE aggiornare questo file a fine lavoro.
> Descrivi lo stato reale del codice, non quello pianificato. Se una sezione non esiste ancora, lasciala "Non ancora implementato".

Ultimo aggiornamento: (data) da (strumento)

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

## 9. Problemi noti / da fare
- (vuoto)
