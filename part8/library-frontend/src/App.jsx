import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client/react'
import Error from './components/Error'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { ALL_AUTHORS, ALL_BOOKS, USERDATA } from './queries'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-app-user-token'))
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  const error = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logOut = async () => {
    setToken(null)
    localStorage.clear()
    await client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <Error errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {!token 
          ? <button onClick={() => setPage('login')}>login</button>
          : <>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={logOut}>logout</button>
            </>
        }
        
      </div>

      <Authors show={page === 'authors'} authors={authors} setError={error} />

      <Books show={page === 'books'} books={books} setError={error} />

      <LoginForm show={page === 'login'} setToken={setToken} setError={error} setPage={setPage} />

      <Recommendations show={page ==='recommend'} books={books} />

      <NewBook show={page === 'add'} setError={error} />
    </div>
  )
}

export default App
