import type { SiteTheme } from '@/types';

export function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-bg', theme.background);
  root.style.setProperty('--color-text-primary', theme.primary_text);
  root.style.setProperty('--color-text-secondary', theme.secondary_text);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-grid', theme.grid);
}
