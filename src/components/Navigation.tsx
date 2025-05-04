import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, LogIn, Menu, X } from 'lucide-react';

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full z-50 px-6 py-4 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-400 hover:text-blue-300 transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="home"
            smooth={true}
            duration={500}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="services"
            smooth={true}
            duration={500}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Services
          </Link>
          <Link
            to="portfolio"
            smooth={true}
            duration={500}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Portfolio
          </Link>
          <Link
            to="custom-design"
            smooth={true}
            duration={500}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Custom Design
          </Link>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Contact
          </Link>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-blue-400 hover:text-blue-300 relative"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLoginClick}
              className="bg-blue-500/20 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg md:hidden p-6 space-y-4 border-t border-blue-400/20"
          >
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="services"
              smooth={true}
              duration={500}
              className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="portfolio"
              smooth={true}
              duration={500}
              className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="custom-design"
              smooth={true}
              duration={500}
              className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Custom Design
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center space-x-4 pt-4 border-t border-blue-400/20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-blue-400 hover:text-blue-300 relative"
                aria-label={`Shopping Cart with ${cartCount} items`}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onLoginClick();
                  setIsMenuOpen(false);
                }}
                className="bg-blue-500/20 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;