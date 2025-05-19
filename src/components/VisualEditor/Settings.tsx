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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isExpanded && user) {
      fetchSettings();
    }
  }, [isExpanded, user]);

  const fetchSettings = async () => {
    try {
      setError(null);
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
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('editor_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        aria-label={isExpanded ? 'Collapse settings' : 'Expand settings'}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className="ml-2">Settings</span>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}
          
          {loading ? (
            <p className="text-sm text-gray-400">Loading settings...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="github-token">
                  GitHub Token
                </label>
                <input
                  id="github-token"
                  type="password"
                  value={settings.github_token}
                  onChange={e => setSettings({ ...settings, github_token: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-blue-400/30 rounded focus:outline-none focus:border-blue-400"
                  placeholder="Enter GitHub token"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="github-repo">
                  GitHub Repo
                </label>
                <input
                  id="github-repo"
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
                aria-label={saving ? 'Saving settings...' : 'Save settings'}
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