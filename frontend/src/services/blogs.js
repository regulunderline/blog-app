import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const like = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const newBlog = {
    user: blog.user.id,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url:blog.url
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, newBlog, config)
  return response.data
}

const remove = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  try{
    await axios.delete(`${baseUrl}/${blog.id}`, config)
    return true
  } catch (error){
    console.log(error)
    return false
  }
}

export default { getAll, setToken, create, like, remove }