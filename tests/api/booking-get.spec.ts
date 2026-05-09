import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/clients/ApiClient';
import { BookingService } from '../../src/api/services/BookingService';
import { Logger } from '../../src/utils/logger';

test('Get bookings', async () => {
  Logger.info('Starting Get bookings test');
  const client = new ApiClient();
  const context = await client.create();

  const booking = new BookingService(context);

  const response = await booking.getBookings();
  Logger.info('Get bookings request sent');

  expect(response.status()).toBe(200);
});

test('Invalid booking id', async () => {
  Logger.info('Starting Invalid booking id test');
  const client = new ApiClient();
  const context = await client.create();

  const booking = new BookingService(context);

  const response = await booking.getBooking(9999999);
  Logger.info('Requested booking with invalid id 9999999');

  expect(response.status()).toBe(404);
});