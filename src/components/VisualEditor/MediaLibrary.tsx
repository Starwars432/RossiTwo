import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useMediaStore } from '../../lib/stores/mediaStore';

const MediaLibrary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { files, isLoading, error, loadFiles, uploadFile, deleteFile } = useMediaStore();

  useEffect(() => {
    if (isExpanded) {
      loadFiles();
    }
  }, [isExpanded]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    onDrop: async (acceptedFiles) => {
      try {
        for (const file of acceptedFiles) {
          await uploadFile(file);
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  });

  const handleDelete = async (id: string, filename: string) => {
    try {
      await deleteFile(id, filename);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        aria-label={isExpanded ? 'Collapse media library' : 'Expand media library'}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <ImageIcon className="w-4 h-4 ml-2 mr-2" />
        <span>Media Library</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-blue-400/30 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400/50 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-sm text-gray-400">
              {isLoading ? 'Uploading...' : 'Drop images here or click to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {isLoading && files.length === 0 ? (
              <p className="text-sm text-gray-400">Loading media...</p>
            ) : files.length === 0 ? (
              <p className="text-sm text-gray-400">No media yet</p>
            ) : (
              files.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-20 object-cover rounded"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(file.id, file.filename)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete ${file.filename}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </motion.button>
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-xs text-gray-300 truncate">
                    {file.filename}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;