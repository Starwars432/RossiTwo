import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-black/90 border border-blue-400/30 rounded-lg shadow-lg py-1 z-50"
        >
          <div className="px-4 py-2 border-b border-blue-400/30">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300 truncate">{user?.email}</span>
            </div>
          </div>
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-white hover:bg-blue-500/20 transition-colors"
            onClick={onClose}
          >
            View Profile
          </a>
          <a
            href="/purchases"
            className="block px-4 py-2 text-sm text-white hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
            onClick={onClose}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Purchase History</span>
          </a>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;