import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ImageIcon } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  description: string;
}

const CustomDesign: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    description: ''
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxSize: 10485760, // 10MB
    onDropRejected: (rejectedFiles) => {
      const errors = rejectedFiles.map(file => {
        if (file.errors[0]?.code === 'file-too-large') {
          return `${file.file.name} is larger than 10MB`;
        }
        return `${file.file.name} is not a supported image type`;
      });
      setErrorMessage(errors.join(', '));
    },
    onDropAccepted: (files) => {
      setUploadedFiles(files);
      setErrorMessage(null);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      description: ''
    });
    setUploadedFiles([]);
    setErrorMessage(null);
    nameInputRef.current?.focus();
  };

  const handleSubmit = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Form validation
    if (!formData.name || !formData.email || !formData.description) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (!uploadedFiles.length) {
      setErrorMessage('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success handling
      resetForm();
      alert('Your design request has been submitted successfully!');
    } catch (error) {
      // Error handling
      if (error instanceof Error) {
        setErrorMessage(`Failed to submit request: ${error.message}`);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              ref={nameInputRef}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              aria-label="Your name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              aria-label="Your email"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project..."
              rows={6}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-blue-400/30 focus:border-blue-400 focus:outline-none"
              aria-label="Project description"
              required
            />
          </div>
          <div
            {...getRootProps()}
            className={`drag-drop-zone h-64 flex flex-col items-center justify-center ${
              isDragActive ? 'dragging' : ''
            } ${errorMessage ? 'border-red-400/50' : ''}`}
            aria-describedby="file-upload-description"
          >
            <input {...getInputProps()} aria-label="File upload" />
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p>Drag & drop images here, or click to select files</p>
              <p id="file-upload-description" className="text-sm text-gray-400 mt-2">
                Accepted file types: .jpg, .png, .gif. Max size: 10MB
              </p>
              {errorMessage && (
                <p className="text-red-400 text-sm mt-2" role="alert">{errorMessage}</p>
              )}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Selected Files:</h4>
                  <ul className="text-sm space-y-2">
                    {uploadedFiles.map(file => (
                      <li key={file.name} className="flex items-center space-x-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview of ${file.name}`}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="text-gray-400">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            disabled={isSubmitting}
            className="text-blue-400 px-8 py-3 rounded-lg hover:text-blue-300 transition-all"
            aria-label="Reset form"
          >
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-8 py-3 rounded-lg transition-all flex items-center space-x-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            aria-label="Submit design request"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CustomDesign;