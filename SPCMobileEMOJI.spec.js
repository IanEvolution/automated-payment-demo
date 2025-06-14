import 'dotenv/config';
const eportalEmail = process.env.EPORTAL_EMAIL;
const eadminUser = process.env.EADMIN_USERNAME;
const eadminPassword = process.env.EADMIN_PASSWORD;

const eportalUrl = process.env.EPORTAL_URL;
const eadminUrl = process.env.EADMIN_URL;

import { test, expect, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
test.use({ ...devices['iPhone 15 Pro'], browserName: 'chromium' });
const nameVar = ['😀', '🚀', '🍕']

// Read all addresses from addresses.csv
const csvPath = path.join(__dirname, 'addresses.csv');
let addresses = [];
try {
  const data = fs.readFileSync(csvPath, 'utf8');
  addresses = data.split(/\r?\n/).filter(Boolean).map(line => line.split(',')[0].trim());
  if (addresses.length === 0) {
    throw new Error('addresses.csv is empty.');
  }
} catch (e) {
  throw new Error('Could not read address from addresses.csv: ' + e.message);
}

// Only run as many tests as the smaller of addresses.length and nameVar.length
const testCount = Math.min(addresses.length, nameVar.length);
for (let i = 0; i < testCount; i++) {
  const userAddress = addresses[i];
  const char = nameVar[i];
  test(`test for address ${userAddress} with name variation ${char}`, async ({ page, browser }) => {
    // --- MOBILE ePortal (iPhone 15 Pro emulation) ---
    // Already using iPhone 15 Pro emulation for this test file
    await page.goto(eportalUrl);
    await page.getByRole('link', { name: 'MENU' }).click();
    await page.getByRole('link', { name: 'Moving Services' }).click();
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.getByRole('textbox', { name: 'Address' }).click();
    await page.getByRole('textbox', { name: 'Address' }).fill(userAddress);
    await page.getByRole('link', { name: `${userAddress}` }).click();
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).click();
    await page.getByText('27', { exact: true }).click();
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill(`TESTER${char}`);
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill('lastname');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(eportalEmail);
    await page.getByRole('textbox', { name: 'PIN' }).click();
    await page.getByRole('textbox', { name: 'PIN' }).fill('1111');
    await page.getByRole('textbox', { name: 'Phone Number' }).click();
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('1234567890');
    await page.locator('#file1').click();
    await page.locator('#file1').setInputFiles('test.pdf');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `screenshots/SPC${i+1}-1.png` });
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `screenshots/SPC${i+1}-2.png` });
    await page.getByRole('button', { name: 'Submit' }).click();
    // meant to fail here, as the ePortal is not set up to handle emoji characters in names
  });
}

// npx playwright test SPCMobileEMOJI.spec.js --debug