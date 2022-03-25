import { useState } from 'react'

const Blog = ({ blog, increaseLikes, user, deleteBlog } ) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [detailVisible, setDetailVisible] = useState(false)
  const [blogObj, setBlogObj] = useState(blog)

  const handleIncreaseLikes = () => {
    const updatedBlog = {
      ...blogObj,
      likes: blogObj.likes + 1,
    }
    setBlogObj(updatedBlog)
    increaseLikes(updatedBlog)
  }

  const hideWhenVisible = { display: detailVisible ? 'none' : '' }
  const showWhenVisible = { display: detailVisible ? '' : 'none' }

  return (
    <div style={blogStyle} className='blog-container' id='rendered-blog'>
      <div style={hideWhenVisible}  className='blogFirstRender'>
        {blog.title} {blog.author} <button id='view-button' onClick={() => setDetailVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible} className='blog2ndRender'>
        <p>{blog.title}<button onClick={() => setDetailVisible(false)}>hide</button></p>
        <p>{blog.author}</p> <p>{blog.url}</p>
        <p>likes: {blog.likes}<button id='like-button' onClick={handleIncreaseLikes}>like</button></p>
        { (user.username === blog.user.username ||
        typeof blog.user === 'string') && (
          <button id='remove-button' onClick={() => deleteBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog