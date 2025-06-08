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

    // Cast as any to avoid TypeScript issues with undocumented properties
    const editor = grapesjs.init({
      container: containerRef.current,
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
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px', widthMedia: '768px' },
          { name: 'Mobile', width: '375px', widthMedia: '375px' },
        ]
      }
    } as any);

    editor.on('canvas:frame:load', () => {
      const frame = editor.Canvas.getFrame();
      const head = frame?.contentDocument?.head;

      if (head) {
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

      initializeEditorStyles(editor);
    });

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