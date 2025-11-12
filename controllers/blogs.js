const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ username : 1, name : 1, id : 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  if (body.title && body.url){
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  } else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if ( !(blog.user.toString() === user.id.toString()) ) {
    return response.status(403).json({ error: 'blog is not yours' })
  }

  await Blog.findByIdAndDelete(blog.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newLikes = request.body.likes
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }

  blog.likes = newLikes
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter