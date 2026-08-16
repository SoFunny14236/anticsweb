import { useEffect, useState, useCallback } from 'react';
import type { SiteTheme } from '@/types';
import { DEFAULT_THEME } from '@/types';
import { supabase } from '@/lib/supabase';
import { applyTheme } from '@/lib/theme';
import { useEditHistory } from '@/hooks/useEditHistory';

export function useSiteTheme() {
  const { registerChange } = useEditHistory();
  const [theme, setTheme] = useState<SiteTheme>(DEFAULT_THEME);
  const [savedTheme, setSavedTheme] = useState<SiteTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  const fetchTheme = useCallback(async () => {
    const { data, error } = await supabase.from('site_theme').select('*').eq('id', 'active').maybeSingle();
    if (error || !data) { applyTheme(DEFAULT_THEME); setLoading(false); return; }
    const loaded: SiteTheme = {
      id: data.id, preset: data.preset, accent: data.accent, background: data.background,
      primary_text: data.primary_text, secondary_text: data.secondary_text, border: data.border, grid: data.grid,
    };
    setTheme(loaded); setSavedTheme(loaded); applyTheme(loaded); setLoading(false);
  }, []);

  useEffect(() => { fetchTheme(); }, [fetchTheme]);

  const previewTheme = useCallback((partial: Partial<SiteTheme>) => {
    setTheme((prev) => { const next = { ...prev, ...partial }; applyTheme(next); return next; });
  }, []);

  const saveTheme = useCallback(async () => {
    const prevTheme = savedTheme;
    await supabase.from('site_theme').upsert(theme);
    setSavedTheme(theme); applyTheme(theme);
    registerChange({
      label: 'Save theme',
      undo: async () => { setTheme(prevTheme); setSavedTheme(prevTheme); applyTheme(prevTheme); await supabase.from('site_theme').upsert(prevTheme); },
      redo: async () => { setTheme(theme); setSavedTheme(theme); applyTheme(theme); await supabase.from('site_theme').upsert(theme); },
    });
  }, [theme, savedTheme, registerChange]);

  const cancelTheme = useCallback(() => { setTheme(savedTheme); applyTheme(savedTheme); }, [savedTheme]);

  const resetTheme = useCallback(async () => {
    const prevTheme = savedTheme;
    setTheme(DEFAULT_THEME); setSavedTheme(DEFAULT_THEME); applyTheme(DEFAULT_THEME);
    await supabase.from('site_theme').upsert(DEFAULT_THEME);
    registerChange({
      label: 'Reset theme',
      undo: async () => { setTheme(prevTheme); setSavedTheme(prevTheme); applyTheme(prevTheme); await supabase.from('site_theme').upsert(prevTheme); },
      redo: async () => { setTheme(DEFAULT_THEME); setSavedTheme(DEFAULT_THEME); applyTheme(DEFAULT_THEME); await supabase.from('site_theme').upsert(DEFAULT_THEME); },
    });
  }, [savedTheme, registerChange]);

  return { theme, savedTheme, loading, previewTheme, saveTheme, cancelTheme, resetTheme };
}
