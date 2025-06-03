import { useEffect, useRef } from "react";
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import { initializeEditorStyles } from './editorStyles';
import ReactDOMServer from 'react-dom/server';
import Navigation from '../Navigation';
import Hero from '../Hero';
import Services from '../Services';
import CustomDesign from '../CustomDesign';
import Contact from '../Contact';
import Footer from '../Footer';

interface EditorInstance {
  editor: Editor | null;
}

const VisualEditor: React.FC = () => {
  const editorRef = useRef<EditorInstance>({ editor: null });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current.editor) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: false,
      plugins: ['gjs-preset-webpage'],
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap',
          '/tailwind.output.css'
        ]
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '768px',
          },
          {
            name: 'Mobile',
            width: '375px',
            widthMedia: '375px',
          }
        ]
      }
    });

    // Initialize editor styles
    initializeEditorStyles(editor);

    // Set initial content when the frame is ready
    editor.on('canvas:frame:load', () => {
      const initialContent = ReactDOMServer.renderToString(
        <div className="min-h-screen bg-black text-white relative font-serif overflow-x-hidden">
          <Navigation onLoginClick={() => {}} />
          <Hero />
          <Services />
          <CustomDesign />
          <Contact />
          <Footer />
        </div>
      );

      editor.setComponents(initialContent);
    });

    editorRef.current.editor = editor;

    return () => {
      if (editorRef.current.editor) {
        editorRef.current.editor.destroy();
        editorRef.current.editor = null;
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