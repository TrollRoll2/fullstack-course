import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

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
  const anecdotes = useSelector(state => state)
  return (
    <ul>
      {anecdotes.sort((a1, a2) => a2.votes - a1.votes).map(a => (
        <Anecdote
          key={a.id}
          anecdote={a}  
          handleClick={() => dispatch(addVote(a.id))}/>
      ))}
    </ul>
  )
}

export default AnecdoteList