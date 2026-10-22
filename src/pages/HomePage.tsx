/**
 * Schermata Home (Dashboard principale).
 * Fedele al riferimento visivo approvato in design/01-home.png.
 *
 * Struttura:
 * 1. Zona superiore del Timer (altezza fissa size.timerZone = 404px):
 *    - Selettore modalità (Libero, Pomodoro, Manuale)
 *    - Timer circolare ad anello con controlli pausa/stop a sinistra
 * 2. Divisore espandibile con freccia (^ / v):
 *    - Un tocco espande l'attività recente verso l'alto coprendo la timerZone.
 *    - Un secondo tocco la richiude tornando alla vista timer standard.
 * 3. Sezione "Attività recente":
 *    - Intestazione con titolo
 *    - Elenco cronologico delle voci con durata calcolata tramite calculateEntryDuration,
 *      badge Pomodoro dove applicabile e orario/giorno.
 *
 * Collegamento: renderizzata da App.tsx quando activePage === 'home'.
 */

import { useState, useEffect, useRef } from 'react';
import { ModeSelector } from '@/components/ModeSelector';
import { RingTimer, type TimerStatus } from '@/components/RingTimer';
import { RecentActivityList, type EnrichedTimeEntry } from '@/components/RecentActivityList';
import type { TimerMode, Project } from '@/data/types';

// Progetti dimostrativi conformi ai token (projectPalette) e a design/01-home.png
const STUDIO_PROJECT: Project = {
  id: 'studio',
  name: 'Studio',
  color: '#8FD0EA',
  archived: false,
};

const SVILUPPO_PROJECT: Project = {
  id: 'sviluppo',
  name: 'Sviluppo app',
  color: '#D9E58A',
  archived: false,
};

const LETTURA_PROJECT: Project = {
  id: 'lettura',
  name: 'Lettura',
  color: '#E9A8D2',
  archived: false,
};

// Voci di attività recente fedeli a design/01-home.png
const DEMO_RECENT_ITEMS: EnrichedTimeEntry[] = [
  {
    entry: {
      id: 'entry-1',
      project_id: 'studio',
      description: 'Analisi 1 ripasso',
      start_at: '2026-10-22T08:18:00.000Z',
      end_at: '2026-10-22T09:30:00.000Z', // 72 min = 1h 12m
      mode: 'free',
    },
    project: STUDIO_PROJECT,
    timeLabel: '09:30',
  },
  {
    entry: {
      id: 'entry-2',
      project_id: 'sviluppo',
      description: 'Sessione Pomodoro',
      start_at: '2026-10-22T07:30:00.000Z',
      end_at: '2026-10-22T08:20:00.000Z',
      mode: 'pomodoro',
      active_seconds: 3000, // 50 minuti di focus effettivo = 0:50
    },
    project: SVILUPPO_PROJECT,
    timeLabel: '08:20',
  },
  {
    entry: {
      id: 'entry-3',
      project_id: 'lettura',
      description: 'Capitolo 3',
      start_at: '2026-10-21T16:00:00.000Z',
      end_at: '2026-10-21T16:35:00.000Z', // 35 min = 0:35
      mode: 'free',
    },
    project: LETTURA_PROJECT,
    timeLabel: 'Ieri',
  },
];

export function HomePage() {
  const [mode, setMode] = useState<TimerMode>('free');
  const [status, setStatus] = useState<TimerStatus>('running');
  // Valore iniziale di 84s (01:24) fedele a design/01-home.png
  const [seconds, setSeconds] = useState<number>(84);

  // Stato di espansione dell'attività recente verso l'alto (SPEC.md)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Progetto attualmente attivo nel timer
  const currentProject: Project = SVILUPPO_PROJECT;

  // Riferimento all'intervallo del timer
  const timerRef = useRef<number | null>(null);

  // Avanzamento dei secondi quando il timer è in esecuzione
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  const handleStart = () => setStatus('running');
  const handlePause = () => setStatus('paused');
  const handleResume = () => setStatus('running');
  const handleStop = () => {
    setStatus('idle');
    setSeconds(0);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {/*
        1. Zona superiore del Timer:
        Altezza standard size.timerZone (404px).
        Quando l'attività recente si espande, viene traslata verso l'alto o collassata.
      */}
      <section
        aria-label="Zona Timer"
        className={`shrink-0 flex flex-col items-center justify-between pt-8 pb-4 px-4 bg-background transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'h-0 opacity-0 -translate-y-6 pointer-events-none overflow-hidden pt-0 pb-0'
            : 'h-[var(--size-timer-zone)] opacity-100 translate-y-0'
        }`}
      >
        {/* Selettore a 3 segmenti in alto */}
        <ModeSelector
          currentMode={mode}
          onSelectMode={setMode}
          disabled={status === 'running'}
        />

        {/* Anello timer circolare con comandi a sinistra */}
        <div className="my-auto w-full flex justify-center">
          <RingTimer
            seconds={seconds}
            status={status}
            projectName={currentProject.name}
            projectColor={currentProject.color}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </div>
      </section>

      {/*
        2. Divisore con freccia espandibile (^ / v):
        Un tocco espande l'attività recente verso l'alto fino a coprire la parte del timer (SPEC.md).
      */}
      <button
        type="button"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Riduci attività recente' : 'Espandi attività recente'}
        className="w-full flex items-center justify-center px-6 py-3 shrink-0 select-none cursor-pointer group bg-background focus:outline-none"
      >
        {/* Linea sinistra */}
        <span className="flex-1 h-[1px] bg-surface-raised" aria-hidden="true" />

        {/* Freccetta centrale */}
        <span className="px-3 text-text-muted group-hover:text-text transition-colors">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          >
            <path d="M1 7L6 2L11 7" />
          </svg>
        </span>

        {/* Linea destra */}
        <span className="flex-1 h-[1px] bg-surface-raised" aria-hidden="true" />
      </button>

      {/*
        3. Sezione Attività Recente:
        Mostra l'intestazione e l'elenco cronologico delle voci con scorrimento verticale.
      */}
      <section
        aria-label="Attività recente"
        className="flex-1 flex flex-col px-6 pb-4 overflow-y-auto"
      >
        {/* Titolo della sezione */}
        <div className="pb-4">
          <h2 className="text-xs font-regular text-text-muted m-0">
            Attività recente
          </h2>
        </div>

        {/* Elenco voci recenti */}
        <div className="flex-1">
          <RecentActivityList items={DEMO_RECENT_ITEMS} />
        </div>
      </section>
    </div>
  );
}
