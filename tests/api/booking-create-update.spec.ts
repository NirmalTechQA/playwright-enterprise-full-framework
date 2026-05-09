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

test('Create booking', async () => {
  Logger.info('Starting Create booking test');
  const client = new ApiClient();
  const context = await client.create();

  const booking = new BookingService(context);

  const response = await booking.createBooking(bookingData);
  Logger.info('Booking create request sent');

  expect(response.status()).toBe(200);

  const body = await response.json();
  Logger.info(`Booking created with id ${body.bookingid}`);

  const createValidation = validateSchema(bookingSchema, body.booking);
  Logger.info('Validated created booking payload against schema');
  if (!createValidation.valid) {
    Logger.error(`Create booking schema errors: ${JSON.stringify(createValidation.errors)}`);
  }
  expect(createValidation.valid).toBeTruthy();
  expect(body.booking.firstname).toBe('Nirmal');
});

test('Update booking', async () => {
  Logger.info('Starting Update booking test');
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

  const updatedPayload = {
    ...bookingData,
    firstname: 'Updated'
  };

  const updateResponse = await booking.updateBooking(
    createBody.bookingid,
    updatedPayload,
    tokenBody.token
  );
  Logger.info('Sent update booking request');

  expect(updateResponse.status()).toBe(200);

  const body = await updateResponse.json();
  Logger.info('Update booking response received');

  const updateValidation = validateSchema(bookingSchema, body);
  Logger.info('Validated updated booking payload against schema');
  if (!updateValidation.valid) {
    Logger.error(`Update booking schema errors: ${JSON.stringify(updateValidation.errors)}`);
  }
  expect(updateValidation.valid).toBeTruthy();
  expect(body.firstname).toBe('Updated');
});