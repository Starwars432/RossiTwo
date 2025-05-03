import React, { useState } from 'react';
import { Link } from 'react-scroll';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useInView } from 'react-intersection-observer';
import {
  Sparkles,
  ImageIcon,
  FileText,
  Palette,
  Brain,
  ShoppingBag,
  BarChart3,
  ShoppingCart,
  LogIn,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="service-card bg-black/50 backdrop-blur-lg p-6 rounded-lg border border-blue-400/20 hover:border-blue-400/50 transition-all"
      data-sb-field-path={__ENABLE_VISUAL_EDITOR__ ? `.${title.toLowerCase().replace(/\s+/g, '-')}` : undefined}
    >
      <div className="mb-4 text-blue-400">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-blue-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    onDrop: acceptedFiles => {
      console.log(acceptedFiles);
    },
  });

  // Initialize visual editor if enabled
  if (__ENABLE_VISUAL_EDITOR__) {
    console.log('Visual Editor is enabled');
  }

  return (
    <div className="min-h-screen bg-black text-white relative font-serif overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 bg-transparent">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex items-center space-x-8">
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="services"
              smooth={true}
              duration={500}
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Services
            </Link>
            <Link
              to="portfolio"
              smooth={true}
              duration={500}
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              to="custom-design"
              smooth={true}
              duration={500}
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Custom Design
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-blue-400 hover:text-blue-300"
              >
                <ShoppingCart className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-500/20 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-sb-field-path={__ENABLE_VISUAL_EDITOR__ ? '.hero' : undefined}
      >
        <div className="absolute inset-0 z-0">
          <Spline scene="https://prod.spline.design/M0A3Y0cy9S1ujpeC/scene.splinecode" />
        </div>
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
              data-sb-field-path={__ENABLE_VISUAL_EDITOR__ ? '.hero-description' : undefined}
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

      {/* Services Section */}
      <section id="services" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-blue-400 mb-2">Our Services</h2>
            <p className="text-gray-400">Comprehensive solutions for your brand</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<ImageIcon className="w-8 h-8" />}
              title="Product Ad Design"
              description="Eye-catching visuals for social media, websites, and email marketing campaigns."
            />
            <ServiceCard
              icon={<Palette className="w-8 h-8" />}
              title="Brand Identity"
              description="Complete brand identity design including logos, guidelines, and assets."
            />
            <ServiceCard
              icon={<ShoppingBag className="w-8 h-8" />}
              title="Clothing Design"
              description="Custom apparel design and merchandising solutions."
            />
            <ServiceCard
              icon={<Brain className="w-8 h-8" />}
              title="AI Model Generation"
              description="Advanced AI-powered design and content generation."
            />
            <ServiceCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Digital Marketing"
              description="Comprehensive digital marketing strategies and implementation."
            />
            <ServiceCard
              icon={<FileText className="w-8 h-8" />}
              title="Custom Design Solutions"
              description="Tailored design solutions for your unique needs."
            />
          </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <section id="custom-design" className="relative py-20 px-6 bg-blue-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-blue-400 mb-2">Custom Design Request</h2>
            <p className="text-gray-400">Tell us about your project</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <textarea
                placeholder="Describe your project..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div
              {...getRootProps()}
              className={`drag-drop-zone h-64 flex items-center justify-center ${
                isDragActive ? 'dragging' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p>Drag & drop images here, or click to select files</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
            >
              Submit Request
            </motion.button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-light text-blue-400 mb-2">Get in Touch</h2>
            <p className="text-gray-400">
              Have questions or ready to start your project? Reach out to us and we'll get back to
              you as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl text-blue-400 mb-6">Send Us a Message</h3>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="What is this regarding?"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <textarea
                placeholder="Your message here..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Send Message
              </motion.button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl text-blue-400 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Email</h4>
                    <p className="text-gray-400">contact@techdesignstudio.com</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Phone</h4>
                    <p className="text-gray-400">+1 (234) 567-890</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Location</h4>
                    <p className="text-gray-400">San Francisco, CA</p>
                    <p className="text-gray-400">United States</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Business Hours</h4>
                <p className="text-gray-400">Monday - Friday</p>
                <p className="text-gray-400">9:00 AM - 6:00 PM EST</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span className="text-xl text-blue-400 italic">Manifest Illusions</span>
            </div>
            <p className="text-gray-400 mb-6">
              Elevating brands with cutting-edge design and innovative digital marketing strategies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Product Ad Design
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Brand Identity
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Clothing Design
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  AI Model Generation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Digital Marketing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Custom Design Solutions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="home"
                  smooth={true}
                  duration={500}
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="services"
                  smooth={true}
                  duration={500}
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="portfolio"
                  smooth={true}
                  duration={500}
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="custom-design"
                  smooth={true}
                  duration={500}
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Custom Design
                </Link>
              </li>
              <li>
                <Link
                  to="contact"
                  smooth={true}
                  duration={500}
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              />
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-500">
            © 2025 Manifest Illusions. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsLoginOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/90 p-8 rounded-lg border border-blue-400/30 relative z-10 w-full max-w-md"
            >
              <h2 className="text-2xl mb-6 text-blue-400">Login</h2>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Sign In
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;