import { test, expect } from '@playwright/test'

// Generate unique email for each test run
const generateTestEmail = () => `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
const testPassword = 'TestPassword123!'

test.describe('Authentication', () => {
  test('should sign up a new user', async ({ page }) => {
    const testEmail = generateTestEmail()
    const expectedDisplayName = testEmail.split('@')[0]

    // Navigate to signup page
    await page.goto('/signup')
    await expect(page).toHaveTitle(/transapp — app/)

    // Fill in signup form
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)

    // Submit form
    await page.click('button:has-text("Sign up")')

    // Should redirect to home page after successful signup
    await expect(page).toHaveURL('/')

    // Should see user is signed in with display name (email prefix)
    await expect(page.locator('text=Signed in as')).toContainText(expectedDisplayName)

    // Should have Profile and Sign out links
    await expect(page.locator('a:has-text("Profile")')).toBeVisible()
    await expect(page.locator('button:has-text("Sign out")')).toBeVisible()
  })

  test('should sign in existing user', async ({ page }) => {
    const testEmail = generateTestEmail()

    // First, create an account
    await page.goto('/signup')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button:has-text("Sign up")')
    await expect(page).toHaveURL('/')

    // Then sign out
    await page.click('button:has-text("Sign out")')
    await expect(page).toHaveURL('/signin')

    // Now sign in with the same credentials
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button:has-text("Sign in")')

    // Should redirect to home and be signed in
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Signed in as')).toContainText(testEmail.split('@')[0])
  })

  test('should persist session after page reload', async ({ page }) => {
    const testEmail = generateTestEmail()

    // Sign up
    await page.goto('/signup')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button:has-text("Sign up")')
    await expect(page).toHaveURL('/')

    // Verify signed in
    const expectedDisplayName = testEmail.split('@')[0]
    await expect(page.locator('text=Signed in as')).toContainText(expectedDisplayName)

    // Reload page
    await page.reload()

    // Should still be signed in after reload
    await expect(page.locator('text=Signed in as')).toContainText(expectedDisplayName)
    await expect(page.locator('a:has-text("Profile")')).toBeVisible()
  })

  test('should reject signup with invalid email', async ({ page }) => {
    await page.goto('/signup')

    // Try with invalid email
    await page.fill('input[type="email"]', 'not-an-email')
    await page.fill('input[type="password"]', testPassword)
    await page.click('button:has-text("Sign up")')

    // Should show error or validation message
    // The exact behavior depends on browser validation
    const emailInput = page.locator('input[type="email"]')
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
    expect(isInvalid).toBe(true)
  })

  test('should reject signup with short password', async ({ page }) => {
    const testEmail = generateTestEmail()

    await page.goto('/signup')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', '123')

    // Password field has minLength=6
    const passwordInput = page.locator('input[type="password"]')
    const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
    expect(isInvalid).toBe(true)
  })

  test('should sign out user', async ({ page }) => {
    const testEmail = generateTestEmail()

    // Sign up
    await page.goto('/signup')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button:has-text("Sign up")')
    await expect(page).toHaveURL('/')

    // Verify signed in
    await expect(page.locator('a:has-text("Profile")')).toBeVisible()

    // Sign out
    await page.click('button:has-text("Sign out")')

    // Should redirect to signin page
    await expect(page).toHaveURL('/signin')

    // Should not see Profile link anymore
    await expect(page.locator('a:has-text("Profile")')).not.toBeVisible()

    // Should see Sign up/Sign in links (in header nav, not footer)
    await expect(page.locator('nav a:has-text("Sign up")')).toBeVisible()
  })
})
