import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import layoutGrid from '../reducers/layout';
import editorReducer from '../reducers/editor';
import nodeIdReducer from '../reducers/getNodeId';
import gapsReducer from '../reducers/gaps';
import nodesReducer from '../reducers/nodes';

export const store = configureStore({
  reducer: {
    layoutGrid,
    editorReducer,
    nodeIdReducer,
    gapsReducer,
    nodesReducer,
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
