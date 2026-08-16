import { useEffect, useState, useCallback } from 'react';
import type { Episode } from '@/types';

const STORAGE_KEY = 'antics-episodes';

const defaultEpisodes: Episode[] = [
  {
    id: 'ep-placeholder',
    title: '?????',
    description: 'Coming Soon',
    runtime: '0:00',
    thumbnail: '/images/soon.png',
    hidden: false,
  },
];

function isLocalhost(): boolean {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function loadEpisodes(): Episode[] {
  if (!isLocalhost()) return defaultEpisodes;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEpisodes;
    const parsed = JSON.parse(raw) as Episode[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultEpisodes;
    return parsed.map((ep) => ({
      ...ep,
      hidden: ep.hidden ?? false,
    }));
  } catch {
    return defaultEpisodes;
  }
}

export function useEpisodes() {
  const localhost = isLocalhost();
  const [episodes, setEpisodes] = useState<Episode[]>(loadEpisodes);

  useEffect(() => {
    if (localhost) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
    }
  }, [episodes, localhost]);

  const addEpisode = useCallback(() => {
    setEpisodes((prev) => [
      ...prev,
      {
        id: `ep-${Date.now()}`,
        title: 'New Episode',
        description: 'Description pending.',
        runtime: '0:00',
        thumbnail: '/images/soon.png',
        hidden: false,
      },
    ]);
  }, []);

  const updateEpisode = useCallback((id: string, patch: Partial<Episode>) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, ...patch } : ep))
    );
  }, []);

  const deleteEpisode = useCallback((id: string) => {
    setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
  }, []);

  const reorderEpisode = useCallback((id: string, dir: -1 | 1) => {
    setEpisodes((prev) => {
      const idx = prev.findIndex((ep) => ep.id === id);
      if (idx === -1) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  const toggleHidden = useCallback((id: string) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, hidden: !ep.hidden } : ep))
    );
  }, []);

  const moveEpisode = useCallback((dragId: string, targetId: string) => {
    setEpisodes((prev) => {
      const dragIdx = prev.findIndex((ep) => ep.id === dragId);
      const targetIdx = prev.findIndex((ep) => ep.id === targetId);
      if (dragIdx === -1 || targetIdx === -1 || dragIdx === targetIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  }, []);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(episodes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'antics-episodes.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [episodes]);

  return {
    episodes,
    localhost,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    reorderEpisode,
    toggleHidden,
    moveEpisode,
    exportJSON,
  };
}
