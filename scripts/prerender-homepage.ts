// scripts/prerender-homepage.ts
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Homepage from '../src/components/Homepage';

const html = ReactDOMServer.renderToStaticMarkup(<Homepage />);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/tailwind.output.css" />
  <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;600;800&display=swap" rel="stylesheet">
  <title>Homepage</title>
</head>
<body>${html}</body>
</html>`;

const outDir = path.join(process.cwd(), 'public', 'static');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'homepage.html'), fullHtml);

console.log('✅ homepage.html created at public/static/homepage.html');