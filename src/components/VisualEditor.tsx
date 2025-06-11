import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import presetWebpage from "grapesjs-preset-webpage";
import "grapesjs/dist/css/grapes.min.css";
import { initializeEditorStyles } from "./editorStyles";

const VisualEditor: React.FC = () => {
  const editorRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    console.log("🧪 Initializing GrapesJS (stable)");

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100vh",
      width: "100%",
      storageManager: false,
      plugins: [presetWebpage],
      canvas: {
        styles: [
          "/tailwind.output.css",
          "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
        ],
      },
      deviceManager: {
        devices: [
          { name: "Desktop", width: "" },
          { name: "Tablet", width: "768px", widthMedia: "768px" },
          { name: "Mobile", width: "375px", widthMedia: "375px" },
        ],
      },
    });

    editorRef.current = editor;

    // Load styles and then inject HTML only after iframe fully ready
    editor.on("canvas:frame:load", () => {
      console.log("✅ GrapesJS iframe fully loaded");

      const frame = editor.Canvas.getFrame();
      const doc = frame?.contentDocument;
      const head = doc?.head;
      const body = doc?.body;

      if (!doc || !head || !body) {
        console.warn("❌ iframe or its document structure is missing");
        return;
      }

      // Add Tailwind + font link again (safety)
      const tailwind = document.createElement("link");
      tailwind.rel = "stylesheet";
      tailwind.href = "/tailwind.output.css";
      head.appendChild(tailwind);

      const font = document.createElement("link");
      font.rel = "stylesheet";
      font.href = "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap";
      head.appendChild(font);

      // Make sure body is visible
      body.style.opacity = "1";
      body.style.visibility = "visible";
      body.style.transform = "none";

      // Inject simple test HTML
      editor.setComponents(`
        <section style="min-height: 100vh; background-color: black; color: white; padding: 2rem;">
          <h1 style="font-size: 2rem;">✅ Working Editor</h1>
          <p>This content is visible and editable in GrapesJS.</p>
        </section>
      `);

      // Apply custom styling
      initializeEditorStyles(editor);
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div ref={containerRef} className="h-screen" />
    </div>
  );
};

export default VisualEditor;
