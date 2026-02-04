const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { decodedToken } = require('../utils/token_helper')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const userToken = decodedToken(request)

  if (!userToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(userToken.id)

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id
  })

  const newBlog = await blog.save()

  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  response.status(201).json(newBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const newBlog = {
    title,
    author,
    url,
    likes,
    user
  }

  const updateBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    newBlog,
    { new: true, runValidators: true }
  )
  response.status(200).json(updateBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


module.exports = blogsRouter