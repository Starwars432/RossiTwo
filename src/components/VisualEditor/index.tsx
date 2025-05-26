import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../../lib/stores/pageStore';
import { useTabStore } from '../../lib/stores/tabStore';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import { editorJSBlock } from './blocks/EditorJSBlock';
import { quillBlock } from './blocks/QuillBlock';
import { tipTapBlock } from './blocks/TipTapBlock';
import ErrorBoundary from './ErrorBoundary';
import { logger } from '../../lib/utils/logger';

interface EditorInstance {
  editor: Editor | null;
}

interface ExtendedEditor extends Editor {
  Panels?: {
    addButton: (panelId: string, options: any) => void;
  };
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

  useEffect(() => {
    if (!containerRef.current || editorRef.current.editor) return;

    const editor = grapesjs.init({
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
          '/assets/index-xuDJ4M-J.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap',
          'https://cdn.tailwindcss.com'
        ]
      },
      blockManager: {
        blocks: []
      }
    });

    const extendedEditor = editor as ExtendedEditor;
    extendedEditor.Panels?.addButton('options', {
      id: 'save',
      className: 'btn-save',
      label: 'Save',
      command: () => handleSave()
    });

    editorRef.current.editor = editor;

    editorJSBlock(editor);
    quillBlock(editor);
    tipTapBlock(editor);

    editor.on('load', () => {
      setIsEditorReady(true);
    });

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

  useEffect(() => {
    if (!isEditorReady || !editorRef.current.editor || !pageId) return;

    let isSubscribed = true;

    const loadContent = async () => {
      try {
        const initialContent = `
          <div class="min-h-screen bg-black text-white relative font-serif overflow-x-hidden">
            <nav class="w-full z-50 px-6 py-4 bg-black/50 backdrop-blur-sm"></nav>
            <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden"></section>
            <section id="services" class="relative py-20 px-6"></section>
            <section id="custom-design" class="relative py-20 px-6 bg-blue-900/10"></section>
            <section id="contact" class="relative py-20 px-6 bg-black"></section>
            <footer class="bg-black/50 backdrop-blur-lg py-16 px-6"></footer>
          </div>
        `;

        if (!isSubscribed || !editorRef.current.editor) return;

        editorRef.current.editor.setComponents(initialContent);

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