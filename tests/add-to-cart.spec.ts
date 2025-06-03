import { test } from '@playwright/test';
import { HomePage } from '../src/pages/Home';
import { LoginPage } from '../src/pages/Login';
import { goToLogin, logStep } from '../src/utils/auth-utils';
import { UserLogin } from '../src/models/UserLogin';
import { AccountPage } from '../src/pages/Account';
import userData from "../resources/files/dataLoginFeature.json";

let homePage: HomePage;
let loginPage: LoginPage;
let accountPage: AccountPage;

test.describe('Your Site Web Page: Add to Cart Feature', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);

    await goToLogin(homePage, loginPage);

    logStep("Log in with valid user credentials");
    await loginPage.expectLoginUrl();
    await loginPage.login(new UserLogin(userData.loginExistUser));
    await accountPage.expectAccountUrl(); 
  });

  test('YS-9: Should show a confirmation message when adding a product to comparison', async ({ page }) => {
    const productName: string = 'iMac';

    logStep(`Search and navigate to category containing ${productName}`);
    await homePage.selectNavbarCategory('Desktops', 'Mac');
    await homePage.validateCategory();

    logStep(`Add ${productName} to comparison list`);
    await homePage.compareProduct(productName);

    logStep(`Validate comparison success message for ${productName}`);
    await homePage.validateComparisonSuccess(productName);
  });
});
