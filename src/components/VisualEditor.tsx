import { useEffect, useRef } from 'react';
import grapesjs, { Editor as GrapesEditor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const VisualEditor = () => {
  // Hold the GrapesJS instance so you can access it later if needed
  const editorRef = useRef<GrapesEditor | null>(null);

  useEffect(() => {
    /* ------------------------------------------------------------------
       1. Initialise GrapesJS
    ------------------------------------------------------------------ */
    const editor = grapesjs.init(
      {
        container: '#gjs',
        // we’ll control height via CSS; keep it ‘auto’ here
        height: 'auto',
        fromElement: false,
        storageManager: false,
        canvas: {
          styles: [
            '/tailwind.output.css',
            'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;600;800&display=swap',
          ],
        },
      } as any // GrapesJS type defs don’t include all props; cast to 'any'
    );

    editorRef.current = editor;

    /* ------------------------------------------------------------------
       2. When GrapesJS is ready, inject the homepage HTML & styles
    ------------------------------------------------------------------ */
    editor.on('load', async () => {
      try {
        const [html, css] = await Promise.all([
          fetch('/static/homepage.html').then((r) => r.text()),
          fetch('/tailwind.output.css').then((r) => r.text()),
        ]);

        editor.setComponents(html);
        editor.setStyle(css);

        /* --------------------------------------------------------------
           3. Ensure the iframe body isn’t clipped / hidden
        -------------------------------------------------------------- */
        const frame = editor.Canvas.getFrame();
        const doc = frame?.contentDocument;
        const body = doc?.body;

        if (body) {
          body.style.minHeight = '100vh';
          body.style.overflow = 'visible';
          body.style.background = 'transparent';
          // add some padding so you can scroll/see everything
          body.style.padding = '2rem';
        }
      } catch (err) {
        console.error('❌ Failed to load homepage or CSS', err);
      }
    });

    return () => {
      editor.destroy();
    };
  }, []);

  /* --------------------------------------------------------------------
     4. Editor container: take full viewport height, allow scrolling
  -------------------------------------------------------------------- */
  return (
    <div
      id="gjs"
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'auto',
        backgroundColor: '#000', // optional: matches site background
      }}
    />
  );
};

export default VisualEditor;
