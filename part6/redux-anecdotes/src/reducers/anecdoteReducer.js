import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    addVote(state, action) {
      const anecdote = action.payload
      return state.map(a => a.id === anecdote.id ? anecdote : a)
    }
  }
})

const { setAnecdotes, createAnecdote, addVote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    dispatch(setAnecdotes(await anecdoteService.getAll()))
  }
}

export const increaseVote = (anecdote) => {
  return async (dispatch) => {
    dispatch(addVote(await anecdoteService.plusVote(anecdote)))
  }
}

export const makeAnecdote = (content) => {
  return async (dispatch) => {
    dispatch(createAnecdote(await anecdoteService.createNew(content)))
  }
}


export default anecdoteSlice.reducer