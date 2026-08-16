import { useRef, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, GripVertical, X, Pin, PinOff } from 'lucide-react';
import type { Episode } from '@/types';
import { useEditMode } from '@/hooks/useEditMode';

interface EpisodeCardProps {
  episode: Episode;
  index: number;
  total: number;
  onUpdate: (id: string, patch: Partial<Episode>) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, dir: -1 | 1) => void;
  onMoveToTop: (id: string) => void;
  onMoveToBottom: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: () => void;
}

function EpisodeCard({ episode, index, total, onUpdate, onDelete, onReorder, onMoveToTop, onMoveToBottom, onToggleHidden, onTogglePin, onDragStart, onDragOver, onDrop }: EpisodeCardProps) {
  const { editMode } = useEditMode();
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') onUpdate(episode.id, { thumbnail: reader.result }); };
    reader.readAsDataURL(file);
  };

  if (!editMode && episode.hidden) return null;

  return (
    <article draggable={editMode} onDragStart={() => onDragStart(episode.id)} onDragOver={(e) => onDragOver(e, episode.id)} onDrop={onDrop}
      className={`group relative border bg-ink-800/60 transition-all duration-300 ${editMode ? 'border-dashed border-accent-600/50 hover:border-accent-500' : 'border-neutral-800 hover:border-accent-600 hover:shadow-glow-lg hover:scale-[1.02]'} ${episode.hidden && editMode ? 'opacity-40' : ''} ${episode.pinned ? 'ring-1 ring-accent-500/40' : ''}`}>
      <div className="relative aspect-video overflow-hidden border-b border-neutral-800 group-hover:border-accent-700/50">
        <img src={episode.thumbnail} alt={episode.title} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" />
        <div className="absolute inset-0 bg-ink-900/30 transition-opacity duration-300 group-hover:bg-ink-950/10" />
        <span className="absolute bottom-2 right-2 border border-neutral-700 bg-ink-900/80 px-2 py-0.5 font-heading text-xs tracking-widest text-neutral-300">{episode.runtime}</span>

        {episode.pinned && (
          <span className="absolute left-2 top-2 flex items-center gap-1 border border-accent-500/60 bg-ink-950/80 px-2 py-0.5 font-heading text-[10px] uppercase tracking-widest text-accent-400">
            <Pin className="h-2.5 w-2.5" /> Pinned
          </span>
        )}

        {editMode && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/70">
            <button onClick={() => fileInputRef.current?.click()} className="border border-accent-600/50 bg-accent-900/30 px-3 py-1.5 font-heading text-xs uppercase tracking-widest text-accent-300 transition-colors hover:bg-accent-900/50">Upload</button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        )}
      </div>

      <div className="p-5">
        {editMode && editing ? (
          <div className="space-y-3">
            <input value={episode.title} onChange={(e) => onUpdate(episode.id, { title: e.target.value })}
              className="w-full border border-accent-700/40 bg-ink-900 px-3 py-2 font-heading text-lg font-semibold uppercase tracking-tight text-neutral-100 outline-none focus:border-accent-500" />
            <textarea value={episode.description} onChange={(e) => onUpdate(episode.id, { description: e.target.value })} rows={2}
              className="w-full resize-none border border-accent-700/40 bg-ink-900 px-3 py-2 font-body text-sm leading-relaxed text-neutral-300 outline-none focus:border-accent-500" />
            <div className="flex items-center gap-2">
              <label className="font-heading text-xs uppercase tracking-widest text-neutral-500">Status:</label>
              <input value={episode.status} onChange={(e) => onUpdate(episode.id, { status: e.target.value })}
                className="flex-1 border border-accent-700/40 bg-ink-900 px-2 py-1 font-body text-sm text-neutral-300 outline-none focus:border-accent-500" />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-heading text-xs uppercase tracking-widest text-neutral-500">Timestamp:</label>
              <input value={episode.runtime} onChange={(e) => onUpdate(episode.id, { runtime: e.target.value })}
                className="w-24 border border-accent-700/40 bg-ink-900 px-2 py-1 font-heading text-xs tracking-widest text-neutral-300 outline-none focus:border-accent-500" />
              <label className="ml-2 font-heading text-xs uppercase tracking-widest text-neutral-500">URL:</label>
              <input value={episode.thumbnail} onChange={(e) => onUpdate(episode.id, { thumbnail: e.target.value })}
                className="flex-1 border border-accent-700/40 bg-ink-900 px-2 py-1 font-body text-xs text-neutral-400 outline-none focus:border-accent-500" />
            </div>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 border border-accent-600/50 px-3 py-1 font-heading text-xs uppercase tracking-widest text-accent-300 transition-colors hover:bg-accent-900/30">
              <X className="h-3 w-3" /> Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-heading text-lg font-semibold uppercase tracking-tight text-neutral-100 group-hover:text-accent-400">{episode.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-neutral-400">{episode.description}</p>
            {episode.status && <span className="mt-2 inline-block font-heading text-xs uppercase tracking-[0.3em] text-accent-500">{episode.status}</span>}
          </>
        )}
      </div>

      {editMode && (
        <div className="flex flex-wrap items-center justify-between gap-1 border-t border-accent-700/20 px-3 py-2">
          <div className="flex items-center gap-0.5">
            <GripVertical className="h-4 w-4 cursor-grab text-neutral-700" />
            <button onClick={() => setEditing(!editing)} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400" title="Edit"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => onTogglePin(episode.id)} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400" title={episode.pinned ? 'Unpin' : 'Pin'}>{episode.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}</button>
            <button onClick={() => onToggleHidden(episode.id)} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400" title={episode.hidden ? 'Show' : 'Hide'}>{episode.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            <button onClick={() => onDelete(episode.id)} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => onMoveToTop(episode.id)} disabled={index === 0} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400 disabled:opacity-20" title="Move to top"><ArrowUpToLine className="h-4 w-4" /></button>
            <button onClick={() => onReorder(episode.id, -1)} disabled={index === 0} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400 disabled:opacity-20" title="Move up"><ArrowUp className="h-4 w-4" /></button>
            <button onClick={() => onReorder(episode.id, 1)} disabled={index === total - 1} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400 disabled:opacity-20" title="Move down"><ArrowDown className="h-4 w-4" /></button>
            <button onClick={() => onMoveToBottom(episode.id)} disabled={index === total - 1} className="rounded p-1 text-neutral-500 transition-colors hover:bg-accent-900/20 hover:text-accent-400 disabled:opacity-20" title="Move to bottom"><ArrowDownToLine className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 border border-accent-600/0 transition-colors duration-300 group-hover:border-accent-600/60" />
    </article>
  );
}

export default EpisodeCard;
