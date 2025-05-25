import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../../lib/stores/pageStore';
import { useTabStore } from '../../lib/stores/tabStore';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import ReactDOMServer from 'react-dom/server';
import { editorJSBlock } from './blocks/EditorJSBlock';
import { quillBlock } from './blocks/QuillBlock';
import { tipTapBlock } from './blocks/TipTapBlock';
import ErrorBoundary from './ErrorBoundary';
import { logger } from '../../lib/utils/logger';

// Import website components
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
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();

  const handleSave = useCallback(async () => {
    if (!editorRef.current.editor || !pageId) {
      logger.warn('Cannot save: editor or pageId not available', { context: 'VisualEditor' });
      return;
    }

    try {
      const html = editorRef.current.editor.getHtml();
      const css = editorRef.current.editor.getCss();

      // Get block data with error handling
      const getBlockData = (selector: string, dataKey: string) => {
        try {
          return editorRef.current.editor?.DomComponents.getComponents()
            .filter((comp) => comp.getClasses().includes(selector))
            .map((comp) => ({
              id: comp.getId(),
              data: comp.get(dataKey)
            })) || [];
        } catch (error) {
          logger.error(`Failed to get ${selector} data`, error as Error, { context: 'VisualEditor' });
          return [];
        }
      };

      const editorJSData = getBlockData('editorjs-container', 'editorjs-data');
      const quillData = getBlockData('quill-container', 'quill-content');
      const tipTapData = getBlockData('tiptap-container', 'tiptap-content');

      await savePage({
        id: pageId,
        content: html,
        metadata: { 
          css,
          editorJSData,
          quillData,
          tipTapData
        },
        title: 'Untitled',
        slug: 'untitled',
        blocks: [],
        updatedAt: new Date().toISOString()
      });

      logger.info('Page saved successfully', { context: 'VisualEditor', data: { pageId } });
    } catch (error) {
      logger.error('Failed to save page', error as Error, { context: 'VisualEditor' });
      setError('Failed to save page. Please try again.');
    }
  }, [pageId, savePage]);

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current || editorRef.current.editor) return;

    const initEditor = async () => {
      if (!containerRef.current) return;

      // Initialize GrapesJS
      editorRef.current.editor = grapesjs.init({
        container: containerRef.current,
        height: '100vh',
        width: 'auto',
        storageManager: false,
        plugins: ['gjs-preset-webpage'],
        pluginsOpts: {
          'gjs-preset-webpage': {}
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap',
            'https://cdn.tailwindcss.com'
          ]
        },
        blockManager: {
          blocks: []
        },
        panels: {
          defaults: [
            {
              id: 'actions',
              buttons: [
                {
                  id: 'save',
                  className: 'btn-save',
                  label: 'Save',
                  command: () => handleSave()
                }
              ]
            }
          ]
        }
      });

      // Initialize blocks
      editorJSBlock(editorRef.current.editor);
      quillBlock(editorRef.current.editor);
      tipTapBlock(editorRef.current.editor);

      // Wait for editor to be ready
      editorRef.current.editor.on('load', () => {
        setIsEditorReady(true);
      });
    };

    initEditor();

    return () => {
      if (editorRef.current.editor) {
        editorRef.current.editor.destroy();
        editorRef.current.editor = null;
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [handleSave]);

  // Load content after editor is ready
  useEffect(() => {
    if (!isEditorReady || !editorRef.current.editor || !pageId) return;

    let isSubscribed = true;

    const loadContent = async () => {
      try {
        // Load initial website content
        const content = ReactDOMServer.renderToString(
          <>
            <Navigation />
            <Hero />
            <Services />
            <CustomDesign />
            <Contact />
            <Footer />
          </>
        );

        if (!isSubscribed || !editorRef.current.editor) return;

        editorRef.current.editor.setComponents(content);

        // Load page-specific content if pageId exists
        const page = await loadPage(pageId);
        if (!isSubscribed || !editorRef.current.editor) return;

        if (page) {
          addTab(page.id, page);
          if (page.content) {
            editorRef.current.editor.setComponents(page.content);
          }
          if (page.metadata?.css) {
            editorRef.current.editor.setStyle(page.metadata.css as string);
          }

          // Set up auto-save
          if (autoSaveIntervalRef.current) {
            clearInterval(autoSaveIntervalRef.current);
          }
          autoSaveIntervalRef.current = setInterval(handleSave, 30000);
        }
      } catch (error) {
        logger.error('Error loading content:', error as Error, { context: 'VisualEditor' });
        if (!isSubscribed) return;
        setError('Failed to load content. Please try refreshing the page.');
      }
    };

    loadContent();

    return () => {
      isSubscribed = false;
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [isEditorReady, pageId, loadPage, addTab, handleSave]);

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
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        <div ref={containerRef} className="h-screen" />
      </div>
    </ErrorBoundary>
  );
};

export default VisualEditor;