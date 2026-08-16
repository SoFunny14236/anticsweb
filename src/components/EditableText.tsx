import { useEffect, useRef, useState } from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, EyeOff, X, Move, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContentStyles } from '@/types';
import { useEditMode } from '@/hooks/useEditMode';
import { useSiteData } from '@/hooks/useSiteData';

interface EditableTextProps {
  contentId: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'a';
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function EditableText({ contentId, as = 'span', className = '', href, target, rel, onClick, children }: EditableTextProps) {
  const { editMode } = useEditMode();
  const { getText, getStyles, updateText, updateStyles, commitText } = useSiteData();
  const [editing, setEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const text = getText(contentId);
  const styles = getStyles(contentId);

  useEffect(() => {
    if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [editing]);

  useEffect(() => {
    if (!editMode) { setEditing(false); setShowControls(false); }
  }, [editMode]);

  const handleBlur = () => { setEditing(false); commitText(contentId); };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && as !== 'p') { e.preventDefault(); setEditing(false); commitText(contentId); }
    if (e.key === 'Escape') setEditing(false);
  };

  const styleObj: React.CSSProperties = {
    fontSize: styles.fontSize, fontWeight: styles.fontWeight, letterSpacing: styles.letterSpacing,
    lineHeight: styles.lineHeight, textAlign: styles.textAlign, width: styles.width,
    position: styles.positionX !== undefined || styles.positionY !== undefined ? 'relative' : undefined,
    left: styles.positionX !== undefined ? `${styles.positionX}px` : undefined,
    top: styles.positionY !== undefined ? `${styles.positionY}px` : undefined,
  };

  if (!editMode) {
    if (styles.visible === false) return null;
    if (as === 'a') {
      return <a href={href} target={target} rel={rel} onClick={onClick} className={className} style={styleObj}>{text || children}</a>;
    }
    const Tag = as;
    return <Tag className={className} style={styleObj} onClick={onClick}>{text || children}</Tag>;
  }

  if (styles.visible === false) {
    return (
      <span className="relative inline-block opacity-30">
        <span className="editable-text text-neutral-600 line-through" style={styleObj}>{text}</span>
        <button onClick={() => { updateStyles(contentId, { visible: true }); commitText(contentId); }}
          className="ml-2 inline-flex items-center gap-1 border border-accent-600/40 px-2 py-0.5 font-heading text-[10px] uppercase tracking-widest text-accent-400 hover:bg-accent-900/20">
          Show
        </button>
      </span>
    );
  }

  const Tag = as;

  return (
    <span className="relative inline-block">
      {editing ? (
        <textarea ref={inputRef} value={text} onChange={(e) => updateText(contentId, e.target.value)}
          onBlur={handleBlur} onKeyDown={handleKeyDown} rows={1}
          className={`${className} resize-none bg-transparent outline outline-1 outline-accent-500`} style={styleObj} />
      ) : (
        <Tag className={`editable-text ${className}`} style={styleObj} onClick={() => setEditing(true)}>
          {text || children}
        </Tag>
      )}

      {editMode && !editing && (
        <button onClick={() => setShowControls(!showControls)}
          className="absolute -right-7 top-0 flex h-5 w-5 items-center justify-center border border-accent-600/40 bg-ink-900 text-accent-400 hover:bg-accent-900/20"
          title="Text controls">
          <Type className="h-3 w-3" />
        </button>
      )}

      {showControls && (
        <div className="absolute left-0 top-full z-50 mt-1 flex flex-wrap items-center gap-1 border border-accent-600/40 bg-ink-900/95 p-2 backdrop-blur-sm">
          <button onClick={() => setShowControls(false)}
            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center border border-accent-600/40 bg-ink-900 text-accent-400 hover:bg-accent-900/20">
            <X className="h-2.5 w-2.5" />
          </button>

          <label className="flex items-center gap-1 font-heading text-[10px] uppercase tracking-widest text-neutral-500">
            Size
            <select value={styles.fontSize ?? ''} onChange={(e) => { updateStyles(contentId, { fontSize: e.target.value }); commitText(contentId); }}
              className="border border-accent-700/30 bg-ink-800 px-1 py-0.5 text-xs text-neutral-300 outline-none">
              <option value="">Default</option>
              <option value="0.875rem">SM</option><option value="1rem">Base</option><option value="1.25rem">LG</option>
              <option value="1.5rem">XL</option><option value="2rem">2XL</option><option value="3rem">3XL</option>
              <option value="4rem">4XL</option><option value="5rem">5XL</option><option value="6rem">6XL</option>
            </select>
          </label>

          <label className="flex items-center gap-1 font-heading text-[10px] uppercase tracking-widest text-neutral-500">
            Weight
            <select value={styles.fontWeight ?? ''} onChange={(e) => { updateStyles(contentId, { fontWeight: e.target.value }); commitText(contentId); }}
              className="border border-accent-700/30 bg-ink-800 px-1 py-0.5 text-xs text-neutral-300 outline-none">
              <option value="">Default</option><option value="300">Light</option><option value="400">Regular</option>
              <option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option>
            </select>
          </label>

          <div className="flex items-center gap-0.5">
            <button onClick={() => { updateStyles(contentId, { textAlign: 'left' }); commitText(contentId); }}
              className={`rounded p-1 ${styles.textAlign === 'left' ? 'bg-accent-900/30 text-accent-400' : 'text-neutral-500 hover:text-accent-400'}`} title="Align left">
              <AlignLeft className="h-3 w-3" />
            </button>
            <button onClick={() => { updateStyles(contentId, { textAlign: 'center' }); commitText(contentId); }}
              className={`rounded p-1 ${styles.textAlign === 'center' ? 'bg-accent-900/30 text-accent-400' : 'text-neutral-500 hover:text-accent-400'}`} title="Align center">
              <AlignCenter className="h-3 w-3" />
            </button>
            <button onClick={() => { updateStyles(contentId, { textAlign: 'right' }); commitText(contentId); }}
              className={`rounded p-1 ${styles.textAlign === 'right' ? 'bg-accent-900/30 text-accent-400' : 'text-neutral-500 hover:text-accent-400'}`} title="Align right">
              <AlignRight className="h-3 w-3" />
            </button>
          </div>

          <label className="flex items-center gap-1 font-heading text-[10px] uppercase tracking-widest text-neutral-500">
            Spacing
            <select value={styles.letterSpacing ?? ''} onChange={(e) => { updateStyles(contentId, { letterSpacing: e.target.value }); commitText(contentId); }}
              className="border border-accent-700/30 bg-ink-800 px-1 py-0.5 text-xs text-neutral-300 outline-none">
              <option value="">Default</option><option value="0.05em">Slight</option><option value="0.1em">Normal</option>
              <option value="0.2em">Wide</option><option value="0.3em">Wider</option><option value="0.4em">Widest</option>
            </select>
          </label>

          <label className="flex items-center gap-1 font-heading text-[10px] uppercase tracking-widest text-neutral-500">
            Line
            <select value={styles.lineHeight ?? ''} onChange={(e) => { updateStyles(contentId, { lineHeight: e.target.value }); commitText(contentId); }}
              className="border border-accent-700/30 bg-ink-800 px-1 py-0.5 text-xs text-neutral-300 outline-none">
              <option value="">Default</option><option value="1.1">Tight</option><option value="1.3">Snug</option>
              <option value="1.5">Normal</option><option value="1.75">Relaxed</option><option value="2">Loose</option>
            </select>
          </label>

          <label className="flex items-center gap-1 font-heading text-[10px] uppercase tracking-widest text-neutral-500">
            Width
            <select value={styles.width ?? ''} onChange={(e) => { updateStyles(contentId, { width: e.target.value }); commitText(contentId); }}
              className="border border-accent-700/30 bg-ink-800 px-1 py-0.5 text-xs text-neutral-300 outline-none">
              <option value="">Auto</option><option value="200px">200px</option><option value="300px">300px</option>
              <option value="400px">400px</option><option value="500px">500px</option><option value="600px">600px</option><option value="100%">Full</option>
            </select>
          </label>

          <div className="flex items-center gap-0.5 border-l border-neutral-700 pl-1">
            <button onClick={() => { updateStyles(contentId, { positionY: (styles.positionY ?? 0) - 4 }); commitText(contentId); }}
              className="rounded p-1 text-neutral-500 hover:text-accent-400" title="Move up">
              <ChevronUp className="h-3 w-3" />
            </button>
            <button onClick={() => { updateStyles(contentId, { positionY: (styles.positionY ?? 0) + 4 }); commitText(contentId); }}
              className="rounded p-1 text-neutral-500 hover:text-accent-400" title="Move down">
              <ChevronDown className="h-3 w-3" />
            </button>
            <button onClick={() => { updateStyles(contentId, { positionX: (styles.positionX ?? 0) - 4 }); commitText(contentId); }}
              className="rounded p-1 text-neutral-500 hover:text-accent-400" title="Move left">
              <Move className="h-3 w-3 -scale-x-100" />
            </button>
            <button onClick={() => { updateStyles(contentId, { positionX: (styles.positionX ?? 0) + 4 }); commitText(contentId); }}
              className="rounded p-1 text-neutral-500 hover:text-accent-400" title="Move right">
              <Move className="h-3 w-3" />
            </button>
          </div>

          <button onClick={() => { updateStyles(contentId, { visible: false }); commitText(contentId); }}
            className="flex items-center gap-1 border border-accent-600/40 px-1.5 py-0.5 font-heading text-[10px] uppercase tracking-widest text-accent-400 hover:bg-accent-900/20" title="Hide">
            <EyeOff className="h-3 w-3" />
          </button>
        </div>
      )}
    </span>
  );
}
