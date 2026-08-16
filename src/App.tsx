import { useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Episodes from '@/components/Episodes';
import About from '@/components/About';
import Subscribe from '@/components/Subscribe';
import EditToggle from '@/components/EditToggle';
import { useEpisodes } from '@/hooks/useEpisodes';
import { EditModeContext } from '@/hooks/useEditMode';

function App() {
  const { localhost } = useEpisodes();
  const [editMode, setEditMode] = useState(false);

  return (
    <EditModeContext.Provider value={{ editMode, setEditMode, localhost }}>
      <div className="scanlines min-h-screen bg-transparent font-body text-neutral-200">
        <Nav />
        <Hero />
        <Episodes />
        <About />
        <Subscribe />

        <footer className="border-t border-blood-700/20 px-6 py-8 text-center">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-neutral-700">
            Antics — All footage archived, nothing verified.
          </p>
        </footer>

        <EditToggle />
      </div>
    </EditModeContext.Provider>
  );
}

export default App;
