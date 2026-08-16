import { useEffect, useState, useCallback } from 'react';
import type { SiteContentEntry, ContentStyles } from '@/types';
import { DEFAULT_CONTENT } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEditHistory } from '@/hooks/useEditHistory';

function applyDefaults(entries: SiteContentEntry[]): Record<string, SiteContentEntry> {
  const map: Record<string, SiteContentEntry> = {};
  for (const [id, value] of Object.entries(DEFAULT_CONTENT)) {
    map[id] = { id, value, styles: {} };
  }
  for (const entry of entries) { map[entry.id] = entry; }
  return map;
}

export function useSiteContent() {
  const { registerChange } = useEditHistory();
  const [content, setContent] = useState<Record<string, SiteContentEntry>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    const { data, error } = await supabase.from('site_content').select('*');
    if (error || !data) { setLoading(false); return; }
    const entries: SiteContentEntry[] = data.map((row: Record<string, unknown>) => ({
      id: row.id as string, value: row.value as string, styles: (row.styles as ContentStyles) ?? {},
    }));
    setContent(applyDefaults(entries));
    setLoading(false);
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const updateText = useCallback((id: string, value: string) => {
    setContent((prev) => {
      const entry = prev[id] ?? { id, value: '', styles: {} };
      return { ...prev, [id]: { ...entry, value } };
    });
  }, []);

  const updateStyles = useCallback((id: string, styles: Partial<ContentStyles>) => {
    setContent((prev) => {
      const entry = prev[id] ?? { id, value: '', styles: {} };
      return { ...prev, [id]: { ...entry, styles: { ...entry.styles, ...styles } } };
    });
  }, []);

  const commitText = useCallback(async (id: string) => {
    const entry = content[id]; if (!entry) return;
    const prevValue = entry.value; const prevStyles = entry.styles;
    await supabase.from('site_content').upsert({ id, value: entry.value, styles: entry.styles });
    registerChange({
      label: `Edit ${id}`,
      undo: async () => {
        setContent((prev) => ({ ...prev, [id]: { ...prev[id], value: prevValue, styles: prevStyles } }));
        await supabase.from('site_content').upsert({ id, value: prevValue, styles: prevStyles });
      },
      redo: async () => {
        setContent((prev) => ({ ...prev, [id]: { ...prev[id], value: entry.value, styles: entry.styles } }));
        await supabase.from('site_content').upsert({ id, value: entry.value, styles: entry.styles });
      },
    });
  }, [content, registerChange]);

  const getText = useCallback((id: string): string => content[id]?.value ?? DEFAULT_CONTENT[id] ?? '', [content]);
  const getStyles = useCallback((id: string): ContentStyles => content[id]?.styles ?? {}, [content]);

  return { content, loading, getText, getStyles, updateText, updateStyles, commitText };
}
