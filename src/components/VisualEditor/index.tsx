import React, { useState, useEffect } from 'react';
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
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image, Plus } from 'lucide-react';

const VisualEditor: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const makeAllContentEditable = () => {
      const makeEditable = (element: HTMLElement) => {
        // Skip elements that shouldn't be editable
        const nonEditableTags = ['SCRIPT', 'STYLE', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        if (nonEditableTags.includes(element.tagName)) return;

        // Make text nodes editable
        if (element.childNodes.length === 0 || 
            (element.childNodes.length === 1 && element.firstChild?.nodeType === Node.TEXT_NODE)) {
          element.setAttribute('data-editable', 'true');
          element.contentEditable = 'true';
          element.addEventListener('focus', () => setSelectedElement(element));
          element.addEventListener('blur', () => setSelectedElement(null));
        }

        // Recursively process child elements
        Array.from(element.children).forEach(child => {
          if (child instanceof HTMLElement) {
            makeEditable(child);
          }
        });
      };

      // Start with the main content container
      const container = document.querySelector('.editable-content');
      if (container instanceof HTMLElement) {
        makeEditable(container);
      }

      // Set up mutation observer to handle dynamically added content
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              makeEditable(node);
            }
          });
        });
      });

      if (container) {
        observer.observe(container, {
          childList: true,
          subtree: true
        });
      }

      return () => observer.disconnect();
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
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleCreateServicePage = () => {
    const title = window.prompt('Enter service page title:');
    if (!title) return;

    // Here you would typically create a new service page
    // and link it to the parent service
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
      {selectedElement && (
        <div className="fixed top-4 right-4 z-50 bg-black/90 border border-blue-400/30 rounded-lg p-2 space-y-2">
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
              onClick={() => {
                const url = window.prompt('Enter the image URL');
                if (url) {
                  document.execCommand('insertImage', false, url);
                }
              }}
              className="p-1 rounded hover:bg-blue-500/20"
              aria-label="Add image"
            >
              <Image className="w-4 h-4" />
            </button>
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