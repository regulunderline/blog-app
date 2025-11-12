const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { log } = require('console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'mluukkai',
        name: 'mluukkai',
        password: 'salainen',
        blogs:[]
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await page.getByText('mluukkai logged in').waitFor()

      expect(page.getByText('mluukkai logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await page.getByText('mluukkai logged in').waitFor()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'url')
      await expect(page.getByText('title author view')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'url')

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1 like')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'url')

      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('title author')).not.toBeVisible()
    })

    test('blogs are sorted by likes', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'url')
      await createBlog(page, 'title1', 'author1', 'url1')

      await page.getByText('title author view').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()

      await expect(page.getByText('view').first().locator('..').getByText('title author view')).toBeVisible()

      await page.getByText('title1 author1 view').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByText('you liked a blog title1 by author1').waitFor()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()
      
      expect(page.getByText('view').first().locator('..').getByText('title1 author1 view')).toBeVisible()
    })
  })
  test('only can see remove button if blog is yours', async ({ page, request }) => {
    await request.post('/api/users', {
    data: {
      username: 'test',
      name: 'test',
      password: '111',
      blogs:[]
    }
  })

    await loginWith(page, 'mluukkai', 'salainen')
    await page.getByText('mluukkai logged in').waitFor()

    await createBlog(page, 'title', 'author', 'url')

    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('remove')).toBeVisible()

    await page.getByRole('button', { name: 'log out' }).click()
    await page.getByText('log in to application').waitFor()
    
    await loginWith(page, 'test', '111')
    await page.getByText('test logged in').waitFor()

    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('remove')).not.toBeVisible()
  })
})