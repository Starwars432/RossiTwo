import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WebFont from 'webfontloader';

interface Font {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
}

interface FontPickerProps {
  onFontSelect: (fontFamily: string) => void;
  currentFont?: string;
}

const FONTS_STORAGE_KEY = 'google_fonts_list';
const FONTS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const FontPicker: React.FC<FontPickerProps> = ({ onFontSelect, currentFont }) => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(FONTS_STORAGE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < FONTS_CACHE_DURATION) {
            setFonts(data);
            setLoading(false);
            return;
          }
        }

        // Fetch from API if cache is invalid or missing
        const response = await fetch(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBP90V_OhccM2ydZrpHGwzXm45vubQ79uQ'
        );
        const data = await response.json();
        
        // Cache the response
        localStorage.setItem(
          FONTS_STORAGE_KEY,
          JSON.stringify({
            data: data.items,
            timestamp: Date.now()
          })
        );
        
        setFonts(data.items);
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFonts();
  }, []);

  const loadFont = (fontFamily: string) => {
    WebFont.load({
      google: {
        families: [fontFamily]
      },
      active: () => {
        onFontSelect(fontFamily);
      }
    });
  };

  const filteredFonts = fonts.filter(font =>
    font.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
      >
        <span style={{ fontFamily: currentFont || 'inherit' }}>
          {currentFont || 'Select Font'}
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 top-full left-0 mt-1 w-64 max-h-96 overflow-y-auto bg-black/90 border border-blue-400/30 rounded-lg shadow-lg"
        >
          <div className="p-2 border-b border-blue-400/30">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fonts..."
              className="w-full px-3 py-1.5 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
            />
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-400">Loading fonts...</div>
          ) : (
            <div className="py-2">
              {filteredFonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => {
                    loadFont(font.family);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-500/20 transition-colors"
                  style={{ fontFamily: font.family }}
                >
                  {font.family}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FontPicker;