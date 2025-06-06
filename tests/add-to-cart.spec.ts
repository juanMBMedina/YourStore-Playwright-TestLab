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

async function setupShoppingCart(homePage: HomePage, productName: string) {
  logStep(`Search and navigate to category containing ${productName}`);
  await homePage.selectNavbarCategory('Desktops', 'Show All Desktops');
  await homePage.validateCategory();

  logStep(`Add ${productName} to shopping cart`);
  await homePage.addToCart(productName);

  logStep(`Validate success message for adding ${productName} to shopping cart`);
  await homePage.validateAddToCartSuccess(productName);

  logStep('Navigate to shopping cart');
  await homePage.goToShoppingCart();

  logStep(`Validate ${productName} exists in shopping cart`);
  await homePage.validateProductInTable(productName);
}

test.describe('Your Site Web Page: Add to Cart Feature', () => {
  const productName = 'Sony VAIO';

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

  test('YS-12: Should validate product added to shopping cart', async ({ page }) => {
    const productName: string = 'Sony VAIO';
    await setupShoppingCart(homePage, productName);
  });

  test('YS-13: Should validate product removed from shopping cart', async ({ page }) => {
    const productName: string = 'Sony VAIO';
    await setupShoppingCart(homePage, productName);

    logStep(`Remove ${productName} from shopping cart`);
    await homePage.removeItemFromTable(productName);

    logStep(`Validate ${productName} is removed from shopping cart`);
    await homePage.validateItemRemovedFromTable(productName);
  });
});
