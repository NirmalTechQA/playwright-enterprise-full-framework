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

test('Delete booking', async () => {
  Logger.info('Starting Delete booking test');
  const client = new ApiClient();
  const context = await client.create();

  const booking = new BookingService(context);
  const auth = new AuthService(context);

  const tokenResponse = await auth.token(validUser, validPassword);
  Logger.info(`Requested auth token for user ${validUser}`);
  const tokenBody = await tokenResponse.json();

  const createResponse = await booking.createBooking(bookingData);
  const createBody = await createResponse.json();
  Logger.info(`Created booking with id ${createBody.bookingid}`);

  const createValidation = validateSchema(bookingSchema, createBody.booking);
  Logger.info('Validated created booking payload against schema');
  if (!createValidation.valid) {
    Logger.error(`Create booking schema errors: ${JSON.stringify(createValidation.errors)}`);
  }
  expect(createValidation.valid).toBeTruthy();

  const response = await booking.deleteBooking(
    createBody.bookingid,
    tokenBody.token
  );
  Logger.info(`Requested delete for booking id ${createBody.bookingid}`);

  expect(response.status()).toBe(201);
});

test('Delete invalid booking', async () => {
  Logger.info('Starting Delete invalid booking test');
  const client = new ApiClient();
  const context = await client.create();

  const booking = new BookingService(context);
  const auth = new AuthService(context);

  const tokenResponse = await auth.token(validUser, validPassword);
  Logger.info(`Requested auth token for user ${validUser}`);
  const tokenBody = await tokenResponse.json();

  const response = await booking.deleteBooking(
    999999,
    tokenBody.token
  );
  Logger.info('Requested delete for invalid booking id 999999');

  expect(response.status()).toBeGreaterThanOrEqual(400);
});