/**
 * Funzione condivisa per il calcolo della durata delle voci temporali.
 * Fonte di verità unica per il calcolo delle durate (SPEC.md e AGENTS.md).
 *
 * Collegamento: usato da lista attività recente (Home), dettagli voce e report mensile.
 */

import type { TimeEntry } from './types';

/**
 * Calcola la durata effettiva in secondi di una voce temporale.
 *
 * Regola SPEC.md:
 * - Se `active_seconds` è definito (non null e non undefined), viene restituito direttamente.
 *   Questo accade sempre per le sessioni Pomodoro (conteggio del solo focus escluse pause)
 *   e per il timer Libero se ci sono state pause.
 * - Altrimenti, viene calcolata la differenza tra `end_at` e `start_at` (in secondi interi).
 * - Se la voce non ha ancora un `end_at` (timer in corso), `now` permette di calcolare
 *   la durata provvisoria trascorsa. Se omesso, viene utilizzato l'istante attuale.
 *
 * @param entry La voce di cui calcolare la durata
 * @param now Timestamp ISO 8601 di riferimento per i timer in corso (opzionale)
 * @returns Durata in secondi interi (non negativa)
 */
export function calculateEntryDuration(entry: TimeEntry, now?: string): number {
  if (entry.active_seconds !== null && entry.active_seconds !== undefined) {
    return Math.max(0, Math.floor(entry.active_seconds));
  }

  const startTime = new Date(entry.start_at).getTime();
  const endTimeStr = entry.end_at ?? now ?? new Date().toISOString();
  const endTime = new Date(endTimeStr).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return 0;
  }

  const durationMs = endTime - startTime;
  return Math.max(0, Math.floor(durationMs / 1000));
}
