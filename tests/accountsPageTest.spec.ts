import { test, expect } from "@playwright/test";

test("Verify that the user can navigate to the accounts page and accounts table is loaded properly", async ({ page }) => {
  const userName = 'admin';
  const password = 'admin123';

  await page.goto('https://www.qaplayground.com/bank');

  await page.locator('#username').fill(userName);
  await page.locator('#password').fill(password);

  await page.locator('#login-btn').click();

  await expect(page).toHaveURL(/\/bank\/dashboard$/);

  await expect(page.locator('#page-title')).toContainText('Dashboard');


  await page.getByTestId('nav-accounts').click();
  await expect(page).toHaveURL(/\/bank\/accounts$/);
  await expect(page.locator('#page-title')).toContainText('Accounts');

  const yourbBankAccountsContainer = page.locator('#accounts-table-wrapper');
  yourbBankAccountsContainer.waitFor();
  await expect(yourbBankAccountsContainer).toBeVisible();
  console.log('Your Bank Accounts container is visible');
  const accountsTable = yourbBankAccountsContainer.locator('table');
  const accountsTableColumns = accountsTable.locator('thead tr th');
  const accountsTableRows = accountsTable.locator('tbody tr');
  const rowCount = await accountsTableRows.count();
  console.log('Number of rows in the accounts table: ' + rowCount);
  await expect(accountsTableColumns).toHaveCount(6);
  expect(rowCount).toBeGreaterThan(0);
  const expectedColumnNames = ['Account Number', 'Account Name', 'Type', 'Balance', 'Status', 'Actions'];
  for (let i = 0; i < expectedColumnNames.length; i++) {
    await expect(accountsTableColumns.nth(i)).toHaveText(expectedColumnNames[i]);
    console.log(`Column ${i + 1} has the correct text: ${expectedColumnNames[i]}`);
  }
  console.log('All columns have the correct text');

  const accountName = accountsTableRows.locator("[data-testid='account-name'] a").first();
  const accountNameText = await accountName.textContent();
  console.log('Account Name: ' + accountNameText);
  expect(accountNameText).not.toBeNull();

});

// Test 2: Scenario 2 verify Quick add account modal 

test('Scenario 2: Verify that the user can open the Quick Add Account modal and the form fields are displayed correctly', async ({ page }) => {
  const userName = 'admin';
  const password = 'admin123';

  await page.goto('https://www.qaplayground.com/bank');
  await page.locator('#username').fill(userName);
  await page.locator('#password').fill(password);
  await page.locator('#login-btn').click();
  await expect(page).toHaveURL(/\/bank\/dashboard$/);
  await expect(page.locator('#page-title')).toContainText('Dashboard');
  await page.getByTestId('quick-add-account').click();

  const quickAddAccountModal = page.locator('#account-modal');

  quickAddAccountModal.waitFor();
  await expect(quickAddAccountModal).toBeVisible();

  const accountFormSection = page.locator("[data-testid='account-form'] div");
  const accountName = accountFormSection.locator('#account-name-field');
  await expect(accountName).toBeVisible();
  const cancelButton = page.getByRole('button',{name:'Cancel'});
  await expect(cancelButton).toBeEnabled()
  await cancelButton.click({ timeout: 10000 });

}
);
