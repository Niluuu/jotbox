import { createSlice } from '@reduxjs/toolkit';

export const refresh = createSlice({
  name: 'refresh',
  initialState: {
    refresh: false,
  },
  reducers: {
    setRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { setRefresh } = refresh.actions;

export default refresh.reducer;
