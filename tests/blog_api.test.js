const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('node:http')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const initialUsers = await helper.createUsers()
  await User.insertMany(initialUsers)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('is id named right', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].id)
})

describe('addition of a new blog', () => {
  test('succeeds with valid data ', async () => {
    const users = await helper.usersInDb()
    const { body } = await api
      .post('/api/login')
      .send({
        username: 'hello1',
        password: '111'
      })
    
    token = 'Bearer '.concat(body.token)

    await api
      .post('/api/blogs')
      .send({
        title: 'Go To Statement Considered very Harmful',
        author: 'Edsger W. Dijkstr',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        user: users[0].id,
        likes: 10,
      })
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)

    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes('Go To Statement Considered very Harmful'))
  })

  test('the default number of likes is 0', async () => {
    const users = await helper.usersInDb()
    const { body } = await api
      .post('/api/login')
      .send({
        username: 'hello1',
        password: '111'
      })
    
    const token = 'Bearer '.concat(body.token)

    const response = await api
      .post('/api/blogs')
      .send({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstr',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        user: users[0].id,
      })
      .set('Authorization', token)

    assert.equal(response.body.likes, 0)
  })

  test('fails with status code 401 if token is not provided ', async () => {
    const users = await helper.usersInDb()

    await api
      .post('/api/blogs')
      .send({
        title: 'Go To Statement Considered very Harmful',
        author: 'Edsger W. Dijkstr',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        user: users[0].id,
        likes: 10,
      })
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', token).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data ', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({likes: 100})
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const likesAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id).likes
    assert.equal(likesAtEnd, 100)
  })

  test('fails with status code 404 if id is invalid', async () => {
    const invalidId = await helper.nonExistingId() 

    await api
      .put(`/api/blogs/${invalidId}`)
      .send({})
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})