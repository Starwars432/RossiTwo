// scripts/prerender-homepage.tsx
// -----------------------------------------------------------------------------
// Pre-render <Homepage /> to static HTML + copy the final Tailwind build CSS.
// Run with `npm run prerender` (dev)      → copies public/tailwind.output.css
// After `vite build && npm run prerender` → copies dist/assets/<hash>.css
// -----------------------------------------------------------------------------
import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Homepage from '../src/components/Homepage';

/* -------------------------------------------------------------------------- */
/* 1.  Render the React component to a plain HTML string                       */
/* -------------------------------------------------------------------------- */
const bodyMarkup = ReactDOMServer.renderToStaticMarkup(<Homepage />);

/* -------------------------------------------------------------------------- */
/* 2.  Wrap it in a very small HTML document                                   */
/* -------------------------------------------------------------------------- */
const fullHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/static/homepage.css" />
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;600;800&display=swap" rel="stylesheet" />
    <title>Homepage</title>
  </head>
  <body>${bodyMarkup}</body>
</html>`;

/* -------------------------------------------------------------------------- */
/* 3.  Decide WHICH CSS file to copy                                           */
/*      • dev  : public/tailwind.output.css                                    */
/*      • build: first *.css found in dist/assets/ (ignores *.css.map)         */
/* -------------------------------------------------------------------------- */
async function findCompiledCss(): Promise<string> {
  const distAssets = path.resolve('dist', 'assets');
  try {
    const files = await fs.readdir(distAssets);
    const cssFile = files.find(f => f.endsWith('.css') && !f.endsWith('.css.map'));
    if (cssFile) {
      console.log(`🔎  Using compiled CSS from dist/assets/${cssFile}`);
      return path.join(distAssets, cssFile);
    }
  } catch {
    /* dist/assets doesn’t exist yet – that’s fine in dev mode                */
  }
  console.log('🔎  Using dev CSS public/tailwind.output.css');
  return path.resolve('public', 'tailwind.output.css');
}

/* -------------------------------------------------------------------------- */
/* 4.  Copy CSS + write the HTML                                               */
/* -------------------------------------------------------------------------- */
const dstDir  = path.resolve('public', 'static');
const dstCss  = path.join(dstDir, 'homepage.css');
const dstHtml = path.join(dstDir, 'homepage.html');

await fs.mkdir(dstDir, { recursive: true });

const srcCss = await findCompiledCss();
await fs.copyFile(srcCss, dstCss);
await fs.writeFile(dstHtml, fullHtml, 'utf8');

console.log('✅  Generated public/static/homepage.html + homepage.css');
