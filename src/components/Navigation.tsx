import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LogIn, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProfileDropdown from './ProfileDropdown';

interface NavigationProps {
  onLoginClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  const { items = [] } = useCart();

  // Only enable animations after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const itemCount = Array.isArray(items) ? items.length : 0;

  // Base motion props that only activate after mount
  const motionProps = isMounted ? {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
  } : {};

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8" />
        </div>

        <button
          className="md:hidden text-blue-400 hover:text-blue-300 transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="home"
            spy={true}
            smooth={true}
            duration={500}
            offset={0}
            isDynamic={true}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="services"
            spy={true}
            smooth={true}
            duration={500}
            offset={-70}
            isDynamic={true}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Services
          </Link>
          <Link
            to="portfolio"
            spy={true}
            smooth={true}
            duration={500}
            offset={-70}
            isDynamic={true}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Portfolio
          </Link>
          <Link
            to="custom-design"
            spy={true}
            smooth={true}
            duration={500}
            offset={-70}
            isDynamic={true}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Custom Design
          </Link>
          <Link
            to="contact"
            spy={true}
            smooth={true}
            duration={500}
            offset={-70}
            isDynamic={true}
            className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
          >
            Contact
          </Link>

          <div className="flex items-center space-x-4">
            <motion.button
              {...motionProps}
              className="text-blue-400 hover:text-blue-300 relative"
              aria-label={`Shopping Cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  {...motionProps}
                  onClick={toggleProfile}
                  className="bg-blue-500/20 text-blue-400 p-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </motion.button>
                <ProfileDropdown 
                  isOpen={isProfileOpen} 
                  onClose={() => setIsProfileOpen(false)} 
                />
              </div>
            ) : (
              <motion.button
                {...motionProps}
                onClick={onLoginClick}
                className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg md:hidden p-6 space-y-4 border-t border-blue-400/20"
            >
              <Link
                to="home"
                spy={true}
                smooth={true}
                duration={500}
                offset={0}
                isDynamic={true}
                className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                duration={500}
                offset={-70}
                isDynamic={true}
                className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="portfolio"
                spy={true}
                smooth={true}
                duration={500}
                offset={-70}
                isDynamic={true}
                className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                to="custom-design"
                spy={true}
                smooth={true}
                duration={500}
                offset={-70}
                isDynamic={true}
                className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Design
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                duration={500}
                offset={-70}
                isDynamic={true}
                className="block text-sm hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-blue-400/20">
                <motion.button
                  {...motionProps}
                  className="text-blue-400 hover:text-blue-300 relative"
                  aria-label={`Shopping Cart with ${itemCount} items`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </motion.button>
                {user ? (
                  <div className="flex-1">
                    <button
                      onClick={toggleProfile}
                      className="w-full bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm truncate">{user.email}</span>
                    </button>
                    <ProfileDropdown 
                      isOpen={isProfileOpen} 
                      onClose={() => {
                        setIsProfileOpen(false);
                        setIsMenuOpen(false);
                      }} 
                    />
                  </div>
                ) : (
                  <motion.button
                    {...motionProps}
                    onClick={() => {
                      onLoginClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex-1 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;