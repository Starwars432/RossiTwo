import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WebFont from 'webfontloader';

interface Font {
  family: string;
  category: string;
  variants: string[];
}

interface FontPickerProps {
  onFontSelect: (fontFamily: string) => void;
  currentFont?: string;
}

const POPULAR_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Source Sans Pro',
  'Raleway',
  'Nunito'
];

const FontPicker: React.FC<FontPickerProps> = ({ onFontSelect, currentFont }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Load popular fonts immediately
        WebFont.load({
          google: {
            families: POPULAR_FONTS
          }
        });

        // Fetch full font list from Google Fonts API
        const response = await fetch(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBP90V_OhccM2ydZrpHGwzXm45vubQ79uQ&sort=popularity'
        );
        const data = await response.json();
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
        setIsOpen(false);
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
              <div className="px-4 py-2 text-xs text-gray-400 font-medium">Popular Fonts</div>
              {POPULAR_FONTS.map(font => (
                <button
                  key={font}
                  onClick={() => loadFont(font)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-500/20 transition-colors"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
              
              <div className="px-4 py-2 text-xs text-gray-400 font-medium border-t border-blue-400/30 mt-2">
                All Fonts
              </div>
              {filteredFonts.map(font => (
                <button
                  key={font.family}
                  onClick={() => loadFont(font.family)}
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