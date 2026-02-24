import { useDispatch, useSelector } from 'react-redux'
import { increaseVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      {anecdote.content} <br />
      has {anecdote.votes} votes
      <button onClick={handleClick}>add vote</button>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter) {
      return anecdotes.filter(a => a.content.includes(filter))
    }
    return anecdotes
  })

  return (
    <ul>
      {[...anecdotes].sort((a1, a2) => a2.votes - a1.votes).map(a => (
        <Anecdote
          key={a.id}
          anecdote={a}  
          handleClick={() => {
            dispatch(increaseVote(a))
            dispatch(setNotification(`Voted for ${a.content}`, 5))
          }}/>
      ))}
    </ul>
  )
}

export default AnecdoteList