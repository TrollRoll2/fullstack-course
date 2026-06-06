import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({show, books}) => {
  const [bookFilter, setBookFilter] = useState(null)
  const filteredBooks = useQuery(ALL_BOOKS, {
    variables: { genre: bookFilter || null }
  })

  if (!show) {
    return null
  }

  if (books.loading || filteredBooks.loading) {
    return <div>Fetching data...</div>
  }

  const bookList = books.data.allBooks

  const uniqueGenres = [...new Set(bookList.flatMap(b => b.genres))]

  const bookDisplay = filteredBooks.data.allBooks

  return (
    <div>
      <h2>books</h2>

      {bookFilter
        ? <div> in genre {bookFilter} </div>
        : null
      }

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookDisplay.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      Filter books by genre:
        {uniqueGenres.map(g => (
          <button key={g} onClick={() => {setBookFilter(g)}}>{g}</button>
        ))}
        <br />
        <button onClick={() => {setBookFilter(null)}}>all genres</button>
    </div>
  )
}

export default Books
