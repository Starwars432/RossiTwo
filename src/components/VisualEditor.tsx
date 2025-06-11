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
    });

    editorRef.current = editor;

    // Initialize editor styles and handle all iframe setup
    initializeEditorStyles(editor);

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div ref={containerRef} className="h-screen" />
    </div>
  );
};

export default VisualEditor;