const baseUrl = 'http://localhost:3001/anecdotes'

const createNew = async (content) => {
  const getId = () => (100000 * Math.random()).toFixed(0)

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, id: getId(), votes: 0 }),
  }

  const response = await fetch(baseUrl, options)
  
  if (!response.ok) {
    throw new Error('An error has occured when creating an anecdote')
  }

  return await response.json()
}

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const plusVote = async (anecdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...anecdote, votes: anecdote.votes + 1})
  }

  const response = await fetch(`${baseUrl}/${anecdote.id}`, options)

  if (!response.ok) {
    throw new Error('An error has occured when liking the anecdote')
  }

  return await response.json()
} 

export default { getAll, createNew, plusVote }