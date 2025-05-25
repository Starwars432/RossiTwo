import { Editor } from 'grapesjs';
import ReactDOM from 'react-dom';
import React from 'react';
import TipTapBlockEditor from './TipTapBlockEditor';

export const tipTapBlock = (editor: Editor) => {
  const blockManager = editor.BlockManager;

  blockManager.add('tiptap', {
    label: 'TipTap Editor',
    category: 'Text Editors',
    content: {
      type: 'div',
      classes: ['tiptap-container'],
      style: { 
        padding: '20px',
        minHeight: '200px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(96, 165, 250, 0.3)',
        borderRadius: '4px'
      }
    },
    activate: true,
    select: true
  });

  // Initialize TipTap when a block is added
  editor.on('component:add', (component: any) => {
    if (component.getClasses().includes('tiptap-container')) {
      const container = component.getEl();
      
      // Create a wrapper for React
      const editorRoot = document.createElement('div');
      container.appendChild(editorRoot);

      // Get saved content if it exists
      const savedContent = component.get('tiptap-content') || '';

      // Render TipTap editor
      ReactDOM.render(
        React.createElement(TipTapBlockEditor, {
          content: savedContent,
          onChange: (content: string) => {
            component.set('tiptap-content', content);
          }
        }),
        editorRoot
      );

      component.set('tiptap-root', editorRoot);
    }
  });

  // Clean up React component when block is removed
  editor.on('component:remove', (component: any) => {
    const root = component.get('tiptap-root');
    if (root) {
      ReactDOM.unmountComponentAtNode(root);
    }
  });
};