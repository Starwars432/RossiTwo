import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Hero from '../Hero';
import Services from '../Services';
import CustomDesign from '../CustomDesign';
import Contact from '../Contact';
import Footer from '../Footer';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image, Plus, Github } from 'lucide-react';

const VisualEditor: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<string[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const makeAllContentEditable = () => {
      const makeEditable = (element: HTMLElement) => {
        if (element.nodeType === Node.TEXT_NODE || element.childNodes.length === 0) {
          element.setAttribute('data-editable', 'true');
          element.contentEditable = 'true';
          element.addEventListener('focus', () => setSelectedElement(element));
          element.addEventListener('blur', () => setSelectedElement(null));
        }

        Array.from(element.children).forEach(child => {
          if (child instanceof HTMLElement) {
            makeEditable(child);
          }
        });
      };

      const container = document.querySelector('.editable-content');
      if (container instanceof HTMLElement) {
        makeEditable(container);
      }
    };

    makeAllContentEditable();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsAdmin(data);

        if (data) {
          await fetchGitHubBranches();
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    checkAdminStatus();
  }, [user]);

  const fetchGitHubBranches = async () => {
    try {
      const { data: settings } = await supabase
        .from('editor_settings')
        .select('github_token, github_repo')
        .eq('user_id', user?.id)
        .single();

      if (settings?.github_token && settings?.github_repo) {
        const [owner, repo] = settings.github_repo.split('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
          headers: {
            'Authorization': `token ${settings.github_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch branches');
        const branchData = await response.json();
        setBranches(branchData.map((branch: any) => branch.name));
      }
    } catch (error) {
      console.error('Error fetching GitHub branches:', error);
    }
  };

  const handleCreateServicePage = async () => {
    const title = window.prompt('Enter service page title:');
    if (!title) return;

    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title,
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          content: {},
          is_draft: true
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        window.location.href = `/vos/${data.slug}`;
      }
    } catch (error) {
      console.error('Error creating service page:', error);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      if (selectedElement) {
        const img = document.createElement('img');
        img.src = publicUrl;
        img.alt = file.name;
        selectedElement.appendChild(img);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleGitHubPush = async () => {
    if (!selectedBranch) return;
    setGithubLoading(true);

    try {
      const { data: pages } = await supabase
        .from('pages')
        .select('*')
        .eq('is_draft', true);

      if (pages) {
        const { data: settings } = await supabase
          .from('editor_settings')
          .select('github_token, github_repo')
          .eq('user_id', user?.id)
          .single();

        if (settings?.github_token && settings?.github_repo) {
          const [owner, repo] = settings.github_repo.split('/');
          
          for (const page of pages) {
            const content = JSON.stringify(page, null, 2);
            const path = `content/pages/${page.slug}.json`;
            const message = `Update ${page.slug} page`;

            await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
              method: 'PUT',
              headers: {
                'Authorization': `token ${settings.github_token}`,
                'Accept': 'application/vnd.github.v3+json'
              },
              body: JSON.stringify({
                message,
                content: btoa(content),
                branch: selectedBranch
              })
            });
          }
        }
      }
    } catch (error) {
      console.error('Error pushing to GitHub:', error);
    } finally {
      setGithubLoading(false);
      setShowGitHubModal(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
        <button
          onClick={() => setShowGitHubModal(true)}
          className="bg-black/90 border border-blue-400/30 rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-blue-500/20"
        >
          <Github className="w-4 h-4" />
          <span>Push to GitHub</span>
        </button>
      </div>

      {selectedElement && (
        <div className="fixed top-4 left-4 z-50 bg-black/90 border border-blue-400/30 rounded-lg p-2 space-y-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => document.execCommand('bold')}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.execCommand('italic')}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.execCommand('justifyLeft')}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Align left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.execCommand('justifyCenter')}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Align center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.execCommand('justifyRight')}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Align right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                const url = window.prompt('Enter the link URL');
                if (url) {
                  document.execCommand('createLink', false, url);
                }
              }}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Add link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Add image"
            >
              <Image className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <button
              onClick={handleCreateServicePage}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Add service page"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showGitHubModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-blue-400/30 rounded-lg p-6 w-96">
            <h3 className="text-xl mb-4">Push to GitHub</h3>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-black/50 border border-blue-400/30 rounded p-2 mb-4"
            >
              <option value="">Select a branch</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowGitHubModal(false)}
                className="px-4 py-2 rounded hover:bg-blue-500/20"
              >
                Cancel
              </button>
              <button
                onClick={handleGitHubPush}
                disabled={!selectedBranch || githubLoading}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {githubLoading ? 'Pushing...' : 'Push'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="editable-content">
        <Hero />
        <Services />
        <CustomDesign />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default VisualEditor;