import { createSlice } from '@reduxjs/toolkit';

export const refreshPage = createSlice({
  name: 'refreshPage',
  initialState: {
    refreshPage: false,
  },
  reducers: {
    setRefreshPage: (state) => {
      state.refreshPage = !state.refreshPage;
    },
  },
});

export const { setRefreshPage } = refreshPage.actions;

export default refreshPage.reducer;
