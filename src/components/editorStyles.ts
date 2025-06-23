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
    const body  = doc?.body;
    if (!doc || !head || !body) return;

    /* Tailwind + Google Fonts -------- */
    appendStylesheet(head, '/static/homepage.css');
    appendStylesheet(head, 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

    /* Force-show all animations, remove scroll watchers, override backgrounds */
    const forceVisible = doc.createElement('style');
    forceVisible.textContent = `
      html, body {
        min-height: 100vh !important;
        background-color: black !important;
        color: white !important;
        margin: 0 !important;
        font-family: 'Playfair Display', serif !important;
        overflow: visible !important;
      }

      *, *::before, *::after {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }

      /* Reveal Framer Motion/scroll hidden stuff */
      [style*="opacity: 0"] {
        opacity: 1 !important;
      }

      [style*="transform: translateY("] {
        transform: translateY(0px) !important;
      }

      [data-observe] {
        opacity: 1 !important;
        transform: none !important;
      }

      /* AOS animation overrides */
      .aos-init, .aos-animate {
        opacity: 1 !important;
        transform: none !important;
      }

      /* Motion div overrides */
      [data-framer-motion] {
        opacity: 1 !important;
        transform: none !important;
      }
    `;
    head.appendChild(forceVisible);
  });

  // Optional: outer canvas styling
  const outerStyles = document.createElement('style');
  outerStyles.innerHTML = `
    .gjs-cv-canvas { 
      background-color: black !important; 
    }
    .gjs-frame-wrapper { 
      padding: 1rem !important; 
    }
  `;
  document.head.appendChild(outerStyles);
};

function appendStylesheet (head: HTMLHeadElement, href: string) {
  if (head.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel   = 'stylesheet';
  link.href  = href;
  head.appendChild(link);
}