// src/components/VisualEditor.tsx
import { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import * as presetWebpage from 'grapesjs-preset-webpage';

export default function VisualEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      storageManager: false,
      plugins: [
        (e) => presetWebpage.default(e, { blocks: ['text', 'link', 'image', 'video'] }),
      ],
      canvas: {
        customSpots: true,
        styles: [
          '/static/homepage.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        ],
      },
    });

    editor.on('load', async () => {
      try {
        const html = await (await fetch('/static/homepage.html')).text();
        const css  = await (await fetch('/static/homepage.css')).text();

        editor.setStyle(css);
        editor.setComponents(
          html
            .replace(/^[\s\S]*?<body[^>]*>/i, '')
            .replace(/<\/body>[\s\S]*$/i, '')
        );

        const doc = editor.Canvas.getFrame()?.contentDocument;
        const head = doc?.head;
        const body = doc?.body;

        if (head && body) {
          const fixStyle = doc.createElement('style');
          fixStyle.innerHTML = `
            html, body {
              background-color: black !important;
              color: white !important;
              font-family: 'Playfair Display', serif !important;
              min-height: 100vh !important;
              overflow: visible !important;
              margin: 0 !important;
            }
            *, *::before, *::after {
              opacity: 1 !important;
              visibility: visible !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
            }
          `;
          head.appendChild(fixStyle);
        }
      } catch (err) {
        console.error('❌ failed injecting homepage into GrapesJS', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
