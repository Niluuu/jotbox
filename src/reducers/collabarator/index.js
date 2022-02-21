import { createSlice } from '@reduxjs/toolkit';

export const collabarator = createSlice({
  name: 'collabarator',
  initialState: {
    inputCollabaratorUsers: [],
    isInputCollabaratorOpen: false,

    cartCollabaratorUsers: [],
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
    setCartCollabaratorUsers: (state, action) => {
      state.cartCollabaratorUsers = action.payload;
    },
  },
});

export const {
  toggleIsInputCollabaratorOpen,
  setInputCollabaratorUsers,

  toggleIsCartCollabaratorOpen,
  setCartCollabaratorUsers,
} = collabarator.actions;

export default collabarator.reducer;
