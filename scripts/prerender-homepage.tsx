// scripts/prerender-homepage.tsx
// -----------------------------------------------------------------------------
// Pre‑render <HomepageForEditor /> to static HTML + copy the final Tailwind CSS.
// Use `npm run prerender` in dev (copies public/tailwind.output.css).
// After `vite build` it automatically picks up the hashed CSS in dist/assets/*.
// -----------------------------------------------------------------------------
import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// ⭐ IMPORTANT ─ we render the light‑weight, iframe‑friendly version created
//   specifically for GrapesJS. It excludes the global wrappers & animations
//   that were hiding content in the editor.
import Homepage from '../src/components/HomepageForEditor';

/* -------------------------------------------------------------------------- */
/* 1.  Render <HomepageForEditor /> to a plain HTML string                     */
/* -------------------------------------------------------------------------- */
const bodyMarkup = ReactDOMServer.renderToStaticMarkup(<Homepage />);

/* -------------------------------------------------------------------------- */
/* 2.  Wrap the markup in a minimal document that keeps fonts & css            */
/* -------------------------------------------------------------------------- */
const fullHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/static/homepage.css" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
    <title>Homepage</title>
  </head>
  <body>${bodyMarkup}</body>
</html>`;

/* -------------------------------------------------------------------------- */
/* 3.  Decide which Tailwind build to copy                                     */
/*      • dev   → public/tailwind.output.css                                   */
/*      • build → first *.css in dist/assets/ (skips *.css.map)                */
/* -------------------------------------------------------------------------- */
async function findCompiledCss(): Promise<string> {
  const distAssets = path.resolve('dist', 'assets');
  try {
    const files = await fs.readdir(distAssets);
    const css = files.find((f) => f.endsWith('.css') && !f.endsWith('.css.map'));
    if (css) {
      console.log(`🔎  Using compiled CSS from dist/assets/${css}`);
      return path.join(distAssets, css);
    }
  } catch {
    /* dist/assets may not exist in dev – fall back to dev CSS. */
  }
  console.log('🔎  Using dev CSS public/tailwind.output.css');
  return path.resolve('public', 'tailwind.output.css');
}

/* -------------------------------------------------------------------------- */
/* 4.  Copy CSS & write the static HTML                                        */
/* -------------------------------------------------------------------------- */
const dstDir = path.resolve('public', 'static');
const dstCss = path.join(dstDir, 'homepage.css');
const dstHtml = path.join(dstDir, 'homepage.html');

await fs.mkdir(dstDir, { recursive: true });

const srcCss = await findCompiledCss();
await fs.copyFile(srcCss, dstCss);
await fs.writeFile(dstHtml, fullHtml, 'utf8');

console.log('✅  Generated public/static/homepage.html + homepage.css');
