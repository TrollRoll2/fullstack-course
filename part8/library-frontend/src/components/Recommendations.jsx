import { useQuery } from '@apollo/client/react'
import { USERDATA } from '../queries'

const Recommendations = ({show, books}) => {
  const userData = useQuery(USERDATA)

  if (!show) {
    return null
  }

  if (books.loading || userData.loading) {
    return <div>Fetching data...</div>
  }

  if (!userData.data?.me) {
    return <div>No personal recommendations available at this time.</div>
  }

  const favoriteGenre = userData.data.me.favoriteGenre

  const bookList = books.data.allBooks.filter(b => b.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>

      books in your favorite genre:
      <p>{favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookList.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations