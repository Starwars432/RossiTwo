import { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

export default function VisualEditor() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      fromElement: false,
      storageManager: false,
      canvas: {
        customSpots: true,
        styles: [
          '/tailwind.output.css',
          '/assets/index-r4rMtXkJ.css' // ✅ update this to your latest asset hash!
        ]
      }
    });

    editor.on('load', async () => {
      try {
        const htmlRes = await fetch('/static/homepage.html');
        const html = await htmlRes.text();

        const bodyOnly = html.replace(/^[\s\S]*<body[^>]*>/i, '').replace(/<\/body>[\s\S]*$/i, '');
        editor.setComponents(bodyOnly); // ✅ safe now!

        const doc = editor.Canvas.getFrame()?.contentDocument;
        const body = doc?.body;

        if (body) {
          body.style.background = '#ffffff';
          body.style.margin = '0';
          body.style.minHeight = '100vh';
          body.style.overflow = 'visible';
        }
      } catch (err) {
        console.error('Failed to load homepage or CSS:', err);
      }
    });

    return () => editor.destroy();
  }, []);

  return <div id="gjs" style={{ height: '100vh', width: '100%' }} />;
}
