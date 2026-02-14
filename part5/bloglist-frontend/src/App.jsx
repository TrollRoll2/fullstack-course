import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogCreationRef = useRef()

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

  const handleAddLike = async (blog) => {
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1
      }

      const updatedBlog = await blogService.updateBlog(newBlog)
      setBlogs(blogs => blogs.map(b => b.id === blog.id ? updatedBlog : b))
    } catch (error) {
      console.log('did not succeed', error)
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog)
        setBlogs(blogs => blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        console.log('did not succeed', error)
      }
    }
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

      blogCreationRef.current.toggleVisibility()
      setBlogs(blogs.concat(newBlog))
      notificationHandler('success', `blog ${title} by ${author} successfully added to the list!`)
    } catch {
      notificationHandler('error', 'blog not added, make sure all credentials are correct')
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

          <Togglable buttonLabel='create blog' ref={blogCreationRef}>
            <CreateBlog handleCreation={handleCreation} />
          </Togglable>

          <h2>All notes:</h2>

          <ul>
            {blogs
              .sort((b1, b2) => b2.likes - b1.likes)
              .map(b => (
                <Blog
                  key={b.id}
                  blog={b}
                  user={user}
                  handleAddLike={handleAddLike}
                  handleDeleteBlog={handleDeleteBlog}
                />
              ))
            }
          </ul>

        </div>
      )}
    </div>
  )
}



export default App