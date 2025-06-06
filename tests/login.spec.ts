import { test } from "@playwright/test";
import { HomePage } from "../src/pages/Home";
import { LoginPage } from "../src/pages/Login";
import { UserLogin } from "../src/models/UserLogin";
import userData from "../resources/files/dataLoginFeature.json";
import { AccountPage } from "../src/pages/Account";
import { goToLogin, logStep } from '../src/utils/auth-utils';

let homePage: HomePage;
let loginPage: LoginPage;
let accountPage: AccountPage;

test.describe("Your Site Web Page: Login Feature", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);
  });

  test.describe("YS-5: Valid login", () => {
    test("Should login successfully with valid user credentials", async ({ page }) => {
      await goToLogin(homePage, loginPage);

      logStep("Instantiating valid user data");
      const user = new UserLogin(userData.loginExistUser);

      logStep("Filling the form with correct data");
      await loginPage.login(user);

      logStep("Validating the user is logged in and sees the welcome message");
      await accountPage.expectAccountUrl();
      await accountPage.expectWelcomeMessage();
    });
  });

  test.describe("YS-6: Invalid login", () => {
    test("Should not login with invalid user credentials", async ({ page }) => {
      await goToLogin(homePage, loginPage);

      logStep("Instantiating invalid user data");
      const user = new UserLogin(userData.loginIncorrectUser);

      logStep("Filling the form with incorrect data");
      await loginPage.login(user);

      logStep("Validating the error message is displayed");
      await loginPage.expectLoginErrorMessage();
    });
  });

  test.describe("YS-7: Empty fields in login form", () => {
    for (const scenario of userData.scenarios) {
      test(`Should show an alert when login form is submitted with ${scenario.description}`, async ({ page }) => {
        await goToLogin(homePage, loginPage);

        logStep(`Submitting the login form with: ${scenario.description}`);
        await loginPage.login(new UserLogin(scenario.email, scenario.password));

        logStep("Validating the error message is shown for empty fields");
        await loginPage.expectLoginErrorMessage();
      });
    }
  });

  test.describe("YS-8: Logout functionality", () => {
    test("Should logout successfully and return to the home page", async ({ page }) => {
      await goToLogin(homePage, loginPage);

      logStep("Instantiating valid user data");
      const user = new UserLogin(userData.loginExistUser);

      logStep("Filling the form with correct data");
      await loginPage.login(user);

      logStep("Validating login success");
      await accountPage.expectAccountUrl();
      await accountPage.expectWelcomeMessage();

      logStep("Performing logout");
      await accountPage.logout();

      logStep("Validating redirection to logout success page");
      await homePage.expectLogoutSuccess();
    });
  });

  test.describe("YS-14: Max login attempts not reached", () => {
    test("Should validate that lockout message is NOT shown before reaching max attempts", async ({ page }) => {
      await goToLogin(homePage, loginPage);

      logStep("Filling the form with incorrect values several times");
      const user = new UserLogin(userData.loginMaxAttemptsUser);
      const maxAttempts = 10;
      let attempt = 1;

      do {
        logStep(`Attempt ${attempt}: Incorrect login`);
        await loginPage.login(user);
        attempt++;
      } while (
        attempt <= maxAttempts &&
        !(await loginPage.isVisibleMaxAttempsMssg())
      );

      logStep("Validating the lockout message is NOT shown");
      await loginPage.expectNumMaxAttemptsErrorMessage();
    });
  });
});
