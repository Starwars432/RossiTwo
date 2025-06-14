import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const VisualEditor = () => {
  const editorRef = useRef<grapesjs.Editor>();

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: 'auto',
      fromElement: false,
      storageManager: false,
      canvas: {
        styles: [
          '/tailwind.output.css',
          'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;600;800&display=swap',
        ],
      },
    });

    editorRef.current = editor;

    // Wait for GrapesJS to finish loading before setting components
    editor.on('load', async () => {
      try {
        const [html, css] = await Promise.all([
          fetch('/static/homepage.html').then((r) => r.text()),
          fetch('/tailwind.output.css').then((r) => r.text()),
        ]);

        editor.setComponents(html); // ✅ Safe now
        editor.setStyle(css);
      } catch (error) {
        console.error('❌ Failed to load homepage or CSS:', error);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" className="flex-1" />;
};

export default VisualEditor;
