/**
 * Componente per la lista dell'Attività Recente.
 * Replicata fedelmente da design/01-home.png.
 *
 * Specifiche:
 * - Ogni riga mostra:
 *   - Pallino colore progetto (da projectPalette)
 *   - Nome progetto (font Inter medium) e descrizione facoltativa (font Inter regular, textMuted)
 *   - Icona Pomodoro se la sessione è stata creata in modalità Pomodoro
 *   - Durata calcolata unicamente tramite calculateEntryDuration(entry) (regola obbligatoria AGENTS.md)
 *   - Orario d'inizio / giorno a destra (font Inter regular, textMuted)
 * - Supporta il tocco per interagire con la voce.
 *
 * Collegamento: utilizzato da HomePage per popolare la sezione inferiore.
 */

import type { TimeEntry, Project } from '@/data/types';
import { calculateEntryDuration } from '@/data/duration';
import { formatDurationHoursMinutes } from '@/utils/formatTime';
import { PomodoroBadge } from './PomodoroBadge';

export interface EnrichedTimeEntry {
  entry: TimeEntry;
  project: Project;
  /** Etichetta leggibile dell'orario o giorno (es. "09:30", "Ieri") */
  timeLabel: string;
}

interface RecentActivityListProps {
  /** Elenco delle voci con relativi progetti associati */
  items: EnrichedTimeEntry[];
  /** Callback opzionale al tocco di una voce (per riavvio o modifica) */
  onItemClick?: (item: EnrichedTimeEntry) => void;
}

export function RecentActivityList({ items, onItemClick }: RecentActivityListProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-sm font-regular text-text-muted">
        Nessuna attività registrata di recente.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4 list-none m-0 p-0" aria-label="Elenco intervalli recenti">
      {items.map((item) => {
        const { entry, project, timeLabel } = item;
        // Calcolo rigoroso della durata tramite la funzione condivisa obbligatoria
        const durationSeconds = calculateEntryDuration(entry);
        const durationFormatted = formatDurationHoursMinutes(durationSeconds);
        const isPomodoro = entry.mode === 'pomodoro';

        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onItemClick?.(item)}
              className="w-full flex items-center justify-between text-left py-1 hover:opacity-90 active:opacity-75 transition-opacity cursor-pointer group"
            >
              {/* Parte sinistra: pallino colorato + colonna testi (progetto e descrizione) */}
              <div className="flex items-center gap-3 min-w-0 pr-4">
                {/* Pallino colore progetto (es. diametro 12px) */}
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />

                <div className="flex flex-col min-w-0">
                  {/* Nome progetto */}
                  <span className="text-base font-medium text-text truncate">
                    {project.name}
                  </span>
                  {/* Descrizione opzionale */}
                  {entry.description && (
                    <span className="text-sm font-regular text-text-muted truncate mt-0.5">
                      {entry.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Parte destra: icona pomodoro (se applicabile), durata e orario */}
              <div className="flex items-center gap-2 shrink-0">
                {isPomodoro && <PomodoroBadge />}

                <div className="flex flex-col items-end">
                  {/* Durata in formato h:mm */}
                  <span className="text-base font-semibold text-text tabular-nums">
                    {durationFormatted}
                  </span>
                  {/* Orario d'inizio o giorno */}
                  <span className="text-xs font-regular text-text-muted mt-0.5">
                    {timeLabel}
                  </span>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
