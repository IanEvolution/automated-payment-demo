const eadminUser = process.env.EADMIN_USERNAME;
const eadminPassword = process.env.EADMIN_PASSWORD;

const eadminUrl = process.env.EADMIN_URL;

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto(eadminUrl);
    await page.getByRole('textbox', { name: 'Username:' }).click();
    await page.getByRole('textbox', { name: 'Username:' }).fill(eadminUser);
    await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password:' }).fill(eadminPassword);
    await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
    await page.getByRole('link', { name: ' Customer Requests ' }).click();
    await page.getByRole('link', { name: 'Contact Requests' }).click();
    // Loop from 598 to 617
    for (let id = 649; id <= 651; id++) {
        await page.getByRole('gridcell', { name: 'Status: activate to sort' }).click();
        await page.getByRole('gridcell', { name: 'Status: activate to sort' }).click();
        await page.getByRole('link', { name: String(id) }).click();
        await page.getByText('Cancel Request').click();
        await page.getByRole('button', { name: 'OK' }).click();
        // Go back to the list after canceling
        // Optionally, add a wait or navigation step if needed
    }
});

//code to run: npx playwright test HELPmecancel.spec.js