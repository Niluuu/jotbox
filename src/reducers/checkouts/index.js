import { createSlice } from '@reduxjs/toolkit';

export const checkouts = createSlice({
  name: 'checkouts',
  initialState: {
    mainCheckouts: [],
    modalCheckouts: [],
    focusFromOutside: false,
  },
  reducers: {
    setMainCheckouts: (state, action) => {
      state.mainCheckouts = action.payload;
    },
    setModalCheckouts: (state, action) => {
      state.modalCheckouts = action.payload;
    },
    setFocusFromOutside: (state, action) => {
      state.setFocusFromOutside = action.payload;
    },
  },
});

export const { setMainCheckouts, setModalCheckouts, setFocusFromOutside } = checkouts.actions;

export default checkouts.reducer;
