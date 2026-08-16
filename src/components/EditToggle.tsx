import { useEditMode } from '@/hooks/useEditMode';

function EditToggle() {
  const { editMode, setEditMode, localhost } = useEditMode();

  if (!localhost) return null;

  return (
    <button
      onClick={() => setEditMode(!editMode)}
      className="fixed bottom-5 right-5 z-[10000] flex items-center gap-2 border border-blood-600/50 bg-ink-900/90 px-4 py-2.5 font-heading text-xs uppercase tracking-[0.3em] text-blood-400 backdrop-blur-sm transition-all duration-300 hover:bg-blood-900/30 hover:shadow-glow"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          editMode ? 'bg-blood-500 live-dot' : 'bg-neutral-600'
        }`}
      />
      Edit Mode: {editMode ? 'ON' : 'OFF'}
    </button>
  );
}

export default EditToggle;
