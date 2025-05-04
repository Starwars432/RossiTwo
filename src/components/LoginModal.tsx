import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 p-8 rounded-lg border border-blue-400/30 relative z-10 w-full max-w-md"
          >
            <h2 className="text-2xl mb-6 text-blue-400">Login</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                aria-label="Email"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                aria-label="Password"
              />
              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
                  type="submit"
                >
                  Sign In
                </motion.button>
                <button
                  onClick={onClose}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;