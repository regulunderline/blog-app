const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 1,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstr',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
  }
]

const createUsers = (async () => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('111', saltRounds)
  return ([
    {
      username: 'hello1',
      name: 'hello1',
      blogs: [],
      passwordHash: passwordHash
    }
  ])
})

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, createUsers, nonExistingId, blogsInDb, usersInDb
}