/**
 * Timer circolare ad anello con display orario interno e tasti pausa/stop a fianco.
 * Replicato fedelmente dalla schermata Home approvata in design/01-home.png.
 *
 * Specifiche visive (design-tokens.json e ARCHITECTURE.md §8):
 * - Diametro anello: size.ringTimer (220px).
 * - Spessore tratto: size.ringStroke (12px).
 * - Tasto pausa: size.pauseButton (56px), cerchio con sfondo surface (#1C1C1E) e barre ambra (#F2D184).
 * - Tasto stop: size.stopButton (64px), cerchio con sfondo della modalità (#7DD3C0) e quadrato onAccent (#131314).
 * - Tasto play (a riposo): cerchio 64px con sfondo della modalità (#7DD3C0) e icona play onAccent.
 * - Display interno: cifre in formato mm:ss o hh:mm (Inter bold) + riga con pallino e nome progetto.
 *
 * Collegamento: utilizzato dalla schermata Home (HomePage).
 */

import { formatTimerDisplay } from '@/utils/formatTime';

export type TimerStatus = 'idle' | 'running' | 'paused';

interface RingTimerProps {
  /** Secondi correnti da visualizzare */
  seconds: number;
  /** Stato attuale del timer */
  status: TimerStatus;
  /** Nome del progetto associato al timer */
  projectName: string;
  /** Colore esadecimale del progetto (da projectPalette) */
  projectColor: string;
  /** Callback invocata alla pressione di Play */
  onStart: () => void;
  /** Callback invocata alla pressione di Pausa */
  onPause: () => void;
  /** Callback invocata alla pressione di Riprendi (dopo pausa) */
  onResume: () => void;
  /** Callback invocata alla pressione di Stop */
  onStop: () => void;
}

export function RingTimer({
  seconds,
  status,
  projectName,
  projectColor,
  onStart,
  onPause,
  onResume,
  onStop,
}: RingTimerProps) {
  // Parametri geometrici SVG conformi ai design tokens
  const size = 220; // size.ringTimer
  const stroke = 12; // size.ringStroke
  const radius = (size - stroke) / 2; // 104px
  const circumference = 2 * Math.PI * radius; // ~653.45px

  /*
   * Nel timer libero, l'anello visualizza l'avanzamento ciclico del minuto corrente (0..60s)
   * oppure resta pieno. Nello screenshot di design/01-home.png (a 01:24 = 84s, 24s sul minuto)
   * l'arco verde copre circa il 40% del cerchio.
   */
  const progressRatio = (seconds % 60) / 60;
  const strokeDashoffset = circumference * (1 - (status === 'idle' ? 0 : Math.max(0.05, progressRatio)));

  // Colore del tratto attivo: menta in corsa, ambra in pausa
  const strokeColor =
    status === 'paused' ? 'var(--color-state-paused)' : 'var(--color-mode-free)';

  return (
    <div className="flex items-center justify-center gap-6 w-full select-none">
      {/*
        Colonna comandi a sinistra dell'anello:
        Ospita i tasti Pausa e Stop posizionati verticalmente come in design/01-home.png.
      */}
      <div className="flex flex-col items-center justify-center gap-4 w-[var(--size-stop-button)]">
        {status === 'idle' && (
          /* Tasto Play per avviare il timer */
          <button
            type="button"
            onClick={onStart}
            aria-label="Avvia timer"
            title="Avvia timer"
            className="w-[var(--size-stop-button)] h-[var(--size-stop-button)] rounded-full bg-mode-free flex items-center justify-center text-on-accent transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-none"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1"
              aria-hidden="true"
            >
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </button>
        )}

        {(status === 'running' || status === 'paused') && (
          <>
            {/* Tasto Pausa / Riprendi (in alto a sinistra dell'anello) */}
            <button
              type="button"
              onClick={status === 'running' ? onPause : onResume}
              aria-label={status === 'running' ? 'Pausa' : 'Riprendi'}
              title={status === 'running' ? 'Pausa' : 'Riprendi'}
              className="w-[var(--size-pause-button)] h-[var(--size-pause-button)] rounded-full bg-surface flex items-center justify-center text-state-paused transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {status === 'running' ? (
                /* Icona due barre verticali di pausa con angoli arrotondati */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="3.5" height="16" rx="1.75" />
                  <rect x="14.5" y="4" width="3.5" height="16" rx="1.75" />
                </svg>
              ) : (
                /* Icona riprendi (play) ambra */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5" aria-hidden="true">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              )}
            </button>

            {/* Tasto Stop (in basso a sinistra dell'anello) */}
            <button
              type="button"
              onClick={onStop}
              aria-label="Ferma e salva"
              title="Ferma e salva"
              className="w-[var(--size-stop-button)] h-[var(--size-stop-button)] rounded-full bg-mode-free flex items-center justify-center text-on-accent transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Icona quadrato di stop con vertici arrotondati */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="3" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/*
        Anello circolare con display orario:
        Diametro size.ringTimer (220px), spessore size.ringStroke (12px).
      */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Tratto di sfondo neutro circolare */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-surface-raised)"
            strokeWidth={stroke}
          />
          {/* Tratto attivo con raccordi arrotondati */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        {/* Display interno all'anello */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* Orario in cifre grandi Inter bold */}
          <span className="text-5xl font-bold tracking-tight text-text leading-none">
            {formatTimerDisplay(seconds)}
          </span>

          {/* Riga progetto: pallino colorato + nome del progetto */}
          <div className="flex items-center justify-center gap-2 mt-3 max-w-[160px] truncate">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: projectColor }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-text-muted truncate">
              {projectName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
