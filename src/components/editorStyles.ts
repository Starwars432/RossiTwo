// src/components/editorStyles.ts
import { Editor } from 'grapesjs';

export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const frame = editor.Canvas.getFrame();
    const doc = frame?.contentDocument;
    const head = doc?.head;
    const body = doc?.body;

    if (!doc || !head || !body) return;

    // ✅ Tailwind (live-preview of custom utilities)
    const tailwind = doc.createElement('link');
    tailwind.rel = 'stylesheet';
    tailwind.href = '/tailwind.output.css';
    head.appendChild(tailwind);

    // ✅ Google Fonts
    const font = doc.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap';
    head.appendChild(font);

    // ✅ Inject minimal and stable iframe CSS
    const style = doc.createElement('style');
    style.textContent = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100vh !important;
        font-family: 'Playfair Display', serif !important;
        background-color: transparent !important;
      }
      *, *::before, *::after {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
        animation: none !important;
      }

      /* Optional: add visible outline to every component for debugging */
      [data-gjs-highlightable] {
        outline: 1px dashed rgba(255, 255, 255, 0.2);
      }
    `;
    head.appendChild(style);
  });

  // ✅ GrapesJS wrapper outside the iframe
  const outer = document.createElement('style');
  outer.textContent = `
    .gjs-cv-canvas { background: transparent !important; }
    .gjs-frame-wrapper { padding: 1rem; }
    .gjs-frame { background-color: transparent !important; }
  `;
  document.head.appendChild(outer);
};
