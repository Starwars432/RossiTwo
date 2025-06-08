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

    // Cast as any to avoid TypeScript issues with undocumented properties
    const editor = grapesjs.init({
      container: "#editor",
      height: "100vh",
      width: "100%",
      storageManager: false,
      plugins: ['gjs-preset-webpage'],
      canvas: {
        styles: [
          '/tailwind.output.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap',
        ]
      }
    } as any);

    editorRef.current = editor;

    editor.on('canvas:frame:load', () => {
      const frame = editor.Canvas.getFrame();
      const head = frame?.contentDocument?.head;

      if (head) {
        // Add Tailwind CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/tailwind.output.css';
        head.appendChild(link);

        // Add debug styles to force visibility
        const debugStyle = document.createElement('style');
        debugStyle.innerHTML = `
          /* Debug styles to ensure content is visible */
          * {
            opacity: 1 !important;
            transform: none !important;
          }
          
          /* Specific fixes for common hidden elements */
          [id*="iwysl"], [id*="ielwx"], [id*="i"] {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }
          
          /* Ensure all sections are visible */
          section, div, nav, header, footer {
            opacity: 1 !important;
            transform: none !important;
          }
        `;
        head.appendChild(debugStyle);
      }

      const body = frame?.contentDocument?.body;
      if (body) {
        // Force visibility on all elements with IDs
        body.querySelectorAll('[id]').forEach(el => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'none';
          (el as HTMLElement).style.visibility = 'visible';
        });

        // Also fix any elements that might be hidden by animation classes
        body.querySelectorAll('*').forEach(el => {
          const element = el as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
          }
        });
      }

      try {
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

        editor.setComponents(initialContent);
      } catch (error) {
        console.error('Error rendering content to editor:', error);
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div id="editor" className="min-h-screen w-full bg-white text-black" />
  );
};

export default VisualEditor;