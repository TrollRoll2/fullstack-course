import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders correct blog content', () => {
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 9001
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('testTitle', { exact: false })
  const author = screen.getByText('testAuthor', { exact: false })
  const url = screen.queryByText('testUrl')
  const likes = screen.queryByText('9001')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('renders url and likes after clicking show', async () => {
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 9001,
    user: { name: 'test' }
  }

  render(<Blog blog={blog} user={{ name: 'test' }} handleAddLike={() => {}} handleDeleteBlog={() => {}}/>)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const url = screen.getByText('testUrl', { exact: false })
  const likes = screen.getByText('9001', { exact: false })

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('like button is called twice when clicked twice', async () => {
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 9001,
    user: { name: 'test' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={{ name: 'test' }} handleAddLike={mockHandler} handleDeleteBlog={() => {}}/>)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})