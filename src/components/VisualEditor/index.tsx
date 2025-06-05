import { useEffect, useRef } from "react";
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
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
      plugins: [grapesjsPresetWebpage],
      pageManager: {
        pages: [
          {
            id: 'home',
            name: 'Home',
            component: ReactDOMServer.renderToString(
              <div className="min-h-screen bg-black text-white relative font-serif overflow-x-hidden">
                <Navigation onLoginClick={() => {}} />
                <Hero />
                <Services />
                <CustomDesign />
                <Contact />
                <Footer />
              </div>
            )
          },
          {
            id: 'services',
            name: 'Services',
            component: ReactDOMServer.renderToString(<Services />)
          },
          {
            id: 'custom-design',
            name: 'Custom Design',
            component: ReactDOMServer.renderToString(<CustomDesign />)
          },
          {
            id: 'contact',
            name: 'Contact',
            component: ReactDOMServer.renderToString(<Contact />)
          }
        ]
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
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
    editor.on('canvas:frame:load', () => {
      initializeEditorStyles(editor);
    });

    // Handle page changes
    editor.on('page:select', (page: any) => {
      console.log('Page selected:', page);
      const selectedPage = editor.Pages.getSelected();
      if (selectedPage) {
        editor.setComponents(selectedPage.get('component'));
      }
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