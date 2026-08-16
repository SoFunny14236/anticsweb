import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface HistoryEntry {
  label: string;
  undo: () => Promise<void> | void;
  redo: () => Promise<void> | void;
}

interface EditHistoryContextValue {
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  registerChange: (entry: HistoryEntry) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  markSaved: () => void;
}

const EditHistoryContext = createContext<EditHistoryContextValue>({
  canUndo: false,
  canRedo: false,
  hasUnsavedChanges: false,
  registerChange: () => {},
  undo: async () => {},
  redo: async () => {},
  markSaved: () => {},
});

export function EditHistoryProvider({ children }: { children: React.ReactNode }) {
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);
  const [, forceRender] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const rerender = () => forceRender((n) => n + 1);

  const registerChange = useCallback((entry: HistoryEntry) => {
    undoStack.current.push(entry);
    redoStack.current = [];
    setHasUnsavedChanges(true);
    rerender();
  }, []);

  const undo = useCallback(async () => {
    const entry = undoStack.current.pop();
    if (!entry) return;
    await entry.undo();
    redoStack.current.push(entry);
    rerender();
  }, []);

  const redo = useCallback(async () => {
    const entry = redoStack.current.pop();
    if (!entry) return;
    await entry.redo();
    undoStack.current.push(entry);
    rerender();
  }, []);

  const markSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return (
    <EditHistoryContext.Provider
      value={{
        canUndo: undoStack.current.length > 0,
        canRedo: redoStack.current.length > 0,
        hasUnsavedChanges,
        registerChange,
        undo,
        redo,
        markSaved,
      }}
    >
      {children}
    </EditHistoryContext.Provider>
  );
}

export const useEditHistory = () => useContext(EditHistoryContext);
