import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterUpdate(state, action) {
      return action.payload
    }
  }
})

export const { filterUpdate } = filterSlice.actions
export default filterSlice.reducer