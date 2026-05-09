import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

// InventoryPage class represents the inventory page and extends BasePage
export class InventoryPage extends BasePage {

  // Locator for the add to cart button for a specific product
  addToCartBtn = this.page.locator('#add-to-cart-sauce-labs-backpack');
  // Locator for the cart badge showing the number of items
  cartBadge = this.page.locator('.shopping_cart_badge');
  // Locator for the cart link to open the cart
  cartLink = this.page.locator('.shopping_cart_link');

  // Constructor to initialize the page
  constructor(page: Page) {
    super(page);
  }

  // Add a product to the cart
  async addProduct() {
    await this.click(this.addToCartBtn);
  }

  // Open the cart page
  async openCart() {
    await this.click(this.cartLink);
  }
}