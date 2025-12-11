import { Page, Locator } from '@playwright/test';

/**
 * BASE PAGE OBJECT
 * -------------------------------------------------------------------------
 * Acts as the parent class for all Page Objects.
 * Encapsulates common browser interactions, error handling, and health monitoring
 * to ensure DRY (Don't Repeat Yourself) principles across the test suite.
 */
export class BasePage {
  readonly page: Page;

  // Session Health Monitoring Storage
  protected consoleErrors: string[] = [];
  protected failedRequests: string[] = [];

  constructor(page: Page) {
    this.page = page;
    this.startHealthMonitors();
  }

  /**
   * HEALTH MONITORING
   * Automatically listens for console errors and failed network requests
   * throughout the lifecycle of any page extending this class.
   */
  private startHealthMonitors() {
    // 1. Capture Console Errors
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`🚩 [BasePage] Console Error Detected: ${msg.text()}`);
        this.consoleErrors.push(msg.text());
      }
    });

    // 2. Capture Network Failures (4xx, 5xx)
    this.page.on('requestfailed', (request) => {
      // Filter out common noise (analytics, trackers)
      if (!request.url().includes('google-analytics') && !request.url().includes('tracker')) {
        console.log(
          `🚩 [BasePage] Network Failure: ${request.url()} - ${request.failure()?.errorText}`,
        );
        this.failedRequests.push(`${request.method()} ${request.url()}`);
      }
    });
  }

  /**
   * GENERIC NAVIGATION
   * Wraps the standard goto method with logging and default wait strategies.
   */
  async navigateTo(
    url: string,
    waitCondition: 'domcontentloaded' | 'networkidle' = 'domcontentloaded',
  ) {
    console.log(`🚀 Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: waitCondition });
  }

  /**
   * CONDITIONAL CLICK (RESILIENT INTERACTION)
   * Useful for elements that may or may not appear (Cookie banners, Popups).
   * Does not fail the test if the element is missing.
   * @param locator - The Playwright locator to check
   * @param timeout - Time to wait before skipping (default: 5000ms)
   */
  async clickIfVisible(locator: Locator, timeout: number = 5000) {
    try {
      if (await locator.first().isVisible({ timeout: timeout })) {
        console.log(`🖱️ Optional element found. Clicking...`);
        await locator.first().click();
        console.log('✅ Click successful.');
      } else {
        console.log('ℹ️ Optional element not visible. Skipping interaction.');
      }
    } catch (error) {
      console.log(`⚠️ Exception in optional click handler: ${error}`);
      // We swallow the error here to allow the test flow to continue
    }
  }

  /**
   * SESSION HEALTH REPORTING
   * Returns true if the session had no silent errors.
   */
  getHealthMetrics() {
    return {
      consoleErrors: this.consoleErrors,
      failedRequests: this.failedRequests,
      isClean: this.consoleErrors.length === 0 && this.failedRequests.length === 0,
    };
  }
}
