import { createContext, useContext } from 'react';
import type { Episode, SiteContentEntry, SiteTheme, ContentStyles } from '@/types';

interface SiteDataContextValue {
  episodes: Episode[];
  episodesLoading: boolean;
  addEpisode: () => void;
  updateEpisode: (id: string, patch: Partial<Episode>) => void;
  deleteEpisode: (id: string) => void;
  reorderEpisode: (id: string, dir: -1 | 1) => void;
  moveToTop: (id: string) => void;
  moveToBottom: (id: string) => void;
  toggleHidden: (id: string) => void;
  togglePin: (id: string) => void;
  moveEpisode: (dragId: string, targetId: string) => void;
  exportJSON: () => void;

  content: Record<string, SiteContentEntry>;
  contentLoading: boolean;
  getText: (id: string) => string;
  getStyles: (id: string) => ContentStyles;
  updateText: (id: string, value: string) => void;
  updateStyles: (id: string, styles: Partial<ContentStyles>) => void;
  commitText: (id: string) => Promise<void>;

  theme: SiteTheme;
  savedTheme: SiteTheme;
  themeLoading: boolean;
  previewTheme: (partial: Partial<SiteTheme>) => void;
  saveTheme: () => Promise<void>;
  cancelTheme: () => void;
  resetTheme: () => Promise<void>;
}

export const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
