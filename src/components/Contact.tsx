import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
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
            Have questions or ready to start your project? Reach out to us and we'll get back to you as
            soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl text-blue-400 mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                aria-label="Name"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                aria-label="Email"
              />
              <input
                type="text"
                placeholder="What is this regarding?"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                aria-label="Subject"
              />
              <textarea
                placeholder="Your message here..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
                aria-label="Message"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all"
                type="submit"
              >
                Send Message
              </motion.button>
            </form>
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
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;