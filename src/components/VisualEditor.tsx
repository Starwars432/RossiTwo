// src/components/VisualEditor.tsx
import { useEffect }    from 'react';
import grapesjs         from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import * as presetWebpage from 'grapesjs-preset-webpage';
import { initialiseEditorStyles } from './editorStyles';   // ← add

export default function VisualEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      fromElement: false,
      storageManager: false,
      plugins: [
        (e) => presetWebpage.default(e, { blocks: ['text','link','image','video'] }),
      ],
      canvas: {
        styles: [                 // we no longer need tailwind here – will be injected
          '/static/homepage.css',
        ],
      },
    });

    /* inject “show everything” styles */
    initialiseEditorStyles(editor);

    /* load the static HTML + CSS ----------------------------------------- */
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
      } catch (err) {
        console.error('❌ failed injecting homepage into GrapesJS', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
