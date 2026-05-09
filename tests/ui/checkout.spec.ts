import { test, expect } from '../../src/fixtures/testFixtures';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { Logger } from '../../src/utils/logger';

// Test suite for checkout functionality
test('Successful checkout', async ({ authenticatedPage }) => {
  // Initialize page objects (already authenticated and at inventory page)
  const inventory = new InventoryPage(authenticatedPage);
  const cart = new CartPage(authenticatedPage);
  const checkout = new CheckoutPage(authenticatedPage);

  Logger.info('Starting checkout test with pre-authenticated session');

  // Add product to cart and open cart
  await inventory.addProduct();
  await inventory.openCart();
  Logger.info('Added product to cart and opened cart');

  // Proceed to checkout
  await cart.checkout();
  Logger.info('Proceeded to checkout');

  // Fill checkout form and finish
  await checkout.fillCheckout('Nirmal', 'Kumar', '600001');
  await checkout.finishCheckout();
  Logger.info('Filled checkout form and completed checkout');

  // Assert success message
  await expect(checkout.success).toContainText('Thank you');
  Logger.info('Checkout successful');
});

// Test for checkout validation error
test('Checkout validation error', async ({ authenticatedPage }) => {
  // Initialize page objects (already authenticated and at inventory page)
  const inventory = new InventoryPage(authenticatedPage);
  const cart = new CartPage(authenticatedPage);
  const checkout = new CheckoutPage(authenticatedPage);

  Logger.info('Starting checkout validation test with pre-authenticated session');

  // Add product to cart and open cart
  await inventory.addProduct();
  await inventory.openCart();
  Logger.info('Added product to cart and opened cart');

  // Proceed to checkout
  await cart.checkout();
  Logger.info('Proceeded to checkout');

  // Click continue without filling form
  await checkout.click(checkout.continueBtn);
  Logger.error('Clicked continue without filling form');

  // Assert error is visible
  await expect(checkout.error).toBeVisible();
  Logger.info('Validation error displayed as expected');
});