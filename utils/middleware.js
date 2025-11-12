const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET) || null
      if (!decodedToken.id) {
        response.status(401).json({ error: 'token invalid' })
      } else {
        request.user = await User.findById(decodedToken.id)
      }
    }
    catch {
      response.status(401).json({ error: 'token invalid' })
    }
  } else {
    request.user = null
  }

  next()
}

module.exports = {userExtractor}