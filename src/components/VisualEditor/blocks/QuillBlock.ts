import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export const quillBlock = (editor: any) => {
  const blockManager = editor.BlockManager;

  blockManager.add('quill', {
    label: 'Text Editor',
    category: 'Basic',
    content: {
      type: 'div',
      classes: ['quill-editor'],
      style: { 
        minHeight: '200px'
      }
    },
    activate: true,
    select: true
  });

  // Initialize Quill when a block is added
  editor.on('component:add', (component: any) => {
    if (component.getClasses().includes('quill-editor')) {
      const editorContainer = component.getEl();
      
      // Create toolbar container
      const toolbarContainer = document.createElement('div');
      editorContainer.appendChild(toolbarContainer);
      
      // Create editor container
      const contentContainer = document.createElement('div');
      editorContainer.appendChild(contentContainer);

      const quillInstance = new Quill(contentContainer, {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ 'header': [1, 2, 3, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link']
          ]
        },
        theme: 'snow',
        placeholder: 'Start writing here...'
      });

      // Get saved content if it exists
      const savedContent = component.get('quill-content');
      if (savedContent) {
        quillInstance.root.innerHTML = savedContent;
      }

      // Handle content changes
      quillInstance.on('text-change', () => {
        const content = quillInstance.root.innerHTML;
        component.set('quill-content', content);
      });

      component.set('quill-instance', quillInstance);
    }
  });

  // Clean up Quill instance when component is removed
  editor.on('component:remove', (component: any) => {
    const quillInstance = component.get('quill-instance');
    if (quillInstance) {
      component.set('quill-instance', null);
    }
  });
};