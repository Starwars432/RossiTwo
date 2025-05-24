import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, ChevronDown, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Page } from '../../lib/types/editor';

interface PageListProps {
  onPageSelect: (id: string) => Promise<Page | null>;
}

const PageList: React.FC<PageListProps> = ({ onPageSelect }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const createNewPage = async () => {
    const title = window.prompt('Enter page title:');
    if (!title) return;

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    try {
      setError(null);
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title,
          slug,
          blocks: [],
          metadata: {},
          is_draft: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPages([data, ...pages]);
        const loadedPage = await onPageSelect(data.id);
        if (!loadedPage) {
          throw new Error('Failed to load new page');
        }
      }
    } catch (error) {
      console.error('Error creating page:', error);
      setError('Failed to create page');
    }
  };

  const startEditing = (page: Page) => {
    setEditingPage(page.id);
    setEditingTitle(page.title);
  };

  const handleRename = async (page: Page) => {
    if (!editingTitle.trim() || editingTitle === page.title) {
      setEditingPage(null);
      return;
    }

    try {
      setError(null);
      const newSlug = editingTitle.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('pages')
        .update({
          title: editingTitle,
          slug: newSlug,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPages(pages.map(p => p.id === page.id ? data : p));
      }
    } catch (error) {
      console.error('Error renaming page:', error);
      setError('Failed to rename page');
    } finally {
      setEditingPage(null);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      setError(null);
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      setPages(pages.filter(p => p.id !== pageId));
    } catch (error) {
      console.error('Error deleting page:', error);
      setError('Failed to delete page');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-blue-400 hover:text-blue-300"
          aria-label={isExpanded ? 'Collapse pages' : 'Expand pages'}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <FileText className="w-4 h-4 ml-2 mr-2" />
          <span>Pages</span>
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={createNewPage}
          className="p-1 text-blue-400 hover:text-blue-300"
          aria-label="Create new page"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2 mb-4">
          {error}
        </div>
      )}

      {isExpanded && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-400">Loading pages...</p>
          ) : pages.length === 0 ? (
            <p className="text-sm text-gray-400">No pages yet</p>
          ) : (
            pages.map(page => (
              <div
                key={page.id}
                className="group relative flex items-center justify-between px-3 py-2 rounded hover:bg-blue-500/10"
              >
                {editingPage === page.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleRename(page)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(page)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => onPageSelect(page.id)}
                    className="flex-1 text-left text-sm truncate"
                  >
                    {page.title}
                    {page.is_draft && (
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </button>
                )}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(page)}
                    className="p-1 text-blue-400 hover:text-blue-300"
                    aria-label={`Rename ${page.title}`}
                  >
                    <Edit2 className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deletePage(page.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                    aria-label={`Delete ${page.title}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PageList;