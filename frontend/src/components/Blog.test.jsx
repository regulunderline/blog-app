import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      title: 'title1',
      author: 'author1',
      url: 'url1',
      likes: 1000,
      user: {
        id: "68daaa2957f66f81e6e3df79",
        name: 'name',
        username: 'username'
      }
    }
    const user = {
      name : 'name',
      username: 'username',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbGxvMSIsImlkIjoiNjhkYWFhMjk1N2Y2NmY4MWU2ZTNkZjc5IiwiaWF0IjoxNzU5NTIyOTYzfQ.fbnf80xJCCBJdS3N8JDtNE-9bqtl0QofGW-IUG8-1xU'
    }
    render(<Blog blog={blog} user={user} />)
  })

  test('renders content', () => {
    const element = screen.getByText('title1 author1')
    const noUrl = screen.getByText('url1')
    const noLikes = screen.getByText('likes 1000')
    expect(element).toBeDefined()
    expect(noUrl).not.toBeVisible()
    expect(noLikes).not.toBeVisible()
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const button = screen.getByText('view')
    await userEvent.setup().click(button)

    const noUrl = screen.getByText('url1')
    const noLikes = screen.getByText('likes 1000')
    expect(noUrl).toBeVisible()
    expect(noLikes).toBeVisible()
  })
})
  
test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
      title: 'title1',
      author: 'author1',
      url: 'url1',
      likes: 1000,
      user: {
        id: "68daaa2957f66f81e6e3df79",
        name: 'name',
        username: 'username'
      }
    }
    const user = {
      name : 'name',
      username: 'username',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbGxvMSIsImlkIjoiNjhkYWFhMjk1N2Y2NmY4MWU2ZTNkZjc5IiwiaWF0IjoxNzU5NTIyOTYzfQ.fbnf80xJCCBJdS3N8JDtNE-9bqtl0QofGW-IUG8-1xU'
    }
  console.log(blog)
  
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={user} handleLike={mockHandler} />
  )

  const buttonView = screen.getByText('view')
  await userEvent.setup().click(buttonView)
  screen.debug()

  const button = screen.getByText('like')
  await userEvent.setup().click(button)
  await userEvent.setup().click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})