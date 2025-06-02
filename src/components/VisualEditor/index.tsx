import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../../lib/stores/pageStore';
import { useTabStore } from '../../lib/stores/tabStore';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import { editorJSBlock } from './blocks/EditorJSBlock';
import { quillBlock } from './blocks/QuillBlock';
import { tipTapBlock } from './blocks/TipTapBlock';
import { initializeEditorStyles } from './editorStyles';
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
  const { pageId } = useParams();
  const { loadPage, savePage } = usePageStore();
  const { addTab } = useTabStore();
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
      }
    });

    // Initialize editor styles
    initializeEditorStyles(editor);

    editor.on('canvas:frame:load', () => {
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
    editorJSBlock(editor);
    quillBlock(editor);
    tipTapBlock(editor);

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