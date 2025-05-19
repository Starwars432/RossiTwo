import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter the image URL');
    if (url) {
      editor.chain().focus().insertContent(`<img src="${url}" alt="" />`).run();
    }
  };

  return (
    <div className="border-b border-blue-400/30 p-4 bg-black/50 flex items-center space-x-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('bold') ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Bold"
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('italic') ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Italic"
      >
        <Italic className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-blue-400/30" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('heading', { level: 1 }) ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Heading 1"
      >
        <Heading1 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('heading', { level: 2 }) ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Heading 2"
      >
        <Heading2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('heading', { level: 3 }) ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Heading 3"
      >
        <Heading3 className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-blue-400/30" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('bulletList') ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Bullet List"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('orderedList') ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Ordered List"
      >
        <ListOrdered className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-blue-400/30" />
      <button
        onClick={() => {
          const url = window.prompt('Enter the URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-blue-500/20 ${
          editor.isActive('link') ? 'text-blue-400' : 'text-white'
        }`}
        aria-label="Add Link"
      >
        <Link className="w-5 h-5" />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-blue-500/20 text-white"
        aria-label="Add Image"
      >
        <Image className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-blue-400/30" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-blue-500/20 text-white disabled:opacity-50"
        aria-label="Undo"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-blue-500/20 text-white disabled:opacity-50"
        aria-label="Redo"
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;