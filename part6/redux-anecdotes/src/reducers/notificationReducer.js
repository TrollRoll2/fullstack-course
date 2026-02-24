import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

const { createNotification, clearNotification} = notificationSlice.actions

let timeOutId

export const setNotification = (message, seconds) => {
  return dispatch => {
  dispatch(createNotification(message))
  clearTimeout(timeOutId)
  timeOutId = setTimeout(() => dispatch(clearNotification()), seconds * 1000)
  }
}

export default notificationSlice.reducer