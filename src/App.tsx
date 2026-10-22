/**
 * Componente radice dell'applicazione (App shell).
 * Ospita il layout minimo con l'area centrale dei contenuti e la barra di navigazione inferiore.
 *
 * Specifiche dello scope:
 * - Cambio schermata gestito unicamente tramite stato locale di React (senza routing esterno).
 * - Spazio centrale che visualizza esclusivamente il nome della pagina attiva ("Home", "Progetti", "Report").
 * - La vecchia pagina di prova iniziale è stata sostituita da questo layout.
 * - Margine safe-area in alto (safe-area-inset-top) per non finire sotto la barra di stato del telefono.
 *
 * Collegamento: montato da src/main.tsx nel DOM (#root).
 */

import { useState } from 'react';
import { BottomNav, type PageId } from './components/BottomNav';

/**
 * Mappa i titoli testuali delle tre pagine abilitate.
 */
const PAGE_TITLES: Record<PageId, string> = {
  home: 'Home',
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
         * Nel browser desktop questo valore vale 0px come da standard.
         */
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/*
        Contenitore principale centrato:
        Su viewport mobile (360x780) occupa il 100% della larghezza;
        su desktop viene centrato con max-w-md per mantenere proporzioni ergonomiche.
      */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto overflow-hidden">
        {/*
          Area centrale della pagina attiva:
          Per ora contiene solo il nome della schermata corrente in font Inter e colore text.
        */}
        <main className="flex-1 flex items-center justify-center p-8">
          <span className="text-xl font-medium text-text">
            {PAGE_TITLES[activePage]}
          </span>
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
