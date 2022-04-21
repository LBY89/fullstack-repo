const { v1: uuid } = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')
const config = require('./config')
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require('apollo-server')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'liubaoying'

const mongoose = require('mongoose')



mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })




  
const typeDefs = gql`
  type Query {
      bookCount: Int
      authorCount: Int
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]
      me: User
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String
    author: Author
    published: Int!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: String
    born: Int
    bookCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
  
`
//editAuthor should return an Author Object.

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
      
      return Book.find({}).populate("author");
    },

       

    allAuthors: async (root, args) => {
      //console.log('args',args);
  
      return Author.find({})
  
    },
    me: (root, args, context) => {
      return context.currentUser
    }

  },

  Mutation: {
    addBook: async (root, args, context) => {

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
      return book
      
    },

    // editAuthor(
    //   name: String!
    //   setBornTo: Int!
    // ): Author

    editAuthor: async (root, args, context) => {
      
      const author = await Author.findOne({name: args.name})
      author.born = args.setBornTo

      const currentUser = context.currentUser

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
      const user = new User({username: args.username})
      return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async(root, args) => {
      const user = await User.findOne({username: args.useranme})
      if (!user||args.password !=='liubaoying') {
        throw new UserInputError("wrong credentials")
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }


  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate('favoriteGenre')
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})