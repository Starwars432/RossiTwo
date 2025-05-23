import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Library, Plus, Trash2 } from 'lucide-react';
import { useComponentStore } from '../../lib/stores/componentStore';
import { Block } from '../../lib/types/editor';

interface ComponentLibraryProps {
  onInsertComponent: (blocks: Block[]) => void;
  selectedBlocks?: Block[];
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onInsertComponent, selectedBlocks }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [componentName, setComponentName] = useState('');
  const [componentCategory, setComponentCategory] = useState('');
  const [componentDescription, setComponentDescription] = useState('');
  const { components, loading, error, loadComponents, saveComponent, deleteComponent } = useComponentStore();

  useEffect(() => {
    if (isExpanded) {
      loadComponents();
    }
  }, [isExpanded]);

  const handleSaveComponent = async () => {
    if (!componentName || !componentCategory || !selectedBlocks?.length) return;

    try {
      await saveComponent(componentName, selectedBlocks, componentCategory, componentDescription);
      setShowSaveDialog(false);
      setComponentName('');
      setComponentCategory('');
      setComponentDescription('');
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const categories = [...new Set(components.map(c => c.category))];

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        aria-label={isExpanded ? 'Collapse component library' : 'Expand component library'}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Library className="w-4 h-4 ml-2 mr-2" />
        <span>Component Library</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          {selectedBlocks?.length ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSaveDialog(true)}
              className="w-full flex items-center justify-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded hover:bg-blue-500/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Save Selection as Component</span>
            </motion.button>
          ) : null}

          {showSaveDialog && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/90 border border-blue-400/30 rounded-lg p-4"
            >
              <h3 className="text-lg text-blue-400 mb-4">Save Component</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="Component Name"
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  value={componentCategory}
                  onChange={(e) => setComponentCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
                />
                <textarea
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="px-4 py-2 text-gray-400 hover:text-gray-300"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveComponent}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Component
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400">Loading components...</p>
            ) : components.length === 0 ? (
              <p className="text-sm text-gray-400">No components yet</p>
            ) : (
              categories.map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">{category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {components
                      .filter(c => c.category === category)
                      .map(component => (
                        <motion.div
                          key={component.id}
                          className="relative group border border-blue-400/30 rounded-lg p-2 hover:border-blue-400/50"
                        >
                          <div className="mb-2">
                            <h4 className="text-sm font-medium text-blue-400">{component.name}</h4>
                            {component.description && (
                              <p className="text-xs text-gray-400">{component.description}</p>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onInsertComponent(component.blocks)}
                              className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30"
                            >
                              Insert
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteComponent(component.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300"
                              aria-label={`Delete ${component.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;