// src/components/editorStyles.ts
import { Editor } from 'grapesjs';

/**
 * Run once, right after the GrapesJS iframe has loaded,
 * to make absolutely every element visible.
 */
export const initialiseEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const frame = editor.Canvas.getFrame();
    const doc   = frame?.contentDocument;
    const head  = doc?.head;
    if (!doc || !head) return;

    /* Tailwind + Google Fonts (already present) -------- */
    appendStylesheet(head, '/tailwind.output.css');
    appendStylesheet(head, 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

    /* NEW:  Hard-override every animation / transition  */
    const forceVisible = doc.createElement('style');
    forceVisible.textContent = `
      /* stop all css / aos / framer animations */
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        opacity: 1   !important;
        transform: none !important;
        visibility: visible !important;
      }
      html, body {
        min-height: 100vh !important;
        background: black !important;
        color: white !important;
        margin: 0 !important;
        font-family: 'Playfair Display', serif !important;
        overflow: visible !important;
      }
    `;
    head.appendChild(forceVisible);
  });
};

function appendStylesheet (head: HTMLHeadElement, href: string) {
  if (head.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel   = 'stylesheet';
  link.href  = href;
  head.appendChild(link);
}
