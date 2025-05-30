import { test } from "@playwright/test";
import { HomePage } from "../src/pages/Home";
import { LoginPage } from "../src/pages/Login";
import { UserLogin } from "../src/models/UserLogin";
import userData from "../resources/files/dataLoginFeature.json";
import { AccountPage } from "../src/pages/Account";

function logStep(step: string) {
  console.log(`\x1b[36m[STEP]\x1b[0m ${step}`);
}

let homePage: HomePage;
let loginPage: LoginPage;
let accountPage: AccountPage;

test.describe("YS-5: Validate login functionality for a user with correct credentials", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);
  });

  test("Should login successfully with valid user credentials", async ({ page }) => {
    logStep("Instantiating user data");
    const user = new UserLogin(
      userData.loginExistUser.email,
      userData.loginExistUser.password
    );

    logStep("1. Go to the main page");
    await homePage.goto();
    await homePage.expectHomeUrl();

    logStep("2. Go to login section");
    await homePage.gotoLoginPage();
    await loginPage.expectLoginUrl();

    logStep("3. Fill the form with correct data");
    await loginPage.login(user);

    logStep("4. Validate the user is logged in and sees the welcome message");
    await accountPage.expectAccountUrl();
    await accountPage.expectWelcomeMessage();
  });
});

test.describe("YS-6: Validate login functionality for a user with incorrect credentials", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  test("Should not login with invalid user credentials", async ({ page }) => {
    logStep("Instantiating user data");
    const user = new UserLogin(
      userData.loginIncorrectUser.email,
      userData.loginIncorrectUser.password
    );

    logStep("1. Go to the main page");
    await homePage.goto();
    await homePage.expectHomeUrl();

    logStep("2. Go to login section");
    await homePage.gotoLoginPage();
    await loginPage.expectLoginUrl();

    logStep("3. Fill the form with incorrect data");
    await loginPage.login(user);

    logStep("4. Validate the user is not logged in and sees the error message");
    await loginPage.expectLoginErrorMessage();
  });
});
