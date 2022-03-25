import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> when new blog is created props pass right details down', () => {
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const input1 = screen.getByPlaceholderText('write here blog title')
  const input2 = screen.getByPlaceholderText('write here blog author')
  const input3 = screen.getByPlaceholderText('write here blog url')

  const sendButton = screen.getByText('create')

  userEvent.type(input1, 'testing a blog form...' )
  userEvent.type(input2, 'author liu' )
  userEvent.type(input3, 'wwww' )
  userEvent.click(sendButton)
  //userEvent.type write corresponding input boxes, above screen.getByPlaceholderText allows to write each 
  //input box. In the end checkinhg is abled with 'toStrictEqual(object)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({ title:'testing a blog form...', author: 'author liu', url: 'wwww' } )
})