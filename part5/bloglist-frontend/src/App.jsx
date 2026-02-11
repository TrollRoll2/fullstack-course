import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const notificationHandler = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notificationHandler('success', 'successfully logged in')
    } catch {
      notificationHandler('error', 'wrong username or password')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    notificationHandler('success', 'successfully logged out')
  }

  const handleCreation = async (title, author, url) => {
    try {
      const newBlog = await blogService.createBlog({
        title,
        author,
        url
      })

      setBlogs(blogs.concat(newBlog))
      notificationHandler('success', `blog ${title} by ${author} successfully added to the list!`)
    } catch {
      notificationHandler('error', `blog not added, make sure all credentials are correct`)
    }
  }

  return (
    <div>
      Welcome to the App!

      <Notification notification={notification} />

      {!user && <Login handleLogin={handleLogin} />}

      {user && (
        <div>
          <p>currently logged in as {user.name}</p>

            <button onClick={handleLogout}>Log out</button>

          <h2>All notes:</h2>
          
          <ul>
            {blogs.map(b => (
              <Blog key={b.id} blog={b}/>
            ))}
          </ul>

          <CreateBlog handleCreation={handleCreation} />

        </div>
      )}
    </div>
  )
}



export default App