const jwt = require('jsonwebtoken')
const config = require('./config')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const {
    UserInputError,
    AuthenticationError,
  } = require('apollo-server')

const resolvers = {
    Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        // allBooks(author: String, genre: String): [Book!]!
        if (args.author) {
          if (args.genre) {
            return await Book.find({author: args.author, genres: {$in: [args.genre]}})
            .populate('author')
          }
          return await Book.find({author: args.author}).populate('author')
  
        }
        // provided args.author === null, then execution starts below
        if (args.genre) {
          return await Book.find({genres: {$in: [args.genre]}}).populate('author')
        }
        return await Book.find({}).populate("author")
        //when query remember to break 'author'
      },
  
      allAuthors: async (root, args) => {
        console.log('allAuthors resolver')// 
        const authors = await Author.find({})
        const books = await Book.find({}).populate("author")
        
        const result = []
  
        authors.forEach(author => {
  
          const authorBooksCount = books.filter(book => book.author.name === author.name).length
          //construct a new Author obj which saves populate issue. Maybe also save from n+1 issue
          const newAuthor = {"name": author.name, "born": author.born, "bookCount": authorBooksCount}
          //console.log("newAuthor", newAuthor);
  
          result.push(newAuthor)
  
        })
        return result
    
      },
      me: (root, args, context) => {
        return context.currentUser
      }
  
    },
  
    Mutation: {

      addBook: async (root, args, context) => {
        //console.log('context', context);
        
        const bookAuthor = await Author.findOne({name: args.author})
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
  
        if (bookAuthor === null) {
          const authorToBook = new Author({name: args.author})
  
          try {
            await authorToBook.save()
          }catch(error){
            throw new UserInputError(error.message, {
              invalidArgs: args,
            });
          }
          
          const book = new Book({...args, author: authorToBook})
          try {
            await book.save()
    
          }catch (error){
            throw new UserInputError(error.message, {
              invalidArgs: args,
            });
    
          }

          console.log('befr book');
          pubsub.publish('BOOK_ADDED', {bookAdded: book})
          console.log('afterbook', book);
          
          return book
  
        }
  
        const book = new Book({...args, author: bookAuthor})
  
        try {
          await book.save()
  
        }catch (error){
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
  
        }

        console.log('befr book');
        pubsub.publish('BOOK_ADDED', {bookAdded: book})
        console.log('book', book);
        
        return book

        
      },
  
  
      editAuthor: async (root, args, context) => {
        
        const author = await Author.findOne({name: args.name})
        author.born = args.setBornTo
  
        const currentUser = context.currentUser
        //console.log('currentUser', currentUser)
  
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
  
  
        try {
          await author.save()
        } catch(error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
  
        return author
  
      },
      createUser: async(root, args) => {
        //console.log('createuser args', args);
        
        const user = new User({username: args.username, favoriteGenre: args.favoriteGenre, password: args.password})
        return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
      },
      login: async(root, args) => {
        //console.log('login args', args);
        const user = await User.findOne({username: args.username})
        //console.log('login useraaaa', user)
        if (!user||args.password !=='liubaoying') {
          throw new UserInputError("wrong credentials")
        }
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        return { value: jwt.sign(userForToken, config.SECRET) }
      }
  
  
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      }
    }
  
  }

  module.exports = resolvers