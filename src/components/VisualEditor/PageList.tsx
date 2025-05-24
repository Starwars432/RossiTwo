import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, ChevronDown, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { usePageStore } from '../../lib/stores/pageStore';
import { useTabStore } from '../../lib/stores/tabStore';

const PageList: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const { pages, loading, error, loadPages, createPage, renamePage, deletePage } = usePageStore();
  const { addTab, activeTab } = useTabStore();

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreatePage = async () => {
    const title = window.prompt('Enter page title:');
    if (!title) return;

    try {
      const newPage = await createPage(title);
      addTab(newPage.id, newPage);
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleRename = async (id: string) => {
    if (!editingTitle.trim()) {
      setEditingPage(null);
      return;
    }

    try {
      await renamePage(id, editingTitle);
      setEditingPage(null);
    } catch (error) {
      console.error('Error renaming page:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await deletePage(id);
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <FileText className="w-4 h-4 ml-2 mr-2" />
          <span>Pages</span>
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCreatePage}
          className="p-1 text-blue-400 hover:text-blue-300"
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
                className={`group relative flex items-center justify-between px-3 py-2 rounded hover:bg-blue-500/10 ${
                  activeTab === page.id ? 'bg-blue-500/20' : ''
                }`}
              >
                {editingPage === page.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleRename(page.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(page.id)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => addTab(page.id, page)}
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
                    onClick={() => {
                      setEditingPage(page.id);
                      setEditingTitle(page.title);
                    }}
                    className="p-1 text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(page.id)}
                    className="p-1 text-red-400 hover:text-red-300"
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