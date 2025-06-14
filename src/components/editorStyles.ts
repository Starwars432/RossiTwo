// src/components/editorStyles.ts
import { Editor } from 'grapesjs';

/**
 * Injects Tailwind, Google Fonts and a safe reset into the GrapesJS canvas
 * iframe — without forcing everything to white text.
 */
export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const waitForIframeReady = () => {
      const frame = editor.Canvas.getFrame();
      const doc = frame?.contentDocument;

      if (!doc || doc.readyState !== 'complete') {
        // iframe still loading → try again in 50 ms
        setTimeout(waitForIframeReady, 50);
        return;
      }

      const { head, body } = doc;
      if (!head || !body) {
        setTimeout(waitForIframeReady, 50);
        return;
      }

      /* ------------------------------------------------------------------
         1.  Tailwind + Fonts
      ------------------------------------------------------------------ */
      const tailwind = doc.createElement('link');
      tailwind.rel = 'stylesheet';
      tailwind.href = '/tailwind.output.css';      // ✅ point to your build
      head.appendChild(tailwind);

      const font = doc.createElement('link');
      font.rel = 'stylesheet';
      font.href =
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap';
      head.appendChild(font);

      /* ------------------------------------------------------------------
         2.  Minimal reset (no forced colours!)
      ------------------------------------------------------------------ */
      const style = doc.createElement('style');
      style.innerHTML = `
        /* make sure no element is hidden or mid‑animation */
        *, *::before, *::after {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }
        /* let Tailwind handle layout; just clear default margins */
        body { margin: 0; min-height: 100vh; }
      `;
      head.appendChild(style);
    };

    waitForIframeReady();
  });

  /* --------------------------------------------------------------------
     3.  Optional outer‑chrome tweaks for the GrapesJS UI
  -------------------------------------------------------------------- */
  const outerStyle = document.createElement('style');
  outerStyle.innerHTML = `
    .gjs-cv-canvas { background-color: #000 !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
  `;
  document.head.appendChild(outerStyle);
};
