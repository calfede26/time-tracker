/**
 * Punto di ingresso dell'applicazione React.
 * Monta il componente radice App nel DOM e importa gli stili globali.
 *
 * Collegamento: index.html → qui → App.tsx → (futuro) pagine e componenti
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

/* Il contenitore #root è definito in index.html */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root non trovato nel DOM');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
