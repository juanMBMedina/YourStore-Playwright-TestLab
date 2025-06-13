import { test } from "@playwright/test";
import { HomePage } from "../src/pages/Home";
import { LoginPage } from "../src/pages/Login";
import { goToLogin, logStep } from "../src/utils/auth-utils";
import { UserLogin } from "../src/models/UserLogin";
import { AccountPage } from "../src/pages/Account";
import { Product } from "../src/models/Product";
import userData from "../resources/files/dataLoginFeature.json";
import dataAddToCartFeature from "../resources/files/dataAddToCartFeature.json";

let homePage: HomePage;
let loginPage: LoginPage;
let accountPage: AccountPage;

async function searchProduct(homePage: HomePage, product: Product) {
  logStep(`Search and navigate to category containing ${product.name}`);
  await homePage.selectNavbarCategory(product.category, product.subcategory);
}

async function setupShoppingCart(homePage: HomePage, product: Product) {
  searchProduct(homePage, product);

  logStep(`Add ${product.name} to shopping cart`);
  await homePage.addToCart(product.name);

  logStep(
    `Validate success message for adding ${product.name} to shopping cart`
  );
  await homePage.validateAddToCartSuccess(product.name);

  logStep("Navigate to shopping cart");
  await homePage.goToShoppingCart();

  logStep(`Validate ${product.name} exists in shopping cart`);
  await homePage.validateProductInTable(product.name);
}

async function setupWhisList(homePage: HomePage, product: Product) {
  searchProduct(homePage, product);

  logStep(`Add ${product.name} to favorites list`);
  await homePage.addToWishList(product.name);
  await homePage.validateWishListSuccess(product.name);

  logStep("Navigate to Wish List");
  await homePage.goToWishList();

  logStep(`Validate ${product.name} exists in favorites list`);
  await homePage.validateProductInTable(product.name);
}

test.describe("Your Site Web Page: Add to Cart Feature", () => {
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

  test("YS-9: Should show a confirmation message when adding a product to comparison", async ({
    page,
  }) => {
    const product = new Product(dataAddToCartFeature.comparisonItem);

    logStep(`Search and navigate to category containing ${product.name}`);
    searchProduct(homePage, product);

    logStep(`Add ${product.name} to comparison list`);
    await homePage.compareProduct(product.name);

    logStep(`Validate comparison success message for ${product.name}`);
    await homePage.validateComparisonSuccess(product.name);
  });


  test("YS-10: Validate the selection of a favorite product", async ({ page }) => {
    const product = new Product(dataAddToCartFeature.wishListItem);
    await setupWhisList(homePage, product);
  });

  test("YS-11: Validate the removal of a favorite product", async ({ page }) => {
    const product = new Product(dataAddToCartFeature.wishListItem);
    await setupWhisList(homePage, product);

    logStep("Remove product from favorites");
    await homePage.removeItemFromTable(product.name);

    logStep("Validate product is removed from favorites list");
    await homePage.validateItemRemovedFromTable(product.name);
  });

  test("YS-12: Should validate product added to shopping cart", async ({
    page,
  }) => {
    const product = new Product(dataAddToCartFeature.addToCartItem);
    await setupShoppingCart(homePage, product);
  });

  test("YS-13: Should validate product removed from shopping cart", async ({
    page,
  }) => {
    const product = new Product(dataAddToCartFeature.addToCartItem);
    await setupShoppingCart(homePage, product);

    logStep(`Remove ${product.name} from shopping cart`);
    await homePage.removeItemFromTable(product.name);

    logStep(`Validate ${product.name} is removed from shopping cart`);
    await homePage.validateItemRemovedFromTable(product.name);
  });

});
