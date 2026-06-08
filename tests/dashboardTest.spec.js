const {test, expect} = require ('@playwright/test');

test ('Scenario 1: Skeleton loading state appears on page load when data renders test', async ({
  page,
}) => {
  const userName = 'admin';
  const password = 'admin123';

  // Delay dashboard API response
  //await page.route('**/api/dashboard*', async route => {
  //await new Promise(res => setTimeout(res, 2000));
  //console.log(route.request().url());
  //await route.continue();
  //});

  await page.goto ('https://www.qaplayground.com/bank');
  const usernameInput = page.locator ('#username');
  await usernameInput.fill (userName);

  const passwordInput = page.locator ('#password');
  await passwordInput.fill (password);

  const loginButton = page.locator ('#login-btn');
  await loginButton.click ();
  await expect (page).toHaveURL ('https://www.qaplayground.com/bank/dashboard');
  const page_title = page.locator ('#page-title');
  await expect (page_title).toContainText ('Dashboard');

  //Immediately assert data-loading='true' on id='dashboard-page-container'
  const dashboardContainer = page.locator ('#dashboard-page-container');
  await expect (dashboardContainer).toHaveAttribute ('data-loading', 'true');

  //skeleton placeholder should be visible

  //await page.pause();
  //const skeletonPlaceholder = page.getByTestId('skeleton-placeholder');
  //console.log(await skeletonPlaceholder.count());

  //await expect(skeletonPlaceholder).toBeVisible();

  //Wait for data-loading='false' on id='dashboard-page-container' (max 2s)
  await dashboardContainer.waitFor ();
  await expect (dashboardContainer).toHaveAttribute ('data-loading', 'false');

  //Assert data-testid='total-balance-card' is visible and contains a dollar amount
  const totalBalanceCard = page.getByTestId ('total-balance-card');
  await expect (totalBalanceCard).toBeVisible ();
  await expect (totalBalanceCard).toContainText ('$');

  //Assert data-testid='accounts-count-card' is visible with a numeric value
  const accountsCountCard = page.locator (
    '[data-testid="accounts-count-card"]'
  );
  await expect (accountsCountCard).toBeVisible ();
  await expect (accountsCountCard).toContainText (/\d+/);

  //Assert data-testid='transactions-count-card' is visible with a numeric value
  const transactionsCountCard = page.locator (
    '[data-testid="transactions-count-card"]'
  );
  await expect (transactionsCountCard).toBeVisible ();
  await expect (transactionsCountCard).toContainText (/\d+/);
});

// Scenario 2 stat card values match with actual account and trnsactions data
test (
  'Scenario 2: Dashboard stat card values match with actual account and transactions data',
  async ({page}) => {
    const userName = 'admin';
    const password = 'admin123';

    await page.goto ('https://www.qaplayground.com/bank');
    const usernameInput = page.locator ('#username');
    await usernameInput.fill (userName);

    const passwordInput = page.locator ('#password');
    await passwordInput.fill (password);

    const loginButton = page.locator ('#login-btn');
    await loginButton.click ();
    // await expect (page).toHaveURL('https://www.qaplayground.com/bank/dashboard');
    //await expect (page).toHaveURL ('*/bank/dashboard');
    await expect (page).toHaveURL (/dashboard/);
    const page_title = page.locator ('#page-title');
    await expect (page_title).toContainText ('Dashboard');

    //Immediately assert data-loading='true' on id='dashboard-page-container'
    const dashboardContainer = page.locator ('#dashboard-page-container');
    await expect (dashboardContainer).toHaveAttribute ('data-loading', 'true');

    //Wait for data-loading='false' on id='dashboard-page-container' (max 2s)

    //await expect (dashboardContainer).toHaveAttribute ('data-loading', 'false');
    await expect (
      dashboardContainer
    ).toHaveAttribute ('data-loading', 'false', {
      timeout: 6000,
    });

    //Assert data-testid='total-balance-card' is visible and contains a dollar amount
    await page.waitForSelector ('[data-testid="total-balance-card"]');
    const balanceCard = page.locator ('#total-balance-card-content');
    const totalBalance = balanceCard.locator ('[data-testid="total-balance"]');
    //const totalBalance = page.getByTestId ('total-balance');
    // Wait until dashboard finishes rendering
    // and a valid numeric balance appears

    // Wait until balance stops changing

    let previousValue = 0;
    let currentValue = 0;

    await expect
      .poll (
        async () => {
          previousValue = currentValue;

          const text = await totalBalance.innerText ();

          currentValue = parseFloat (text.replace (/[^0-9.-]+/g, ''));

          console.log ('Current dashboard balance:', currentValue);

          return currentValue === previousValue;
        },
        {
          timeout: 10000,
        }
      )
      .toBe (true);

    // get the total card balance after the value stabilizes
    const totalBalanceText = await totalBalance.innerText ();
    console.log (totalBalanceText + ':  Total from card');

    const totalBalanceValue = parseFloat (
      totalBalanceText.replace (/[^0-9.-]+/g, '')
    );
    console.log (
      totalBalanceValue + ' total balance text value from card in float'
    );
    // let totalBalanceValue = 7500;
    await page.goto ('https://www.qaplayground.com/bank/accounts');
    await page.waitForSelector ('.relative.w-full.overflow-auto');
    const accountsTable = page.locator ('#accounts-table');
    await accountsTable.waitFor ();

    const accountsTable_rows = accountsTable.locator ('tbody tr');

    console.log (
      (await accountsTable_rows.count ()) + ' total rows in accounts table'
    );

    let totalBalanceFromTable = 0;

    for (let i = 0; i < (await accountsTable_rows.count ()); i++) {
      const balanceCell = accountsTable_rows
        .nth (i)
        .locator ("[data-testid='account-balance']");

      const text = await balanceCell.textContent ();
      console.log (
        text + ' Text:  balance value from accounts table row ' + (i + 1)
      );

      const text1 = await balanceCell.innerText ();
      console.log (
        text1 + ' Text1:  balance value from accounts table row ' + (i + 1)
      );

      const text2 = await balanceCell.allInnerTexts ();
      console.log (
        text2 + ' Text2:  balance value from accounts table row ' + (i + 1)
      );

      const balanceValue = parseFloat (text1.replace (/[^0-9.-]+/g, ''));
      totalBalanceFromTable += balanceValue;

      console.log (
        balanceValue +
          ' balance value in float from accounts table row ' +
          (i + 1)
      );
      expect (balanceValue).toBeGreaterThanOrEqual (0);
    }

    console.log (
      totalBalanceFromTable +
        ' total balance value from accounts table in float'
    );

    //Assert total balance from card matches with total balance calculated from accounts table
    expect (totalBalanceValue).toBeCloseTo (totalBalanceFromTable, 2);
    await page.pause ();
  }
);

// Test 3: Quick check on the page navigations on dashboard and accounts page and verify the modals open on clicking quick add buttons
test ('Scenario 3: Verify Page navigations on dashboard and accounts page- test', async ({
  page,
}) => {
  const userName = 'admin';
  const password = 'admin123';

  await page.goto ('https://www.qaplayground.com/bank');
  const usernameInput = page.locator ('#username');
  await usernameInput.fill (userName);

  const passwordInput = page.locator ('#password');
  await passwordInput.fill (password);

  const loginButton = page.locator ('#login-btn');
  await loginButton.click ();
  await expect (page).toHaveURL ('https://qaplayground.com/bank/dashboard');
  const page_title = page.locator ('#page-title');
  await expect (page_title).toContainText ('Dashboard');

  // Click on quick add account button and verify it navigates to accounts page and opens add account modal

  const quickAddAccountButton = page.getByTestId ('quick-add-account');
  await expect (quickAddAccountButton).toBeVisible ();
  await quickAddAccountButton.click ();

  await expect (page).toHaveURL (/.*\/bank\/accounts/);
  const addAccountModal = page.getByTestId ('account-modal');
  await expect (addAccountModal).toBeVisible ();
  // navigate back to Dashboard

  await page.goto ('https://www.qaplayground.com/bank/dashboard');
  // verify quick add transaction button is visible and click on it and verify it opens add transaction modal
  const quickNewTransactionButton = page.getByTestId ('quick-new-transaction');
  await expect (quickNewTransactionButton).toBeVisible ();
  await quickNewTransactionButton.click ();

  await expect (page).toHaveURL (/.*\/bank\/transactions/);
  const newTransactionModal = page.getByTestId ('transaction-modal');
  await expect (newTransactionModal).toBeVisible ();
});

// Test the  recent transactions page
test ('Scenario 4: Verify Recent transactions page- test', async ({page}) => {
  const userName = 'admin';
  const password = 'admin123';

  await page.goto ('https://www.qaplayground.com/bank');

  await page.locator ('#username').fill (userName);
  await page.locator ('#password').fill (password);

  await page.locator ('#login-btn').click ();

  await expect (page).toHaveURL (/\/bank\/dashboard$/);

  await expect (page.locator ('#page-title')).toContainText ('Dashboard');

  // Recent transactions table validation

  const recentTransactionsTable = page.getByTestId (
    'recent-transactions-table'
  );

  const rows = recentTransactionsTable.locator ('tbody tr');

  // Wait for first row
  await expect (rows.first ()).toBeVisible ();
  const numberOfRows = await rows.count ();

  console.log (numberOfRows + ' total rows in recent transactions table');

  expect (numberOfRows).toBeGreaterThanOrEqual (1);
  expect (numberOfRows).toBeLessThanOrEqual (5);
  await page.pause ();
  for (let i = 0; i < numberOfRows; i++) {
    const row = rows.nth (i);
    console.log ('Validating row inside the loop: ' + (i + 1));

    const date = row.locator ('td').nth (0);
    const type = row.locator ('td').nth (1);
    const account = row.locator ('td').nth (2);
    const amount = row.locator ('td').nth (3);
    const status = row.locator ('td').nth (4);

    await expect (date).toBeVisible ();

    await expect (type).toBeVisible ();

    await expect (account).toBeVisible ();

    await expect (amount).toBeVisible ();
    await expect (amount).toContainText (/\$/);

    await expect (status).toBeVisible ();
    await expect (status).toContainText ('Completed');
  }
});
