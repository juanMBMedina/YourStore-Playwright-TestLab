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

function goToLogin() {
  logStep("1. Go to the main page");
  homePage.goto();
  homePage.expectHomeUrl();

  logStep("2. Go to login section");
  homePage.gotoLoginPage();
  loginPage.expectLoginUrl();
}

test.describe("YS-5: Validate login functionality for a user with correct credentials", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);
  });

  test("Should login successfully with valid user credentials", async ({
    page,
  }) => {
    logStep("Instantiating user data");
    const user = new UserLogin(userData.loginExistUser);

    await goToLogin();

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
    const user = new UserLogin(userData.loginIncorrectUser);

    await goToLogin();

    logStep("3. Fill the form with incorrect data");
    await loginPage.login(user);

    logStep("4. Validate the user is not logged in and sees the error message");
    await loginPage.expectLoginErrorMessage();
  });
});

test.describe("YS-7: Validate error message when no data is entered in the login form", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  const scenarios = [
    { email: "", password: "", description: "both fields empty" },
    {
      email: "",
      password: "somePassword",
      description: "empty email, filled password",
    },
    {
      email: "user@example.com",
      password: "",
      description: "filled email, empty password",
    },
  ];

  for (const scenario of scenarios) {
    test(`Should show an alert when login form is submitted with ${scenario.description}`, async ({
      page,
    }) => {
      await goToLogin();

      logStep(`3. Submit the login form with: ${scenario.description}`);
      await loginPage.login(new UserLogin(scenario.email, scenario.password));

      logStep("4. Validate the error message is shown for empty fields");
      await loginPage.expectLoginErrorMessage();
    });
  }
});

test.describe("YS-8: Validate logout functionality for a user", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);
  });

  test("Should logout successfully and return to the home page", async ({
    page,
  }) => {
    logStep("Instantiating user data");

    const user = new UserLogin(userData.loginExistUser);

    await goToLogin();

    logStep("3. Fill the form with correct data");
    await loginPage.login(user);

    logStep("4. Validate the user is logged in and sees the welcome message");
    await accountPage.expectAccountUrl();
    await accountPage.expectWelcomeMessage();

    logStep("5. Perform logout from the account page");
    await accountPage.logout();

    logStep("6. Validate the user is redirected to the logout success page");
    await homePage.expectLogoutSuccess();
  });
});

test.describe("YS-13: Validate error message when the maximum number of login attempts is not reached", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  test("YS-13: Should validate the error message when the maximum number of attempts is NOT reached", async ({
    page,
  }) => {
    await goToLogin();
    logStep("Step 3: Fill the form with incorrect values several times");
    const user = new UserLogin(userData.loginMaxAttemptsUser);
    let maxAttempts = 10;
    let attempt = 1;
    do {
      logStep(`Attempt ${attempt}: Fill the form with incorrect data`);
      await loginPage.login(user);
      attempt++;
    } while (attempt <= maxAttempts && !(await loginPage.isVisibleMaxAttempsMssg()));

    logStep("Step 4: Validate that the lockout message is NOT shown");
    // If you have a method to check the absence of the lockout message, use it here
    await loginPage.expectNumMaxAttemptsErrorMessage();
  });
});
