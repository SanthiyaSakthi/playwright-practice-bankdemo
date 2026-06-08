const {test, expect} = require('@playwright/test');

test('Scenario 1: Login test', async ({page}) => {

  const userName = 'admin';
  const password = 'admin123';


await page.goto('https://www.qaplayground.com/bank');
const usernameInput = page.locator('#username');
await usernameInput.fill(userName);

const passwordInput = page.locator('#password');
await passwordInput.fill(password);

const loginButton = page.locator('#login-btn');
await loginButton.click();
await expect(page).toHaveURL('https://www.qaplayground.com/bank/dashboard');
const page_title = page.locator('#page-title');
await expect(page_title).toContainText('Dashboard');


});
// INvalid credentials scenarios

test('Scenario 2: Login test with invalid credentials', async ({page}) => {

  const userName = 'wrong';
  const password = 'wrong123';


await page.goto('https://www.qaplayground.com/bank');
const usernameInput = page.locator('#username');
await usernameInput.fill(userName);

const passwordInput = page.locator('#password');
await passwordInput.fill(password);

const loginButton = page.locator('#login-btn');
await loginButton.click();

const errorMessage = page.locator('#alert-message');
await expect(errorMessage).toBeVisible();
await expect(errorMessage).toContainText('Invalid username or password. Please try again.');
await expect(page).toHaveURL('https://www.qaplayground.com/bank');

});

// Scenarios 3: Login Test - Toggle Password Visibility

test('Scenario 3: Login Test - Toggle Password Visibility', async ({page}) => {
  const password = 'wrong123';
  await page.goto('https://www.qaplayground.com/bank');
  const passwordInput = page.locator('#password');
await passwordInput.fill(password);
  await expect(passwordInput).toHaveAttribute('type', 'password');
  const togglebutton = page.getByTestId('toggle-password-btn');
  await togglebutton.click();
  await expect(passwordInput).toHaveAttribute('type', 'text');
  await togglebutton.click();
  await expect(passwordInput).toHaveAttribute('type', 'password');
});

// Scenario 4: Login Test - Pressing enter in password field should trigger login

test ('Scenario 4: Login Test - Pressing enter in password field should trigger login', async ({page}) => {
  

  const userName = 'admin';
  const password = 'admin123';


await page.goto('https://www.qaplayground.com/bank');
const usernameInput = page.locator('#username');
await usernameInput.fill(userName);

const passwordInput = page.locator('#password');
await passwordInput.fill(password);
await passwordInput.press('Enter');
await expect(page).toHaveURL('https://www.qaplayground.com/bank/dashboard');
const page_title = page.locator('#page-title');
await expect(page_title).toContainText('Dashboard');
});

// Scenario 5: Login Test -  Verify the Readonly viewer login grants restricted access

test('Scenario 5: Login Test -  Verify the Readonly viewer login grants restricted access', async ({page}) => {

  const userName = 'viewer';
  const password = 'viewer123';


await page.goto('https://www.qaplayground.com/bank');
const usernameInput = page.locator('#username');
await usernameInput.fill(userName);

const passwordInput = page.locator('#password');
await passwordInput.fill(password);
await passwordInput.press('Enter');
await expect(page).toHaveURL('https://www.qaplayground.com/bank/dashboard');
const viewer_Badge = page.getByTestId('viewer-badge');
await expect(viewer_Badge).toBeVisible();
await expect(viewer_Badge).toHaveText('Read-only');


});