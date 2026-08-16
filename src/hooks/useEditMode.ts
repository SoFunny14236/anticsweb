import { createContext, useContext } from 'react';

export const EDIT_MODE_PASSWORD = '(#*!&%(#Secret';
export const UNLOCK_CLICKS = 33;
export const UNLOCK_CLICK_TIMEOUT_MS = 2500;
export const UNLOCK_MAX_ATTEMPTS = 3;

interface EditModeContextValue {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

export const EditModeContext = createContext<EditModeContextValue>({
  editMode: false,
  setEditMode: () => {},
});

export const useEditMode = () => useContext(EditModeContext);
