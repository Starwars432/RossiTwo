import { Editor } from 'grapesjs';

export const initialiseEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const frame = editor.Canvas.getFrame();
    const doc = frame?.contentDocument;
    const head = doc?.head;
    const body = doc?.body;
    if (!doc || !head || !body) return;

    // ✅ Append stylesheets
    appendStylesheet(head, '/static/homepage.css');
    appendStylesheet(head, 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

    // ✅ Force-visible styles
    const style = doc.createElement('style');
    style.innerHTML = `
      html, body {
        min-height: 100vh !important;
        background: black !important;
        color: white !important;
        font-family: 'Playfair Display', serif !important;
        margin: 0 !important;
        overflow: visible !important;
      }

      *, *::before, *::after {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
        animation: none !important;
        transition: none !important;
      }

      [style*="opacity"] {
        opacity: 1 !important;
      }

      [style*="transform"] {
        transform: none !important;
      }

      [style*="visibility"] {
        visibility: visible !important;
      }

      [data-framer-motion],
      [data-observe],
      .aos-init,
      .aos-animate {
        opacity: 1 !important;
        transform: none !important;
      }
    `;
    head.appendChild(style);
  });

  const outer = document.createElement('style');
  outer.innerHTML = `
    .gjs-cv-canvas { background-color: black !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
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
