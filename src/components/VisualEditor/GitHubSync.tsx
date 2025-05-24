import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Github } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GitHubSyncProps {
  pageId: string;
}

const GitHubSync: React.FC<GitHubSyncProps> = ({ pageId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-github`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setSuccess('Successfully pushed to GitHub!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with GitHub');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        aria-label={isExpanded ? 'Collapse GitHub sync' : 'Expand GitHub sync'}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Github className="w-4 h-4 ml-2 mr-2" />
        <span>GitHub Sync</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded p-2">
              {success}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Github className="w-4 h-4" />
            <span>{isSyncing ? 'Pushing to GitHub...' : 'Push to GitHub'}</span>
          </motion.button>

          <p className="text-xs text-gray-400">
            This will push the current page content to the connected GitHub repository.
          </p>
        </div>
      )}
    </div>
  );
};

export default GitHubSync;