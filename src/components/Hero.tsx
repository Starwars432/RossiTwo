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

  // Generate cosmic particles with different types and behaviors
  const generateCosmicParticles = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const type = Math.random();
      let particleType = 'star';
      
      if (type < 0.08) particleType = 'nebula';
      else if (type < 0.15) particleType = 'comet';
      else if (type < 0.22) particleType = 'planet';
      else if (type < 0.28) particleType = 'asteroid';
      else if (type < 0.32) particleType = 'pulsar';
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        type: particleType,
        speed: Math.random() * 25 + 8,
        opacity: Math.random() * 0.8 + 0.2,
        color: [
          '#60A5FA', // Blue
          '#A78BFA', // Purple
          '#F472B6', // Pink
          '#34D399', // Emerald
          '#FBBF24', // Amber
          '#FB7185', // Rose
          '#818CF8', // Indigo
          '#06B6D4', // Cyan
          '#8B5CF6', // Violet
        ][Math.floor(Math.random() * 9)],
        delay: Math.random() * 8,
      };
    });
  };

  const particles = generateCosmicParticles(80);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-sb-field-path="sections.0"
    >
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Cosmic Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, particle.opacity, particle.opacity, 0],
              x: particle.type === 'comet' ? [0, 120] : 
                 particle.type === 'asteroid' ? [0, Math.sin(particle.id) * 40] :
                 [0, Math.sin(particle.id) * 15],
              y: particle.type === 'comet' ? [0, -60] : 
                 particle.type === 'asteroid' ? [0, Math.cos(particle.id) * 30] :
                 [0, Math.cos(particle.id) * 15],
              rotate: particle.type === 'asteroid' ? [0, 360] : 0,
            }}
            transition={{
              duration: particle.speed,
              repeat: Infinity,
              ease: particle.type === 'pulsar' ? "easeInOut" : "linear",
              delay: particle.delay,
            }}
          >
            {particle.type === 'star' && (
              <div
                className="rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            )}
            
            {particle.type === 'nebula' && (
              <div
                className="rounded-full blur-sm"
                style={{
                  width: `${particle.size * 4}px`,
                  height: `${particle.size * 4}px`,
                  background: `radial-gradient(circle, ${particle.color}40 0%, ${particle.color}20 40%, transparent 70%)`,
                }}
              />
            )}
            
            {particle.type === 'comet' && (
              <div className="relative">
                <div
                  className="rounded-full"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                  }}
                />
                <div
                  className="absolute top-1/2 left-full h-px origin-left"
                  style={{
                    width: `${particle.size * 12}px`,
                    background: `linear-gradient(to right, ${particle.color}, ${particle.color}80, transparent)`,
                    transform: 'translateY(-50%) rotate(45deg)',
                  }}
                />
              </div>
            )}
            
            {particle.type === 'planet' && (
              <div
                className="rounded-full"
                style={{
                  width: `${particle.size * 2}px`,
                  height: `${particle.size * 2}px`,
                  background: `radial-gradient(circle at 30% 30%, ${particle.color}, ${particle.color}60, ${particle.color}20)`,
                  boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
                }}
              />
            )}

            {particle.type === 'asteroid' && (
              <div
                className="rounded-sm"
                style={{
                  width: `${particle.size * 1.5}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  opacity: 0.6,
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                }}
              />
            )}

            {particle.type === 'pulsar' && (
              <motion.div
                className="rounded-full"
                style={{
                  width: `${particle.size * 3}px`,
                  height: `${particle.size * 3}px`,
                  background: `radial-gradient(circle, ${particle.color}, transparent)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0.3, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        ))}

        {/* Floating Energy Orbs */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${15 + i * 7}%`,
              top: `${25 + (i % 4) * 18}%`,
              width: `${30 + i * 8}px`,
              height: `${30 + i * 8}px`,
              background: `radial-gradient(circle, ${
                ['#60A5FA', '#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#06B6D4'][i % 6]
              }25 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 25, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Cosmic Dust Clouds */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute blur-xl"
            style={{
              left: `${i * 15}%`,
              top: `${15 + i * 12}%`,
              width: `${180 + i * 40}px`,
              height: `${90 + i * 25}px`,
              background: `linear-gradient(${45 + i * 30}deg, 
                rgba(96, 165, 250, 0.15) 0%, 
                rgba(167, 139, 250, 0.15) 30%,
                rgba(244, 114, 182, 0.15) 60%,
                rgba(52, 211, 153, 0.15) 100%)`,
              borderRadius: '50%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 35 + i * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Distant Galaxy Spiral */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 opacity-15"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(from 0deg, 
                transparent 0deg, 
                rgba(96, 165, 250, 0.4) 60deg, 
                transparent 120deg, 
                rgba(167, 139, 250, 0.4) 180deg, 
                transparent 240deg, 
                rgba(244, 114, 182, 0.4) 300deg, 
                transparent 360deg)`,
            }}
          />
        </motion.div>

        {/* Cosmic Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border opacity-10"
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 25}%`,
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              borderColor: ['#60A5FA', '#A78BFA', '#F472B6'][i],
              borderWidth: '2px',
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Shooting Stars */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, 200],
              y: [0, -100],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 8 + Math.random() * 10,
              ease: "easeOut",
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full">
              <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-white to-transparent transform -rotate-45 origin-left" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
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