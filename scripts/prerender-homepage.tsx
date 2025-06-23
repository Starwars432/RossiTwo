// scripts/prerender-homepage.tsx
// -----------------------------------------------------------------------------
// Pre‑render <StaticHomepage /> to static HTML + copy the final Tailwind CSS.
// Use `npm run prerender` in dev (copies public/tailwind.output.css).
// After `vite build` it automatically picks up the hashed CSS in dist/assets/*.
// -----------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// ✅ This is the static, animation-free, layout-safe version
import StaticHomepage from '../src/components/StaticHomepage';

/* -------------------------------------------------------------------------- */
/* 1.  Render <StaticHomepage /> to a plain HTML string                        */
/* -------------------------------------------------------------------------- */
const bodyMarkup = ReactDOMServer.renderToStaticMarkup(<StaticHomepage />);

/* -------------------------------------------------------------------------- */
/* 2.  Wrap it in a minimal HTML document with Google Fonts + homepage CSS    */
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
  <body style="background: black; color: white; font-family: 'Playfair Display', serif; margin: 0;">
    ${bodyMarkup}
  </body>
</html>`;

/* -------------------------------------------------------------------------- */
/* 3.  Locate the correct Tailwind CSS file (dist/assets or public fallback)  */
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
    // dist/assets may not exist yet → fallback to dev CSS
  }
  console.log('🔎  Using dev CSS public/tailwind.output.css');
  return path.resolve('public', 'tailwind.output.css');
}

/* -------------------------------------------------------------------------- */
/* 4.  Save HTML and copy CSS to public/static/                               */
/* -------------------------------------------------------------------------- */
const dstDir = path.resolve('public', 'static');
const dstHtml = path.join(dstDir, 'homepage.html');
const dstCss = path.join(dstDir, 'homepage.css');

await fs.mkdir(dstDir, { recursive: true });
const srcCss = await findCompiledCss();
await fs.copyFile(srcCss, dstCss);
await fs.writeFile(dstHtml, fullHtml, 'utf8');

console.log('✅  Generated public/static/homepage.html + homepage.css');
console.log('📄  StaticHomepage.tsx used (zero animations, full layout)');
