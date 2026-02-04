const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'firstblog',
    'author': 'itsme',
    'url': 'firstentry',
    'likes': 100
  },
  {
    'title': 'secondblog',
    'author': 'notme',
    'url': 'secondentry',
    'likes': 200
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const findOneBlog = async (title) => {
  return Blog.findOne({ title: title }).lean()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  findOneBlog
}