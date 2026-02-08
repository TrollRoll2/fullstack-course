const assert = require('node:assert')
const jwt = require('jsonwebtoken')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { dbTestSetup, blogsInDb, usersInDb, loginToken } = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when a token is not provided', () => {
  beforeEach( async () => {
    await User.deleteMany()
    await Blog.deleteMany()
    await dbTestSetup()
  })

  test('a blog cannot be posted', async () => {
    const initialBlogs = await blogsInDb()
    const initialUsers = await usersInDb()

    const newBlog = {
      title: 'newblog',
      author: 'someAuthor',
      url: 'thisIsSurelyAWorkingURL',
      likes: 300,
      user: initialUsers[0].id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await blogsInDb()

    assert.strictEqual(response.length, initialBlogs.length)
  })

  test('a blog can not be deleted', async () => {
    const initialBlogs = await blogsInDb()
    const firstBlog = initialBlogs[0]

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .expect(401)

    const blogsAfter = await blogsInDb()

    assert.strictEqual(blogsAfter.length, initialBlogs.length)
  })
})

describe('when requesting blogs', () => {
  test('all blogs are returned', async () => {
    const initialBlogs = await blogsInDb()

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs are returned in json format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs have an id property', async () => {
    const initialBlogs = await blogsInDb()

    const response = await api.get('/api/blogs')
    const ids = response.body.map((blog) => blog.id)

    assert.strictEqual(ids.length, initialBlogs.length)
  })
})

describe ('when a user is logged in', () => {
  beforeEach( async () => {
    await User.deleteMany()
    await Blog.deleteMany()
    await dbTestSetup()
  })

  test('posting a blog saves it in the database', async () => {
    const initialBlogs = await blogsInDb()
    const token = await loginToken(api)

    const newBlog = {
      title: 'newblog',
      author: 'someAuthor',
      url: 'thisIsSurelyAWorkingURL',
      likes: 300
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${ token }` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const endResult = await blogsInDb()
    assert.strictEqual(endResult.length, initialBlogs.length + 1)

    const blogTitles = endResult.map((b) => b.title)
    assert(blogTitles.includes('newblog'))
  })

  test('posting a blog without likes defaults to 0', async () => {
    const initialUsers = await usersInDb()
    const token = await loginToken(api)

    const newBlog = {
      title: 'nolikes',
      author: 'mr lonely',
      url: 'emptyLikeMySoul',
      user: initialUsers[0].id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${ token }` })

    const endResult = await Blog.findOne({ title: 'nolikes' })

    assert.strictEqual(endResult.likes, 0)
  })

  test('a blog missing title is not added', async () => {
    const initialUsers = await usersInDb()
    const initialBlogs = await blogsInDb()
    const token = await loginToken(api)

    const newBlog = {
      author: 'mr lonely',
      url: 'emptyLikeMySoul',
      user: initialUsers[0].id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${ token }` })
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a blog missing url is not added', async () => {
    const initialUsers = await usersInDb()
    const initialBlogs = await blogsInDb()
    const token = await loginToken(api)

    const newBlog = {
      title: 'nolikes',
      author: 'mr lonely',
      user: initialUsers[0].id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${ token }` })
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a blog can be successfully deleted', async () => {
    const initialBlogs = await blogsInDb()
    const token = await loginToken(api)
    const userId = jwt.verify(token, process.env.SECRET).id
    const deleteBlog = initialBlogs.find(b => b.user.toString() === userId.toString())

    await api
      .delete(`/api/blogs/${deleteBlog.id}`)
      .set({ Authorization: `Bearer ${ token }` })
      .expect(204)

    const blogsAfter = await blogsInDb()

    assert.strictEqual(blogsAfter.length, initialBlogs.length - 1)
  })

  test('a blog can be successfully updated', async () => {
    const initialBlogs = await blogsInDb()
    const token = await loginToken(api)
    const firstBlog = initialBlogs[0]

    const newBlog = {
      title: 'newTitle',
      author: 'newAuthor',
      url: 'newUrl',
      likes: 101
    }

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(newBlog)
      .set({ Authorization: `Bearer ${ token }` })
      .expect(200)

    const updatedDb = await blogsInDb()
    const updatedBlog = updatedDb.find(b => b.id === firstBlog.id)

    assert.deepEqual(updatedBlog, {
      title: 'newTitle',
      author: 'newAuthor',
      url: 'newUrl',
      likes: 101,
      user: firstBlog.user,
      id: firstBlog.id
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})