import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Toolbar from './Toolbar';
import PageList from './PageList';
import MediaLibrary from './MediaLibrary';
import Settings from './Settings';
import AIAssistant from './AIAssistant';

const VisualEditor: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        placeholder: 'Start writing...',
      }),
      BubbleMenu,
      FloatingMenu,
      Heading,
      Image,
    ],
    content: currentPage?.content || '',
    editable: true,
    onUpdate: ({ editor }) => {
      if (currentPage) {
        handleContentUpdate(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        setError(null);
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (editor && currentPage) {
      editor.commands.setContent(currentPage.content);
      updatePreview(currentPage.content);
      setPreviewUrl(window.location.origin);
    }
  }, [currentPage, editor]);

  const handleContentUpdate = async (content: string): Promise<void> => {
    if (!currentPage || !user) return;

    try {
      setError(null);
      const { error } = await supabase
        .from('pages')
        .update({
          content: { html: content },
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentPage.id);

      if (error) throw error;
      updatePreview(content);
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to save changes');
    }
  };

  const updatePreview = (content: string) => {
    // Create a preview version of the content
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Playfair Display', serif;
              line-height: 1.5;
              margin: 0;
              padding: 20px;
              background: black;
              color: white;
            }
            img { max-width: 100%; height: auto; }
            [data-editable="true"] { outline: 2px solid transparent; }
            [data-editable="true"]:hover { outline-color: rgba(96, 165, 250, 0.3); }
            .content { max-width: 1200px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="content editable-content">
            ${content}
          </div>
        </body>
      </html>
    `;
    setPreview(previewContent);
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 border-r border-blue-400/30 p-4">
          <PageList onPageSelect={setCurrentPage} currentPage={currentPage} />
          <MediaLibrary />
          <Settings />
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="w-1/2 flex flex-col border-r border-blue-400/30">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2">
                {error}
              </div>
            )}
            {editor && <Toolbar editor={editor} />}
            <div className="flex-1 p-4 editable-content">
              <EditorContent editor={editor} className="prose prose-invert max-w-none" />
            </div>
          </div>

          {/* Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-blue-400/30 bg-black/50 flex justify-between items-center">
              <h3 className="text-blue-400">Live Preview</h3>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View Live Site
                </a>
              )}
            </div>
            <div className="flex-1 overflow-auto bg-black">
              {preview && (
                <iframe
                  srcDoc={preview}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-same-origin"
                />
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <AIAssistant
          onCreatePage={async (title, content) => {
            const slug = title.toLowerCase().replace(/\s+/g, '-');
            try {
              const { data, error } = await supabase
                .from('pages')
                .insert({
                  title,
                  slug,
                  content: { html: content },
                  is_draft: true,
                })
                .select()
                .single();

              if (error) throw error;
              if (data) {
                setCurrentPage(data);
              }
            } catch (err) {
              console.error('Error creating page:', err);
              throw new Error('Failed to create page');
            }
          }}
          onUpdateContent={async (content) => {
            if (editor) {
              editor.commands.setContent(content);
              await handleContentUpdate(content);
            }
          }}
          onAddImage={async (url) => {
            if (editor) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        />
      </div>
    </div>
  );
};

export default VisualEditor;