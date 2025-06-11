import { Editor } from 'grapesjs';

export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    console.log("📦 canvas:frame:load triggered");

    const tryInject = () => {
      const frame = editor.Canvas.getFrame();
      const doc = frame?.contentDocument;
      const head = doc?.head;
      const body = doc?.body;

      if (!doc || !head || !body) {
        console.warn("⏳ Retrying DOM access...");
        setTimeout(tryInject, 100);
        return;
      }

      // 🔁 Wait for GrapesJS wrapper to be available
      const wrapper = editor.getWrapper();
      if (!wrapper) {
        console.warn("⏳ Waiting for wrapper...");
        setTimeout(tryInject, 100);
        return;
      }

      // ✅ Inject custom styles
      const styleEl = doc.createElement('style');
      styleEl.innerHTML = `
        body {
          background-color: black;
          color: white;
          margin: 0;
          font-family: 'Playfair Display', serif;
          min-height: 100vh;
        }
        *, *::before, *::after {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }
      `;
      head.appendChild(styleEl);

      const tailwind = doc.createElement("link");
      tailwind.rel = "stylesheet";
      tailwind.href = "/tailwind.output.css";
      head.appendChild(tailwind);

      const font = doc.createElement("link");
      font.rel = "stylesheet";
      font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
      head.appendChild(font);

      // ✅ Force background for visibility
      body.style.backgroundColor = "black";
      body.style.color = "white";

      // ✅ Inject test HTML once wrapper is ready
      editor.setComponents(`
        <section class="min-h-screen bg-black text-white p-8">
          <h1 class="text-4xl font-bold">✅ GrapesJS Canvas Renders</h1>
          <p>This was injected after successful DOM + wrapper readiness.</p>
        </section>
      `);

      console.log("✅ Styles and components injected!");
    };

    tryInject();
  });

  // Optional: style GrapesJS outer editor UI
  const outerStyle = document.createElement('style');
  outerStyle.innerHTML = `
    .gjs-cv-canvas { background-color: #000 !important; }
    .gjs-frame-wrapper { padding: 1rem !important; }
  `;
  document.head.appendChild(outerStyle);
};
