import { createSlice } from '@reduxjs/toolkit';

export const filterByTitle = createSlice({
  name: 'filterByTitle',
  initialState: {
    filterByTitleLetter: '',
  },
  reducers: {
    setFilterByTitle: (state, action) => {
      state.filterByTitleLetter = action.payload;
    },
  },
});

export const { setFilterByTitle } = filterByTitle.actions;

export default filterByTitle.reducer;
