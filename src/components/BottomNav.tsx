/**
 * Barra di navigazione inferiore a sole tre icone (Home, Progetti, Report).
 * Replicata fedelmente dalle schermate di riferimento in design/ (01-home.png, 04-progetti.png, 05-report.png).
 *
 * Specifiche visive e di interazione:
 * - Icone SVG inline con raccordi e vertici morbidi (nessuna libreria esterna).
 * - Stato attivo con colore token "text" (#EDEDF0), stato inattivo con "textMuted" (#9A9AA3).
 * - Altezza barra pari al token size.navBar (48px) più il safe area inset inferiore per mobile.
 * - Area di tocco di ogni pulsante pari ad almeno size.touchMin (44px) per conformità ergonomica.
 *
 * Collegamento: posizionato sul fondo dell'App shell in src/App.tsx.
 */

import type { ReactElement } from 'react';

export type PageId = 'home' | 'projects' | 'reports';

interface BottomNavProps {
  /** Identificativo della schermata attualmente visualizzata */
  activePage: PageId;
  /** Funzione di callback invocata al click su una delle icone */
  onSelectPage: (page: PageId) => void;
}

/**
 * Icona Home: casetta minimale a 5 lati con vertici arrotondati, tracciato outline continuo.
 */
function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 10.5L12 4L19.5 10.5V18.5C19.5 19.6 18.6 20.5 17.5 20.5H6.5C5.4 20.5 4.5 19.6 4.5 18.5V10.5Z" />
    </svg>
  );
}

/**
 * Icona Progetti: cartella stilizzata a profilo singolo con linguetta sinistra smussata.
 */
function ProjectsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7C4 5.9 4.9 5 6 5H9.5C10.3 5 11 5.4 11.5 6L12.5 7.5H18C19.1 7.5 20 8.4 20 9.5V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V7Z" />
    </svg>
  );
}

/**
 * Icona Report: tre capsule/barre verticali ad angoli tondi (bassa, alta, media).
 */
function ReportsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {/* Barra sinistra: bassa */}
      <rect x="4" y="12" width="3.5" height="8" rx="1.75" />
      {/* Barra centrale: alta */}
      <rect x="10.25" y="4" width="3.5" height="16" rx="1.75" />
      {/* Barra destra: altezza intermedia */}
      <rect x="16.5" y="8" width="3.5" height="12" rx="1.75" />
    </svg>
  );
}

export function BottomNav({ activePage, onSelectPage }: BottomNavProps) {
  // Lista dei tab: ordine Home, Progetti, Report come da schermate design
  const items: Array<{ id: PageId; label: string; icon: () => ReactElement }> = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'projects', label: 'Progetti', icon: ProjectsIcon },
    { id: 'reports', label: 'Report', icon: ReportsIcon },
  ];

  return (
    <nav
      aria-label="Navigazione principale"
      className="w-full bg-background flex items-center justify-around shrink-0"
      style={{
        /*
         * L'altezza complessiva unisce la quota standard del token size.navBar (48px)
         * al margine di sicurezza inferiore (safe-area-inset-bottom) del dispositivo mobile,
         * evitando che i tasti finiscano sotto la barra gesti di Android.
         */
        height: 'calc(var(--size-nav-bar) + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map((item) => {
        const isActive = activePage === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPage(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            /*
             * Area di tocco minima di 44px (size.touchMin dai token) garantita da min-w e min-h.
             * Colori: "text" per attivo, "textMuted" per inattivo (da design-tokens.json).
             */
            className={`flex items-center justify-center min-w-[var(--size-touch-min)] min-h-[var(--size-touch-min)] transition-colors cursor-pointer ${
              isActive ? 'text-text' : 'text-text-muted hover:text-text'
            }`}
          >
            <Icon />
          </button>
        );
      })}
    </nav>
  );
}
