import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const handleCreate = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm handleCreate={handleCreate} />)

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const sendButton = screen.getByText('create')

  await user.type(title, 'testing a form...')
  await user.type(author, 'testing a form...')
  await user.type(url, 'testing a form...')
  await user.click(sendButton)

  expect(handleCreate.mock.calls).toHaveLength(1)
  expect(handleCreate.mock.calls[0][0].title).toBe('testing a form...')
  expect(handleCreate.mock.calls[0][0].author).toBe('testing a form...')
  expect(handleCreate.mock.calls[0][0].url).toBe('testing a form...')
})