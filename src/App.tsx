/**
 * Componente radice dell'applicazione (App shell).
 * Ospita il layout minimo con l'area centrale dei contenuti e la barra di navigazione inferiore.
 *
 * Specifiche dello scope:
 * - Navigazione gestita tramite stato locale di React (senza librerie esterne).
 * - Quando la scheda attiva è 'home', renderizza HomePage con la Zona Timer e il divisore.
 * - Per le altre schede ('projects', 'reports'), mostra lo spazio con il nome della schermata.
 * - Margine safe-area in alto (safe-area-inset-top) per non sovrapporsi alla barra di sistema.
 *
 * Collegamento: montato da src/main.tsx nel DOM (#root).
 */

import { useState } from 'react';
import { BottomNav, type PageId } from './components/BottomNav';
import { HomePage } from './pages/HomePage';

/**
 * Titoli testuali delle schermate non ancora implementate.
 */
const PLACEHOLDER_TITLES: Partial<Record<PageId, string>> = {
  projects: 'Progetti',
  reports: 'Report',
};

export function App() {
  const [activePage, setActivePage] = useState<PageId>('home');

  return (
    <div
      className="flex flex-col h-screen w-full bg-background text-text overflow-hidden select-none"
      style={{
        /*
         * Applica il margine superiore per la barra di stato del telefono (Android/Capacitor).
         * Nel browser desktop questo valore vale 0px come da standard W3C.
         */
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/*
        Contenitore principale centrato:
        Su mobile (360x780) occupa il 100% della larghezza;
        su desktop viene centrato con max-w-md per mantenere proporzioni ergonomiche.
      */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto overflow-hidden">
        {/*
          Area centrale della pagina attiva:
        */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activePage === 'home' ? (
            <HomePage />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <span className="text-xl font-medium text-text">
                {PLACEHOLDER_TITLES[activePage]}
              </span>
            </div>
          )}
        </main>

        {/*
          Barra di navigazione inferiore ancorata sul fondo.
        */}
        <BottomNav
          activePage={activePage}
          onSelectPage={setActivePage}
        />
      </div>
    </div>
  );
}
