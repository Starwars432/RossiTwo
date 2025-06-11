import { Editor } from "grapesjs";

export const initializeEditorStyles = (editor: Editor) => {
  // Wait for the editor to be fully loaded before accessing Canvas
  editor.on('load', () => {
    // Delay setup until iframe document is reliably available
    const waitForIframe = () => {
      const frame = editor.Canvas.getFrame();
      const doc = frame?.contentDocument;

      if (!doc) {
        console.warn("⏳ Waiting for iframe contentDocument...");
        setTimeout(waitForIframe, 100); // Retry in 100ms
        return;
      }

      const head = doc.head;
      const body = doc.body;

      if (!head || !body) {
        console.warn("⏳ Waiting for head/body...");
        setTimeout(waitForIframe, 100); // Retry again
        return;
      }

      console.log("✅ iframe DOM ready for injection");

      // Inject CSS files
      const tailwind = doc.createElement("link");
      tailwind.rel = "stylesheet";
      tailwind.href = "/tailwind.output.css";
      head.appendChild(tailwind);

      const font = doc.createElement("link");
      font.rel = "stylesheet";
      font.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
      head.appendChild(font);

      // Inject inline base styles
      const styleEl = doc.createElement("style");
      styleEl.innerHTML = `
        body {
          margin: 0;
          font-family: 'Playfair Display', serif;
          background-color: black;
          color: white;
          min-height: 100vh;
        }

        *, *::before, *::after {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }
      `;
      head.appendChild(styleEl);

      // Inject test component to confirm
      editor.setComponents(`
        <section class="min-h-screen bg-black text-white p-8">
          <h1 class="text-4xl font-bold mb-4">✅ DOM Ready!</h1>
          <p>This was injected once iframe DOM was available.</p>
        </section>
      `);
    };

    // Start polling after short delay
    setTimeout(waitForIframe, 50);
  });

  // Style the outer GrapesJS editor UI
  const outerStyle = document.createElement("style");
  outerStyle.innerHTML = `
    .gjs-cv-canvas { background-color: #000 !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
  `;
  document.head.appendChild(outerStyle);
};