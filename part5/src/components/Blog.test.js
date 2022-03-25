import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {

  const blog = {
    title: 'testing with react-testing-library',
    author: 'lby',
    likes: 0,
    url: 'wwww',
    user: {
      username: 'asdf'
    }
  }

  const user = {
    username: 'asdf'
  }


  //to embed two different className for before and after click rendering. and 
  //test them separately.

  test('only title and author to display', () => {

    const { container } = render(<Blog blog={blog} user={user}/>)
    const div = container.querySelector('.blogFirstRender')
    //screen.debug(div)
    // expect(div).toHaveStyle('display: block')
    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    expect(div).not.toHaveTextContent(blog.likes.toString())
    expect(div).not.toHaveTextContent(blog.url)

  })
  test('url and likes will be displayed after button click', () => {
    const { container } = render(<Blog blog={blog} user={user}/>)
    const button = screen.getByText('view')
    userEvent.click(button)
    const div = container.querySelector('.blog2ndRender')
    //screen.debug(div)
    // expect(div).toHaveStyle('display: block')
    expect(div).toHaveTextContent(blog.likes.toString())
    expect(div).toHaveTextContent(blog.url)

  })

  test('after clicked twice props proved to called twice as well', () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} user={user} increaseLikes={mockHandler}/>)

    const button = screen.getByText('like')
    userEvent.click(button)
    userEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})



