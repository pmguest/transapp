# E2E Tests with Playwright

This directory contains end-to-end tests for the transapp application using Playwright.

## Test Coverage

### Authentication Tests (`e2e/auth.spec.ts`)
- ✅ User registration (sign up)
- ✅ User login (sign in)
- ✅ Session persistence after page reload
- ✅ Invalid email rejection
- ✅ Short password rejection
- ✅ User logout

### Profile Tests (`e2e/profile.spec.ts`)
- ✅ Display profile page with auto-generated display name
- ✅ Edit display name
- ✅ Edit bio
- ✅ Edit avatar URL
- ✅ Edit all fields at once
- ✅ Cancel edit and discard changes
- ✅ Profile editing requires authentication

## Running Tests

### Prerequisites
Make sure the dev server is running or Playwright will start it automatically:
```bash
npm run dev
```

### Run all tests
```bash
npm run test
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:ui
```
This opens an interactive browser where you can:
- See tests run in real-time
- Pause and step through tests
- Inspect the page at any point
- Re-run individual tests

### Run tests in debug mode
```bash
npm run test:debug
```
This opens Playwright Inspector for step-by-step debugging.

### View test report
After running tests, view the HTML report:
```bash
npm run test:report
```

## Test Structure

Tests use:
- **Unique email generation**: Each test creates a unique test account to avoid conflicts
- **BeforeEach hooks**: Profile tests set up authentication before each test
- **Assertions**: Use Playwright's expect() for clear, readable assertions
- **Page navigation**: Tests navigate using URLs and check redirects

## Example Test Pattern

```typescript
test('should sign up a new user', async ({ page }) => {
  // Arrange: Generate test data
  const testEmail = generateTestEmail()
  
  // Act: Navigate and fill form
  await page.goto('/signup')
  await page.fill('input[type="email"]', testEmail)
  await page.fill('input[type="password"]', testPassword)
  await page.click('button:has-text("Sign up")')
  
  // Assert: Verify outcome
  await expect(page).toHaveURL('/')
  await expect(page.locator('text=Signed in as')).toBeVisible()
})
```

## CI/CD Integration

Tests are configured to:
- Run in headless mode in CI environments
- Retry failed tests twice in CI
- Use a single worker in CI for reliability
- Take screenshots on failure
- Record traces for debugging

## Notes

- Tests automatically wait for elements and navigation
- Each test is isolated and independent
- Tests clean up by signing out at the end (or via beforeEach setup)
- Test emails are unique to prevent conflicts between parallel runs
- Avatar URLs use placeholder service (i.pravatar.cc) that doesn't require authentication
