const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')
// const groupBy = require('lodash/groupBy')
// const forEach = require('lodash/forEach')

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }  
  ]

const dummy = (blogs) => {
    return 1
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }


const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 1
        ? blogs[0].likes
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const favblog = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
    console.log('favblog',favblog)
    const picked = (({ title, author, likes }) => ({ title, author, likes }))(favblog)
    console.log('picked????', picked)
    return picked
}
//to get only partial of favoriteBlog obj
// const object = { a: 5, b: 6, c: 7  };
// const picked = (({ a, c }) => ({ a, c }))(object);

// console.log(picked); // { a: 5, c: 7 }

const mostBlogs = (blogs) => {
    const authoObj = _.groupBy(blogs, 'author')
    const maxKey = Object.keys(authoObj).reduce((a, b) => authoObj[a] > authoObj[b] ? a : b)
    console.log('maxKey', maxKey)
    return (
        {
            author: maxKey,
            blogs: authoObj[maxKey].length
        }
    )
}

const mostLikes = (blogs) => {
    const authoObj = _.groupBy(blogs, 'author')

    Object.keys(authoObj).forEach(key => {
        authoObj[key] = totalLikes(authoObj[key])
    })
    console.log('authoObj',authoObj)
    const maxKey = Object.keys(authoObj).reduce((a, b) => authoObj[a] > authoObj[b] ? a : b)
    return (
        {
            author: maxKey,
            likes: authoObj[maxKey]
        }
    )
}

module.exports = {
    dummy, 
    initialBlogs,
    blogsInDb,
    totalLikes, 
    favoriteBlog,
    mostBlogs,
    mostLikes,
    usersInDb

}

