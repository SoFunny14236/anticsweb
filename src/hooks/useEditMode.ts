import { createContext, useContext } from 'react';

interface EditModeContextValue {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  localhost: boolean;
}

export const EditModeContext = createContext<EditModeContextValue>({
  editMode: false,
  setEditMode: () => {},
  localhost: false,
});

export const useEditMode = () => useContext(EditModeContext);
