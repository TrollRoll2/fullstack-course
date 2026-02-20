import { useDispatch } from 'react-redux'
import { filterUpdate } from '../reducers/filterReducer'

const AnecdoteFilter = () => {
  const dispatch = useDispatch()

  const handleChange = event => {
    event.preventDefault()
    const filterText = event.target.value
    dispatch(filterUpdate(filterText))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter anecdotes: <input onChange={handleChange} />
    </div>
  )
}

export default AnecdoteFilter