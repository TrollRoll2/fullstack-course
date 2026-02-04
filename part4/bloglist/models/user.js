const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, 'username must be longer than 3 characters'],
    required: [true, 'a username is required'],
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)