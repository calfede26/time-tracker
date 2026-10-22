/**
 * Schermata Home (Dashboard principale).
 * Fedele al riferimento visivo approvato in design/01-home.png.
 *
 * Struttura:
 * 1. Zona superiore del Timer con altezza fissa size.timerZone (404px):
 *    - Selettore delle 3 modalità in alto (Libero, Pomodoro, Manuale)
 *    - Timer circolare ad anello (220px) con display orario e tasti pausa/stop a fianco
 * 2. Divisore espandibile con freccia verso l'alto (^).
 * 3. Area inferiore riservata all'attività recente.
 *
 * Collegamento: renderizzata come schermata predefinita in src/App.tsx.
 */

import { useState, useEffect, useRef } from 'react';
import { ModeSelector } from '@/components/ModeSelector';
import { RingTimer, type TimerStatus } from '@/components/RingTimer';
import type { TimerMode } from '@/data/types';

export function HomePage() {
  const [mode, setMode] = useState<TimerMode>('free');
  const [status, setStatus] = useState<TimerStatus>('running');
  // Valore iniziale di 84s (01:24) fedele a design/01-home.png
  const [seconds, setSeconds] = useState<number>(84);

  // Progetto attualmente selezionato per il timer
  const projectName = 'Sviluppo app';
  const projectColor = '#D9E58A'; // Secondo colore della projectPalette (#D9E58A lime pastello)

  // Riferimento all'intervallo del timer
  const timerRef = useRef<number | null>(null);

  // Gestione dell'avanzamento dei secondi a timer attivo
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

  // Gestori delle azioni del timer
  const handleStart = () => {
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleResume = () => {
    setStatus('running');
  };

  const handleStop = () => {
    setStatus('idle');
    setSeconds(0);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/*
        Zona superiore fissa del Timer:
        Altezza standard 404px (token size.timerZone).
        Resta fissa in tutte le schermate del timer (decisione ARCHITECTURE.md §8).
      */}
      <section
        aria-label="Zona Timer"
        className="h-[var(--size-timer-zone)] shrink-0 flex flex-col items-center justify-between pt-8 pb-4 px-4 bg-background"
      >
        {/* Selettore a 3 segmenti in alto */}
        <ModeSelector
          currentMode={mode}
          onSelectMode={setMode}
          disabled={status === 'running'}
        />

        {/* Anello timer circolare con tasti a sinistra */}
        <div className="my-auto w-full flex justify-center">
          <RingTimer
            seconds={seconds}
            status={status}
            projectName={projectName}
            projectColor={projectColor}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </div>
      </section>

      {/*
        Divisore con freccia espandibile (^):
        Linea orizzontale sottile interrotta al centro da una freccia verso l'alto
        come visibile in design/01-home.png.
      */}
      <div
        className="w-full flex items-center justify-center px-6 my-2 shrink-0 select-none cursor-pointer group"
        aria-label="Espandi attività recente"
      >
        {/* Linea sinistra */}
        <div className="flex-1 h-[1px] bg-surface-raised" />

        {/* Freccetta centrale verso l'alto */}
        <div className="px-3 text-text-muted group-hover:text-text transition-colors">
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
          >
            <path d="M1 7L6 2L11 7" />
          </svg>
        </div>

        {/* Linea destra */}
        <div className="flex-1 h-[1px] bg-surface-raised" />
      </div>

      {/*
        Sezione inferiore per l'Attività Recente:
        Spazio placeholder in attesa del compito successivo.
      */}
      <div className="flex-1 px-6 py-2 overflow-y-auto">
        <span className="text-xs font-medium text-text-muted">
          Attività recente
        </span>
      </div>
    </div>
  );
}
