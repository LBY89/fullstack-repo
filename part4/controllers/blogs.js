const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
//const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog
  .find({}).populate('user',{ username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})



blogsRouter.post('/', async(request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('decodedToken', decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalide token' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedblog = await blog.save()
  user.blogs = user.blogs.concat(savedblog._id)
  await user.save()
  response.status(201).json(savedblog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user
  console.log('user._id', user._id)
  console.log('user', user)
  console.log('blog', blog)
  console.log('blog.user.toString()', blog.user)
  console.log('user._id', user._id)
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(200).send('Success 1')
  } else {
    response.status(400).end()
  }
  
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  console.log('reqeustbody', body)
  //const user = await Blog.findOne(blog.user)
  const blog = {
    likes: body.likes
  }
  //await blog.populate('user')
  const newBlog = await Blog
  .findByIdAndUpdate(request.params.id, blog, { new: true })
  .populate('user',{ username: 1, name: 1 })
  
  response.json(newBlog)
})

blogsRouter.post('/:id/comments', (request, response, next) => {
  const body = request.body
  console.log('reqeustbody', body)
  const comment = new Comment({
    content:body.content,
    blogId: body.blogId
  })
  comment
  .save()
  .then((newComment) => response.status(201).json(newComment))
  .catch((error) => next(error))
  
})


blogsRouter.get('/:id/comments', async (request, response) => {
  // console.log('request.body',request.body)
  // console.log('response.data', response.data)
  const comments = await Comment.find({})
  console.log('comments from get', comments)
  if (comments) {
    response.json(comments)
  } else {
    response.status(404).end()
  }
  
  
})

module.exports = blogsRouter