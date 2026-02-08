const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const dbTestSetup = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const userPassword = await bcrypt.hash('password1', 10)

  const firstUser = new User({
    'username': 'firstUser',
    'passwordHash': userPassword,
    'name': 'firstName',
    'blogs': []
  })

  const userPassword2 = await bcrypt.hash('password2', 10)

  const secondUser = new User({
    'username': 'secondUser',
    'passwordHash': userPassword2,
    'name': 'secondName',
    'blogs': []
  })

  const initialUsers = await Promise.all([
    firstUser.save(),
    secondUser.save()
  ])

  const firstBlog = new Blog({
    title: 'firstBlog',
    author: 'firstAuthor',
    url: 'firstUrl',
    likes: 100,
    user: firstUser._id
  })

  const secondBlog = new Blog({
    title: 'secondBlog',
    author: 'secondAuthor',
    url: 'secondUrl',
    likes: 200,
    user: secondUser._id
  })

  const thirdBlog = new Blog({
    title: 'thirdBlog',
    author: 'thirdAuthor',
    url: 'thirdUrl',
    likes: 300,
    user: secondUser._id
  })

  const initialBlogs = await Promise.all([
    firstBlog.save(),
    secondBlog.save(),
    thirdBlog.save()
  ])

  return {
    users: initialUsers,
    blogs: initialBlogs
  }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const loginToken = async (api) => {
  const login = await api
    .post('/api/login')
    .send({
      username: 'firstUser',
      password: 'password1'
    })
  return login.body.token
}


module.exports = {
  dbTestSetup,
  blogsInDb,
  usersInDb,
  loginToken
}