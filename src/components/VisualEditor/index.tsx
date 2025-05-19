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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: currentPage?.content || '',
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
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsAdmin(data);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
      }
    };

    checkAdminStatus();
  }, [user]);

  // Debounce content updates to prevent multiple rapid saves
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleContentUpdate = debounce(async (content: string) => {
    if (!currentPage || !user || isSaving) return;

    try {
      setIsSaving(true);
      setError(null);

      const { error } = await supabase
        .from('pages')
        .update({
          content: { html: content },
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentPage.id)
        .select()
        .single();

      if (error) throw error;
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, 1000);

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
          <div className="flex-1 p-4 relative">
            {error && (
              <div className="absolute top-0 right-0 m-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                {error}
              </div>
            )}
            {isSaving && (
              <div className="absolute top-0 right-0 m-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded text-blue-400">
                Saving changes...
              </div>
            )}
            <EditorContent editor={editor} className="prose prose-invert max-w-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;