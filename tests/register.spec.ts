import { test } from '@playwright/test';
import { UserRegister } from '../src/models/UserRegister';
import { RegisterPage } from '../src/pages/Register';
import { HomePage } from '../src/pages/Home';
import * as data from '../resources/files/dataRegisterFeature.json';
import { goToRegister, logStep } from '../src/utils/auth-utils';

let homePage: HomePage;
let registerPage: RegisterPage;

test.describe('Your Site Web Page: Register User Feature', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
  });

  test.describe('YS-1: Register with valid data', () => {
    test('Should successfully register a new user', async ({ page }) => {
      await goToRegister(homePage, registerPage);

      logStep('Fill out the registration form with valid data');
      const user = new UserRegister(); // genera usuario válido por defecto
      await registerPage.register(user);

      logStep('Validate successful registration');
      await registerPage.expectSuccessRegistration();
    });
  });

  test.describe('YS-2: Register with existing user', () => {
    test('Should show error message when user already exists', async ({ page }) => {
      await goToRegister(homePage, registerPage);

      logStep('Fill out the registration form with an existing user');
      const user = new UserRegister(data.userExist);
      await registerPage.register(user);

      logStep('Validate error message for existing user');
      await registerPage.expectUserExistsRegistration();
    });
  });

  test.describe('YS-3: Register with empty or invalid fields', () => {
    for (const scenario of data.scenarios) {
      test(`${scenario.description}`, async ({ page }) => {
        await goToRegister(homePage, registerPage);

        logStep(`Attempting to register with: ${scenario.description}`);
        const user = new UserRegister(scenario.userData);
        await registerPage.register(user);

        logStep('Validate error messages for invalid input');
        await registerPage.expectErrorMessages(scenario.expectedErrors);
      });
    }
  });

  test.describe('YS-4: Register without agreeing to Privacy Policy', () => {
    test('Should show error when privacy policy is not accepted', async ({ page }) => {
      await goToRegister(homePage, registerPage);

      logStep('Attempting to register without agreeing to privacy policy');
      const user = new UserRegister(data.userWithoutPrivacy);
      await registerPage.register(user);

      logStep('Validate error message for missing privacy policy agreement');
      await registerPage.expectUserWithoutPrivacy();
    });
  });
});
