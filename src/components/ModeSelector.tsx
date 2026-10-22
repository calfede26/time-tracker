/**
 * Selettore delle tre modalità del timer: Libero, Pomodoro, Manuale.
 * Fedele alle schermate approvate in design/ (01-home.png, 02-pomodoro.png, 03-manuale.png).
 *
 * Specifiche visive:
 * - Contenitore a capsula con sfondo surface (#1C1C1E) e raggio rounded-full.
 * - Modalità attiva: sfondo pieno con il colore riservato del token (free: #7DD3C0,
 *   pomodoro: #F4A98B, manual: #A9B8F5), testo con colore onAccent (#131314).
 * - Modalità inattive: testo con colore textMuted (#9A9AA3).
 * - Altezza complessiva: token size.button (52px).
 *
 * Collegamento: posizionato nella parte alta della HomePage (dentro la timerZone).
 */

import type { TimerMode } from '@/data/types';

interface ModeSelectorProps {
  /** Modalità attualmente selezionata */
  currentMode: TimerMode;
  /** Callback invocata quando l'utente seleziona una modalità */
  onSelectMode: (mode: TimerMode) => void;
  /** Disabilita il cambio modalità quando il timer è in corso */
  disabled?: boolean;
}

interface ModeOption {
  id: TimerMode;
  label: string;
  activeBgClass: string;
}

const MODES: ModeOption[] = [
  { id: 'free', label: 'Libero', activeBgClass: 'bg-mode-free' },
  { id: 'pomodoro', label: 'Pomodoro', activeBgClass: 'bg-mode-pomodoro' },
  { id: 'manual', label: 'Manuale', activeBgClass: 'bg-mode-manual' },
];

export function ModeSelector({
  currentMode,
  onSelectMode,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Modalità timer"
      className="inline-flex items-center p-1 bg-surface rounded-full h-[var(--size-button)] max-w-full"
    >
      {MODES.map((mode) => {
        const isSelected = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled && !isSelected}
            onClick={() => onSelectMode(mode.id)}
            /*
             * Raggio rounded-full, altezza piena del contenitore, testo Inter medium (500),
             * colore dinamico sul segmento attivo e textMuted su quelli inattivi.
             */
            className={`px-5 py-2.5 rounded-full text-base font-medium transition-colors cursor-pointer select-none min-h-[var(--size-touch-min)] flex items-center justify-center ${
              isSelected
                ? `${mode.activeBgClass} text-on-accent font-semibold`
                : 'text-text-muted hover:text-text'
            } ${disabled && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
