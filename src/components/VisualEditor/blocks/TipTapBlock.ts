import { Editor } from 'grapesjs';
import ReactDOM from 'react-dom';
import React from 'react';
import TipTapBlockEditor from './TipTapBlockEditor';

export const tipTapBlock = (editor: Editor) => {
  const blockManager = editor.BlockManager;

  blockManager.add('tiptap', {
    label: 'Rich Text Editor',
    category: 'Basic',
    content: {
      type: 'div',
      classes: ['tiptap-editor'],
      style: { 
        minHeight: '200px'
      }
    },
    activate: true,
    select: true
  });

  // Initialize TipTap when a block is added
  editor.on('component:add', (component: any) => {
    if (component.getClasses().includes('tiptap-editor')) {
      const container = component.getEl();
      const editorRoot = document.createElement('div');
      container.appendChild(editorRoot);

      const savedContent = component.get('tiptap-content') || '';

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

  // Clean up when component is removed
  editor.on('component:remove', (component: any) => {
    const root = component.get('tiptap-root');
    if (root) {
      ReactDOM.unmountComponentAtNode(root);
    }
  });
};