import { createSlice } from '@reduxjs/toolkit';
import { initialStateStr } from '../../utils/editor/initialState';

export const editor = createSlice({
  name: 'editor',
  initialState: {
    text: initialStateStr,
    shouldUndo: false,
    shouldRedo: false,
    updatedText:
      '{"blocks":[{"key":"cbbnn","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    onCreateFuncCall: false,
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setUndo: (state) => {
      state.shouldUndo = !state.shouldUndo;
    },
    setRedo: (state) => {
      state.shouldRedo = !state.shouldRedo;
    },
    setUpdatedText: (state, action) => {
      state.updatedText = action.payload;
    },
    toggleOnCreateFunctionCall: (state, action) => {
      state.onCreateFuncCall = action.payload;
    },
  },
});

export const {
  setText,
  setUndo,
  setRedo,
  setUpdatedText,
  toggleOnCreateFunctionCall,
} = editor.actions;

export default editor.reducer;
