import { request } from '@playwright/test';

// ApiClient creates a reusable request context for API tests
export class ApiClient {

  // Create a new Playwright API request context
  // Uses the Restful Booker base URL for all API calls
  async create() {
    return await request.newContext({
      baseURL: 'https://restful-booker.herokuapp.com'
    });
  }
}