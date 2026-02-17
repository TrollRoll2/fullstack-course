const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'testUsername',
        password: 'testPassword',
        name: 'testUser'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testUsername', 'testPassword')
      await expect(page.getByText('currently logged in as testUser')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testUsername', 'wrongPassword')
      const locateError = page.locator('.error')

      await expect(locateError).toContainText('wrong username or password')
      await expect(page.getByText('currently logged in as testUser')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach( async ({ page }) => {
      await loginWith(page, 'testUsername', 'testPassword')
    })

    test('a blog can be created', async ({ page }) => {
      await createBlog(page, 'testTitle', 'testAuthor', 'testUrl')
      await expect(page.getByRole('heading', { name: 'testTitle by testAuthor' })).toBeVisible()
    })

    describe('and there is a blog', () => {
      beforeEach( async ({ page }) => {
        await createBlog(page, 'testTitle', 'testAuthor', 'testUrl')
      })

      test('the blog can be liked', async ({ page }) => {
        const testBlog = page.getByRole('heading', { name: 'testTitle by testAuthor' }).locator('..')
        await testBlog.getByRole('button', { name: 'show' }).click()
        await testBlog.getByRole('button', { name: 'like' }).click()

        await expect(testBlog.getByText('likes: 1')).toBeVisible()
      })

      test('the blog can be deleted', async ({ page }) => {
        const testBlog = page.getByRole('heading', { name: 'testTitle by testAuthor' }).locator('..')
        await testBlog.getByRole('button', { name: 'show' }).click()
        page.on('dialog', c => c.accept())
        await testBlog.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByRole('heading', { name: 'testTitle by testAuthor' })).not.toBeVisible()
      })

      test('only the creator can delete the blog', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            username: 'testUsername2',
            password: 'testPassword2',
            name: 'testUser2'
          }
        })
        await page.getByText('Log out').click()
        await page.getByRole('heading', { name: 'Login' }).waitFor()
        await loginWith(page, 'testUsername2', 'testPassword2')

        const testBlog = page.getByRole('heading', { name: 'testTitle by testAuthor' }).locator('..')
        await testBlog.getByRole('button', { name: 'show' }).click()

        await expect(page.getByText('currently logged in as testUser2')).toBeVisible()
        await expect(testBlog.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      describe('and there is ANOTHER blog', () => {
        beforeEach( async ({ page }) => {
          await createBlog(page, 'testTitle2', 'testAuthor2', 'testUrl2')
        })

        test('the blog with the highest likes is always on top', async ({ page }) => {
          const testBlog = page.getByRole('heading', { name: 'testTitle by testAuthor' }).locator('..')
          const testBlog2 = page.getByRole('heading', { name: 'testTitle2 by testAuthor2' }).locator('..')

          await testBlog.getByRole('button', { name: 'show' }).click()
          await testBlog2.getByRole('button', { name: 'show' }).click()

          await testBlog2.getByRole('button', { name: 'like' }).click()
          const firstOrder = await page.getByTestId('blog').all()

          await expect(testBlog2.getByText('likes: 1')).toBeVisible()
          await expect(firstOrder[0]).toContainText('testTitle2 by testAuthor2')
          await expect(firstOrder[1]).toContainText('testTitle by testAuthor')

          await testBlog.getByRole('button', { name: 'like' }).click()
          await testBlog.getByRole('button', { name: 'like' }).click()
          const secondOrder = await page.getByTestId('blog').all()

          await expect(testBlog.getByText('likes: 2')).toBeVisible()
          await expect(secondOrder[0]).toContainText('testTitle by testAuthor')
          await expect(secondOrder[1]).toContainText('testTitle2 by testAuthor2')
        })

      })

    })
  })
})