import { createSlice } from '@reduxjs/toolkit';

export const collabaratorToggle = createSlice({
  name: 'collabaratorToggle',
  initialState: {
    collabaratorUsers: [],
    isCollabaratorOpen: false,

    collabaratorModalUsers: [],
    isModalCollabaratorOpen: false,
  },
  reducers: {
    toggleIsCollabaratorOpen: (state) => {
      state.isCollabaratorOpen = !state.isCollabaratorOpen;
    },
    setCollabaratorUsers: (state, action) => {
      state.collabaratorUsers = action.payload;
    },
    toggleIsModalCollabaratorOpen: (state) => {
      state.isModalCollabaratorOpen = !state.isModalCollabaratorOpen;
    },
    setCollabaratorModalUsers: (state, action) => {
      state.collabaratorModalUsers = action.payload;
    },
  },
});

export const {
  toggleIsCollabaratorOpen,
  setCollabaratorUsers,

  toggleIsModalCollabaratorOpen,
  setCollabaratorModalUsers,
} = collabaratorToggle.actions;

export default collabaratorToggle.reducer;
