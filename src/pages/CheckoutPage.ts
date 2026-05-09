import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

// CheckoutPage class represents the checkout page and extends BasePage
export class CheckoutPage extends BasePage {

  // Locator for the first name input field
  firstName = this.page.locator('#first-name');
  // Locator for the last name input field
  lastName = this.page.locator('#last-name');
  // Locator for the postal code input field
  postalCode = this.page.locator('#postal-code');
  // Locator for the continue button
  continueBtn = this.page.locator('#continue');
  // Locator for the finish button
  finishBtn = this.page.locator('#finish');
  // Locator for the success message header
  success = this.page.locator('.complete-header');
  // Locator for error messages
  error = this.page.locator('[data-test="error"]');

  // Constructor to initialize the page
  constructor(page: Page) {
    super(page);
  }

  // Fill the checkout form with first name, last name, and postal code
  async fillCheckout(first: string, last: string, zip: string) {
    await this.fill(this.firstName, first);
    await this.fill(this.lastName, last);
    await this.fill(this.postalCode, zip);
  }

  // Complete the checkout process by clicking continue and then finish
  async finishCheckout() {
    await this.click(this.continueBtn);
    await this.click(this.finishBtn);
  }
}