import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(email, password);
        setMode('login');
        setError('Account created! Please sign in.');
      }
    } catch (err) {
      setError(mode === 'login' ? 'Invalid email or password' : 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError('Error signing in with Google');
    }
  };

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-blue-400">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('login')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-400/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or continue with</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  <span>Google</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;