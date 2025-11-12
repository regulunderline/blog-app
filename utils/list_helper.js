const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs => {
    const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
})

const favoriteBlog = (blogs => {
    const reducer = (favorite, blog) => {
      return blog.likes > favorite.likes
        ? blog
        : favorite
    }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, blogs[0])
})

const mostBlogs = (blogs => {
  const reducer = (mostBlogsSoFar, blogReduce) => {
    const blogReduceBlogs = blogs.filter(blog => blog.author === blogReduce.author).length
    return blogReduceBlogs > mostBlogsSoFar.blogs
      ? {author: blogReduce.author, blogs: blogReduceBlogs}
      : mostBlogsSoFar
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, {author: blogs[0].author, blogs: 1})
})

const mostLikes = (blogs => {
  const reducer = (mostLikesSoFar, blogReduce) => {
    const blogReduceLikes = blogs.filter(blog => blog.author === blogReduce.author).reduce((sum,blog) => sum = sum + blog.likes, 0)
    return blogReduceLikes > mostLikesSoFar.likes
      ? {author: blogReduce.author, likes: blogReduceLikes}
      : mostLikesSoFar
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, {author: blogs[0].author, likes: blogs[0].likes})
})

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}