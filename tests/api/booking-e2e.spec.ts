import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/clients/ApiClient';
import { BookingService } from '../../src/api/services/BookingService';
import { AuthService } from '../../src/api/services/AuthService';
import bookingData from '../../src/test-data/bookingData.json';
import { Logger } from '../../src/utils/logger';
import { bookingSchema } from '../../src/api/schemas/booking.schema';
import { validateSchema } from '../../src/utils/schemaValidator';

const validUser = process.env.HEROKU_VALID_USER;
const validPassword = process.env.HEROKU_VALID_PASSWORD;

if (!validUser || !validPassword) {
  throw new Error('HEROKU_VALID_USER and HEROKU_VALID_PASSWORD must be set');
}

test('Complete API E2E flow', async () => {
  Logger.info('Starting Complete API E2E flow test');
  const client = new ApiClient();
  const context = await client.create();

  const booking = new BookingService(context);
  const auth = new AuthService(context);

  const tokenResponse = await auth.token(validUser, validPassword);
  Logger.info(`Requested auth token for user ${validUser}`);
  const tokenBody = await tokenResponse.json();

  const createResponse = await booking.createBooking(bookingData);
  const createBody = await createResponse.json();
  const bookingId = createBody.bookingid;
  Logger.info(`Created booking with id ${bookingId}`);

  const updatedPayload = {
    ...bookingData,
    firstname: 'AutomationUpdated'
  };

  const updateResponse = await booking.updateBooking(
    bookingId,
    updatedPayload,
    tokenBody.token
  );
  Logger.info(`Requested update for booking id ${bookingId}`);

  expect(updateResponse.status()).toBe(200);

  const verifyResponse = await booking.getBooking(bookingId);
  const verifyBody = await verifyResponse.json();
  Logger.info('Verified updated booking details');

  const verifyValidation = validateSchema(bookingSchema, verifyBody);
  Logger.info('Validated retrieved booking payload against schema');
  if (!verifyValidation.valid) {
    Logger.error(`Verified booking schema errors: ${JSON.stringify(verifyValidation.errors)}`);
  }
  expect(verifyValidation.valid).toBeTruthy();
  expect(verifyBody.firstname).toBe('AutomationUpdated');

  const deleteResponse = await booking.deleteBooking(
    bookingId,
    tokenBody.token
  );
  Logger.info(`Requested delete for booking id ${bookingId}`);

  expect(deleteResponse.status()).toBe(201);
});