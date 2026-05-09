import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

// CartPage class represents the cart page and extends BasePage
export class CartPage extends BasePage {

  // Locator for the checkout button
  checkoutBtn = this.page.locator('#checkout');

  // Constructor to initialize the page
  constructor(page: Page) {
    super(page);
  }

  // Click the checkout button to proceed to checkout
  async checkout() {
    await this.click(this.checkoutBtn);
  }
}