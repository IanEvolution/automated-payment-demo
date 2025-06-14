#!/usr/bin/env node
import 'dotenv/config';
const eportalEmail = process.env.EPORTAL_EMAIL;
const eadminUser = process.env.EADMIN_USERNAME;
const eadminPassword = process.env.EADMIN_PASSWORD;

const eportalUrl = process.env.EPORTAL_URL;
const eadminUrl = process.env.EADMIN_URL;

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const nameVar = ['!', "'", '&', '(', ')', '/', '.', '\\', '@', '=', '+', '-', '"', ':'];

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

const testCount = Math.min(addresses.length, nameVar.length);

(async () => {
  for (let i = 0; i < testCount; i++) {
    const userAddress = addresses[i];
    const char = nameVar[i];
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1600, height: 1200 });
    // eportal run s
    await page.goto(eportalUrl);
    await page.getByRole('banner').getByRole('link', { name: 'Moving Services' }).click();
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
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `screenshots/SPC${i+1}-1.png` });
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.screenshot({ path: `screenshots/SPC${i+1}-2.png` });
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `screenshots/SPC${i+1}-3.png` });
    await page.getByRole('button', { name: 'Return to Login' }).click();


    // eAdmin run
    await page.goto(eadminUrl);
    await page.getByRole('textbox', { name: 'Username:' }).click();
    await page.getByRole('textbox', { name: 'Username:' }).fill(eadminUser);
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill(eadminPassword);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('link', { name: ' Customer Requests ' }).click();
    await page.getByRole('link', { name: 'Contact Requests' }).click();
    await page.getByRole('gridcell', { name: 'Last Updated: activate to' }).click();
    await page.getByRole('gridcell', { name: 'Last Updated: activate to' }).click();
    const addressParts = userAddress.split(' ');
    const streetNumber = addressParts[0];
    const direction = addressParts[1];
    const partialMatch = `${streetNumber} ${direction}`;
    const row = await page.getByRole('row', { name: new RegExp(partialMatch, 'i') });
    await row.getByRole('link').nth(1).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `screenshots/SPC${i+1}-4.png` });
    await page.getByText('Complete Request').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await browser.close();
  }

  // Add one more test with a different tester name (e.g., '"TESTER') for the last address in the CSV
  if (addresses.length > 0) {
    const userAddress = addresses[addresses.length - 1];
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1600, height: 1200 });
    await page.goto(eportalUrl);
    await page.getByRole('banner').getByRole('link', { name: 'Moving Services' }).click();
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.getByRole('textbox', { name: 'Address' }).click();
    await page.getByRole('textbox', { name: 'Address' }).fill(userAddress);
    await page.getByRole('link', { name: `${userAddress}` }).click();
    await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).click();
    await page.getByText('27', { exact: true }).click();
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('"TESTER');
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
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `screenshots/SPC-custom-1.png` });
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.screenshot({ path: `screenshots/SPC-custom-2.png` });
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `screenshots/SPC-custom-3.png` });
    await page.getByRole('button', { name: 'Return to Login' }).click();
    // eAdmin run
    await page.goto(eadminUrl);
    await page.getByRole('textbox', { name: 'Username:' }).click();
    await page.getByRole('textbox', { name: 'Username:' }).fill(eadminUser);
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill(eadminPassword);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('link', { name: ' Customer Requests ' }).click();
    await page.getByRole('link', { name: 'Contact Requests' }).click();
    await page.getByRole('gridcell', { name: 'Last Updated: activate to' }).click();
    await page.getByRole('gridcell', { name: 'Last Updated: activate to' }).click();
    const addressParts = userAddress.split(' ');
    const streetNumber = addressParts[0];
    const direction = addressParts[1];
    const partialMatch = `${streetNumber} ${direction}`;
    const row = await page.getByRole('row', { name: new RegExp(partialMatch, 'i') });
    await row.getByRole('link').nth(1).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `screenshots/SPC-custom-4.png` });
    await page.getByText('Complete Request').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await browser.close();
  }
})();

