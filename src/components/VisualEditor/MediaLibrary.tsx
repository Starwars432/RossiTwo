import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Upload, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';

const MediaLibrary: React.FC = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isExpanded) {
      fetchMedia();
    }
  }, [isExpanded]);

  const fetchMedia = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      setError(null);
      try {
        for (const file of acceptedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

          const { data, error } = await supabase
            .from('media')
            .insert({
              filename: file.name,
              url: publicUrl,
              mime_type: file.type,
              size: file.size,
            })
            .select()
            .single();

          if (error) throw error;
          if (data) {
            setMedia([data, ...media]);
          }
        }
      } catch (error) {
        console.error('Error uploading media:', error);
        setError('Failed to upload media');
      } finally {
        setUploading(false);
      }
    }
  });

  const deleteMedia = async (id: string, filename: string) => {
    try {
      setError(null);
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filename]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setMedia(media.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting media:', error);
      setError('Failed to delete media');
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
        <span className="ml-2">Media Library</span>
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
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Drop zone for file upload"
          >
            <input {...getInputProps()} />
            <Upload className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-sm text-gray-400">
              {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {loading ? (
              <p className="text-sm text-gray-400">Loading media...</p>
            ) : media.length === 0 ? (
              <p className="text-sm text-gray-400">No media yet</p>
            ) : (
              media.map(item => (
                <div
                  key={item.id}
                  className="relative group"
                >
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => deleteMedia(item.id, item.filename)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete ${item.filename}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;