import { test, expect } from '@playwright/test'

const generateTestEmail = () => `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
const testPassword = 'TestPassword123!'

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Sign up before each test
    const testEmail = generateTestEmail()
    await page.goto('/signup')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button:has-text("Sign up")')
    await expect(page).toHaveURL('/')
  })

  test('should display profile page with auto-generated display name', async ({ page }) => {
    // Navigate to profile
    await page.click('a:has-text("Profile")')
    await expect(page).toHaveURL('/profile')

    // Should show email
    await expect(page.locator('text=Email')).toBeVisible()

    // Should show display name (auto-generated from email prefix)
    await expect(page.locator('text=Display Name')).toBeVisible()

    // Should have "Not set" for bio initially
    await expect(page.locator('text=Bio')).toBeVisible()
    await expect(page.locator('text=Not set')).toBeVisible()
  })

  test('should edit profile display name', async ({ page }) => {
    await page.click('a:has-text("Profile")')
    await expect(page).toHaveURL('/profile')

    // Click edit
    await page.click('button:has-text("Edit Profile")')

    // Find and clear display name input
    const displayNameInput = page.locator('input[placeholder="Enter your display name"]')
    await displayNameInput.clear()
    await displayNameInput.fill('John Developer')

    // Save
    await page.click('button:has-text("Save")')

    // Should return to view mode
    await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible()

    // Display name should be updated
    await expect(page.locator('text=John Developer')).toBeVisible()

    // Header should also update to show new display name
    await expect(page.locator('text=Signed in as John Developer')).toBeVisible()
  })

  test('should edit profile bio', async ({ page }) => {
    await page.click('a:has-text("Profile")')

    // Click edit
    await page.click('button:has-text("Edit Profile")')

    // Fill in bio
    const bioInput = page.locator('textarea[placeholder="Tell us about yourself"]')
    await bioInput.fill('Full-stack developer interested in building scalable applications.')

    // Save
    await page.click('button:has-text("Save")')

    // Bio should be displayed
    await expect(page.locator('text=Full-stack developer interested in building scalable applications.')).toBeVisible()
  })

  test('should edit profile avatar URL', async ({ page }) => {
    await page.click('a:has-text("Profile")')

    // Click edit
    await page.click('button:has-text("Edit Profile")')

    // Set avatar URL
    const avatarInput = page.locator('input[placeholder="https://example.com/avatar.jpg"]')
    await avatarInput.fill('https://i.pravatar.cc/120?img=42')

    // Save
    await page.click('button:has-text("Save")')

    // Avatar image should be visible (circular)
    const avatarImg = page.locator('img[alt="Avatar"]')
    await expect(avatarImg).toBeVisible()
    await expect(avatarImg).toHaveAttribute('src', 'https://i.pravatar.cc/120?img=42')
  })

  test('should edit all profile fields at once', async ({ page }) => {
    await page.click('a:has-text("Profile")')

    // Click edit
    await page.click('button:has-text("Edit Profile")')

    // Fill all fields
    await page.locator('input[placeholder="Enter your display name"]').clear()
    await page.locator('input[placeholder="Enter your display name"]').fill('Alice Smith')
    await page.locator('textarea[placeholder="Tell us about yourself"]').fill('Passionate about tech and open source')
    await page.locator('input[placeholder="https://example.com/avatar.jpg"]').fill('https://i.pravatar.cc/120?img=15')

    // Save
    await page.click('button:has-text("Save")')

    // Verify all fields are updated
    await expect(page.locator('text=Alice Smith')).toBeVisible()
    await expect(page.locator('text=Passionate about tech and open source')).toBeVisible()
    await expect(page.locator('img[alt="Avatar"]')).toHaveAttribute('src', 'https://i.pravatar.cc/120?img=15')

    // Reload page and verify persistence
    await page.reload()
    await expect(page.locator('text=Alice Smith')).toBeVisible()
    await expect(page.locator('text=Passionate about tech and open source')).toBeVisible()
  })

  test('should cancel edit and discard changes', async ({ page }) => {
    await page.click('a:has-text("Profile")')

    // Get original display name (email prefix)
    const emailText = await page.locator('text=Email').locator('.. >> text=/[@]/').textContent()
    const originalDisplayName = emailText?.split('@')[0]

    // Click edit
    await page.click('button:has-text("Edit Profile")')

    // Make changes
    await page.locator('input[placeholder="Enter your display name"]').clear()
    await page.locator('input[placeholder="Enter your display name"]').fill('New Name')
    await page.locator('textarea[placeholder="Tell us about yourself"]').fill('New bio')

    // Cancel
    await page.click('button:has-text("Cancel")')

    // Original values should be restored
    if (originalDisplayName) {
      await expect(page.locator(`text=${originalDisplayName}`)).toBeVisible()
    }
    await expect(page.locator('text=New Name')).not.toBeVisible()
    await expect(page.locator('text=New bio')).not.toBeVisible()
  })

  test('should redirect to signin when accessing profile without auth', async ({ page }) => {
    // Sign out first
    await page.click('button:has-text("Sign out")')
    await expect(page).toHaveURL('/signin')

    // Try to access profile directly
    await page.goto('/profile')

    // Should redirect to signin
    await expect(page).toHaveURL('/signin')
  })
})
