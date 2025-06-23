// src/components/VisualEditor.tsx
import { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import * as presetWebpage from 'grapesjs-preset-webpage';
import { initialiseEditorStyles } from './editorStyles';

export default function VisualEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      storageManager: false,
      canvas: {
        customSpots: true,
        styles: [
          '/static/homepage.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        ],
      },
      plugins: [
        (e) =>
          presetWebpage.default(e, {
            blocks: ['text', 'link', 'image', 'video'],
          }),
      ],
    });

    // ✅ Inject iframe-wide styles for visibility overrides
    initialiseEditorStyles(editor);

    editor.on('load', async () => {
      try {
        const htmlRes = await fetch('/static/homepage.html');
        const cssRes = await fetch('/static/homepage.css');

        const html = await htmlRes.text();
        const css = await cssRes.text();

        editor.setStyle(css);
        editor.setComponents(
          html
            .replace(/^[\s\S]*?<body[^>]*>/i, '')
            .replace(/<\/body>[\s\S]*$/i, '')
        );

        // ✅ Remove inline styles to stop AOS/framer hiding content
        const frame = editor.Canvas.getFrame();
        const doc = frame?.contentDocument;
        const allElements = doc?.body?.querySelectorAll('*');

        allElements?.forEach((el) => {
          el.removeAttribute('style');
        });

      } catch (err) {
        console.error('❌ failed injecting homepage into GrapesJS', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
