import { useEffect, useState, useCallback } from 'react';
import type { Episode } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEditHistory } from '@/hooks/useEditHistory';

const STORAGE_KEY = 'antics-episodes';

const defaultEpisodes: Episode[] = [
  { id: 'ep-placeholder', title: '?????', description: 'Coming Soon', status: 'Coming Soon', runtime: '0:00', thumbnail: '/images/soon.png', hidden: false, pinned: false },
];

function sortEpisodes(eps: Episode[]): Episode[] {
  return [...eps].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return 0;
  });
}

function loadFromLocalStorage(): Episode[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Episode[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((ep) => ({
      ...ep, status: ep.status ?? '', pinned: ep.pinned ?? false, hidden: ep.hidden ?? false,
    }));
  } catch { return null; }
}

export function useEpisodes() {
  const { registerChange } = useEditHistory();
  const [episodes, setEpisodes] = useState<Episode[]>(defaultEpisodes);
  const [loading, setLoading] = useState(true);

  const persistEpisodes = useCallback(async (next: Episode[]) => {
    const rows = next.map((ep, i) => ({
      id: ep.id, title: ep.title, description: ep.description, status: ep.status,
      runtime: ep.runtime, thumbnail: ep.thumbnail, hidden: ep.hidden, pinned: ep.pinned, sort_order: i,
    }));
    await supabase.from('episodes').upsert(rows);
  }, []);

  const fetchEpisodes = useCallback(async () => {
    const { data, error } = await supabase.from('episodes').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) {
      const local = loadFromLocalStorage();
      if (local) {
        setEpisodes(sortEpisodes(local));
        for (const ep of local) {
          await supabase.from('episodes').upsert({
            id: ep.id, title: ep.title, description: ep.description, status: ep.status,
            runtime: ep.runtime, thumbnail: ep.thumbnail, hidden: ep.hidden, pinned: ep.pinned, sort_order: 0,
          });
        }
        localStorage.removeItem(STORAGE_KEY);
      }
      setLoading(false);
      return;
    }
    const mapped: Episode[] = data.map((row: Record<string, unknown>) => ({
      id: row.id as string, title: row.title as string, description: row.description as string,
      status: (row.status as string) ?? '', runtime: row.runtime as string,
      thumbnail: row.thumbnail as string, hidden: row.hidden as boolean, pinned: row.pinned as boolean,
    }));
    setEpisodes(sortEpisodes(mapped));
    setLoading(false);
  }, []);

  useEffect(() => { fetchEpisodes(); }, [fetchEpisodes]);

  const addEpisode = useCallback(() => {
    const newEp: Episode = { id: `ep-${Date.now()}`, title: 'New Episode', description: 'Description pending.', status: 'Coming Soon', runtime: '0:00', thumbnail: '/images/soon.png', hidden: false, pinned: false };
    setEpisodes((prev) => { const next = [...prev, newEp]; persistEpisodes(next); return next; });
  }, [persistEpisodes]);

  const updateEpisode = useCallback((id: string, patch: Partial<Episode>) => {
    setEpisodes((prev) => { const next = prev.map((ep) => (ep.id === id ? { ...ep, ...patch } : ep)); persistEpisodes(next); return next; });
  }, [persistEpisodes]);

  const deleteEpisode = useCallback((id: string) => {
    const snapshot = episodes;
    setEpisodes((prev) => { const next = prev.filter((ep) => ep.id !== id); persistEpisodes(next); supabase.from('episodes').delete().eq('id', id); return next; });
    registerChange({
      label: 'Delete episode',
      undo: async () => { const ep = snapshot.find((e) => e.id === id); if (ep) { setEpisodes((prev) => { const next = [...prev, ep]; persistEpisodes(next); return next; }); await supabase.from('episodes').upsert({ ...ep, sort_order: 0 }); } },
      redo: async () => { setEpisodes((prev) => prev.filter((ep) => ep.id !== id)); await supabase.from('episodes').delete().eq('id', id); },
    });
  }, [episodes, persistEpisodes, registerChange]);

  const reorderEpisode = useCallback((id: string, dir: -1 | 1) => {
    setEpisodes((prev) => {
      const idx = prev.findIndex((ep) => ep.id === id); if (idx === -1) return prev;
      const newIdx = idx + dir; if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev]; [next[idx], next[newIdx]] = [next[newIdx], next[idx]]; persistEpisodes(next); return next;
    });
  }, [persistEpisodes]);

  const moveToTop = useCallback((id: string) => {
    setEpisodes((prev) => {
      const idx = prev.findIndex((ep) => ep.id === id); if (idx === -1 || idx === 0) return prev;
      const next = [...prev]; const [moved] = next.splice(idx, 1); next.unshift(moved); persistEpisodes(next); return next;
    });
  }, [persistEpisodes]);

  const moveToBottom = useCallback((id: string) => {
    setEpisodes((prev) => {
      const idx = prev.findIndex((ep) => ep.id === id); if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev]; const [moved] = next.splice(idx, 1); next.push(moved); persistEpisodes(next); return next;
    });
  }, [persistEpisodes]);

  const toggleHidden = useCallback((id: string) => {
    setEpisodes((prev) => { const next = prev.map((ep) => (ep.id === id ? { ...ep, hidden: !ep.hidden } : ep)); persistEpisodes(next); return next; });
  }, [persistEpisodes]);

  const togglePin = useCallback((id: string) => {
    setEpisodes((prev) => {
      const next = prev.map((ep) => (ep.id === id ? { ...ep, pinned: !ep.pinned } : ep));
      const sorted = sortEpisodes(next); persistEpisodes(sorted); return sorted;
    });
  }, [persistEpisodes]);

  const moveEpisode = useCallback((dragId: string, targetId: string) => {
    setEpisodes((prev) => {
      const dragIdx = prev.findIndex((ep) => ep.id === dragId);
      const targetIdx = prev.findIndex((ep) => ep.id === targetId);
      if (dragIdx === -1 || targetIdx === -1 || dragIdx === targetIdx) return prev;
      const next = [...prev]; const [moved] = next.splice(dragIdx, 1); next.splice(targetIdx, 0, moved); persistEpisodes(next); return next;
    });
  }, [persistEpisodes]);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(episodes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'antics-episodes.json'; a.click(); URL.revokeObjectURL(url);
  }, [episodes]);

  return { episodes, loading, addEpisode, updateEpisode, deleteEpisode, reorderEpisode, moveToTop, moveToBottom, toggleHidden, togglePin, moveEpisode, exportJSON };
}
