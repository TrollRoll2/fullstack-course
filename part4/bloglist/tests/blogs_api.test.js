const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, blogsInDb, findOneBlog } = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach( async () => {
  await Blog.deleteMany()
  await Blog.insertMany(initialBlogs)
})

test('all blogs are returned', async () => {
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
  const response = await api.get('/api/blogs')

  const ids = response.body.map((blog) => blog.id)
  assert.strictEqual(ids.length, initialBlogs.length)
})

test('posting a blog saves it in the database', async () => {
  const newBlog = {
    title: 'newblog',
    author: 'someAuthor',
    url: 'thisIsSurelyAWorkingURL',
    likes: 300
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const endResult = await blogsInDb()
  assert.strictEqual(endResult.length, initialBlogs.length + 1)

  const blogTitles = endResult.map((b) => b.title)
  assert(blogTitles.includes('newblog'))
})

test('posting a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'nolikes',
    author: 'mr lonely',
    url: 'emptyLikeMySoul'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const endResult = await findOneBlog(newBlog.title)
  assert.strictEqual(endResult.likes, 0)
})

test('a blog missing title is not added', async () => {
  const newBlog = {
    author: 'mr lonely',
    url: 'emptyLikeMySoul'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a blog missing url is not added', async () => {
  const newBlog = {
    title: 'nolikes',
    author: 'mr lonely',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})