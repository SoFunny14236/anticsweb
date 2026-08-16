import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useSiteData } from '@/hooks/useSiteData';
import { useEditMode } from '@/hooks/useEditMode';
import EpisodeCard from '@/components/EpisodeCard';

function Episodes() {
  const { episodes, addEpisode, updateEpisode, deleteEpisode, reorderEpisode, moveToTop, moveToBottom, toggleHidden, togglePin, moveEpisode, exportJSON, getText } = useSiteData();
  const { editMode } = useEditMode();
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragId && dragId !== id) moveEpisode(dragId, id);
  };

  const handleDrop = () => setDragId(null);
  const visibleCount = episodes.filter((ep) => !ep.hidden).length;

  return (
    <section id="videos" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex items-end justify-between border-b border-accent-700/30 pb-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-[0.4em] text-accent-500">{getText('videos_label')}</span>
            <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-neutral-100 sm:text-5xl">{getText('videos_heading')}</h2>
          </div>
          <div className="flex items-center gap-4">
            {editMode && (
              <button onClick={exportJSON} className="flex items-center gap-2 border border-accent-700/40 px-3 py-1.5 font-heading text-xs uppercase tracking-widest text-accent-400 transition-colors hover:bg-accent-900/20">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            )}
            <span className="hidden font-heading text-xs uppercase tracking-[0.3em] text-neutral-600 sm:block">
              {String(visibleCount).padStart(2, '0')} {getText('videos_count_label')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} total={episodes.length}
              onUpdate={updateEpisode} onDelete={deleteEpisode} onReorder={reorderEpisode}
              onMoveToTop={moveToTop} onMoveToBottom={moveToBottom} onToggleHidden={toggleHidden}
              onTogglePin={togglePin} onDragStart={setDragId} onDragOver={handleDragOver} onDrop={handleDrop} />
          ))}
        </div>

        {editMode && (
          <button onClick={addEpisode} className="mt-8 flex w-full items-center justify-center gap-2 border border-dashed border-accent-700/40 py-6 font-heading text-sm uppercase tracking-[0.3em] text-neutral-500 transition-colors hover:border-accent-600 hover:bg-accent-900/10 hover:text-accent-400">
            <Plus className="h-5 w-5" /> Add Episode
          </button>
        )}
      </div>
    </section>
  );
}

export default Episodes;
