import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = ({ show, authors, setError }) => {
  const token = localStorage.getItem('library-app-user-token')
  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: (error) => setError(error.message)
  })

  if (!show) {
    return null
  }

  if (authors.loading) {
    return <div>Fetching data...</div>
  }


  const submit = async (event) => {
    event.preventDefault()

    if (!name) {
    setError('Please choose an author')
    return
  }

    editAuthor({ variables: { name, born: parseInt(birthyear) } })
    setError(`Sucessfully set birthyear of ${name} to ${birthyear}`)

    setName('')
    setBirthyear('')
  }

  const authorList = authors.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authorList.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      {token 
        ? <>
          <h1>Set birthyear</h1>
          <div>
            <form onSubmit={submit}>
              <div>
                <label>
                  name
                  <select name="name" value={name} onChange={({ target }) => setName(target.value)}>
                    <option value="">Choose an author</option>
                    {authorList.map((a) => (
                      <option key={a.id} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  born
                  <input
                    type="number"
                    value={birthyear}
                    onChange={({ target }) => setBirthyear(target.value)}
                  />
                </label>
              </div>
              <button type="submit">Update author</button>
            </form>
          </div>
          </>
        : null
      }
    </div>
  )
}

export default Authors
