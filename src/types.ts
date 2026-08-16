export interface Episode {
  id: string;
  title: string;
  description: string;
  status: string;
  runtime: string;
  thumbnail: string;
  hidden: boolean;
  pinned: boolean;
}

export interface ContentStyles {
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  positionX?: number;
  positionY?: number;
  width?: string;
  visible?: boolean;
}

export interface SiteContentEntry {
  id: string;
  value: string;
  styles: ContentStyles;
}

export interface SiteTheme {
  id: string;
  preset: string;
  accent: string;
  background: string;
  primary_text: string;
  secondary_text: string;
  border: string;
  grid: string;
}

export interface ThemePreset {
  name: string;
  label: string;
  accent: string;
  background: string;
  primary_text: string;
  secondary_text: string;
  border: string;
  grid: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { name: 'red', label: 'Red', accent: '#cc1414', background: '#0a0a0a', primary_text: '#e5e5e5', secondary_text: '#9ca3af', border: '#8b0000', grid: 'rgba(204, 20, 20, 0.09)' },
  { name: 'cyan', label: 'Cyan', accent: '#06b6d4', background: '#0a0a0a', primary_text: '#e5e5e5', secondary_text: '#9ca3af', border: '#0e7490', grid: 'rgba(6, 182, 212, 0.09)' },
  { name: 'green', label: 'Green', accent: '#22c55e', background: '#0a0a0a', primary_text: '#e5e5e5', secondary_text: '#9ca3af', border: '#166534', grid: 'rgba(34, 197, 94, 0.09)' },
  { name: 'amber', label: 'Amber', accent: '#f59e0b', background: '#0a0a0a', primary_text: '#e5e5e5', secondary_text: '#9ca3af', border: '#92400e', grid: 'rgba(245, 158, 11, 0.09)' },
  { name: 'white', label: 'White', accent: '#e5e5e5', background: '#0a0a0a', primary_text: '#f5f5f5', secondary_text: '#a3a3a3', border: '#525252', grid: 'rgba(229, 229, 229, 0.06)' },
  { name: 'purple', label: 'Purple', accent: '#a855f7', background: '#0a0a0a', primary_text: '#e5e5e5', secondary_text: '#9ca3af', border: '#6b21a8', grid: 'rgba(168, 85, 247, 0.09)' },
];

export const DEFAULT_THEME: SiteTheme = {
  id: 'active', preset: 'red', accent: '#cc1414', background: '#0a0a0a',
  primary_text: '#e5e5e5', secondary_text: '#9ca3af', border: '#8b0000', grid: 'rgba(204, 20, 20, 0.09)',
};

export const DEFAULT_CONTENT: Record<string, string> = {
  hero_tagline: '[ CASE FILE OPEN ]',
  hero_title: 'ANTICS',
  nav_videos: 'Videos',
  nav_about: 'About',
  nav_subscribe: 'Subscribe',
  videos_label: 'Archive',
  videos_heading: 'Videos',
  videos_count_label: 'Filed',
  about_file: 'File #0001',
  about_heading: 'About',
  about_para1: 'I document things that happened, more or less, in the order they occurred. Every video is filed, timestamped, and presented with commentary.',
  about_status: 'Status: Ongoing',
  subscribe_tagline: '[ AWAITING AUTHORIZATION ]',
  subscribe_heading: 'Subscribe',
  subscribe_para: "New files are added when they're added. The only way to know is to be on the list.",
  subscribe_button: 'Subscribe on YouTube',
  footer_text: 'Antics — All footage archived, nothing verified.',
  scroll_text: 'Scroll',
};
