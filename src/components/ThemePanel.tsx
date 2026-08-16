import { useState } from 'react';
import { Palette, Check, X, RotateCcw } from 'lucide-react';
import { THEME_PRESETS } from '@/types';
import type { SiteTheme } from '@/types';
import { useEditMode } from '@/hooks/useEditMode';
import { useSiteData } from '@/hooks/useSiteData';

function ThemePanel() {
  const { editMode } = useEditMode();
  const { theme, savedTheme, previewTheme, saveTheme, cancelTheme, resetTheme } = useSiteData();
  const [open, setOpen] = useState(false);

  if (!editMode) return null;

  const hasChanges =
    theme.accent !== savedTheme.accent || theme.background !== savedTheme.background ||
    theme.primary_text !== savedTheme.primary_text || theme.secondary_text !== savedTheme.secondary_text ||
    theme.border !== savedTheme.border || theme.grid !== savedTheme.grid || theme.preset !== savedTheme.preset;

  const handlePresetClick = (presetName: string) => {
    const preset = THEME_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    previewTheme({ preset: preset.name, accent: preset.accent, background: preset.background, primary_text: preset.primary_text, secondary_text: preset.secondary_text, border: preset.border, grid: preset.grid });
  };

  const colorFields: { key: keyof SiteTheme; label: string }[] = [
    { key: 'accent', label: 'Accent' }, { key: 'background', label: 'Background' },
    { key: 'primary_text', label: 'Primary Text' }, { key: 'secondary_text', label: 'Secondary Text' },
    { key: 'border', label: 'Border' }, { key: 'grid', label: 'Grid' },
  ];

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[10000] flex items-center gap-2 border border-accent-600/50 bg-ink-900/90 px-4 py-2.5 font-heading text-xs uppercase tracking-[0.3em] text-accent-400 backdrop-blur-sm transition-all duration-300 hover:bg-accent-900/30 hover:shadow-glow">
        <Palette className="h-4 w-4" />
        Theme
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-[10000] max-h-[70vh] w-80 overflow-y-auto border border-accent-600/40 bg-ink-900/95 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-accent-700/20 px-4 py-3">
            <h3 className="font-heading text-sm uppercase tracking-[0.3em] text-accent-400">Theme</h3>
            <button onClick={() => setOpen(false)} className="text-neutral-500 transition-colors hover:text-accent-400">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            <span className="font-heading text-xs uppercase tracking-[0.3em] text-neutral-500">Presets</span>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {THEME_PRESETS.map((preset) => (
                <button key={preset.name} onClick={() => handlePresetClick(preset.name)}
                  className={`flex flex-col items-center gap-1 border p-2 transition-all ${theme.preset === preset.name ? 'border-accent-500 bg-accent-900/20' : 'border-neutral-700 hover:border-accent-600/50'}`}>
                  <span className="h-6 w-6 rounded-full border border-neutral-600" style={{ backgroundColor: preset.accent }} />
                  <span className="font-heading text-[10px] uppercase tracking-widest text-neutral-400">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <span className="font-heading text-xs uppercase tracking-[0.3em] text-neutral-500">Custom Colors</span>
              <div className="mt-3 space-y-2">
                {colorFields.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between border border-neutral-800 px-3 py-2">
                    <label className="font-heading text-xs uppercase tracking-widest text-neutral-400">{label}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={theme[key] as string}
                        onChange={(e) => previewTheme({ [key]: e.target.value, preset: 'custom' } as Partial<SiteTheme>)}
                        className="h-6 w-8 cursor-pointer border border-neutral-700 bg-transparent" />
                      <input type="text" value={theme[key] as string}
                        onChange={(e) => previewTheme({ [key]: e.target.value, preset: 'custom' } as Partial<SiteTheme>)}
                        className="w-24 border border-neutral-700 bg-ink-800 px-2 py-0.5 font-body text-xs text-neutral-300 outline-none focus:border-accent-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {hasChanges && (
                <div className="flex items-center gap-2 border border-amber-600/30 bg-amber-900/10 px-3 py-1.5 font-heading text-[10px] uppercase tracking-widest text-amber-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 live-dot" />
                  Unsaved theme changes
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={saveTheme} disabled={!hasChanges}
                  className="flex flex-1 items-center justify-center gap-1.5 border border-accent-600 bg-accent-900/20 px-3 py-2 font-heading text-xs uppercase tracking-widest text-accent-400 transition-colors hover:bg-accent-900/40 disabled:opacity-40">
                  <Check className="h-3.5 w-3.5" /> Save Theme
                </button>
                <button onClick={cancelTheme} disabled={!hasChanges}
                  className="flex flex-1 items-center justify-center gap-1.5 border border-neutral-700 px-3 py-2 font-heading text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:bg-neutral-800 disabled:opacity-40">
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
              </div>
              <button onClick={resetTheme}
                className="flex items-center justify-center gap-1.5 border border-neutral-700 px-3 py-2 font-heading text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:border-accent-600/40 hover:text-accent-400">
                <RotateCcw className="h-3.5 w-3.5" /> Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ThemePanel;
