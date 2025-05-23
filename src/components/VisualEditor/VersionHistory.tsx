import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, History, RotateCcw } from 'lucide-react';
import { useVersionStore } from '../../lib/stores/versionStore';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  pageId: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ pageId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { versions, loading, error, loadVersions, revertToVersion } = useVersionStore();

  useEffect(() => {
    if (isExpanded) {
      loadVersions(pageId);
    }
  }, [isExpanded, pageId]);

  const handleRevert = async (versionId: string) => {
    if (window.confirm('Are you sure you want to revert to this version? This action cannot be undone.')) {
      try {
        await revertToVersion(pageId, versionId);
        await loadVersions(pageId);
      } catch (error) {
        console.error('Error reverting version:', error);
      }
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        aria-label={isExpanded ? 'Collapse version history' : 'Expand version history'}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <History className="w-4 h-4 ml-2 mr-2" />
        <span>Version History</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-gray-400">Loading versions...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-gray-400">No versions yet</p>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group border border-blue-400/30 rounded-lg p-3 hover:border-blue-400/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-blue-400">
                        Version {version.version}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRevert(version.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-blue-400 hover:text-blue-300"
                      title="Revert to this version"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                  {version.comment && (
                    <p className="text-xs text-gray-400">{version.comment}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VersionHistory;