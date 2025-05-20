import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
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
    }
  }, [currentPage, editor]);

  const handleContentUpdate = async (content: string) => {
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
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to save changes');
    }
  };

  const handleCreatePage = async (title: string, content: string) => {
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
  };

  const handleAddImage = async (url: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<img src="${url}" alt="" />`).run();
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

        {/* Editor */}
        <div className="flex-1 flex flex-col">
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

        {/* AI Assistant */}
        <AIAssistant
          onCreatePage={handleCreatePage}
          onUpdateContent={(content) => editor?.commands.setContent(content)}
          onAddImage={handleAddImage}
        />
      </div>
    </div>
  );
};

export default VisualEditor;