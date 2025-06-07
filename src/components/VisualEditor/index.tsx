import { useEffect, useRef } from "react";
import grapesjs from 'grapesjs';
import preset from 'grapesjs-preset-webpage';
import 'grapesjs/dist/css/grapes.min.css';
import { initializeEditorStyles } from './editorStyles';

interface EditorInstance {
  editor: any | null;
}

const VisualEditor: React.FC = () => {
  const editorRef = useRef<EditorInstance>({ editor: null });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current.editor) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: '100vh',
      storageManager: false,
      plugins: [preset],
      canvas: {
        styles: [
          '/tailwind.output.css',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        ],
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

    // Initialize editor styles when canvas loads
    editor.on('canvas:frame:load', () => {
      const frame = editor.Canvas.getFrameEl();
      const head = frame?.contentDocument?.head;

      if (head) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/tailwind.output.css';
        head.appendChild(link);
      }

      initializeEditorStyles(editor);
    });

    // Handle page changes
    editor.on('page:select', (page: any) => {
      console.log('Page selected:', page);
    });

    // Inject a default homepage layout so the canvas isn't empty
    editor.setComponents(`
      <section class="min-h-screen bg-black text-white font-serif p-8">
        <h1 class="text-4xl mb-4">Manifest Illusions</h1>
        <p class="text-lg">Start editing your page content here…</p>
      </section>
    `);

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
