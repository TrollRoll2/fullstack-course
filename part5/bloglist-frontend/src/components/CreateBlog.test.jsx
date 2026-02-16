import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

test('<CreateBlog> updates parent state and calls handleCreation function', async () => {
  const handleCreation = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlog handleCreation={handleCreation} />)

  screen.debug()

  const saveButton = screen.getByText('save blog')
  const title = screen.getByText('title')
  const author = screen.getByText('author')
  const url = screen.getByText('url')

  await user.type(title, 'title tested')
  await user.type(author, 'author tested')
  await user.type(url, 'url tested')
  await user.click(saveButton)

  expect(handleCreation.mock.calls).toHaveLength(1)
  expect(handleCreation.mock.calls[0][0]).toBe('title tested')
  expect(handleCreation.mock.calls[0][1]).toBe('author tested')
  expect(handleCreation.mock.calls[0][2]).toBe('url tested')
})