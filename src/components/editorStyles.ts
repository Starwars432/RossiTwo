// src/components/editorStyles.ts
import { Editor } from 'grapesjs';

/**
 * Inject Tailwind + Google Fonts into the GrapesJS iframe
 * without forcing any background colour.
 */
export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const frame = editor.Canvas.getFrame();
    const doc   = frame?.contentDocument;
    const head  = doc?.head;

    if (!doc || !head) return;

    /* Tailwind (already loaded via /static/homepage.css but
       keeping this allows live‑preview of new utility classes) */
    const tailwind = doc.createElement('link');
    tailwind.rel = 'stylesheet';
    tailwind.href = '/tailwind.output.css';
    head.appendChild(tailwind);

    /* Google Font */
    const font = doc.createElement('link');
    font.rel = 'stylesheet';
    font.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap';
    head.appendChild(font);

    /* Minimal reset */
    const style = doc.createElement('style');
    style.textContent = `
      *,*::before,*::after{opacity:1!important;transform:none!important;visibility:visible!important;}
      body{margin:0;min-height:100vh;}
    `;
    head.appendChild(style);
  });

  /* Make GrapesJS outer wrapper transparent */
  const outer = document.createElement('style');
  outer.textContent = `.gjs-cv-canvas{background:transparent!important;}`;
  document.head.appendChild(outer);
};
