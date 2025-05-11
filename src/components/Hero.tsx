import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import * as THREE from 'three';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    
    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
    cameraRef.current.position.z = 1;

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0x000000, 1);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 7000;
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;     // x
      positions[i + 1] = (Math.random() - 0.5) * 2000; // y
      positions[i + 2] = Math.random() * 2000;         // z
      velocities[i / 3] = Math.random() * 2 + 2;       // Speed
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      color: 0x60A5FA,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });

    starsRef.current = new THREE.Points(starGeometry, starMaterial);
    sceneRef.current.add(starsRef.current);

    // Animation
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !starsRef.current) return;

      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = starsRef.current.geometry.attributes.velocity.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] -= velocities[i / 3];

        // Reset star position when it goes behind the camera
        if (positions[i + 2] < -1000) {
          positions[i] = (Math.random() - 0.5) * 2000;
          positions[i + 1] = (Math.random() - 0.5) * 2000;
          positions[i + 2] = 1000;
        }
      }

      starsRef.current.geometry.attributes.position.needsUpdate = true;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.aspect = aspect;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (starsRef.current) {
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.Material).dispose();
      }
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-sb-field-path="sections.0"
    >
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <h1 className="text-8xl italic">Manifest</h1>
            <h1 className="text-8xl italic text-blue-400">Illusions</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl text-gray-300 mt-8 mb-12 max-w-3xl mx-auto"
            data-sb-field-path="sections.0.content"
          >
            Elevating brands with cutting-edge design and innovative digital marketing strategies
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <Link to="services" smooth={true} duration={500}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Explore Services
              </motion.button>
            </Link>
            <Link to="custom-design" smooth={true} duration={500}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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