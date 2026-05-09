import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../utils/constants';
import { Logger } from '../utils/logger';

// Custom fixture interfaces
interface LoginFixture {
  loginPage: LoginPage;
}

interface AuthenticatedFixture {
  authenticatedPage: Page;
}

export const test = base.extend<LoginFixture & AuthenticatedFixture>({
  // Fixture for LoginPage with pre-navigation to login page
  loginPage: async ({ page }, use) => {
    // Initialize LoginPage
    const loginPage = new LoginPage(page);
    // Navigate to the login page
    await loginPage.navigate('/');
    Logger.info('Login page fixture initialized and navigated');
    // Provide the fixture to the test
    await use(loginPage);
  },

  // Fixture for a pre-authenticated session
  // Automatically logs in with valid credentials and waits for inventory page
  // Useful for tests that need to skip login step (checkout, inventory, cart tests)
  authenticatedPage: async ({ page }, use) => {
    // Initialize LoginPage
    const loginPage = new LoginPage(page);
    // Navigate to login page
    await loginPage.navigate('/');
    Logger.info('Starting pre-authenticated session setup');
    
    // Perform login with valid credentials
    await loginPage.login(USERS.VALID_USERNAME, USERS.VALID_PASSWORD);
    Logger.info('User successfully authenticated');
    
    // Wait for inventory page to load
    await page.waitForURL(/inventory/);
    Logger.info('Navigated to inventory page - authenticated session ready');
    
    // Provide the authenticated page to the test
    await use(page);
    
    Logger.info('Test completed - session closed');
  },
});

export const expect = test.expect;