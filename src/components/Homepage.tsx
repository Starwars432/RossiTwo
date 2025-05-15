import React from 'react';
import Hero from './Hero';
import Services from './Services';
import CustomDesign from './CustomDesign';
import Contact from './Contact';

const Homepage: React.FC = () => {
  return (
    <>
      <Hero />
      <Services />
      <CustomDesign />
      <Contact />
    </>
  );
};

export default Homepage;