import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../../lib/stores/pageStore';
import { useThemeStore } from '../../lib/stores/themeStore';
import { useTabStore } from '../../lib/stores/tabStore';
import PageList from './PageList';
import MediaLibrary from './MediaLibrary';
import ThemeSettings from './ThemeSettings';
import GitHubSync from './GitHubSync';
import Settings from './Settings';
import Canvas from './Canvas';
import Tutorial from './Tutorial';
import KeyboardShortcuts from './KeyboardShortcuts';
import TabBar from './TabBar';
import { BreakpointProvider } from '../../contexts/BreakpointContext';
import Hero from '../Hero';
import Services from '../Services';
import CustomDesign from '../CustomDesign';
import Contact from '../Contact';
import Footer from '../Footer';

const VisualEditor: React.FC = () => {
  const { pageId } = useParams();
  const { loadPage, loading, error } = usePageStore();
  const { loadTheme } = useThemeStore();
  const { addTab } = useTabStore();

  useEffect(() => {
    if (pageId) {
      loadPage(pageId).then(page => {
        if (page) {
          addTab(page.id, page);
        }
      });
    }
    loadTheme();
  }, [pageId, loadPage, loadTheme, addTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-blue-400">Loading editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <BreakpointProvider>
      <div className="min-h-screen bg-black text-white flex">
        <div className="w-64 bg-black/50 border-r border-blue-400/30 p-4">
          <PageList onPageSelect={loadPage} />
          <MediaLibrary />
          <ThemeSettings />
          {pageId && <GitHubSync pageId={pageId} />}
          <Settings />
        </div>

        <div className="flex-1 flex flex-col">
          <TabBar />
          <Canvas>
            <Hero />
            <Services />
            <CustomDesign />
            <Contact />
            <Footer />
          </Canvas>
        </div>

        <Tutorial />
        <KeyboardShortcuts />
      </div>
    </BreakpointProvider>
  );
};

export default VisualEditor;