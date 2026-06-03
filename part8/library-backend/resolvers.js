const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')

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
    allAuthors: async () => await Author.find({})
  },

  Author: {
    id: (root) => root._id,
    bookCount: async (root) => await Book.collection.countDocuments({ author: root._id })
  },

  Mutation: {
    addBook: async (root, args) => {
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
        	}
				}
      )}
    },

    editAuthor: async (root, args) => {
			const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

			try {
				await author.save()
				return author
			} catch (error) {
				throw new GraphQLError(`There was a problem with updating author ${author.name}'s birthyear to ${args.setBornTo}`)
    	}
		}
	}
}

module.exports = resolvers