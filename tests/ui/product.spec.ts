import { test, expect } from '../../src/fixtures/testFixtures';
import { test as baseTest } from '@playwright/test';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { Logger } from '../../src/utils/logger';

// Test suite for product-related functionality
test('Add product to cart', async ({ authenticatedPage }) => {
  // Initialize InventoryPage with pre-authenticated session
  const inventory = new InventoryPage(authenticatedPage);

  Logger.info('Starting add product test with pre-authenticated session');

  // Add a product to the cart
  await inventory.addProduct();
  Logger.info('Added product to cart');

  // Assert that the cart badge shows '1'
  await expect(inventory.cartBadge).toHaveText('1');
  Logger.info('Cart badge updated correctly');
});

// Test for invalid product validation - uses baseTest for unauthenticated access
baseTest('Invalid product validation', async ({ page }) => {
  // Initialize InventoryPage object without authentication
  const inventory = new InventoryPage(page);

  // Expect the addProduct method to throw an error when called without login
  await expect(async () => {
    await inventory.addProduct();
  }).rejects.toThrow();
  Logger.error('Invalid product validation test: addProduct threw error as expected');
});
