import { test, expect } from '../../src/fixtures/testFixtures';
import { USERS } from '../../src/utils/constants';
import { Logger } from '../../src/utils/logger';

// Test suite for login functionality
// Test for valid login scenario using the loginPage fixture
test('Valid login', async ({ page, loginPage }) => {
  // Perform login with valid credentials
  await loginPage.login(USERS.VALID_USERNAME, USERS.VALID_PASSWORD);
  Logger.info('Logged in with valid credentials');

  // Assert that the URL contains 'inventory' after successful login
  await expect(page).toHaveURL(/inventory/);
  Logger.info('Valid login test passed');
});

// Test for invalid login scenario using the loginPage fixture
test('Invalid login', async ({ page, loginPage }) => {
  // Attempt login with invalid credentials
  await loginPage.login(USERS.INVALID_USERNAME, USERS.INVALID_PASSWORD);
  Logger.error('Attempted login with invalid credentials');

  // Assert that the error message is visible
  await expect(loginPage.error).toBeVisible();
  Logger.info('Invalid login test passed - error message displayed');
});