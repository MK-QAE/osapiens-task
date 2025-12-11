import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { OSAPIENS_LOCATORS } from './constants/osapiensLocators';

// Load .env file only for real secrets (e.g. TestRail credentials)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = OSAPIENS_LOCATORS.URLS.BASE_PROD;

// Shared reporter list
const reporters: ReporterDescription[] = [
  ['list'], // Print test results to the console
  ['html'], // Generate standard HTML report (for GitHub artifacts / local debugging)
];

// Add TestRail reporter only on CI
if (process.env.CI) {
  reporters.push([
    'playwright-testrail-reporter',
    {
      // 1. Connection settings
      host: process.env.TESTRAIL_HOST,

      // 2. Authentication
      username: process.env.TESTRAIL_USERNAME,
      apiKey: process.env.TESTRAIL_API_KEY,

      // 3. Project and suite config
      projectId: Number(process.env.TESTRAIL_PROJECT_ID),
      suiteId: Number(process.env.TESTRAIL_SUITE_ID),

      // 4. Run configuration
      createTestRun: true,
      runName: `Scheduled Run - ${new Date().toISOString().split('T')[0]}`,
      includeAllCases: true,
    },
  ]);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: reporters,

  use: {
    // Use Playwright baseURL so pages can navigate with relative paths
    baseURL: BASE_URL,
    // Collect trace only on first retry
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
