import { test } from '@playwright/test';
import { UserRegister } from '../src/models/UserRegister';
import { RegisterPage } from '../src/pages/Register';
import { HomePage } from '../src/pages/Home';
import * as data from '../resources/files/dataRegisterFeature.json';


let homePage: HomePage;
let registerPage: RegisterPage;

function logStep(step: string) {
  console.log(`\x1b[36m[STEP]\x1b[0m ${step}`);
}

function goToRegister() {
  logStep('1. Go to the main page');
  homePage.goto();
  homePage.expectHomeUrl();

  logStep('2. Go to register section');
  homePage.gotoRegisterPage();
  registerPage.expectRegisterUrl();
}


test.describe('YS-1: Validate correct functionality when registering a new user', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
  });

  test('Successfully register a new user', async ({ page }) => {
    // Go to Register page.
    goToRegister();

    logStep('3. Fill out the registration form with valid data');
    const user = new UserRegister();
    await registerPage.register(user);

    logStep('4. Validate that the user was successfully registered');
    await registerPage.expectSuccessRegistration();
  });
});

test.describe('YS-2: Validate error message when registering an existing user', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
  });

  test('Show error message for existing user registration', async ({ page }) => {
    // Go to Register page.
    goToRegister();

    logStep('3. Fill out the registration form with an existing user');
    const user = new UserRegister(data.userExist);
    await registerPage.register(user);
    logStep('4. Validate that the user was not registered and an error message is displayed');
    await registerPage.expectUserExistsRegistration();
  });
});

test.describe('YS-3: Validate error messages for void or invalid fields during registration', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
  });

  const scenarios = data.scenarios;

  for (const scenario of scenarios) {
    test(scenario.description, async ({ page }) => {
      // Go to Register page.
      goToRegister();

      logStep(`3. Attempt to register with scenario: ${scenario.description}`);
      const user = new UserRegister(scenario.userData);
      await registerPage.register(user);
      
      logStep('4. Validate error messages are displayed for the scenario');
      await registerPage.expectErrorMessages(scenario.expectedErrors);
    });
  }
});

test.describe('YS-4: Validate error message when registering without agreeing to Privacy Policy', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
  });

  test('Show error message for registration without agreeing to Privacy Policy', async ({ page }) => {
    // Go to Register page.
    goToRegister();

    logStep('3. Fill out the registration form without agreeing to Privacy Policy');
    const user = new UserRegister(data.userWithoutPrivacy);
    await registerPage.register(user);

    logStep('4. Validate that the user was not registered and an error message is displayed');
    await registerPage.expectUserWithoutPrivacy();
  });
});
