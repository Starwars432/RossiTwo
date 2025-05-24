import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useTabStore } from '../../lib/stores/tabStore';
import { usePageStore } from '../../lib/stores/pageStore';

const TabBar: React.FC = () => {
  const { openTabs, activeTab, pages, removeTab, setActiveTab, addTab } = useTabStore();
  const { createPage, loadPage } = usePageStore();

  const handleNewTab = async () => {
    try {
      const title = window.prompt('Enter page title:');
      if (!title) return;

      const newPage = await createPage(title);
      if (!newPage) throw new Error('Failed to create page');
      
      const loadedPage = await loadPage(newPage.id);
      if (loadedPage) {
        addTab(loadedPage.id, loadedPage);
      }
    } catch (error) {
      console.error('Error creating new page:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center border-b border-blue-400/30 bg-black/50"
    >
      <div className="flex-1 flex items-center overflow-x-auto">
        <AnimatePresence mode="popLayout">
          {openTabs.map(pageId => {
            const page = pages[pageId];
            if (!page) return null;
            
            return (
              <motion.button
                key={pageId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={() => setActiveTab(pageId)}
                className={`group relative flex items-center space-x-2 px-4 py-2 border-r border-blue-400/30 ${
                  activeTab === pageId 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-400 hover:bg-blue-500/10'
                }`}
              >
                <span className="truncate max-w-xs">
                  {page.title || 'Untitled'}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(pageId);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                  aria-label="Close tab"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewTab}
        className="p-2 text-blue-400 hover:bg-blue-500/20 transition-colors"
        aria-label="New tab"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default TabBar;