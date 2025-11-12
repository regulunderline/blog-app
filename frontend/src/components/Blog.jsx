import { useState } from 'react'
import Expand from './Expand'
import blogService from '../services/blogs'

const Blog = ({ blog, user, handleLike, handleRemove }) => {

  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: user.username === blog.user.username ? '' : 'none' }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <Expand visible={visible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={showWhenVisible}><button onClick={handleRemove}>remove</button></div>
      </Expand>
    </div>
  )
}

export default Blog