import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PageListProps {
  onPageSelect: (page: any) => void;
  currentPage: any;
}

const PageList: React.FC<PageListProps> = ({ onPageSelect, currentPage }) => {
  const [pages, setPages] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewPage = async () => {
    const title = window.prompt('Enter page title:');
    if (!title) return;

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title,
          slug,
          content: { html: '' },
          is_draft: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPages([data, ...pages]);
        onPageSelect(data);
      }
    } catch (error) {
      console.error('Error creating page:', error);
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
          <span className="ml-2">Pages</span>
        </button>
        <button
          onClick={createNewPage}
          className="p-1 text-blue-400 hover:text-blue-300"
          title="Create new page"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-400">Loading pages...</p>
          ) : pages.length === 0 ? (
            <p className="text-sm text-gray-400">No pages yet</p>
          ) : (
            pages.map(page => (
              <motion.button
                key={page.id}
                onClick={() => onPageSelect(page)}
                className={`w-full flex items-center px-3 py-2 rounded text-left text-sm ${
                  currentPage?.id === page.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'hover:bg-blue-500/10 text-gray-300'
                }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{page.title}</span>
              </motion.button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PageList;