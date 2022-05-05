import { createSlice } from '@reduxjs/toolkit';

export const collabarator = createSlice({
  name: 'collabarator',
  initialState: {
    inputCollabaratorUsers: [],
    isInputCollabaratorOpen: false,

    isCartCollabaratorOpen: false,
  },
  reducers: {
    toggleIsInputCollabaratorOpen: (state) => {
      state.isInputCollabaratorOpen = !state.isInputCollabaratorOpen;
    },
    setInputCollabaratorUsers: (state, action) => {
      state.inputCollabaratorUsers = action.payload;
    },
    toggleIsCartCollabaratorOpen: (state) => {
      state.isCartCollabaratorOpen = !state.isCartCollabaratorOpen;
    },
  },
});

export const {
  toggleIsInputCollabaratorOpen,
  setInputCollabaratorUsers,

  toggleIsCartCollabaratorOpen,
} = collabarator.actions;

export default collabarator.reducer;
