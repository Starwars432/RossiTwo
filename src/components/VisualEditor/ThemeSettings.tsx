import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Palette, Plus, Trash2 } from 'lucide-react';
import { useThemeStore } from '../../lib/stores/themeStore';
import { Theme } from '../../lib/types/theme';

const ThemeSettings: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentTheme, presets, setTheme, saveTheme, savePreset, deletePreset, applyPreset } = useThemeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await saveTheme();
    } catch (err) {
      setError('Failed to save theme settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreset = async () => {
    if (!presetName) return;
    try {
      await savePreset(presetName, currentTheme);
      setShowSaveDialog(false);
      setPresetName('');
    } catch (err) {
      setError('Failed to save preset');
    }
  };

  const handleDeletePreset = async (id: string) => {
    try {
      await deletePreset(id);
    } catch (err) {
      setError('Failed to delete preset');
    }
  };

  const handleColorChange = (key: keyof Theme['colors'], value: string) => {
    setTheme({
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [key]: value
      }
    });
  };

  const handleFontChange = (key: keyof Theme['fonts'], value: string) => {
    setTheme({
      ...currentTheme,
      fonts: {
        ...currentTheme.fonts,
        [key]: value
      }
    });
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        aria-label={isExpanded ? 'Collapse theme settings' : 'Expand theme settings'}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Palette className="w-4 h-4 ml-2 mr-2" />
        <span>Theme Settings</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Theme Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {presets.map(preset => (
                  <motion.div
                    key={preset.id}
                    className="relative group border border-blue-400/30 rounded-lg p-2 hover:border-blue-400/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-blue-400">{preset.name}</h4>
                      {!preset.isDefault && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePreset(preset.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300"
                          aria-label={`Delete ${preset.name} preset`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyPreset(preset)}
                      className="w-full text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30"
                    >
                      Apply
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSaveDialog(true)}
              className="w-full flex items-center justify-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded hover:bg-blue-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Save Current Theme as Preset</span>
            </motion.button>

            {showSaveDialog && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/90 border border-blue-400/30 rounded-lg p-4"
              >
                <h3 className="text-lg text-blue-400 mb-4">Save Theme Preset</h3>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset Name"
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400 mb-4"
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
                    onClick={handleSavePreset}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Preset
                  </motion.button>
                </div>
              </motion.div>
            )}

            <div>
              <h3 className="text-sm text-gray-400 mb-2">Colors</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">
                      {key}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                        className="flex-1 px-2 py-1 bg-black/50 border border-blue-400/30 rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-2">Fonts</h3>
              <div className="space-y-2">
                {Object.entries(currentTheme.fonts).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">
                      {key} Font
                    </label>
                    <select
                      value={value}
                      onChange={(e) => handleFontChange(key as keyof Theme['fonts'], e.target.value)}
                      className="w-full px-2 py-1 bg-black/50 border border-blue-400/30 rounded text-sm"
                    >
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <span>{isSaving ? 'Saving...' : 'Save Theme'}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;