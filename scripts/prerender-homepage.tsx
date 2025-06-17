// scripts/prerender-homepage.tsx
import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Homepage from '../src/components/Homepage';

/* ------------------------------------------------------------------ */
/*  1.  Render the homepage component to static HTML                  */
/* ------------------------------------------------------------------ */
const html = ReactDOMServer.renderToStaticMarkup(<Homepage />);

/* ------------------------------------------------------------------ */
/*  2.  Wrap it in a bare‑bones document (keeps Google Fonts, etc.)   */
/* ------------------------------------------------------------------ */
const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/static/homepage.css" />
  <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;600;800&display=swap" rel="stylesheet">
  <title>Homepage</title>
</head>
<body>${html}</body>
</html>`;

/* ------------------------------------------------------------------ */
/*  3.  Copy the Tailwind build → public/static/homepage.css          */
/*      – in dev we copy public/tailwind.output.css                   */
/*      – after "vite build" you may instead copy dist/assets/*.css   */
/* ------------------------------------------------------------------ */
const srcCss  = path.resolve('public', 'tailwind.output.css');
const dstDir  = path.resolve('public', 'static');
const dstHtml = path.join(dstDir, 'homepage.html');
const dstCss  = path.join(dstDir, 'homepage.css');

await fs.mkdir(dstDir, { recursive: true });
await fs.copyFile(srcCss, dstCss);
await fs.writeFile(dstHtml, fullHtml);

console.log('✅ homepage.html + homepage.css written to public/static/');