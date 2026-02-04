const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be longer than 3 characters' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const newUser = await user.save()
  response.status(201).json(newUser)
})

module.exports = usersRouter