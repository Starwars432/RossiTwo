import { Editor } from 'grapesjs';

export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    console.log("🎯 Frame load event triggered");

    const frame = editor.Canvas.getFrame();
    const doc = frame?.contentDocument;

    if (!doc) {
      console.warn("⏳ Document not ready, retrying...");
      setTimeout(() => initializeEditorStyles(editor), 50); // Re-call until ready
      return;
    }

    const head = doc.head;
    const body = doc.body;

    if (!head || !body) {
      console.warn("⏳ Head/body missing, retrying...");
      setTimeout(() => initializeEditorStyles(editor), 50);
      return;
    }

    // ✅ Inject CSS styles
    const styleEl = doc.createElement('style');
    styleEl.innerHTML = `
      :root {
        --color-primary: #3B82F6;
        --color-background: #000;
        --color-text: #FFF;
      }

      body {
        margin: 0;
        background-color: var(--color-background) !important;
        color: var(--color-text) !important;
      }

      *, *::before, *::after {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
      }
    `;
    head.appendChild(styleEl);

    // Tailwind
    const tailwind = doc.createElement('link');
    tailwind.rel = 'stylesheet';
    tailwind.href = '/tailwind.output.css';
    head.appendChild(tailwind);

    // Google Font
    const font = doc.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap';
    head.appendChild(font);

    // Inject minimal HTML
    editor.setComponents(`
      <section class="min-h-screen bg-black text-white p-8">
        <h1 class="text-4xl font-bold mb-4">✅ Canvas Rendered</h1>
        <p>This confirms the iframe DOM is fully accessible.</p>
      </section>
    `);

    console.log("✅ Styles and HTML injected into canvas");
  });

  // Outer UI styles
  const outerStyle = document.createElement('style');
  outerStyle.innerHTML = `
    .gjs-cv-canvas { background-color: #000 !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
  `;
  document.head.appendChild(outerStyle);
};
