const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Query {
      bookCount: Int
      authorCount: Int
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]
  }

  type Book {
    title: String!
    author: String!
    published: String!
    id: ID
    genres: [String!]!
  }

  type Author {
    name: String!
    id: String
    born: Int
    bookCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  }
  
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      console.log('args', args);
      
      if (args.author && !args.genre) {

      const filteredBooks = books.filter(book => book.author === args.author)
      //console.log('filterBooks', filteredBooks);

      const result = []

      filteredBooks.forEach( book =>{
        const titleObj = {title: book.title}
        result.push(titleObj)}
        
      )
      //console.log('result', result);
      
      return result

      }
      
      if (args.genre && !args.author) {
        const filteredBooks = books.filter(book => book.genres.includes(args.genre))
        console.log('filteredBooks', filteredBooks);
        const result = []
        filteredBooks.forEach(
          book => {
            const genreObj = {author: book.author, title: book.title}
            result.push(genreObj)
          }
        )
        return result
      }

      if (args.author && args.genre) {
        const filteredBooks = books.filter(book => book.genres.includes(args.genre) && book.author === args.author )
        const result = []
        filteredBooks.forEach(
          book => {
            const genreObj = {author: book.author, title: book.title}
            result.push(genreObj)
          }
        )
        return result
      }

    },
    allAuthors: (root, args) => {
      //console.log('args',args);
      
      const result = []
      authors.forEach(author => {
        
        const authorBooksCount = books.filter(book => book.author !== author.name).length
        const newAuthor = {"name": author.name, "bookCount": authorBooksCount}
        //console.log("newAuthor", newAuthor);
        
        result.push(newAuthor)

      })

      return result
  
    }

  },
  // const object = { a: 5, b: 6, c: 7  };
  // const picked = (({ a, c }) => ({ a, c }))(object);
  
  // console.log(picked); // { a: 5, c: 7 }
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() }
      console.log('book', book);
      const names = []
      authors.forEach(
        author =>{
          names.push(author.name)
        }
      )

      if (!names.includes(book.author)) {
        const authorObj = {name: book.author, id: uuid(), born: null}
        return authors.push(authorObj)
      }
      
      books = books.concat(book)
      console.log('books', books);
      console.log('authors', authors);
      
      
      //const picked = (({title, author}) => ({title, author}))(book)
      return book
    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})