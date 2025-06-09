import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import presetWebpage from "grapesjs-preset-webpage";
import "grapesjs/dist/css/grapes.min.css";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Services from "./Services";
import CustomDesign from "./CustomDesign";
import Contact from "./Contact";
import Footer from "./Footer";
import ReactDOMServer from "react-dom/server";
import { initializeEditorStyles } from "./editorStyles";

const VisualEditor: React.FC = () => {
  const editorRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    console.log("🧪 Initializing GrapesJS...");

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

    editor.on("canvas:frame:load", () => {
      console.log("✅ GrapesJS iframe loaded");

      const frame = editor.Canvas.getFrame();
      const head = frame?.contentDocument?.head;

      if (head) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/tailwind.output.css";
        head.appendChild(link);

        const debugStyle = document.createElement("style");
        debugStyle.innerHTML = `
          * {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }

          section, div, nav, header, footer {
            opacity: 1 !important;
            transform: none !important;
          }
        `;
        head.appendChild(debugStyle);
      }

      const body = frame?.contentDocument?.body;
      if (body) {
        body.querySelectorAll("*").forEach((el) => {
          const element = el as HTMLElement;
          element.style.opacity = "1";
          element.style.transform = "none";
          element.style.visibility = "visible";
        });
      }

      try {
        // TEST MODE: Render only one component to isolate issues
        const html = ReactDOMServer.renderToString(
          <Navigation onLoginClick={() => {}} />
        );
        editor.setComponents(html);
      } catch (error) {
        console.error("❌ Error rendering component:", error);
      }

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
