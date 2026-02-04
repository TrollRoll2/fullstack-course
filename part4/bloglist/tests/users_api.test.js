const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialUsers, usersInDb } = require('./user_test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there are two users saved', () => {
  beforeEach( async () => {
    await User.deleteMany()
    await User.insertMany(initialUsers)
  })

  test('all users can be seen in the api', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, initialUsers.length)
  })

  test('a user can be added', async () => {
    const newUser = {
      'username': 'thirdUser',
      'password': 'pleaseEncryptThis',
      'name': 'itsmeagain'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const endResult = await usersInDb()
    assert.strictEqual(endResult.length, initialUsers.length + 1)

    const usernames = endResult.map((u) => u.username)
    assert(usernames.includes('firstUser'))
  })

  test('a unique username is required', async () => {
    const unoriginal = {
      'username': 'firstUser',
      'password': 'passwordIsDifferent',
      'name': 'itsme'
    }

    const result = await api
      .post('/api/users')
      .send(unoriginal)
      .expect(400)

    assert(result.body.error.includes('expected `username` to be unique'))

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, initialUsers.length)
  })

})

describe('when adding a user', () => {
  beforeEach( async () => {
    await User.deleteMany()
  })

  test('username must be longer than 3 characters', async () => {
    const newUser = {
      'username': 'me',
      'password': 'longerthan3',
      'name': 'itsme'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('username must be longer than 3 characters'))

    const endResult = await usersInDb()
    assert.strictEqual(endResult.length, 0)

    const usernames = endResult.map((u) => u.username)
    assert(!usernames.includes('me'))
  })

  test('password must be longer than 3 characters', async () => {
    const newUser = {
      'username': 'longerthan3',
      'password': 'no',
      'name': 'itsme'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('password must be longer than 3 characters'))

    const endResult = await usersInDb()
    assert.strictEqual(endResult.length, 0)

    const usernames = endResult.map((u) => u.username)
    assert(!usernames.includes('longerthan3'))
  })

})

after(async () => {
  await mongoose.connection.close()
})