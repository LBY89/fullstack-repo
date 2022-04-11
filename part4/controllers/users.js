const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {

    const users = await User
        .find({}).populate('blogs',{ title: 1, author: 1, url: 1 })
    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {

    const user = await User.findById(request.params.id)
        .find({}).populate('blogs',{ title: 1, author: 1, url: 1 })
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }

})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.username === undefined || body.password === undefined) {
    return response.status(400).json({ error: 'username or password must be given' })
  } else if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({ error: 'username and password must be at least 3 characters' })
  }

  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
      return response.status(400).json({
          error: 'username must be unique'
      })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter