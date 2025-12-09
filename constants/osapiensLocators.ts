// constants/osapiensLocators.ts
import type { Page } from '@playwright/test';

// Derive types from Playwright's getByRole signature
type AriaRoleFromPage = Parameters<Page['getByRole']>[0];
type GetByRoleOptions = Parameters<Page['getByRole']>[1];

type RoleLocator = {
  role: AriaRoleFromPage;
  options?: GetByRoleOptions;
};

export const OSAPIENS_LOCATORS = {
  // URL defaults
  URLS: {
    BASE_PROD: 'https://careers.osapiens.com/',
  },

  // Main UI Elements defined by Role and Name options
  ELEMENTS: {
    COOKIE_BANNER: {
      role: 'button',
      options: { name: /reject all|alle ablehnen|accept|kabul/i },
    } as RoleLocator,

    VIEW_JOBS_BTN: {
      role: 'link',
      options: { name: /view jobs|offene stellen/i },
    } as RoleLocator,

    SEARCH_INPUT: {
      role: 'textbox',
      options: { name: /search/i },
    } as RoleLocator,

    // For dynamic elements used in page methods
    JOB_GRID_CELL: {
      role: 'gridcell',
      // Name/label is provided dynamically via regex in the page object
    } as RoleLocator,

    JOB_HEADING: {
      role: 'heading',
      // Name/label is provided dynamically via regex in the page object
    } as RoleLocator,
  },

  // Magic/DOM Injection Styles (CSS colors and text)
  MAGIC_STYLES: {
    HEADER_COLOR: '#2563eb',
    MATCH_COLOR: '#e11d48',
    BUTTON_HIRE_BG: '#16a34a',
    BUTTON_REGEX: /apply|bewerben/i,
  },
} as const;
