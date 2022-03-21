const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./list_helper')
const jwt = require('jsonwebtoken')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {

    await User.deleteMany({})
    await Blog.deleteMany({})
    
    const newUser = {
    username: "root",
    password: "password",
    }

    await api.post("/api/users").send(newUser)
    await Blog.insertMany(helper.initialBlogs)

    const result = await api.post("/api/login").send(newUser)

    token = result.body.token
})

describe('initial state contain blogs', () => {

      
      //4.8 all blog posts in the JSON format
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
      //4.8 right amout of blog posts returned
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    //4.9 unique identifier
    test('unique identifier of the blog post is id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        console.log('blogs', blogs)
        expect(blogs[0].id).toBeDefined()
    })
}) 
    //4.10
describe("add blog", () => {
    

    test('a valid blog can be added', async () => {
      
        const newBlog = {
            
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }
       
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain(
            'Canonical string reduction'
        )
    })
    //4.11
})
    

describe('something missing', () => {

    test('if missing likes default to 0', async () => {
        const newBlog = {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            __v: 0
        }
        
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const all_likes =response.body.map(r => r.likes)
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(all_likes).toContain(0)
    })

    //4.12
    test('title and url missing', async () => {
        const newBlog = {
            author: "Liu",
            likes: 0
        }
        
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        
    })
    //4.13
})

describe('deletion of a blog',() => {
    
    test('succeeds with status code 204 if id is valid', async () => {
    
        const newBlog = {
            _id: "5a422b891b54a676234d17fa",
            title: "world class tests",
            author: "Robert C. Martin",
            url: "www.wwww.fi",
            __v: 0
        }
      
        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201);
      
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[blogsAtStart.length - 1];
        
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length
        )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

    //4.14
describe('update of a blog', () => {
    test('update successful with status code 202 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            likes: 66
        }

        await api
            .put(`/api/blogs/${blogsAtStart[0].id}`)
            .send(newBlog)
            .expect(202)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toEqual(66)
    })
})


afterAll(() => {
  mongoose.connection.close()
})