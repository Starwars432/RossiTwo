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

const VisualEditor: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: currentPage?.content || '',
    onUpdate: ({ editor }) => {
      // Handle content updates
      if (currentPage) {
        handleContentUpdate(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (!error && data) {
        setIsAdmin(data);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleContentUpdate = async (content: string) => {
    if (!currentPage || !user) return;

    try {
      const { error } = await supabase
        .from('pages')
        .update({
          content: { html: content },
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentPage.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating content:', error);
    }
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
          {editor && <Toolbar editor={editor} />}
          <div className="flex-1 p-4">
            <EditorContent editor={editor} className="prose prose-invert max-w-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;