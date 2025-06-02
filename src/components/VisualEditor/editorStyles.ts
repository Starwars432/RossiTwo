import { Editor } from 'grapesjs';

export const initializeEditorStyles = (editor: Editor) => {
  editor.on('canvas:frame:load', () => {
    const iframe = editor.Canvas.getFrameEl();
    const iframeDoc = iframe?.contentDocument;
    
    if (!iframeDoc) return;

    // Add base styles to iframe head
    const styleEl = iframeDoc.createElement('style');
    styleEl.innerHTML = `
      :root {
        --color-primary: #3B82F6;
        --color-secondary: #60A5FA;
        --color-background: #000000;
        --color-text: #FFFFFF;
        --color-accent: #2563EB;
        --font-heading: 'Playfair Display';
        --font-body: 'Playfair Display';
        --spacing-xs: 0.5rem;
        --spacing-sm: 1rem;
        --spacing-md: 1.5rem;
        --spacing-lg: 2rem;
        --spacing-xl: 3rem;
      }

      body {
        margin: 0;
        font-family: var(--font-body), serif;
        background: var(--color-background);
        color: var(--color-text);
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading), serif;
      }

      .min-h-screen {
        min-height: 100vh;
      }

      .bg-black {
        background-color: #000000;
      }

      .text-white {
        color: #FFFFFF;
      }

      .text-blue-400 {
        color: #60A5FA;
      }

      .font-serif {
        font-family: var(--font-body), serif;
      }

      .italic {
        font-style: italic;
      }
    `;
    iframeDoc.head.appendChild(styleEl);

    // Add Google Fonts
    const fontLink = iframeDoc.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap';
    iframeDoc.head.appendChild(fontLink);

    // Add Tailwind output CSS
    const tailwindLink = iframeDoc.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = '/tailwind.output.css';
    iframeDoc.head.appendChild(tailwindLink);

    // Set editor canvas background
    const canvas = editor.Canvas.getBody();
    if (canvas) {
      canvas.style.background = 'var(--color-background)';
    }
  });

  // Update editor UI colors
  editor.setStyle(`
    .gjs-one-bg { background-color: #1a1a1a !important; }
    .gjs-two-color { color: #60A5FA !important; }
    .gjs-three-bg { background-color: #2563EB !important; }
    .gjs-four-color, .gjs-four-color-h:hover { color: #FFFFFF !important; }
  `);
};