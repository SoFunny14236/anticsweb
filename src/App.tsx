import { useState } from 'react';
import { EditModeContext, useEditMode } from '@/hooks/useEditMode';
import { EditHistoryProvider } from '@/hooks/useEditHistory';
import { SiteDataContext } from '@/hooks/useSiteData';
import { useEpisodes } from '@/hooks/useEpisodes';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useSiteTheme } from '@/hooks/useSiteTheme';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Episodes from '@/components/Episodes';
import About from '@/components/About';
import Subscribe from '@/components/Subscribe';
import EditToolbar from '@/components/EditToolbar';
import ThemePanel from '@/components/ThemePanel';
import { EditableText } from '@/components/EditableText';

function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const { loading: episodesLoading, ...episodesRest } = useEpisodes();
  const { loading: contentLoading, ...contentRest } = useSiteContent();
  const { loading: themeLoading, ...themeRest } = useSiteTheme();
  return <SiteDataContext.Provider value={{ episodesLoading, contentLoading, themeLoading, ...episodesRest, ...contentRest, ...themeRest }}>{children}</SiteDataContext.Provider>;
}

function AppContent() {
  const { editMode } = useEditMode();
  return (
    <div className={`scanlines min-h-screen bg-transparent font-body text-neutral-200 ${editMode ? 'edit-mode-active' : ''}`}>
      <Nav />
      <Hero />
      <Episodes />
      <About />
      <Subscribe />

      <footer className="border-t border-accent-700/20 px-6 py-8 text-center">
        <EditableText contentId="footer_text" as="p" className="font-heading text-xs uppercase tracking-[0.3em] text-neutral-700" />
      </footer>

      <EditToolbar />
      <ThemePanel />
    </div>
  );
}

function App() {
  const [editMode, setEditMode] = useState(false);
  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      <EditHistoryProvider>
        <SiteDataProvider>
          <AppContent />
        </SiteDataProvider>
      </EditHistoryProvider>
    </EditModeContext.Provider>
  );
}

export default App;
