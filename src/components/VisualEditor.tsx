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
      fromElement: false,
      storageManager: false,
      plugins: [
        editor =>
          presetWebpage.default(editor, {
            blocks: ['text', 'link', 'image', 'video'],
          }),
      ],
      canvas: {
        customSpots: true,
        styles: [
          '/tailwind.output.css',
          '/static/homepage.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        ],
      },
    });

    // Safe loader
    editor.on('canvas:frame:load', async () => {
      try {
        const htmlRes = await fetch('/static/homepage.html');
        const rawHTML = await htmlRes.text();
        const bodyContent = rawHTML
          .replace(/^[\s\S]*?<body[^>]*>/i, '')
          .replace(/<\/body>[\s\S]*$/i, '');

        const cssRes = await fetch('/static/homepage.css');
        const rawCSS = await cssRes.text();

        editor.setStyle(rawCSS);
        editor.setComponents(bodyContent);

        // Optional: improve layout
        const frame = editor.Canvas.getFrame();
        const doc = frame?.contentDocument;
        const body = doc?.body;
        if (body) {
          body.style.margin = '0';
          body.style.minHeight = '100vh';
          body.style.overflow = 'visible';
          body.style.background = 'black';
          body.style.color = 'white';
          body.style.fontFamily = "'Playfair Display', serif";
        }
      } catch (err) {
        console.error('❌ Failed to load homepage HTML:', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
