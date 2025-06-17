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

  // Generate hyperspace stars with different depths/speeds
  const generateHyperspaceStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const depth = Math.random() * 3 + 1; // 1-4 depth levels
      const speed = 4 - depth; // Closer stars move faster
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        depth: depth,
        speed: speed,
        opacity: Math.random() * 0.8 + 0.2,
      };
    });
  };

  const stars = generateHyperspaceStars(80);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-sb-field-path="sections.0"
    >
      {/* Hyperspace Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.initialX}%`,
              top: `${star.initialY}%`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, (star.x - 50) * 8], // Stretch outward from center
              y: [0, (star.y - 50) * 8],
              scale: [0, star.size, star.size * 2],
              opacity: [0, star.opacity, 0],
            }}
            transition={{
              duration: star.speed,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 2,
            }}
          >
            {/* Star with trailing effect */}
            <div className="relative">
              {/* Main star */}
              <div 
                className="bg-blue-400 rounded-full"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  boxShadow: `0 0 ${star.size * 2}px rgba(96, 165, 250, 0.8)`,
                }}
              />
              {/* Trailing line for hyperspace effect */}
              <motion.div
                className="absolute top-1/2 left-1/2 bg-gradient-to-r from-blue-400 to-transparent"
                style={{
                  width: `${star.size * 20}px`,
                  height: `${star.size * 0.5}px`,
                  transformOrigin: 'left center',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  rotate: Math.atan2(star.y - 50, star.x - 50) * (180 / Math.PI),
                }}
                transition={{
                  duration: star.speed,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central light burst effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-96 h-96 bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent rounded-full" />
      </motion.div>

      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30 pointer-events-none" />

      <div className="relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-8xl italic">Manifest</h1>
          <h1 className="text-8xl italic text-blue-400">Illusions</h1>
        </motion.div>

        <motion.p
          className="text-xl text-gray-300 mt-8 mb-12 max-w-3xl mx-auto text-center"
          data-sb-field-path="sections.0.content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          Elevating brands with cutting-edge design and innovative digital marketing strategies
        </motion.p>

        <motion.div
          className="flex justify-center gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
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