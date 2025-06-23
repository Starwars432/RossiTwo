// src/components/HomepageForEditor.tsx
import Hero from './Hero';
import Services from './Services';
import CustomDesign from './CustomDesign';
import Contact from './Contact';
import Footer from './Footer';

export default function HomepageForEditor() {
  return (
    <main style={{
      background: 'black',
      color: 'white',
      fontFamily: "'Playfair Display', serif",
      paddingBottom: '4rem',
    }}>
      <Hero />
      <Services />
      <CustomDesign />
      <Contact />
      <Footer />
    </main>
  );
}