import {test, expect} from '@playwright/test';

// Verify pinned account section on dashboard page and validate drag and drop

test (
  'Scenario 5: Verify pinned account section and drag and drop functionality',
  async ({page}) => {
    const userName = 'admin';
    const password = 'admin123';

    await page.goto ('https://www.qaplayground.com/bank');

    await page.locator ('#username').fill (userName);
    await page.locator ('#password').fill (password);

    await page.locator ('#login-btn').click ();

    await expect (page).toHaveURL (/\/bank\/dashboard$/);

    await expect (page.locator ('#page-title')).toContainText ('Dashboard');

    const pinnedAccountsSection = page.getByTestId ('pinned-accounts-section');
    await expect (pinnedAccountsSection).toBeVisible ();
    const draggableAccounts = page.getByTestId (/^draggable-account/);
    await expect (draggableAccounts.first ()).toBeVisible ();

    const count = await draggableAccounts.count ();
    console.log (count + ' total draggable accounts available');
    expect (count).toBeGreaterThanOrEqual (2);

    for (let i = 0; i < count; i++) {
      const account = draggableAccounts.nth (i);
      await expect (account).toHaveAttribute ('draggable', 'true');
      console.log ('Account ' + (i + 1) + ' is draggable');
    }
    const firstAccount = draggableAccounts.first ();
    const secondAccount = draggableAccounts.nth (1);
    await expect (secondAccount).toBeVisible ();

    // Capture initial order

    const firstAccountTextBefore = await firstAccount.innerText ();

    const secondAccountTextBefore = await secondAccount.innerText ();

    console.log ('Before drag first account:', firstAccountTextBefore);

    console.log ('Before drag second account:', secondAccountTextBefore);

    // Perform drag simultaneously
    await firstAccount.dragTo (secondAccount);

    await expect (firstAccount).toBeVisible ();

    await page.waitForTimeout (2000);

    await page.reload ();

    await expect (page.locator ('#page-title')).toContainText ('Dashboard');

    // Re-locate after reload

    const draggableAccountsAfterReload = page.getByTestId (
      /^draggable-account/
    );

    // Capture new order

    const firstAccountTextAfterReload = await draggableAccountsAfterReload
      .first ()
      .innerText ();

    const secondAccountTextAfterReload = await draggableAccountsAfterReload
      .nth (1)
      .innerText ();

    console.log ('After reload first account:', firstAccountTextAfterReload);

    console.log ('After reload second account:', secondAccountTextAfterReload);

    expect (firstAccountTextAfterReload).toContain (
      secondAccountTextBefore.trim ()
    );

    expect (secondAccountTextAfterReload).toContain (
      firstAccountTextBefore.trim ()
    );
  }
);
