import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Hero from '../Hero';
import Services from '../Services';
import CustomDesign from '../CustomDesign';
import Contact from '../Contact';
import Footer from '../Footer';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image, Plus } from 'lucide-react';

const VisualEditor: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentContent, setCurrentContent] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Click to edit content...',
      }),
    ],
    content: currentContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setCurrentContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsAdmin(data);
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {editor && (
        <>
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex items-center space-x-1 bg-black/90 border border-blue-400/30 rounded-lg p-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 rounded hover:bg-blue-500/20 ${
                  editor.isActive('bold') ? 'text-blue-400' : 'text-white'
                }`}
                aria-label="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 rounded hover:bg-blue-500/20 ${
                  editor.isActive('italic') ? 'text-blue-400' : 'text-white'
                }`}
                aria-label="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-1 rounded hover:bg-blue-500/20 ${
                  editor.isActive({ textAlign: 'left' }) ? 'text-blue-400' : 'text-white'
                }`}
                aria-label="Align left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-1 rounded hover:bg-blue-500/20 ${
                  editor.isActive({ textAlign: 'center' }) ? 'text-blue-400' : 'text-white'
                }`}
                aria-label="Align center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-1 rounded hover:bg-blue-500/20 ${
                  editor.isActive({ textAlign: 'right' }) ? 'text-blue-400' : 'text-white'
                }`}
                aria-label="Align right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const url = window.prompt('Enter the link URL');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={`p-1 rounded hover:bg-blue-500/20 ${
                  editor.isActive('link') ? 'text-blue-400' : 'text-white'
                }`}
                aria-label="Add link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </BubbleMenu>

          <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bg-black/90 border border-blue-400/30 rounded-lg p-1">
              <button
                onClick={() => {
                  const url = window.prompt('Enter the image URL');
                  if (url) {
                    editor.chain().focus().insertContent(`<img src="${url}" alt="" />`).run();
                  }
                }}
                className="flex items-center space-x-2 p-2 hover:bg-blue-500/20 rounded w-full"
                aria-label="Add image"
              >
                <Image className="w-4 h-4" />
                <span>Add Image</span>
              </button>
              <button
                onClick={() => {
                  const title = window.prompt('Enter section title');
                  if (title) {
                    editor.chain().focus().insertContent(`<h2>${title}</h2>`).run();
                  }
                }}
                className="flex items-center space-x-2 p-2 hover:bg-blue-500/20 rounded w-full"
                aria-label="Add section"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>
          </FloatingMenu>
        </>
      )}

      <div className="editable-content">
        <Hero />
        <Services />
        <CustomDesign />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default VisualEditor;