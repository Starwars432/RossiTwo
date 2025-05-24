import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Palette } from 'lucide-react';
import { useThemeStore } from '../../lib/stores/themeStore';
import WebFont from 'webfontloader';

const ThemeSettings: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();

  const handleColorChange = (key: string, value: string) => {
    setTheme({
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [key]: value
      }
    });
  };

  const handleFontChange = (key: string, value: string) => {
    WebFont.load({
      google: {
        families: [value]
      }
    });

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
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Palette className="w-4 h-4 ml-2 mr-2" />
        <span>Theme Settings</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Colors</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(currentTheme.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
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
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => handleFontChange(key, e.target.value)}
                    className="w-full px-2 py-1 bg-black/50 border border-blue-400/30 rounded text-sm"
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;