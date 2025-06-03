import { useEffect, useRef } from "react";
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import { editorJSBlock } from './blocks/EditorJSBlock';
import { quillBlock } from './blocks/QuillBlock';
import { tipTapBlock } from './blocks/TipTapBlock';
import ErrorBoundary from './ErrorBoundary';
import { logger } from '../../lib/utils/logger';
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
      },
      styleManager: {
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'min-height', 'padding', 'margin']
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'text-align']
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border-radius', 'border', 'box-shadow']
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['opacity', 'transition', 'transform']
          }
        ]
      }
    });

    // Initialize blocks
    editorJSBlock(editor);
    quillBlock(editor);
    tipTapBlock(editor);

    // Set initial content when the frame is ready
    editor.on('canvas:frame:load', () => {
      const frame = editor.Canvas.getFrame();
      if (!frame?.contentDocument) return;
      
      // Add base styles
      const styleEl = frame.contentDocument.createElement('style');
      styleEl.innerHTML = `
        :root {
          --color-primary: #3B82F6;
          --color-secondary: #60A5FA;
          --color-background: #000000;
          --color-text: #FFFFFF;
          --color-accent: #2563EB;
          --font-heading: 'Playfair Display';
          --font-body: 'Playfair Display';
        }

        body {
          margin: 0;
          font-family: var(--font-body), serif !important;
          background-color: var(--color-background) !important;
          color: var(--color-text) !important;
          min-height: 100vh;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading), serif !important;
        }
      `;
      frame.contentDocument.head.appendChild(styleEl);

      // Add Tailwind CSS
      const tailwindLink = frame.contentDocument.createElement('link');
      tailwindLink.rel = 'stylesheet';
      tailwindLink.href = '/tailwind.output.css';
      frame.contentDocument.head.appendChild(tailwindLink);

      // Set initial content
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
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Editor error boundary caught error', error, {
          context: 'VisualEditor',
          data: errorInfo
        });
      }}
    >
      <div className="min-h-screen bg-black">
        <div ref={containerRef} className="h-screen" />
      </div>
    </ErrorBoundary>
  );
};

export default VisualEditor;