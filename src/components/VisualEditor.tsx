import { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

export default function VisualEditor() {
  useEffect(() => {
    /* 1. Initialise GrapesJS */
    const editor = grapesjs.init(
      {
        container: '#gjs',
        height: '100%',
        fromElement: false,
        storageManager: false,
        canvas: {
          styles: [
            '/tailwind.output.css',
            'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;600;800&display=swap',
          ],
        },
      } as any
    );

    /* 2. After the editor is fully ready */
    editor.on('load', async () => {
      try {
        const html = await fetch('/static/homepage.html').then((r) => r.text());
        editor.setComponents(html);

        const frame = editor.Canvas.getFrame();
        const doc = frame?.contentDocument;
        const body = doc?.body;
        if (!doc || !body) return;

        /* ①  Force layout */
        doc.documentElement.style.height = '100%';
        body.style.minHeight = '100vh';
        body.style.margin = '0';
        body.style.overflow = 'visible';

        /* ②  Add bright‑red test banner */
        const test = doc.createElement('div');
        test.textContent =
          'TEST BANNER – if you can read this, the page loaded!';
        test.style.cssText = `
          position:fixed;top:0;left:0;right:0;
          background:#ff0040;color:#fff;font-size:20px;
          padding:8px;z-index:9999;text-align:center;
        `;
        doc.body.appendChild(test);

        /* ③  Remove hero overlays if present */
        doc
          .querySelectorAll('.pointer-events-none.absolute.inset-0')
          .forEach((el) => el.remove());

        /* ④  Be 100 % sure background is white */
        body.style.background = '#ffffff';
      } catch (err) {
        console.error('Failed to inject homepage', err);
      }
    });

    return () => editor.destroy();
  }, []);

  /* 3. GrapesJS container – white + scrollable */
  return (
    <div
      id="gjs"
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'auto',
        background: '#fff',
      }}
    />
  );
}
