import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  if (message[0] === null) {
    return null
  }

  if (message[1]){
    return(
      <div className='success'>
        {message[0]}
      </div>
    )
  }
  return (
    <div className='error'>
      {message[0]}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState([null, false])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleCreate = async blogObject => {
    try {
      const newBlog = await blogService.create(blogObject)
      const newBlogs =await blogService.getAll()

      blogFormRef.current.toggleVisibility()

      setBlogs(newBlogs)
      setMessage([`a new blog ${newBlog.title} by ${newBlog.author}`, true])
      setTimeout(() => {
        setMessage([null, false])
      }, 5000)
    } catch {
      setMessage(['could not create a blog', false])
      setTimeout(() => {
        setMessage([null, false])
      }, 5000)
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessage(['wrong username or password', false])
      setTimeout(() => {
        setMessage([null, false])
      }, 5000)
    }
  }

  const addedLike = async likedBlog => {
    try{
      const request = await blogService.like(likedBlog)
      request.user = likedBlog.user
      likedBlog = request
      const newBlogs = blogs.map(blog => blog.id === likedBlog.id ? likedBlog : blog)
      setBlogs(newBlogs)
      setMessage([`you liked a blog ${likedBlog.title} by ${likedBlog.author}`, true])
      setTimeout(() => {
        setMessage([null, false])
     }, 5000)
    } catch (error){
      setMessage([`could not like`, false])
      setTimeout(() => {
        setMessage([null, false])
     }, 5000)
      console.log(error)
    }
  }

  const removedBlog = async deletedBlog => {
    if(window.confirm(`Remove blog ${deletedBlog.title} by ${deletedBlog.author}`)){
      const resault = await blogService.remove(deletedBlog)
      if (resault){
        const newBlogs = blogs.filter(blog => blog.id !== deletedBlog.id)
        setBlogs(newBlogs)
        setMessage([`you removed a blog ${deletedBlog.title} by ${deletedBlog.author}`, true])
        setTimeout(() => {
          setMessage([null, false])
        }, 5000)
      } else {
        setMessage([`could not remove`, false])
        setTimeout(() => {
          setMessage([null, false])
        }, 5000)
      }
    }
  }

  const loginForm = () => {
    return (
      <div>
        <h1>log in to application</h1>
        <Notification message={message} />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="text"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit">
              login
            </button>
          </div>
        </form>
      </div>
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} />

        <div>
          {user.name} logged in
          <button onClick={() => {
            setUser(null)
            window.localStorage.clear()
          }}>log out</button></div>
        <br/>
        <Togglable buttonLabel = "create new blog" ref={blogFormRef}>
          <BlogForm handleCreate={handleCreate} />
        </Togglable>
        {console.log(blogs)}
        {blogs.toSorted((a,b) => b.likes - a.likes).map(blog => 
          <Blog key={blog.id} blog={blog} user={user} handleLike={() => addedLike(blog)} handleRemove={() => removedBlog(blog)} />)}
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App