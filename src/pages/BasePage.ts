import { Page, Locator } from '@playwright/test';

// BasePage class provides common functionality for all page objects
export class BasePage {

  // Constructor to initialize the page object
  constructor(protected page: Page) {}

  // Navigate to a specific URL
  async navigate(url: string) {
    await this.page.goto(url);
  }

  // Click on a given locator
  async click(locator: Locator) {
    await locator.click();
  }

  // Fill a locator with a given value
  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }
}