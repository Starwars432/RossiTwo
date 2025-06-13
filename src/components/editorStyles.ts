import { Editor } from 'grapesjs';

export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    console.log("📦 canvas:frame:load triggered");

    const attempt = () => {
      const frame = editor.Canvas.getFrame();
      const doc = frame?.contentDocument;

      if (!doc) {
        console.warn("⏳ Frame document not ready. Retrying...");
        setTimeout(attempt, 100);
        return;
      }

      const head = doc.head;
      const body = doc.body;

      if (!head || !body) {
        console.warn("⏳ Head or body missing. Retrying...");
        setTimeout(attempt, 100);
        return;
      }

      // ✅ Force reset style for visibility
      const style = doc.createElement("style");
      style.innerHTML = `
        html, body {
          background: black !important;
          color: white !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'Playfair Display', serif !important;
          min-height: 100vh !important;
        }

        *, *::before, *::after {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
          animation: none !important;
        }
      `;
      head.appendChild(style);

      // Load Tailwind and Google Fonts
      const tailwind = doc.createElement("link");
      tailwind.rel = "stylesheet";
      tailwind.href = "/tailwind.output.css";
      head.appendChild(tailwind);

      const font = doc.createElement("link");
      font.rel = "stylesheet";
      font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
      head.appendChild(font);

      // ✅ Inject visible debug content
      editor.setComponents(`
        <section class="min-h-screen bg-black text-white p-8">
          <h1 class="text-4xl font-bold">✅ Canvas Loaded</h1>
          <p>This HTML was injected directly after DOM stabilization.</p>
        </section>
      `);

      console.log("✅ Styles and test HTML injected into canvas");
    };

    attempt(); // kick off retry loop
  });

  // Optional outer editor styling
  const outerStyle = document.createElement("style");
  outerStyle.innerHTML = `
    .gjs-cv-canvas { background: #000 !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
  `;
  document.head.appendChild(outerStyle);
};
