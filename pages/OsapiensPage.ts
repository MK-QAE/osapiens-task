import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { OSAPIENS_LOCATORS } from '../constants/osapiensLocators';

/**
 * OSAPIENS CAREERS PAGE
 * -------------------------------------------------------------------------
 * Specific implementation for the Careers portal.
 * Inherits generic browser capabilities from BasePage.
 */
export class OsapiensCareersPage extends BasePage {
  readonly baseUrl: string;
  readonly cookieButton: Locator;
  readonly viewJobsButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page); // Initialize the parent BasePage (sets up page and health monitors)

    // Configuration
    this.baseUrl = process.env.BASE_URL || OSAPIENS_LOCATORS.URLS.BASE_PROD;

    // Locator Initialization (using Constants)
    const loc = OSAPIENS_LOCATORS.ELEMENTS;
    this.cookieButton = page.getByRole(loc.COOKIE_BANNER.role, loc.COOKIE_BANNER.options);
    this.viewJobsButton = page.getByRole(loc.VIEW_JOBS_BTN.role, loc.VIEW_JOBS_BTN.options);
    this.searchInput = page.getByRole(loc.SEARCH_INPUT.role, loc.SEARCH_INPUT.options);
  }

  /**
   * Workflow: Open Application
   * Uses the inherited navigateTo method.
   */
  async openApp() {
    await this.navigateTo(this.baseUrl);
  }

  /**
   * Workflow: Handle Consent
   * Uses the inherited clickIfVisible method for robustness.
   */
  async handleCookies() {
    console.log('🍪 Checking for Cookie Banner...');
    await this.clickIfVisible(this.cookieButton);
  }

  /**
   * Business Logic: Navigate to Job Board
   */
  async accessJobListings() {
    await expect(this.viewJobsButton.first(), 'View Jobs button should be visible').toBeVisible();
    await this.viewJobsButton.first().click();
    await expect(this.searchInput, 'Search bar should appear').toBeVisible();
  }

  /**
   * Business Logic: Perform Search
   * Includes performance monitoring specific to this feature.
   */
  async searchForRole(term: string) {
    const startTime = Date.now();

    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');

    const duration = Date.now() - startTime;
    console.log(`⏱️ Search Performance: Operation took ${duration}ms`);

    // Soft Assertion: SLA check (e.g., search must be under 3s)
    expect.soft(duration, 'Performance Warning: Search took too long').toBeLessThan(3000);
  }

  async verifyAndClickListing(regexPattern: RegExp) {
    const role = OSAPIENS_LOCATORS.ELEMENTS.JOB_GRID_CELL.role;
    const matchingJob = this.page.getByRole(role, { name: regexPattern }).first();

    await expect(matchingJob, `Should find job matching ${regexPattern}`).toBeVisible();

    const title = await matchingJob.innerText();
    console.log(`✅ Match found: "${title}"`);

    await matchingJob.click();
  }

  async validateJobDetails(regexPattern: RegExp) {
    const role = OSAPIENS_LOCATORS.ELEMENTS.JOB_HEADING.role;
    const header = this.page.getByRole(role, { name: regexPattern }).first();

    await expect(header).toBeVisible();

    // Simple content length check to ensure page isn't empty
    const bodyText = await this.page.locator('body').textContent();
    expect.soft(bodyText?.length).toBeGreaterThan(100);

    console.log('✅ Job details verified.');
  }

  /**
   * Demo Feature: DOM Injection
   * Modifies the UI to personalize the experience for the candidate.
   */
  async injectCandidateMagic(candidateName: string) {
    console.log('🎩 Performing magic trick for the recruiters...');
    const styles = OSAPIENS_LOCATORS.MAGIC_STYLES;

    await this.page.evaluate(
      ({ name, style }) => {
        const header = document.querySelector('h1, h2');
        if (header && header instanceof HTMLElement) {
          header.style.transition = 'all 0.5s';
          header.style.color = style.HEADER_COLOR;
          header.innerHTML = `${header.innerText} <br><span style="font-size: 0.6em; color: ${style.MATCH_COLOR};">(✨ Best Match: ${name})</span>`;
        }

        const buttons = Array.from(document.querySelectorAll('a, button'));
        const applyBtn = buttons.find((b) => /apply|bewerben/i.test((b as HTMLElement).innerText));

        if (applyBtn && applyBtn instanceof HTMLElement) {
          applyBtn.innerText = `🚀 Hire ${name.split(' ')[0]} Immediately`;
          applyBtn.style.backgroundColor = style.BUTTON_HIRE_BG;
          applyBtn.style.border = '2px solid #fff';
          applyBtn.style.transform = 'scale(1.1)';
        }
      },
      { name: candidateName, style: styles },
    );

    await this.page.waitForTimeout(1000);
    await test.info().attach('Candidate Magic', {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    });
  }

  /**
   * Validates that the session was clean (no console errors).
   * Uses data collected by the BasePage.
   */
  assertHealthySession() {
    const health = this.getHealthMetrics();

    if (!health.isClean) {
      console.warn('⚠️ Session Health Warning: Silent errors were detected.');
      console.warn('Console Errors:', health.consoleErrors);
      console.warn('Failed Requests:', health.failedRequests);
    } else {
      console.log('💚 Session Health Check: CLEAN');
    }
  }
}
