import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import layoutGrid from '../features/layout/layoutGridType'

export const store = configureStore({
  reducer: {
    layoutGridTypeReducer: layoutGrid
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
