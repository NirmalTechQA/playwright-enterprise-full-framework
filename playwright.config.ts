import { defineConfig, devices } from '@playwright/test';

// Playwright configuration for the enterprise framework
export default defineConfig({

  // Root directory containing test files
  testDir: './tests',

  // Maximum time a single test can run
  timeout: 30000,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Allow tests to run fully in parallel
  fullyParallel: true,

  // Worker configuration
  workers: process.env.CI ? 2 : 4,

  // Reporters
  reporter: [
    ['html'],
    ['list']
  ],

  use: {

    // Base URL
    baseURL: 'https://www.saucedemo.com/',

    // Run in headless mode
    headless: true,

    // Capture screenshots on failure
    screenshot: 'only-on-failure',

    // Retain videos for failures
    video: 'retain-on-failure',

    // Retain traces for debugging
    trace: 'retain-on-failure'
  },

  // Browser projects
  projects: [

    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'firefox',

      use: {
        ...devices['Desktop Firefox']
      }
    }

  ]

});