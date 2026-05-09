import { test, expect } from '../../src/fixtures/testFixtures';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { Logger } from '../../src/utils/logger';
import faker from 'faker';

// Test suite for end-to-end UI flow
test('Complete UI E2E flow', async ({ authenticatedPage }) => {
  // Initialize page objects with pre-authenticated session
  const inventory = new InventoryPage(authenticatedPage);
  const cart = new CartPage(authenticatedPage);
  const checkout = new CheckoutPage(authenticatedPage);

  Logger.info('Starting E2E flow test with pre-authenticated session');

  // Add product to cart and open cart
  await inventory.addProduct();
  await inventory.openCart();
  Logger.info('Added product to cart and opened cart');

  // Proceed to checkout
  await cart.checkout();
  Logger.info('Proceeded to checkout');

  // Generate fake data for checkout form using faker library
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const zipCode = faker.address.zipCode();

  // Fill checkout form with fake data and finish
  await checkout.fillCheckout(firstName, lastName, zipCode);
  await checkout.finishCheckout();
  Logger.info(`Filled checkout form with fake data (${firstName} ${lastName}, ${zipCode}) and completed checkout`);

  // Assert success message
  await expect(checkout.success).toContainText('Thank you');
  Logger.info('E2E flow completed successfully');
});