# Utility Portal Automation Example

This project demonstrates advanced Playwright automation for a generic utility portal, including both customer and admin flows. All sensitive data and URLs are managed via environment variables for security and portability.

## Features
- Batch automation for multiple addresses from `addresses.csv`
- Mobile (iPhone 15 Pro) emulation for customer flows
- Desktop automation for admin flows
- File upload, screenshots, and robust selectors
- Cross-platform: works on macOS and Windows
- No hardcoded credentials or URLs; all configuration via `.env`

## Project Structure
- `SPC.spec.js` — Main Playwright test (desktop)
- `SPCMobile.spec.js` — Playwright test for mobile/desktop split
- `SPC.executable.js` — Standalone Node.js script (mirrors test logic)
- `HELPmecancel.spec.js` — Admin batch cancel script
- `addresses.csv` — Input addresses for batch runs
- `test.pdf` — File to upload
- `screenshots/` — Output screenshots
- `run_spc1.command` — macOS double-click launcher
- `run_spc1.bat` — Windows double-click launcher
- `SPCMobileEMOJI.spec.js` — Playwright test for emoji name input (expected to fail, demonstrates negative testing)

## Setup
1. **Install Node.js** (https://nodejs.org/)
2. **Install dependencies:**
   ```sh
   npm install playwright dotenv
   ```
3. **(Optional) Install Playwright browsers:**
   ```sh
   npx playwright install
   ```
4. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your credentials and URLs.

## Usage
- **Run all tests (macOS/Terminal):**
  ```sh
  npx playwright test SPC1.spec.js
  npx playwright test SPCMobile.spec.js
  ```
- **Run the standalone script (macOS):**
  ```sh
  ./run_spc1.command
  ```
- **Run the standalone script (Windows):**
  Double-click `run_spc1.bat` or run:
  ```sh
  node SPC1.executable.js
  ```
- **Run the emoji test (for negative/edge case demonstration):**
  ```sh
  npx playwright test SPCMobileEMOJI.spec.js
  ```
  - This test is expected to fail, as the portal is not set up to handle emoji characters in names. Failure is a pass for this scenario.

## Notes
- Place your addresses in `addresses.csv` (one per line).
- Screenshots are saved in the `screenshots/` folder.
- All credentials and URLs are set via environment variables in `.env`.
- For mobile automation, the script uses iPhone 15 Pro emulation.
- For admin automation, a desktop browser context is used.

## Troubleshooting
- If you see infinite refresh or login issues, try running in headed mode:
  ```sh
  npx playwright test SPCMobile.spec.js --headed
  ```
- Make sure all dependencies are installed and browsers are up to date.
- If you encounter errors, check the Playwright output and adjust selectors as needed.

## Portfolio Notice
This is a generalized example based on real-world automation experience. All sensitive and proprietary information has been removed. No internal or client-specific data is present.

## License
For demonstration and educational use only.