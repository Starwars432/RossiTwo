// src/components/editorStyles.ts
import { Editor } from 'grapesjs';

/**
 * Inject CSS + runtime visibility resets into the iframe after it's loaded.
 */
export const initialiseEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const frame = editor.Canvas.getFrame();
    const doc = frame?.contentDocument;
    const head = doc?.head;
    const body = doc?.body;
    if (!doc || !head || !body) return;

    // ✅ Append external CSS files
    appendStylesheet(head, '/static/homepage.css');
    appendStylesheet(head, 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

    // ✅ Append force-visible CSS rules
    const style = doc.createElement('style');
    style.textContent = `
      html, body {
        min-height: 100vh !important;
        background-color: black !important;
        color: white !important;
        font-family: 'Playfair Display', serif !important;
        margin: 0 !important;
        overflow: visible !important;
      }

      *, *::before, *::after {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }

      [data-framer-motion], [data-observe], .aos-init, .aos-animate {
        opacity: 1 !important;
        transform: none !important;
      }
    `;
    head.appendChild(style);

    // ✅ Remove inline styles — just like you did manually in the console
    body.querySelectorAll<HTMLElement>('*').forEach((el) => {
      el.removeAttribute('style');
    });
  });

  // Optional: Style outer canvas
  const outer = document.createElement('style');
  outer.textContent = `
    .gjs-cv-canvas {
      background-color: black !important;
    }
    .gjs-frame-wrapper {
      padding: 1rem !important;
    }
  `;
  document.head.appendChild(outer);
};

function appendStylesheet(head: HTMLHeadElement, href: string) {
  if (head.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  head.appendChild(link);
}
