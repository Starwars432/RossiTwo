// src/components/VisualEditor.tsx
import { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

export default function VisualEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      fromElement: false,
      storageManager: false,
      canvas: {
        customSpots: true,
        styles: ['/static/homepage.css'],  // Pre-load full CSS upfront
      },
    });

    editor.on('load', async () => {
      try {
        const htmlRes = await fetch('/static/homepage.html');
        const html = await htmlRes.text();

        // Extract only the <body> contents
        const bodyOnly = html
          .replace(/^[\s\S]*?<body[^>]*>/i, '')
          .replace(/<\/body>[\s\S]*$/i, '');

        // Set the full CSS *before* HTML
        const cssRes = await fetch('/static/homepage.css');
        const css = await cssRes.text();
        editor.setStyle(css);

        editor.setComponents(bodyOnly);

        const doc = editor.Canvas.getFrame()?.contentDocument;
        const body = doc?.body;
        if (body) {
          body.style.background = '';  // Remove any forced background
          body.style.margin = '0';
          body.style.minHeight = '100vh';
          body.style.overflow = 'visible';
        }
      } catch (err) {
        console.error('Error loading homepage:', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
