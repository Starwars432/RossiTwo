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
        (e) => presetWebpage.default(e, {
          blocks: ['text', 'link', 'image', 'video'],
        }),
      ],
    });

    // ✅ Inject iframe-wide CSS overrides
    initialiseEditorStyles(editor);

    editor.on('load', async () => {
      try {
        const htmlRes = await fetch('/static/homepage.html');
        const cssRes  = await fetch('/static/homepage.css');

        const html = await htmlRes.text();
        const css  = await cssRes.text();

        // ✅ Clean animation classes from class="..." attributes
        const strippedHtml = html
          .replace(/^[\s\S]*?<body[^>]*>/i, '')
          .replace(/<\/body>[\s\S]*$/i, '')
          .replace(/class="([^"]*)"/g, (_, cls) => {
            const cleaned = cls
              .split(' ')
              .filter(c =>
                !/^opacity-/.test(c) &&
                !/^translate/.test(c) &&
                !/^scale-/.test(c) &&
                !/^aos-/.test(c) &&
                !/^motion-/.test(c)
              )
              .join(' ');
            return `class="${cleaned}"`;
          });

        editor.setStyle(css);
        editor.setComponents(strippedHtml);

        // ✅ Kill inline styles from JS animation frameworks
        const doc = editor.Canvas.getFrame()?.contentDocument;
        const all = doc?.body?.querySelectorAll('*') || [];
        all.forEach((el) => {
          el.removeAttribute('style');
        });
      } catch (err) {
        console.error('❌ Failed to inject homepage:', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
