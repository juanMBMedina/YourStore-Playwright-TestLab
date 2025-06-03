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

test.describe('Add to cart Suit case to Your Site Web Site', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);

    goToLogin(homePage, loginPage);
    logStep("3. Perform login with user credentials");
    await loginPage.expectLoginUrl();
    await loginPage.login(new UserLogin(userData.loginExistUser));
    await accountPage.expectAccountUrl(); 

  });

  test('YS-9 Validate the correct display of the product comparison message', async ({ page }) => {
    const productName : string = 'iMac';
    logStep(`4. Searching for the product ${productName} in the search bar`);
    await homePage.selectNavbarCategory('Desktops', 'Mac');
    // Validate the page title
    await homePage.validateCategory();
    logStep(`5. Adding the product ${productName} to the comparison list`);
    await homePage.compareProduct(productName);
    await homePage.validateComparisonSuccess(productName);
  });
});
