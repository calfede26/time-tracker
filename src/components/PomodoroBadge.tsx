/**
 * Icona distintiva stilizzata del Pomodoro (pomodorino con foglioline).
 * Utilizzata nelle voci di elenco per identificare gli intervalli generati da sessioni Pomodoro.
 * Replicata fedelmente da design/01-home.png.
 *
 * Colori da design-tokens.json:
 * - Corpo: mode.pomodoro (#F4A98B)
 * - Foglioline: mode.free (#7DD3C0)
 *
 * Collegamento: utilizzato in RecentActivityList per evidenziare le voci Pomodoro.
 */

export function PomodoroBadge() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Sessione Pomodoro"
      className="inline-block shrink-0"
    >
      <title>Sessione Pomodoro</title>
      {/* Corpo del pomodoro: ellisse pastello pesca */}
      <circle cx="8" cy="10" r="5.5" fill="var(--color-mode-pomodoro)" />

      {/* Foglioline / picciolo verde menta in cima */}
      <path
        d="M8 2V4.5M5.5 3.5L7.5 4.8M10.5 3.5L8.5 4.8"
        stroke="var(--color-mode-free)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
