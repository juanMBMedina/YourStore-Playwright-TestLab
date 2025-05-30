import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/Home';
import { LoginPage } from '../src/pages/Login';
import { UserLogin } from '../src/models/UserLogin';
import userData from '../resources/files/dataLoginFeature.json';
import { AccountPage } from '../src/pages/Account';
test.describe('YS-5: Validate login functionality for a user with correct credentials', () => {
  test(
    'Should login successfully with valid user credentials',
    async ({ page }) => {
      // Test Description: Validate login for a user with correct credentials
      // Steps:
      // 1. Go to the main page
      // 2. Go to login section
      // 3. Fill the form with correct data
      // 4. Validate the user is logged in and sees the welcome message
      // Traceability: Test Case ID YS-5 (from test plan)

      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const user = new UserLogin(
        userData.loginExistUser.email,
        userData.loginExistUser.password
      );

      // 1. Go to the main page
      await homePage.goto();
      await homePage.expectHomeUrl();

      // 2. Go to login section
      await homePage.gotoLoginPage();
      await loginPage.expectLoginUrl();

      // 3. Fill the form with correct data
      await loginPage.login(user);

      // 4. Validate the user is logged in and sees the welcome message
      await accountPage.expectAccountUrl();
      await accountPage.expectWelcomeMessage();
    }
  );
});
