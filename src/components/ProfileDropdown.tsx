import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => onClose()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-0 mt-2 w-48 bg-black/90 border border-blue-400/30 rounded-lg shadow-lg py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-blue-400/30">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300 truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={() => handleNavigation('/profile')}
              className="block w-full px-4 py-2 text-sm text-white hover:bg-blue-500/20 transition-colors text-left"
            >
              View Profile
            </button>
            <button
              onClick={() => handleNavigation('/purchases')}
              className="block w-full px-4 py-2 text-sm text-white hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Purchase History</span>
            </button>
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-sm text-white hover:bg-blue-500/20 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;