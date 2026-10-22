/**
 * Utilità di formattazione temporale per il display del timer.
 * Rispetta la decisione registrata in ARCHITECTURE.md (§8):
 * - Sotto 1 ora: mostra minuti:secondi (mm:ss).
 * - Da 1 ora in poi: mostra ore:minuti (hh:mm).
 * - Mai tutti e tre i numeri contemporaneamente.
 *
 * Collegamento: utilizzato dal componente RingTimer e dalla schermata Home.
 */

/**
 * Formatta un numero di secondi per la visualizzazione all'interno dell'anello del timer.
 * @param totalSeconds Secondi totali trascorsi o rimanenti (non negativi)
 * @returns Stringa formattata "mm:ss" (se < 3600) oppure "hh:mm" (se >= 3600)
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  if (safeSeconds < 3600) {
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const hours = Math.floor(safeSeconds / 3600);
  const remainingMinutes = Math.floor((safeSeconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

/**
 * Formatta una durata totale in secondi nel formato "h:mm" utilizzato nell'elenco
 * dell'attività recente e nei riepiloghi (es. 4320s -> "1:12", 3000s -> "0:50").
 * @param totalSeconds Secondi totali calcolati da calculateEntryDuration
 * @returns Stringa formattata "h:mm"
 */
export function formatDurationHoursMinutes(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}
