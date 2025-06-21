// scripts/prerender-homepage.tsx
// -----------------------------------------------------------------------------
// Pre‑render the <Homepage /> React component to a static HTML file that can be
// consumed by GrapesJS (or served directly). Run via `npm run prerender`.
// -----------------------------------------------------------------------------
import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Homepage from '../src/components/Homepage';

/* -------------------------------------------------------------------------- */
/*  1. Render the <Homepage /> component to a static HTML string               */
/* -------------------------------------------------------------------------- */
const bodyMarkup = ReactDOMServer.renderToStaticMarkup(<Homepage />);

/* -------------------------------------------------------------------------- */
/*  2. Wrap the body markup in a minimal HTML document                         */
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
/*  3. Copy the Tailwind build + write the generated HTML                      */
/*      – In dev we copy public/tailwind.output.css                            */
/*      – After `vite build` you might swap this for the compiled CSS in dist  */
/* -------------------------------------------------------------------------- */
const srcCss = path.resolve('public', 'tailwind.output.css');
const dstDir = path.resolve('public', 'static');
const dstCss = path.join(dstDir, 'homepage.css');
const dstHtml = path.join(dstDir, 'homepage.html');

await fs.mkdir(dstDir, { recursive: true });
await fs.copyFile(srcCss, dstCss);
await fs.writeFile(dstHtml, fullHtml, 'utf8');

console.log('✅  Generated public/static/homepage.html and homepage.css');
