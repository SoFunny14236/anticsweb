import { Undo2, Redo2, LogOut, Save } from 'lucide-react';
import { useEditMode } from '@/hooks/useEditMode';
import { useEditHistory } from '@/hooks/useEditHistory';

function EditToolbar() {
  const { editMode, setEditMode } = useEditMode();
  const { canUndo, canRedo, hasUnsavedChanges, undo, redo, markSaved } = useEditHistory();

  if (!editMode) return null;

  const handleExit = () => {
    setEditMode(false);
    localStorage.removeItem('antics-edit-unlocked');
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-[10000] flex -translate-x-1/2 items-center gap-1 border border-accent-600/40 bg-ink-900/95 px-2 py-2 backdrop-blur-sm">
      <button onClick={undo} disabled={!canUndo}
        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-heading text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:bg-accent-900/20 hover:text-accent-400 disabled:opacity-30"
        title="Undo">
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <button onClick={redo} disabled={!canRedo}
        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-heading text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:bg-accent-900/20 hover:text-accent-400 disabled:opacity-30"
        title="Redo">
        <Redo2 className="h-3.5 w-3.5" />
      </button>

      <div className="mx-1 h-5 w-px bg-neutral-700" />

      <div className="flex items-center gap-1.5 px-2">
        {hasUnsavedChanges ? (
          <span className="flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-amber-500">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 live-dot" />
            Unsaved Changes
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            All Changes Saved
          </span>
        )}
      </div>

      <div className="mx-1 h-5 w-px bg-neutral-700" />

      <button onClick={markSaved} disabled={!hasUnsavedChanges}
        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-heading text-xs uppercase tracking-widest text-accent-400 transition-colors hover:bg-accent-900/20 disabled:opacity-30"
        title="Save changes">
        <Save className="h-3.5 w-3.5" />
        Save
      </button>

      <button onClick={handleExit}
        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-heading text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:bg-accent-900/20 hover:text-accent-400"
        title="Exit edit mode">
        <LogOut className="h-3.5 w-3.5" />
        Exit
      </button>
    </div>
  );
}

export default EditToolbar;
