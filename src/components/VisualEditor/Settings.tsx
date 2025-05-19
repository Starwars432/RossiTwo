import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    github_token: '',
    github_repo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isExpanded && user) {
      fetchSettings();
    }
  }, [isExpanded, user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('editor_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSettings({
          github_token: data.github_token || '',
          github_repo: data.github_repo || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('editor_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className="ml-2">Settings</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-400">Loading settings...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub Token</label>
                <input
                  type="password"
                  value={settings.github_token}
                  onChange={e => setSettings({ ...settings, github_token: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
                  placeholder="Enter GitHub token"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub Repo</label>
                <input
                  type="text"
                  value={settings.github_repo}
                  onChange={e => setSettings({ ...settings, github_repo: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
                  placeholder="username/repo"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveSettings}
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;