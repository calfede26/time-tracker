/**
 * Definizione dei tipi di dominio per il Time Tracker.
 * Riflette fedelmente il modello dati definito in SPEC.md.
 *
 * Collegamento: usato dal livello dati (src/data/) e da tutta l'interfaccia (src/pages/, src/components/).
 */

/** Modalità supportate per la registrazione del tempo */
export type TimerMode = 'free' | 'pomodoro' | 'manual';

/**
 * Entità Progetto.
 * Un progetto può avere un genitore (parent_id) per supportare un livello di annidamento.
 */
export interface Project {
  id: string;
  name: string;
  /** Colore esadecimale scelto dall'utente tra quelli in projectPalette */
  color: string;
  /** ID del progetto genitore. Se null o undefined, è un progetto principale */
  parent_id?: string | null;
  /** Indica se il progetto è archiviato (non selezionabile per nuove voci) */
  archived: boolean;
}

/**
 * Voce di tracciamento temporale.
 * Rappresenta un intervallo registrato in modalità libera, pomodoro o manuale.
 */
export interface TimeEntry {
  id: string;
  /** Riferimento obbligatorio al progetto associato */
  project_id: string;
  /** Descrizione opzionale dell'attività svolta */
  description?: string | null;
  /** Timestamp ISO 8601 di inizio intervallo */
  start_at: string;
  /**
   * Timestamp ISO 8601 di fine intervallo.
   * Se nullo/assente, la voce rappresenta un timer attualmente in esecuzione.
   */
  end_at?: string | null;
  /** Modalità con cui è stata creata la voce */
  mode: TimerMode;
  /**
   * Secondi effettivi di attività:
   * - Pomodoro: solo secondi di focus (le pause sono escluse).
   * - Libero: secondi effettivi escluse le pause (presente solo se c'è stata almeno una pausa).
   * - Manuale / Libero senza pause: null o undefined.
   */
  active_seconds?: number | null;
}

/**
 * Impostazioni globali della modalità Pomodoro.
 * Conserva i parametri di durata e configurazione audio per i cicli di focus/pausa.
 */
export interface PomodoroSettings {
  /** Durata intervallo di focus in minuti */
  focus_min: number;
  /** Durata pausa breve in minuti */
  short_break_min: number;
  /** Durata pausa lunga in minuti */
  long_break_min: number;
  /** Quanti cicli di focus completare prima di attivare la pausa lunga */
  cycles_before_long_break: number;
  /** Flag o identificatore suono all'inizio di un intervallo */
  sound_start: boolean | string;
  /** Flag o identificatore suono alla fine di un intervallo */
  sound_end: boolean | string;
}
