import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  console.log('app user', user)
  const newBlogs = blogs.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes) )

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('JSON.parse user', user)

      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log('JSONstringify user', user)
      blogService.setToken(user.token)
      setUser(user)//successful login token is saved here
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    localStorage.clear()
    setUser(null)
  }


  const addBlog = (blogObject) => {

    console.log('blogobj', blogObject)
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedblog => {
        setBlogs(blogs.concat(returnedblog))
        setErrorMessage(`a new blog ${returnedblog.title} by ${returnedblog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
  const blogFormRef = useRef()

  const increaseLikes = async (updatedBlog) => {
    console.log('updatedBlog', updatedBlog)
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    console.log('blogs before', blogs)
    const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
    console.log('returned', returnedBlog)
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog: returnedBlog))
  }
  //homes.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

  const deleteBlogPost = (blog) => {
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)

    console.log('blos', blogs)
    if (window.confirm(`Delete '${blog.title}' by '${blog.author}'`)) {
      blogService
        .deleteBlogPost(blog.id)
        .then(() => {
          setBlogs(blogs.filter(n => n.id !== blog.id))
        })

    }
    console.log('blos', blogs)
  }

  return (
    <div>
      <h2>Login to See My Secrets 🤫</h2>
      <Notification message={errorMessage} />
      {user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable> :
        <div>
          <p>{user.name} logged in <button id='logout-button' onClick = {handleLogout}>logout</button></p>
          <Togglable buttonLabel='create blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
          </Togglable>
          {newBlogs.map(blog =>

            <Blog id='each-blog' key={blog.id} blog={blog} user={user} increaseLikes={increaseLikes} deleteBlog={deleteBlogPost} />
          )}
        </div>
      }
    </div>
  )
}
export default App
