/**
 * Script che genera src/theme.generated.css dal file design-tokens.json.
 * Così design-tokens.json resta l'unica fonte di verità per i valori di stile.
 *
 * Va eseguito con: node scripts/generate-theme.js
 * Viene anche lanciato automaticamente prima di "dev" e "build" (vedi package.json).
 *
 * Collegamento: design-tokens.json → src/theme.generated.css → src/index.css (che lo importa)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/** @typedef {Record<string, unknown>} Tokens */
const tokens = JSON.parse(
  readFileSync(resolve(root, 'design-tokens.json'), 'utf-8')
);

const lines = [
  '/* File generato automaticamente da scripts/generate-theme.js */',
  '/* NON modificare a mano: cambia design-tokens.json e rigenera.  */',
  '',
  '/*',
  ' * Blocco @theme di Tailwind v4: sostituisce (non estende) i valori predefiniti.',
  ' * Usa --color-*, --font-*, --spacing-*, --radius-*, --shadow-* come classi Tailwind.',
  ' */',
  '@theme {',
];

/* ---- Colori ---- */
const c = tokens.color;
// Colori piatti
lines.push(`  --color-background: ${c.background};`);
lines.push(`  --color-surface: ${c.surface};`);
lines.push(`  --color-surface-raised: ${c.surfaceRaised};`);
lines.push(`  --color-text: ${c.text};`);
lines.push(`  --color-text-muted: ${c.textMuted};`);
lines.push(`  --color-on-accent: ${c.onAccent};`);

// Modalità timer
lines.push(`  --color-mode-free: ${c.mode.free};`);
lines.push(`  --color-mode-pomodoro: ${c.mode.pomodoro};`);
lines.push(`  --color-mode-manual: ${c.mode.manual};`);

// Stati
lines.push(`  --color-state-paused: ${c.state.paused};`);
lines.push(`  --color-state-error: ${c.state.error};`);

// Palette progetto (i colori usabili per i progetti)
c.projectPalette.forEach((hex, i) => {
  lines.push(`  --color-project-${i + 1}: ${hex};`);
});

lines.push('');

/* ---- Font ---- */
const f = tokens.font;
lines.push(`  --font-sans: '${f.family}', sans-serif;`);
lines.push('');

// Pesi: generano classi come font-regular, font-medium, ecc.
for (const [name, value] of Object.entries(f.weight)) {
  lines.push(`  --font-weight-${name}: ${value};`);
}
lines.push('');

// Dimensioni del testo: generano classi come text-2xs, text-xs, ecc.
for (const [name, value] of Object.entries(f.size)) {
  lines.push(`  --text-${name}: ${value}px;`);
}
lines.push('');

/* ---- Spaziature ---- */
// Lo space array genera --spacing-0, --spacing-1 ecc.
// Usiamo i valori come indice, così le classi sono p-0, p-1, ecc.
tokens.space.forEach((px, i) => {
  lines.push(`  --spacing-${i}: ${px}px;`);
});
lines.push('');

/* ---- Raggi ---- */
for (const [name, value] of Object.entries(tokens.radius)) {
  const v = value === 9999 ? '9999px' : `${value}px`;
  lines.push(`  --radius-${name}: ${v};`);
}
lines.push('');

/* ---- Dimensioni fisse (size) — esposti come custom properties, usabili con arbitrary values ---- */
// Non vanno nello spacing perché sono dimensioni specifiche di componenti,
// non unità di spaziatura generiche. Li esponiamo come variabili CSS.
lines.push('');
lines.push('  /* Dimensioni componenti (usare con valori arbitrari, es. w-[var(--size-ring-timer)]) */');

/* Convertiamo nomi camelCase in kebab-case */
for (const [name, value] of Object.entries(tokens.size)) {
  const kebab = name.replace(/([A-Z])/g, '-$1').toLowerCase();
  lines.push(`  --size-${kebab}: ${value}px;`);
}
lines.push('');

/* ---- Ombre ---- */
for (const [name, value] of Object.entries(tokens.shadow)) {
  lines.push(`  --shadow-${name}: ${value};`);
}

lines.push('}');
lines.push('');

const output = lines.join('\n');
const outPath = resolve(root, 'src', 'theme.generated.css');
writeFileSync(outPath, output, 'utf-8');
console.log(`✓ Tema generato → ${outPath}`);
