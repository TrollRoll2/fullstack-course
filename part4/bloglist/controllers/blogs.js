const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    ...body,
    likes: body.likes || 0
  })

  const newBlog = await blog.save()
  response.status(201).json(newBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const newBlog = {
    title,
    author,
    url,
    likes
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