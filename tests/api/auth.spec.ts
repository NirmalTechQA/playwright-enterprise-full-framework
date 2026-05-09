import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/clients/ApiClient';
import { AuthService } from '../../src/api/services/AuthService';
import { Logger } from '../../src/utils/logger';

// Use environment variables from .env for auth credentials
const validUser = process.env.HEROKU_VALID_USER;
const validPassword = process.env.HEROKU_VALID_PASSWORD;
const invalidUser = process.env.HEROKU_INVALID_USER;
const invalidPassword = process.env.HEROKU_INVALID_PASSWORD;

if (!validUser || !validPassword || !invalidUser || !invalidPassword) {
  throw new Error('HEROKU_VALID_USER, HEROKU_VALID_PASSWORD, HEROKU_INVALID_USER, and HEROKU_INVALID_PASSWORD must all be set');
}

test('Generate token', async () => {
  Logger.info('Starting Generate token test');
  const client = new ApiClient();
  const context = await client.create();
  const auth = new AuthService(context);

  const response = await auth.token(validUser, validPassword);
  Logger.info(`Requested token for valid user ${validUser}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  Logger.info('Token response received');
  expect(body.token).toBeTruthy();
});

test('Invalid auth', async () => {
  Logger.info('Starting Invalid auth test');
  const client = new ApiClient();
  const context = await client.create();
  const auth = new AuthService(context);

  const response = await auth.token(invalidUser, invalidPassword);
  Logger.info(`Requested token for invalid user ${invalidUser}`);

  const body = await response.json();
  Logger.info('Invalid auth response received');
  expect(body.reason).toContain('Bad credentials');
});