const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  const listWithNoBlogs = []

  const listWithOneBlog = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5
    }
  ]

  const listWithTwoBlogs = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5
    },
    {
      id: 'valididover9000',
      title: 'Booktitle',
      author: 'Me',
      url: 'https://someurl.pdf',
      likes: 10
    }
  ]

  test('when list has no blogs returns "No blogs"', () => {
    const result = listHelper.favoriteBlog(listWithNoBlogs)
    assert.strictEqual(result, 'No blogs')
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5
    })
  })

  test('when list has two blogs, the result is the one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithTwoBlogs)
    assert.deepStrictEqual(result, {
      id: 'valididover9000',
      title: 'Booktitle',
      author: 'Me',
      url: 'https://someurl.pdf',
      likes: 10
    })
  })
})