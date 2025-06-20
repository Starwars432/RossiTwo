// src/components/VisualEditor.tsx
import { useEffect } from 'react';
import grapesjs from 'grapesjs';
import * as presetWebpage from 'grapesjs-preset-webpage';
import 'grapesjs/dist/css/grapes.min.css';

export default function VisualEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      storageManager: false,
      plugins: [editor =>
        presetWebpage.default(editor, {
          blocks: [
            'column1',
            'column2',
            'column3',
            'text',
            'link',
            'image',
            'video',
          ],
        })
      ],
      canvas: {
        styles: [
          '/tailwind.output.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        ],
      },
    });

    editor.on('load', async () => {
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

        const doc = editor.Canvas.getFrame()?.contentDocument;
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
        console.error('❌ Error loading homepage:', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
