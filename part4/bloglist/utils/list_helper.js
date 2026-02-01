const _ = require('lodash')

const dummy = () => {
  return (1)
}

const totalLikes = (blogs) => {
  const likesSum = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(likesSum, 0)
}

const favoriteBlog = (blogs) => {
  const highestLikes = (highest, blog) => {
    return (highest.likes > blog.likes
      ? highest
      : blog
    )
  }

  return blogs.length === 0
    ? 'No blogs'
    : blogs.reduce(highestLikes, { likes: 0 })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 'No blogs'
  }

  const [auth, amount] = _.chain(blogs)
    .groupBy('author')
    .toPairs()
    .maxBy(x => x[1].length)
    .value()

  return {
    author: auth,
    blogs: amount.length
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'No blogs'
  }

  const [auth, authBlogs] = _.chain(blogs)
    .groupBy('author')
    .toPairs()
    .maxBy(x => _.sumBy(x[1], 'likes'))
    .value()

  return {
    author: auth,
    likes: _.sumBy(authBlogs, 'likes')
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}