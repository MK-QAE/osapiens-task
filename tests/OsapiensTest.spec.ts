import { test } from '@playwright/test';
import { OsapiensCareersPage } from '../pages/OsapiensPage';

/**
 * ---------------------------------------------------------------------------
 * AUTHOR: [Your Name] - Lead QA Engineer Candidate
 * TICKET: QA-101: Verify Career Page Job Listings
 * ARCHITECTURE: Modular Page Object Model (POM)
 * * * ARCHITECTURE NOTES:
 * 1. BasePage: Handles generic browser interactions (Inheritance).
 * 2. OsapiensPage: Contains specific business logic for the Careers portal.
 * 3. Constants: Locators and static data are separated for maintainability.
 * ---------------------------------------------------------------------------
 */

// -------------------------------------------------------------------------
// TEST EXECUTION (The Scenario Layer)
// -------------------------------------------------------------------------

test('C2342: E2E - Search and Validate "Quality/QA" Roles', async ({ page }) => {
  // TestRail Mapping (Metadata)
  test.info().annotations.push({ type: 'testrail', description: 'C2342' });

  // Initialize Page Object
  const careersPage = new OsapiensCareersPage(page);

  // Test Data (Ideally, move these to a separate fixture/data file in the future)
  const SEARCH_TERM = 'Quality';
  const JOB_MATCH_PATTERN = /QA|Quality|Test|Assurance/i;
  const CANDIDATE_NAME = 'Muide Kececi';

  await test.step('Step 1: Navigate to Career Portal', async () => {
    // Updated: Uses specific 'openApp' method which calls BasePage.navigateTo
    await careersPage.openApp();
    await careersPage.handleCookies();
  });

  await test.step('Step 2: Access Job Listings', async () => {
    await careersPage.accessJobListings();
  });

  await test.step(`Step 3: Search for "${SEARCH_TERM}" with Performance Check`, async () => {
    await careersPage.searchForRole(SEARCH_TERM);
  });

  await test.step('Step 4: Verify Job List and Select Position', async () => {
    await careersPage.verifyAndClickListing(JOB_MATCH_PATTERN);
  });

  await test.step('Step 5: Validate Details & Inject Magic', async () => {
    await careersPage.validateJobDetails(JOB_MATCH_PATTERN);
    await careersPage.injectCandidateMagic(CANDIDATE_NAME);
  });

  await test.step('Final Step: Session Health Check', async () => {
    // Validates that no 500 errors or console exceptions occurred
    careersPage.assertHealthySession();
  });
});
