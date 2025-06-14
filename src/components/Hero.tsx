import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const isClient = typeof window !== 'undefined';
  const [ScrollLink, setScrollLink] = useState<any>(null);

  useEffect(() => {
    if (isClient) {
      import('react-scroll').then((module) => {
        setScrollLink(() => module.Link);
      });
    }
  }, [isClient]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-sb-field-path="sections.0"
    >
      {/* Fog Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.3] }}
        transition={{ duration: 3, times: [0, 0.5, 1], ease: "easeInOut" }}
      />

      {/* Light Beam Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-conic from-blue-500/10 via-transparent to-transparent pointer-events-none"
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ 
          opacity: [0, 0.15, 0.1],
          rotate: [-45, -30, -45]
        }}
        transition={{ 
          duration: 5,
          times: [0, 0.5, 1],
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.h1 
            className="text-8xl italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Manifest
          </motion.h1>
          <motion.h1 
            className="text-8xl italic text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Illusions
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-xl text-gray-300 mt-8 mb-12 max-w-3xl mx-auto"
          data-sb-field-path="sections.0.content"
        >
          Elevating brands with cutting-edge design and innovative digital marketing strategies
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex justify-center gap-6"
        >
          {isClient && ScrollLink ? (
            <ScrollLink to="services" smooth={true} duration={500}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Explore Services
              </motion.button>
            </ScrollLink>
          ) : (
            <a href="#services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Explore Services
              </motion.button>
            </a>
          )}
          
          {isClient && ScrollLink ? (
            <ScrollLink to="custom-design" smooth={true} duration={500}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500/10 border border-blue-400/30 text-blue-400 px-8 py-3 rounded-lg hover:bg-blue-500/20 transition-all"
              >
                Custom Design
              </motion.button>
            </ScrollLink>
          ) : (
            <a href="#custom-design">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500/10 border border-blue-400/30 text-blue-400 px-8 py-3 rounded-lg hover:bg-blue-500/20 transition-all"
              >
                Custom Design
              </motion.button>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;