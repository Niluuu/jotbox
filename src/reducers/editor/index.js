import { createSlice } from '@reduxjs/toolkit'

export const editor = createSlice({
  name: 'editor',
  initialState: {
    text: '{"blocks":[{"key":"cbbnn","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload
    }
  },
})

export const { setText } = editor.actions

export default editor.reducer