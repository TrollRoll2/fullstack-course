const { GraphQLError, graphql } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async (root, args) => {
      if (!args.author) {
        return Book.collection.countDocuments()
      }

			const author = await Author.findOne({ name: args.author })

			if (!author) {
				return 0
			}

      return Book.collection.countDocuments({ author: author._id })
    },
    
    allBooks: async (root, args) => {
      let books = await Book.find({}).populate('author')

      if (args.author) {
        books = books.filter(b => b.author.name === args.author)
      }

      if (args.genre) {
        books = books.filter(b => b.genres.includes(args.genre))
      }

      return books
    },

    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async () => await Author.find({}),
		me: (root, args, context) => {
			return context.currentUser
		}
  },

  Author: {
    id: (root) => root._id,
    bookCount: async (root) => await Book.collection.countDocuments({ author: root._id })
  },

  Mutation: {
    addBook: async (root, args, {currentUser}) => {

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED'
					}
				})
			}

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
				try {
        	await author.save()
				} catch (error) {
					throw new GraphQLError(`There was a problem with adding author ${args.author}: ${error.message}`, {
        		extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.name,
							error
						}
					})
				}
      }

      const newBook = new Book({ ...args, author: author._id})

      try {
        await newBook.save()
        return newBook.populate('author')
      } catch (error) {
        throw new GraphQLError(`There was a problem with saving book ${newBook.title}: ${error.message}`, {
        	extensions: {
          	code: 'BAD_USER_INPUT',
          	invalidArgs: args.title,
						error
        	}
				}
      )}
    },

    editAuthor: async (root, args, {currentUser}) => {

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED'
					}
				})
			}

			const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

			try {
				await author.save()
				return author
			} catch (error) {
				throw new GraphQLError(`There was a problem with updating author ${author.name}'s birthyear to ${args.setBornTo}: ${error.message}`, {
        		extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.name,
							error
						}
				})
    	}
		},

		createUser: async (root, args) => {
			const user = await new User({ username: args.username, favoriteGenre: args.favoriteGenre })

			return user.save()
				.catch(error => {
					throw new GraphQLError(`Failed to create user: ${error.message}`, {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.username,
							error
						}
					})
				})
		},

		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })
			console.log(user)

			if (!user || args.password !== 'secret' ) {
				throw new GraphQLError('Invalid username or password', {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}

			const userToken = {
				username: user.username,
				id: user._id
			}

			return {value: jwt.sign(userToken, process.env.JWT_SECRET)}
		},

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
	}
}

module.exports = resolvers