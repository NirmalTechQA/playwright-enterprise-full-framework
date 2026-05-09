import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

// LoginPage class represents the login page and extends BasePage
export class LoginPage extends BasePage {

  // Locator for the username input field
  username = this.page.locator('#user-name');
  // Locator for the password input field
  password = this.page.locator('#password');
  // Locator for the login button
  loginBtn = this.page.locator('#login-button');
  // Locator for error messages
  error = this.page.locator('[data-test="error"]');

  // Constructor to initialize the page
  constructor(page: Page) {
    super(page);
  }

  // Perform login by filling username and password and clicking login
  async login(user: string, pass: string) {
    await this.fill(this.username, user);
    await this.fill(this.password, pass);
    await this.click(this.loginBtn);
  }
}