import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  modifier?: 'Ctrl' | 'Shift' | 'Alt';
}

const shortcuts: Shortcut[] = [
  { key: 'Z', description: 'Undo', modifier: 'Ctrl' },
  { key: 'Y', description: 'Redo', modifier: 'Ctrl' },
  { key: 'D', description: 'Duplicate block', modifier: 'Ctrl' },
  { key: 'Delete', description: 'Delete block' },
  { key: '↑↓', description: 'Navigate blocks' },
  { key: 'Space', description: 'Open block menu' },
  { key: 'Esc', description: 'Close menus' },
  { key: 'S', description: 'Save changes', modifier: 'Ctrl' },
  { key: 'P', description: 'Preview', modifier: 'Ctrl' },
  { key: '/', description: 'Show keyboard shortcuts', modifier: 'Ctrl' },
];

const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500/20 text-blue-400 p-2 rounded-lg hover:bg-blue-500/30 transition-colors"
        title="Show keyboard shortcuts (Ctrl + /)"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-black/90 border border-blue-400/30 rounded-lg p-6 z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-blue-400">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {shortcuts.map((shortcut) => (
                  <div
                    key={`${shortcut.modifier || ''}-${shortcut.key}`}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-400">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.modifier && (
                        <>
                          <kbd className="px-2 py-1 bg-blue-500/10 border border-blue-400/30 rounded text-sm text-blue-400">
                            {shortcut.modifier}
                          </kbd>
                          <span className="text-gray-400">+</span>
                        </>
                      )}
                      <kbd className="px-2 py-1 bg-blue-500/10 border border-blue-400/30 rounded text-sm text-blue-400">
                        {shortcut.key}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;