<div align="center">
  <h1>🚀 Osapiens QA Challenge: Lead Automation Showcase</h1>
</div>

---

## 👤 Candidate Profile

| Attribute     | Details                                             |
|---------------|-----------------------------------------------------|
| **Candidate** | MK                                                  |
| **Role** | Lead QA Engineer                                         |
| **Focus** | Engineering Excellence, Stability & Resilience          |
| **Tech Stack**| Playwright (TypeScript)                             |

---

## 🎯 Project Overview

This project serves as a **robust End-to-End (E2E) automation suite** to verify the recruitment workflows on the **Osapiens Careers** page.

> As a **Lead QA**, the focus goes beyond basic functionality — it's about engineering quality across four pillars:

### 🔥 Engineering Pillars

* 🔥 **Performance**
* 🛡️ **Resilience**
* 🔄 **Process Integration**
* 💎 **Code Quality**

---

## 📂 Project Architecture

The project utilizes a scalable **Modular Page Object Model (POM)** structure to adhere to **DRY (Don't Repeat Yourself)** principles and ensure maintainability.

```text
├── constants/
│   └── osapiensLocators.ts    # 🧠 Single Source of Truth: Centralized Selectors & Regex
├── pages/
│   ├── BasePage.ts            # 🏗️ Parent Class: Generic logic, Health Monitors, & Wrappers
│   └── OsapiensPage.ts        # 📄 Page Object: Specific Business Logic for Career Portal
├── TestPlan/
│   └── TestPlan.md            # 📘 Test Plan: Quality Guide and Strategy
├── tests/
│   └── OsapiensTest.spec.ts   # 🧪 Test Scenario: Clean, readable, and focused on workflow
├── .prettierrc                # 🌟 Code Formatting
├── .env                       # 🔐 Configuration: API Keys & Secrets
├── playwright.config.ts       # ⚙️ Framework Configuration
└── README.md                  # 📘 Documentation
```

## 🌟 Key Features & Technical Highlights

This framework embraces **advanced engineering practices** for real-world robustness rather than simple "happy path" automation.

### 1. 🏗️ Architecture & Inheritance (`BasePage`)
* **Inheritance Pattern:** All Page Objects extend a `BasePage`. This centralizes low-level browser interactions.
* **Agnostic Logic:** Generic methods like `clickIfVisible()` handle flaky elements (e.g., Cookie Banners) safely to prevent test crashes due to non-critical UI interruptions.
* **Modular Design:** The project uses a strict separation of concerns, moving logic out of the spec file and into dedicated `pages/` and `constants/` directories for better maintainability.

### 2. 🧩 Robust Locator Strategy
Hardcoded strings are eliminated in favor of resilience.
* **Centralized Constants:** All text patterns and selectors live in `constants/osapiensLocators.ts`.
* **Regex Support:** Handles internationalization (i18n) with dynamic selectors.
  * *Example:* `/view jobs|offene stellen/i`

### 3. 🛡️ Proactive Health Monitoring
The framework listens to the browser's internal events during execution to surface silent bugs.
* **Console Errors:** Automatically captures JavaScript exceptions.
* **Network Failures:** Monitors for silent API failures (4xx/5xx) even if the UI appears functional.
* **Result:** The test provides a "Session Health Report" at the end.

### 4. ⏱️ Performance SLA Checks
Functional correctness is not enough; speed matters.
* **SLA Check:** Measures the search operation duration.
* **Soft Assertions:** If the search takes **>3 seconds**, a warning is logged (SLA Breach), but the pipeline continues.

### 5. 📊 Reporting & Integration
* **TestRail Integration:** Results are mapped to TestRail (e.g., `C2342`) for full traceability.
* **Visual Evidence:** Screenshots are attached even for successful steps to ensure transparency.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** installed.

```bash
# Install dependencies
npm install
npx playwright install
```

### 2. Environment Configuration
Create a `.env` file in the root directory. This handles TestRail integration keys.

```
# TestRail Configuration 
TESTRAIL_USERNAME=***REDACTED_EMAIL***
TESTRAIL_API_KEY=***REDACTED_API_KEY***
TESTRAIL_PROJECT_ID=3
TESTRAIL_SUITE_ID=14
TESTRAIL_RUN_ID=29
TESTRAIL_HOST=https://osapiensss.testrail.io/
```
```bash
npm install dotenv --save-dev
```

---

## ▶️ Execution

### Run in Headed Mode (Recommended for Review)
To observe the browser interactions and the "Magic Injection" demo:

```bash
npx playwright test tests/osapiens.spec.ts --headed
```

### Run in Headless Mode (CI/CD)

```bash
npx playwright test
```

### View Reports

```bash
npx playwright show-report
```

---


## Code Formatting (Prettier)

This project uses [Prettier](https://prettier.io/) for automatic code formatting.

Why we use Prettier:

- Consistent code style across the whole codebase
- Less noise in code reviews (focus on logic, not formatting)
- Faster development with format-on-save / pre-commit hooks

Basic usage:

```bash
npx prettier . --write
```

---

## 🎩 Special Feature: DOM Injection

As a demonstration of advanced browser control, the final step of the test utilizes `page.evaluate()` to inject JavaScript directly into the browser context.

* **What it does:** Dynamically rewrites the CSS, Job Title, and "Apply" button to personalize them for the candidate ("MK").
* **Technical Value:** Demonstrates the ability to manipulate the DOM beyond standard WebDriver-style interactions, useful for mocking states or bypassing complex UI blockers.

<br>

<div align="center">
  <i>Crafted with ❤️ and TypeScript by <b>MK</b>.</i>
</div>