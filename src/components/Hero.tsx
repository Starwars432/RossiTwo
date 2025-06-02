import { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const motionProps = isMounted ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 }
  } : {};

  const buttonMotionProps = isMounted ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-sb-field-path="sections.0"
    >
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <motion.div
            {...motionProps}
            className="flex flex-col items-center space-y-4"
          >
            <h1 className="text-8xl italic">Manifest</h1>
            <h1 className="text-8xl italic text-blue-400">Illusions</h1>
          </motion.div>
          <motion.p
            {...motionProps}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl text-gray-300 mt-8 mb-12 max-w-3xl mx-auto"
            data-sb-field-path="sections.0.content"
          >
            Elevating brands with cutting-edge design and innovative digital marketing strategies
          </motion.p>
          <motion.div
            {...motionProps}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <Link to="services" smooth={true} duration={500}>
              <motion.button
                {...buttonMotionProps}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Explore Services
              </motion.button>
            </Link>
            <Link to="custom-design" smooth={true} duration={500}>
              <motion.button
                {...buttonMotionProps}
                className="bg-blue-500/10 border border-blue-400/30 text-blue-400 px-8 py-3 rounded-lg hover:bg-blue-500/20 transition-all"
              >
                Custom Design
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;