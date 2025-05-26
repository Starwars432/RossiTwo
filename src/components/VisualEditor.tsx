import { useEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-webpage";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Services from "./Services";
import CustomDesign from "./CustomDesign";
import Contact from "./Contact";
import Footer from "./Footer";
import ReactDOMServer from "react-dom/server";

const VisualEditor: React.FC = () => {
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current) return;

    const editor = grapesjs.init({
      container: "#editor",
      height: "100vh",
      width: "100%",
      storageManager: false,
      plugins: ['gjs-preset-webpage'],
      canvas: {
        styles: [
          '/assets/index-xuDJ4M-J.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap',
          'https://cdn.tailwindcss.com'
        ]
      }
    });

    editorRef.current = editor;

    // Load initial content
    const initialContent = ReactDOMServer.renderToString(
      <>
        <Navigation onLoginClick={() => {}} />
        <Hero />
        <Services />
        <CustomDesign />
        <Contact />
        <Footer />
      </>
    );

    // Get the document from the canvas frame
    const canvasDoc = editor.Canvas.getDocument();
    
    // Add styles to the canvas document head
    const styleEl = canvasDoc.createElement('style');
    styleEl.innerHTML = `
      /* Add any additional styles needed */
      body {
        margin: 0;
        font-family: var(--font-body), serif;
        background: var(--color-background);
        color: var(--color-text);
      }
    `;
    canvasDoc.head.appendChild(styleEl);

    // Set the initial content
    editor.setComponents(initialContent);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      id="editor" 
      className="min-h-screen w-full bg-white text-black"
    />
  );
};

export default VisualEditor;