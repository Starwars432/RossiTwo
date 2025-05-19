import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import CustomDesign from './components/CustomDesign';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ProfilePage from './components/ProfilePage';
import VisualEditor from './components/VisualEditor';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'vos'>('home');

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/profile') {
        setCurrentPage('profile');
      } else if (path.startsWith('/vos')) {
        setCurrentPage('vos');
      } else {
        setCurrentPage('home');
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('load', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('load', handleNavigation);
    };
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-black text-white relative font-serif overflow-x-hidden">
          {currentPage !== 'vos' && (
            <Navigation onLoginClick={() => setIsLoginOpen(true)} />
          )}
          
          {currentPage === 'home' && (
            <>
              <Hero />
              <Services />
              <CustomDesign />
              <Contact />
              <Footer />
            </>
          )}
          
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'vos' && <VisualEditor />}
          
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;