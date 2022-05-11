const { gql } = require('apollo-server')

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
    password: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String
    author: Author!
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
      password: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
  
`

module.exports =  typeDefs