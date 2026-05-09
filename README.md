# Playwright Enterprise Framework

Enterprise-grade Playwright + TypeScript framework supporting:

- **UI Automation** - Page Object Model pattern with custom fixtures
- **API Automation** - Service layer with schema validation
- **Cross-Browser Testing** - Chromium, Firefox, WebKit
- **Environment Configuration** - Secrets and credentials via `.env`
- **Comprehensive Logging** - Built-in logger for debugging
- **Type Safety** - Full TypeScript support
- **Test Data Management** - Centralized test data
- **CI/CD Ready** - GitHub Actions compatible

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Installation & Setup](#installation--setup)
3. [Running Tests](#running-tests)
4. [Framework Architecture](#framework-architecture)
5. [UI Test Strategy](#ui-test-strategy)
6. [API Test Strategy](#api-test-strategy)
7. [Team Onboarding Guide](#team-onboarding-guide)
8. [Configuration](#configuration)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install
npx playwright install

# Create .env file with required credentials
cp .env.example .env

# Run all tests
npm test
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `@playwright/test` - Testing framework
- `typescript` - Type checking
- `ajv` - JSON schema validation
- `dotenv` - Environment configuration
- `@types/node` - Node.js types

### Step 2: Install Playwright Browsers

```bash
npx playwright install
```

Installs Chromium, Firefox, and WebKit browsers for cross-browser testing.

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Valid credentials for test user
HEROKU_VALID_USER=admin
HEROKU_VALID_PASSWORD=password123

# Invalid credentials for negative testing
HEROKU_INVALID_USER=invaliduser
HEROKU_INVALID_PASSWORD=wrongpassword
```

### Step 4: Verify Installation

```bash
# Run a quick sanity test
npx playwright test tests/api/auth.spec.ts
```

If tests pass, your setup is complete! ✅

---

## Running Tests

### Run All Tests

```bash
npm test
# Equivalent to: npx playwright test
```

### Run UI Tests

```bash
npm run test:ui
# Equivalent to: npx playwright test tests/ui
```

**UI Test Suite:**
- `login.spec.ts` - Login page functionality
- `product.spec.ts` - Product interaction and cart operations
- `checkout.spec.ts` - Checkout flow validation
- `e2e.spec.ts` - End-to-end user workflows

### Run API Tests

```bash
npm run test:api
# Equivalent to: npx playwright test tests/api
```

**API Test Suite:**
- `auth.spec.ts` - Authentication token generation
- `booking-create-update.spec.ts` - Create and update booking operations
- `booking-delete.spec.ts` - Delete booking operations
- `booking-e2e.spec.ts` - Complete booking workflow (create → update → delete)
- `booking-get.spec.ts` - Retrieve booking records

### Run Specific Test File

```bash
npx playwright test tests/ui/login.spec.ts
npx playwright test tests/api/booking-e2e.spec.ts
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

Opens interactive Playwright Inspector for step-by-step execution.

### View Test Report

```bash
npm run report
# Equivalent to: npx playwright show-report
```

Displays detailed HTML report with screenshots and traces.

---

## Framework Architecture

### Directory Structure

```
src/
├── api/
│   ├── clients/
│   │   └── ApiClient.ts          # HTTP context factory
│   ├── services/
│   │   ├── AuthService.ts        # Auth operations
│   │   └── BookingService.ts     # Booking CRUD operations
│   └── schemas/
│       └── booking.schema.ts     # JSON schema for booking validation
├── fixtures/
│   └── testFixtures.ts           # Custom Playwright fixtures
├── pages/
│   ├── BasePage.ts               # Base class with common methods
│   ├── LoginPage.ts              # Login page object
│   ├── InventoryPage.ts          # Product inventory page object
│   ├── CartPage.ts               # Shopping cart page object
│   └── CheckoutPage.ts           # Checkout page object
├── test-data/
│   └── bookingData.json          # Centralized test data
└── utils/
    ├── logger.ts                 # Custom logging utility
    ├── schemaValidator.ts        # JSON schema validation
    └── constants.ts              # Framework constants

tests/
├── ui/
│   ├── login.spec.ts
│   ├── product.spec.ts
│   ├── checkout.spec.ts
│   └── e2e.spec.ts
└── api/
    ├── auth.spec.ts
    ├── booking-create-update.spec.ts
    ├── booking-delete.spec.ts
    ├── booking-e2e.spec.ts
    └── booking-get.spec.ts
```

### Core Components

#### 1. **Page Objects** (`src/pages/`)

Encapsulate UI elements and actions using Page Object Model (POM) pattern.

```typescript
// Example: LoginPage.ts
export class LoginPage extends BasePage {
  // Elements
  get usernameField() { return this.page.locator('#user-name'); }
  get passwordField() { return this.page.locator('#password'); }
  
  // Actions
  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
```

#### 2. **Fixtures** (`src/fixtures/testFixtures.ts`)

Reusable test setup with pre-configured state.

```typescript
// Provides authenticated page for tests that require login
test('user action', async ({ authenticatedPage }) => {
  // Page is already logged in
  // Use authenticatedPage directly
});
```

#### 3. **API Services** (`src/api/services/`)

Service layer abstracts HTTP operations.

```typescript
// BookingService encapsulates booking API calls
const booking = new BookingService(context);
await booking.createBooking(payload);
await booking.updateBooking(id, payload, token);
await booking.deleteBooking(id, token);
```

#### 4. **Logger Utility** (`src/utils/logger.ts`)

Centralized logging for all tests.

```typescript
Logger.info('Starting test');
Logger.error('Test failed');
// Output: [INFO] Starting test
//         [ERROR] Test failed
```

#### 5. **Schema Validation** (`src/utils/schemaValidator.ts`)

Validate API responses against JSON schemas.

```typescript
const result = validateSchema(bookingSchema, responseBody);
if (!result.valid) {
  console.log(result.errors); // Detailed validation errors
}
```

---

## API Test Strategy

### Test Architecture

API tests follow a **Service + Schema Validation** pattern:

```
Test Case
    ↓
API Service (abstraction layer)
    ↓
HTTP Client (Playwright APIRequestContext)
    ↓
Restful Booker API
    ↓
Response Validation (status + schema)
```

### Request Lifecycle

1. **Create API Client Context**
   ```typescript
   const client = new ApiClient();
   const context = await client.create(); // Creates HTTP context
   ```

2. **Initialize Service**
   ```typescript
   const booking = new BookingService(context);
   ```

3. **Execute API Call**
   ```typescript
   const response = await booking.createBooking(bookingData);
   ```

4. **Validate Response**
   ```typescript
   expect(response.status()).toBe(200);
   const body = await response.json();
   const validation = validateSchema(bookingSchema, body.booking);
   expect(validation.valid).toBeTruthy();
   ```

### Schema Validation

**Booking Schema** (`src/api/schemas/booking.schema.ts`):
- Validates JSON structure
- Enforces required fields: `firstname`, `lastname`, `totalprice`, `bookingdates`
- Validates nested objects (e.g., `bookingdates.checkin`, `bookingdates.checkout`)
- Allows additional properties for API flexibility

**Example:**
```json
{
  "firstname": "Nirmal",
  "lastname": "Kumar",
  "totalprice": 1500,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-05-01",
    "checkout": "2026-05-10"
  },
  "additionalneeds": "Breakfast"
}
```

### Authentication Strategy

Tests use environment-based credentials:
- Valid credentials: `HEROKU_VALID_USER` / `HEROKU_VALID_PASSWORD`
- Invalid credentials: `HEROKU_INVALID_USER` / `HEROKU_INVALID_PASSWORD`

**Token Flow:**
1. Call `AuthService.token(user, password)` to get auth token
2. Pass token in `Cookie: token=<token>` header for protected operations
3. Use token for create, update, delete operations

### Test Scenarios

| Test Case | Type | Purpose |
|-----------|------|---------|
| `auth.spec.ts` | Functional | Verify token generation (valid/invalid) |
| `booking-get.spec.ts` | Functional | Retrieve bookings and validate schema |
| `booking-create-update.spec.ts` | Functional | Create and update bookings with validation |
| `booking-delete.spec.ts` | Functional | Delete bookings and edge cases |
| `booking-e2e.spec.ts` | E2E | Complete workflow (create → update → verify → delete) |

### Response Validation

Every API test validates:
1. **HTTP Status** - Correct response code (200, 201, 400, 404, etc.)
2. **JSON Schema** - Response payload structure and types
3. **Data Integrity** - Expected values after operations
4. **Error Messages** - Proper error details on failure

---

## Team Onboarding Guide

### For New Team Members

#### Day 1: Environment Setup

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd playwright-enterprise-full-framework
   ```

2. Install dependencies
   ```bash
   npm install
   npx playwright install
   ```

3. Set up environment file
   ```bash
   cp .env.example .env
   # Update credentials in .env as needed
   ```

4. Run sanity tests
   ```bash
   npm run test:ui -- tests/ui/login.spec.ts
   npm run test:api -- tests/api/auth.spec.ts
   ```

#### Day 2: Understanding the Framework

**Read these files in order:**
1. `src/fixtures/testFixtures.ts` - Understand custom fixtures
2. `src/pages/BasePage.ts` - Learn base page utilities
3. `src/utils/logger.ts` - Logging patterns
4. `src/api/clients/ApiClient.ts` - API setup

**Run these commands:**
```bash
# Run a UI test and check logs
npx playwright test tests/ui/login.spec.ts --workers=1

# Run an API test and check logs
npx playwright test tests/api/auth.spec.ts

# View HTML report
npm run report
```

#### Day 3: Writing Your First Test

**UI Test Example:**

```typescript
import { test, expect } from '../../src/fixtures/testFixtures';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { Logger } from '../../src/utils/logger';

test('Add multiple products', async ({ authenticatedPage }) => {
  const inventory = new InventoryPage(authenticatedPage);
  
  Logger.info('Adding first product');
  await inventory.addProduct();
  
  Logger.info('Adding second product');
  await inventory.addProduct();
  
  await expect(inventory.cartBadge).toHaveText('2');
  Logger.info('Test passed');
});
```

**API Test Example:**

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/clients/ApiClient';
import { BookingService } from '../../src/api/services/BookingService';
import { bookingSchema } from '../../src/api/schemas/booking.schema';
import { validateSchema } from '../../src/utils/schemaValidator';
import { Logger } from '../../src/utils/logger';

test('Create and validate booking', async () => {
  Logger.info('Starting booking test');
  
  const client = new ApiClient();
  const context = await client.create();
  const booking = new BookingService(context);
  
  const response = await booking.createBooking({
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 1000,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-05-15',
      checkout: '2026-05-20'
    }
  });
  
  const body = await response.json();
  const validation = validateSchema(bookingSchema, body.booking);
  
  expect(response.status()).toBe(200);
  expect(validation.valid).toBeTruthy();
  Logger.info('Booking test passed');
});
```

### Common Tasks

#### Add a New Page Object

1. Create file `src/pages/NewPage.ts`
2. Extend `BasePage`
3. Define selectors and actions
4. Export class

#### Add a New Fixture

1. Update `src/fixtures/testFixtures.ts`
2. Use `test.extend()` to add new fixture
3. Example: `authenticatedPage` fixture already provided

#### Add Schema Validation

1. Define JSON schema in `src/api/schemas/`
2. Import in test
3. Call `validateSchema(schema, data)`
4. Assert `validation.valid === true`

#### Debug a Test

```bash
# Run in debug mode
npx playwright test tests/ui/login.spec.ts --debug

# Run with verbose output
npx playwright test tests/ui/login.spec.ts --reporter=list

# Run specific test by name
npx playwright test --grep "Add product to cart"
```

### Best Practices

✅ **DO:**
- Use Page Objects for UI elements
- Use Services for API calls
- Validate responses with schemas
- Add logs for debugging
- Use fixtures for reusable setup
- Keep test data centralized in `src/test-data/`
- Run tests with `--workers=1` for debugging

❌ **DON'T:**
- Hardcode credentials (use `.env`)
- Mix business logic with tests
- Ignore schema validation errors
- Create duplicate page objects
- Skip logging in important steps

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests fail with "Cannot find module" | Run `npm install` and `npx playwright install` |
| Authentication fails | Check `.env` credentials match test user |
| Schema validation errors | Review schema definition and API response structure |
| Tests timeout | Increase timeout in `playwright.config.ts` or use `--workers=1` |
| Browser won't open | Run `npx playwright install` and verify system dependencies |

### Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JSON Schema Guide](https://json-schema.org/understanding-json-schema/)
- Project Wiki (if available): See team documentation

### Support

- **Questions?** Check existing tests first
- **Bug found?** Create an issue with reproduction steps
- **Feature request?** Discuss with team lead

---

## UI Test Strategy

### Test Architecture

UI tests follow a **Page Object Model (POM)** pattern with custom fixtures:

```
Test Case
    ↓
Custom Fixture (setup: login)
    ↓
Page Object (UI element locators + actions)
    ↓
Base Page (common utilities)
    ↓
Playwright Browser Context
    ↓
UI Application
```

### Page Object Structure

Each page object extends `BasePage` and provides:
- **Selectors** - Element locators using `page.locator()`
- **Actions** - Methods encapsulating user interactions
- **Assertions** - Helper methods for common validations

**Example:**
```typescript
export class LoginPage extends BasePage {
  // Selectors
  get usernameField() { return this.page.locator('#user-name'); }
  get passwordField() { return this.page.locator('#password'); }
  get loginButton() { return this.page.locator('#login-button'); }
  get error() { return this.page.locator('[data-test="error"]'); }
  
  // Actions
  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
```

### Available Fixtures

#### `loginPage` Fixture
- **Provides:** Navigated LoginPage object
- **Setup:** Loads login page, ready for interaction
- **Use Case:** Login-specific tests

```typescript
test('Login test', async ({ loginPage }) => {
  await loginPage.login('user', 'password');
});
```

#### `authenticatedPage` Fixture
- **Provides:** Browser page already logged in
- **Setup:** Performs login automatically, positioned at inventory page
- **Use Case:** Tests requiring authenticated session

```typescript
test('Authenticated action', async ({ authenticatedPage }) => {
  const inventory = new InventoryPage(authenticatedPage);
  await inventory.addProduct();
});
```

### UI Test Files Overview

#### 1. **login.spec.ts** - Authentication Tests

**Tests:**
- `Valid login` - Verify successful login with correct credentials
- `Invalid login` - Verify error message with incorrect credentials

**Coverage:**
- Login form submission
- URL navigation to inventory page
- Error message display
- Credential validation

**Fixtures Used:** `loginPage`, `page`

**Page Objects:** `LoginPage`

```bash
npx playwright test tests/ui/login.spec.ts
```

#### 2. **product.spec.ts** - Product Interaction Tests

**Tests:**
- `Add product to cart` - Verify product can be added to cart with proper badge update
- `Invalid product validation` - Verify unauthenticated user cannot add products

**Coverage:**
- Product addition functionality
- Cart badge counter
- Unauthenticated access control
- Error handling

**Fixtures Used:** `authenticatedPage`, `baseTest`

**Page Objects:** `InventoryPage`

```bash
npx playwright test tests/ui/product.spec.ts
```

#### 3. **checkout.spec.ts** - Checkout Flow Tests

**Tests:**
- `Successful checkout` - Verify complete checkout flow from cart to confirmation
- `Checkout validation error` - Verify form validation when required fields are empty

**Coverage:**
- Multi-page flow (inventory → cart → checkout)
- Form filling and submission
- Validation error display
- Success confirmation message

**Fixtures Used:** `authenticatedPage`

**Page Objects:** `InventoryPage`, `CartPage`, `CheckoutPage`

```bash
npx playwright test tests/ui/checkout.spec.ts
```

#### 4. **e2e.spec.ts** - End-to-End User Workflows

**Tests:**
- Complete user journey from login to checkout
- Multiple product selection scenarios
- Cart management (add, view, remove)

**Coverage:**
- Full user workflow validation
- Multiple page transitions
- Session persistence
- Data consistency across pages

**Fixtures Used:** `authenticatedPage`, `loginPage`, `page`

**Page Objects:** All page objects

```bash
npx playwright test tests/ui/e2e.spec.ts
```

### Test Data in UI Tests

Tests use centralized constants from `src/utils/constants.ts`:

```typescript
export const USERS = {
  VALID_USERNAME: 'standard_user',
  VALID_PASSWORD: 'secret_sauce',
  INVALID_USERNAME: 'invalid_user',
  INVALID_PASSWORD: 'wrong_password'
};
```

### Cross-Browser Testing

UI tests run against multiple browsers:

**Local Testing:**
```bash
# Run against all configured browsers
npx playwright test tests/ui

# Run against specific browser
npx playwright test tests/ui --project=chromium
npx playwright test tests/ui --project=firefox
```

**CI/CD:** Tests automatically run against Chromium and Firefox in GitHub Actions

### UI Test Best Practices

✅ **DO:**
- Use fixtures for common setup (login, navigation)
- Leverage page objects for all element interactions
- Add descriptive logs at key points
- Wait for elements implicitly (Playwright handles timeouts)
- Test both success and failure scenarios
- Use meaningful test names that describe the action

❌ **DON'T:**
- Hardcode wait times (use implicit waits)
- Mix page object logic with test logic
- Skip assertions on critical paths
- Use generic selectors that might break with UI changes
- Test multiple independent flows in one test

### UI Test Debugging

**Run tests in headed mode (see browser):**
```bash
npx playwright test tests/ui/login.spec.ts --headed
```

**Run tests in debug mode (step through):**
```bash
npx playwright test tests/ui/login.spec.ts --debug
```

**Generate trace for failed test (replay in Trace Viewer):**
```bash
npx playwright test tests/ui/login.spec.ts
npx playwright show-trace trace/trace.zip
```

**Take screenshot at specific point:**
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

---

## Configuration

### Playwright Config (`playwright.config.ts`)

**Key Settings:**

```typescript
{
  testDir: './tests',              // Where to find tests
  timeout: 30000,                  // 30s per test
  retries: 1,                      // Retry failed tests once
  workers: process.env.CI ? 2 : 4, // 2 workers in CI, 4 locally
  fullyParallel: true,             // Tests run in parallel
  
  reporter: ['html', 'list'],      // HTML report + console list
  
  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: true,
    screenshot: 'only-on-failure', // Screenshot on failure
    video: 'retain-on-failure',    // Video on failure
    trace: 'retain-on-failure'     // Trace on failure
  },
  
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] }
  ]
}
```

**What This Means:**
- Tests automatically run on both Chromium and Firefox
- Failed tests are retried once automatically
- Screenshots, videos, and traces captured only on failure (saves storage)
- 2 parallel workers in CI to avoid resource contention
- 4 parallel workers locally for faster feedback

### TypeScript Config (`tsconfig.json`)

```typescript
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,           // Strict type checking
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/playwright.yml`

The framework includes automated testing on every code change:

#### Triggers

Tests run automatically on:
- **Push to any branch** - All commits trigger tests
- **Pull requests** - All PR changes trigger tests
- **Manual trigger** - Can run tests manually from GitHub UI

```yaml
on:
  push:           # Run on push to any branch
  pull_request:   # Run on pull requests
  # workflow_dispatch:  # Uncomment to enable manual trigger
```

#### Workflow Steps

1. **Checkout Code**
   ```yaml
   - uses: actions/checkout@v4
   ```
   Retrieves the repository code for testing

2. **Setup Node.js**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: 20
   ```
   Installs Node.js v20 (required for dependencies)

3. **Install Dependencies**
   ```yaml
   - run: npm install
   ```
   Installs npm packages (Playwright, TypeScript, etc.)

4. **Install Playwright Browsers**
   ```yaml
   - run: npx playwright install --with-deps
   ```
   Installs Chromium, Firefox, WebKit + system dependencies

5. **Run UI Tests**
   ```yaml
   - name: Run UI Tests
     run: npx playwright test tests/ui
   ```
   Executes all UI tests across configured browsers

6. **Run API Tests**
   ```yaml
   - name: Run API Tests
     run: npx playwright test tests/api
   ```
   Executes all API tests in sequence

#### Environment Secrets

Add credentials to GitHub repository settings:

**Steps:**
1. Go to: Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

| Secret Name | Value | Used By |
|------------|-------|---------|
| `HEROKU_VALID_USER` | `admin` | API tests |
| `HEROKU_VALID_PASSWORD` | (password) | API tests |
| `HEROKU_INVALID_USER` | `invalid` | API tests |
| `HEROKU_INVALID_PASSWORD` | (password) | API tests |

**Reference in workflow:**
```yaml
env:
  HEROKU_VALID_USER: ${{ secrets.HEROKU_VALID_USER }}
  HEROKU_VALID_PASSWORD: ${{ secrets.HEROKU_VALID_PASSWORD }}
  HEROKU_INVALID_USER: ${{ secrets.HEROKU_INVALID_USER }}
  HEROKU_INVALID_PASSWORD: ${{ secrets.HEROKU_INVALID_PASSWORD }}
```

**Update workflow:**
```yaml
- name: Run API Tests
  env:
    HEROKU_VALID_USER: ${{ secrets.HEROKU_VALID_USER }}
    HEROKU_VALID_PASSWORD: ${{ secrets.HEROKU_VALID_PASSWORD }}
    HEROKU_INVALID_USER: ${{ secrets.HEROKU_INVALID_USER }}
    HEROKU_INVALID_PASSWORD: ${{ secrets.HEROKU_INVALID_PASSWORD }}
  run: npx playwright test tests/api
```

### Pull Request Integration

#### Branch Protection Rules

Configure to enforce passing tests before merge:

**Setup:**
1. Go to: Repository → Settings → Branches → Branch protection rules
2. Click "Add rule"
3. Create rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date before merging
   - ✅ Dismiss stale pull request approvals

#### Status Checks

GitHub displays test results as:
- ✅ **Passing** - All tests passed, safe to merge
- ❌ **Failing** - Tests failed, fix required before merge
- ⏳ **Pending** - Tests still running

#### PR Comments

Tests can be configured to auto-comment results on PRs:

**Example workflow addition:**
```yaml
- name: Post Test Results
  if: always()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '✅ All tests passed!'
      })
```

### Test Reports

#### HTML Report

Playwright generates detailed HTML reports:

**View in CI:**
1. Go to GitHub Actions workflow run
2. Click "Summary" tab
3. Scroll to "Artifacts" section
4. Download `playwright-report`
5. Extract and open `index.html` in browser

**Report Contents:**
- Test execution timeline
- Pass/fail status for each test
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

#### Test Results

**Success Criteria:**
```
✅ UI Tests: 4 passed
✅ API Tests: 10 passed
Total: 14 passed
```

**Failure Indication:**
```
❌ UI Tests: 1 failed
  - Invalid product validation (timeout waiting for element)
```

### Common CI/CD Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Module not found" | Dependencies not installed | Ensure `npm install` runs before tests |
| Tests timeout in CI | Resource constraints | Use `workers: 2` in CI mode (already configured) |
| "Browser not installed" | Playwright binaries missing | Run `npx playwright install --with-deps` |
| Credentials not found | Secrets not set | Add secrets to GitHub Settings → Secrets |
| Flaky tests in CI | Timing issues | Use `--workers=1` or increase timeout |
| API tests fail in CI | Network/API issues | Check API availability, add retries |
| Screenshots not captured | Configuration issue | Verify screenshot/video settings in `playwright.config.ts` |

### Debugging CI Failures

**Step 1: Check Workflow Logs**
1. Go to GitHub Actions
2. Click on failed workflow run
3. Expand job to see detailed output
4. Look for error messages in "Run UI Tests" or "Run API Tests" sections

**Step 2: Download Artifacts**
1. Go to failed workflow run
2. Click "Artifacts" section
3. Download `playwright-report` zip
4. Extract and open `index.html`
5. Click on failed test to see:
   - Screenshot of failure
   - Video recording
   - Console logs
   - Network trace

**Step 3: Reproduce Locally**
```bash
# Reproduce exact CI commands locally
npm install
npx playwright install
npx playwright test tests/ui  # or tests/api
```

**Step 4: Run with Debug**
```bash
# If test passes locally but fails in CI
npx playwright test tests/ui/login.spec.ts --debug
# This helps identify timing or environment differences
```

### Deployment with Tests

Tests serve as **quality gates** before deployment:

**Deployment Flow:**
1. Developer creates Pull Request
2. Tests run automatically
3. If tests pass → PR can be merged (with review)
4. If tests fail → PR cannot be merged
5. Once merged to `main` → Deploy to production

**Prevent Bad Deploys:**
```yaml
# Example: Only deploy if tests pass
- name: Deploy to Production
  if: success()  # Only runs if all previous steps succeeded
  run: npm run deploy
```

### Performance Monitoring

**Test Duration Tracking:**

View test execution times in HTML report:
- Individual test duration
- Total suite duration
- Slowest tests
- Worker efficiency

**Optimize for Speed:**
- Increase workers (if resources allow)
- Parallelize independent test files
- Remove unnecessary waits
- Use fixtures to share expensive setup

### Notification Integration

**Email on Failure:**

Add to workflow to notify on failures:
```yaml
- name: Send Slack Alert
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ Tests failed on ${{ github.ref }}"
      }
```

---

## Contributing

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Write tests for your feature**
   - Add UI tests in `tests/ui/`
   - Add API tests in `tests/api/`
   - Ensure new tests have descriptive names

3. **Run tests locally**
   ```bash
   npm test
   ```

4. **Verify all tests pass**
   - UI tests: `npm run test:ui`
   - API tests: `npm run test:api`

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: Feature description"
   git push origin feature/your-feature
   ```

6. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Wait for CI to pass

7. **Address review feedback**
   - Make requested changes
   - Re-run tests to verify
   - Push updates (PR auto-updates)

8. **Merge after approval**
   - Maintainer merges PR
   - CI runs on merge
   - Tests verify deployment readiness

---

## Troubleshooting Guide

### Local Development

**Issue:** `npm install` fails
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Tests fail with "Chrome/Firefox not found"
```bash
# Solution: Reinstall browsers
npx playwright install --with-deps
```

**Issue:** Port already in use
```bash
# Solution: Kill process using port
lsof -i :3000
kill -9 <PID>
```

### GitHub Actions

**Issue:** Tests pass locally but fail in CI
```bash
# Common causes:
# 1. Environment variables not set
# 2. Timing differences
# 3. Different OS (local vs Ubuntu in CI)

# Solution: Check env vars
echo $HEROKU_VALID_USER
# Or increase timeouts in playwright.config.ts
```

**Issue:** Artifacts not generated
```bash
# Solution: Ensure test ran and check disk space
# Artifacts generated: 
# - playwright-report/ (HTML report)
# - test-results/ (Screenshots, videos)
```

---

**Last Updated:** May 2026
**Framework Version:** 1.0.0
**Maintained By:** QA Team
