import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  modalOpen: string | null;
}

const initialState: UIState = {
  sidebarOpen: false,
  modalOpen: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => { state.sidebarOpen = action.payload; },
    openModal: (state, action: PayloadAction<string>) => { state.modalOpen = action.payload; },
    closeModal: (state) => { state.modalOpen = null; },
  },
});

export const { toggleSidebar, setSidebarOpen, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
