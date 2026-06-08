import { test, expect } from '@playwright/test';
//import fs from 'fs';

test('Verify the Transactions page Export button ', async ({ page }) => {

  const userName = 'admin';
  const password = 'admin123';

  await page.goto('https://www.qaplayground.com/bank');

  await page.locator('#username').fill(userName);
  await page.locator('#password').fill(password);

  await page.locator('#login-btn').click();

  await expect(page).toHaveURL(/\/bank\/dashboard$/);

  await expect(page.locator('#page-title')).toContainText('Dashboard');

  await page.getByTestId('nav-transactions').click();
  await expect(page).toHaveURL(/\/bank\/transactions$/);
  const title = await page.title();
  console.log("page title" + title);
  //await expect(page.locator('#page-title')).includes('Transaction');
  const exportButton = page.getByTestId('export-button');


  // download event

  /*const downloadPromise = page.waitForEvent('download');
  //await page.getByText('Download file').click();
  await exportButton.click();
  const download = await downloadPromise; */

  const [download] =
    await Promise.all([

      page.waitForEvent(
        'download'
      ),

      exportButton.click()

    ]);

  // Wait for the download process to complete and save the downloaded file somewhere.
  const filePath =
    'C:/Santhiya/Automation/Playwright_workspaces/Plawright_practice1/test-results/' +
    download.suggestedFilename();

  await download.saveAs(filePath);
  console.log(
    'Downloaded file path:',
    filePath
  );

  // Validate CSV extension

  expect(
    download.suggestedFilename()
  ).toMatch(/\.csv$/);

  // Validate file exists

  // expect(
  //   fs.existsSync(filePath)
  // ).toBeTruthy();

  const toastMessage = page.locator('text=Transactions exported successfully!');
  //await toastMessage.waitFor({ state: "visible" });

  await expect(toastMessage).toBeVisible();

  await expect(toastMessage)
    .toContainText(
      'Transactions exported successfully!'
    );

  // Toast disappears

  await expect(toastMessage)
    .toBeHidden();


});

// verify no transactions details

test.only(
  'Verify transactions page when no transactions exist',

  async ({ page }) => {

    // Login
    const userName = 'admin';
    const password = 'admin123';

    let fromDateValue = `May 24th, 2026`;
    let toDateValue = `May 26th, 2026`;

    await page.goto('https://www.qaplayground.com/bank');

    await page.locator('#username').fill(userName);
    await page.locator('#password').fill(password);

    await page.locator('#login-btn').click();

    await expect(page).toHaveURL(/\/bank\/dashboard$/);

    await expect(page.locator('#page-title')).toContainText('Dashboard');

    // Open transactions page

    await page.getByTestId('nav-transactions').click();
    await expect(page).toHaveURL(/\/bank\/transactions$/);
    console.log('Page title:', await page.title());

    // FROM DATE

    const fromDatePicker = page.getByTestId('date-from-input');
    await fromDatePicker.click();
    // const datePickerCalendar = page.getByTestId('date-picker-calendar');

    const datePickerCalendar = page.locator(
      '[data-testid="date-picker-calendar"][data-state="open"]'
    );
    await expect(datePickerCalendar).toBeVisible();


    const fromDateSelectorCell = datePickerCalendar.locator(
      `[aria-label*="${fromDateValue}"]`
    );
    await fromDateSelectorCell.click();

    // To  DATE

    const toDatePicker = page.getByTestId('date-to-input');
    await toDatePicker.click();
    await expect(datePickerCalendar).toBeVisible();

    const toDateSelectorCell = datePickerCalendar.locator(
      `[aria-label*="${toDateValue}"]`
    );
    await toDateSelectorCell.click();

    /*await selectDate(
     page.getByTestId('date-from-input'),
     fromDateValue, page
   );
   await selectDate(
     page.getByTestId('date-to-input'),
     toDateValue, page
   ); */

 const applyButton = page.getByTestId('apply-filters-button');
 applyButton.click();
    // Validate 'No transactions message'
    const tableBody = page.locator(
      '#transactions-table tbody'
    );

    await expect(tableBody)
      .toContainText('No transactions found');

  }
);


/*async function selectDate(dateInput, dateValue, page) {

  await dateInput.click();

  const openCalendar = page.locator(
    '[data-testid="date-picker-calendar"][data-state="open"]'
  );

  await expect(openCalendar).toBeVisible();

  await openCalendar
    .locator(`[aria-label*="${dateValue}"]`)
    .click();
} */