/**
 * Componente radice dell'app.
 * Per ora mostra solo una pagina di prova con il font Inter in vari pesi,
 * usando le classi Tailwind generate dai design tokens.
 *
 * Collegamento: main.tsx → qui → (futuro) router, layout, pagine
 */

/**
 * Pagina di prova: verifica che lo scheletro funzioni.
 * Mostra testo in Inter con pesi 400, 500, 600, 700 e colori dai token.
 */
export function App() {
  return (
    <div className="min-h-screen p-11">
      {/* Titolo grande in bold — colore menta (modalità libera) per verificare la palette */}
      <h1 className="text-3xl font-bold mb-8">
        Time Tracker
      </h1>

      {/* Testo regular (400) — colore testo principale */}
      <p className="text-base font-regular mb-4">
        Testo in Inter regular (400) — colore principale.
      </p>

      {/* Testo medium (500) — colore attenuato per verificare textMuted */}
      <p className="text-base font-medium text-text-muted mb-4">
        Testo in Inter medium (500) — colore attenuato.
      </p>

      {/* Testo semibold (600) — colore modalità Pomodoro per verificare la palette */}
      <p className="text-lg font-semibold text-mode-pomodoro mb-4">
        Testo in Inter semibold (600) — colore Pomodoro.
      </p>

      {/* Testo bold (700) — colore modalità manuale */}
      <p className="text-lg font-bold text-mode-manual">
        Testo in Inter bold (700) — colore Manuale.
      </p>
    </div>
  );
}
