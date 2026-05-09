import { defineConfig, devices } from '@playwright/test';

// Playwright configuration for the enterprise framework
// Includes parallel execution, CI worker settings, reporters, and browser projects
export default defineConfig({
  // Root directory containing test files
  testDir: './tests',

  // Maximum time a single test can run
  timeout: 30000,

  // Retry failed tests once to improve CI stability
  retries: 1,

  // Allow tests within a file to run in parallel
  fullyParallel: true,

  // Configure worker count for CI and local runs
  // Use a smaller number in CI to avoid resource contention,
  // while allowing faster parallel execution locally.
  workers: process.env.CI ? 2 : 4,

  //For retries of local runs, we want to avoid retries to speed up feedback, while in CI we want to allow retries to improve stability.
  retries: process.env.CI ? 2 : 0

  // Report test results in both HTML and list formats
  reporter: [['html'], ['list']],

  use: {
    // Base URL for relative navigation in tests
    baseURL: 'https://www.saucedemo.com/',
    // Run tests in headless mode for CI and automation
    headless: true,
    // Capture screenshots only when failures occur
    screenshot: 'only-on-failure',
    // Keep video only for failed tests
    video: 'retain-on-failure',
    // Collect trace only for failures to help debugging
    trace: 'retain-on-failure'
  },

  // Define projects to run against multiple browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ]
});