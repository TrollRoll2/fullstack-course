const User = require('../models/user')

const initialUsers = [
  {
    'username': 'firstUser',
    'passwordHash': 'thisisnotavalidhash',
    'name': 'itsme'
  },
  {
    'username': 'secondUser',
    'passwordHash': 'thisisnotverysecure',
    'name': 'notme'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers,
  usersInDb,
}