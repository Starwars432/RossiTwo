import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ImageIcon, FileText, Palette, Brain, ShoppingBag, BarChart3 } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  fieldPath?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, fieldPath }) => {
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
      data-sb-field-path={fieldPath}
    >
      <div className="mb-4 text-blue-400">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-blue-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="relative py-20 px-6" data-sb-field-path="sections.1">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-light text-blue-400 mb-2" data-sb-field-path="sections.1.title">
            Our Services
          </h2>
          <p className="text-gray-400" data-sb-field-path="sections.1.content">
            Comprehensive solutions for your brand
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<ImageIcon className="w-8 h-8" />}
            title="Product Ad Design"
            description="Eye-catching visuals for social media, websites, and email marketing campaigns."
            fieldPath="sections.2"
          />
          <ServiceCard
            icon={<Palette className="w-8 h-8" />}
            title="Brand Identity"
            description="Complete brand identity design including logos, guidelines, and assets."
            fieldPath="sections.3"
          />
          <ServiceCard
            icon={<ShoppingBag className="w-8 h-8" />}
            title="Clothing Design"
            description="Custom apparel design and merchandising solutions."
            fieldPath="sections.4"
          />
          <ServiceCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Model Generation"
            description="Advanced AI-powered design and content generation."
            fieldPath="sections.5"
          />
          <ServiceCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Digital Marketing"
            description="Comprehensive digital marketing strategies and implementation."
            fieldPath="sections.6"
          />
          <ServiceCard
            icon={<FileText className="w-8 h-8" />}
            title="Custom Design Solutions"
            description="Tailored design solutions for your unique needs."
            fieldPath="sections.7"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;