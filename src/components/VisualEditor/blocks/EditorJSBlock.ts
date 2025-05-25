import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

export const editorJSBlock = (editor: any) => {
  const blockManager = editor.BlockManager;

  blockManager.add('editorjs', {
    label: 'Rich Text Editor',
    category: 'Text Editors',
    content: {
      type: 'div',
      classes: ['editorjs-container'],
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

  // Initialize Editor.js when a block is added
  editor.on('component:add', (component: any) => {
    if (component.getClasses().includes('editorjs-container')) {
      // Get saved data if it exists
      const savedData = component.get('editorjs-data');

      const editorInstance = new EditorJS({
        holder: component.getEl(),
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 3
            }
          },
          list: {
            class: List,
            inlineToolbar: true
          }
        },
        data: savedData || undefined,
        placeholder: 'Start writing here...',
        onChange: async () => {
          try {
            const data = await editorInstance.save();
            component.set('editorjs-data', data);
          } catch (error) {
            console.error('Failed to save Editor.js content:', error);
          }
        }
      });

      component.set('editorjs-instance', editorInstance);
    }
  });

  // Clean up Editor.js instance when component is removed
  editor.on('component:remove', (component: any) => {
    const editorInstance = component.get('editorjs-instance');
    if (editorInstance) {
      editorInstance.destroy();
    }
  });
};