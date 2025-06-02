import { UserRegister } from '../models/UserRegister';
import { HomePage } from './Home';
import { expect } from '@playwright/test';

export class RegisterPage extends HomePage {
  protected static readonly SUCCESS_REGISTRATION_HEADING = 'Account';
  protected static readonly SUCCESS_REGISTRATION_MESSAGE = 'Congratulations! Your new account has been successfully created!';
  protected static readonly USER_EXISTS_REGISTRATION_MESSAGE = ' Warning: E-Mail Address is already registered!';
  // Locators
  protected readonly firstNameInput = 'input[name="firstname"]';
  protected readonly lastNameInput = 'input[name="lastname"]';
  protected readonly emailInput = 'input[name="email"]';
  protected readonly telephoneInput = 'input[name="telephone"]';
  protected readonly passwordInput = 'input[name="password"]';
  protected readonly confirmPasswordInput = 'input[name="confirm"]';
  protected readonly agreeCheckbox = 'input[name="agree"]';
  protected readonly continueButton = 'input[type="submit"]';
  protected readonly subscribeYesRadio = 'input[name="newsletter"][value="1"]';
  protected readonly subscribeNoRadio = 'input[name="newsletter"][value="0"]';
  
  // Methods to interact with the form
  async fillRegistrationForm(user: UserRegister) {
    await this.page.fill(this.firstNameInput, user.getFirstName());
    await this.page.fill(this.lastNameInput, user.getLastName());
    await this.page.fill(this.emailInput, user.getEmail());
    await this.page.fill(this.telephoneInput, user.getEmail());
    await this.page.fill(this.passwordInput, user.getPassword());
    await this.page.fill(this.confirmPasswordInput, user.getPassword());
    await this.selectSubscribeOption(user.getSubscribe());
    await this.selectPrivacyStatus(user.getCheckPrivacy());
  }

  async submitForm() {
    await this.page.click(this.continueButton);
  }

  async register(user: UserRegister) {
    await this.fillRegistrationForm(user);
    await this.submitForm();
  }

  async expectRegisterUrl() {
    await this.page.waitForURL(/route=account\/register/);
  }

  async expectSuccessRegistration() {
    await expect(this.page.locator(this.successMessageLocator)).toHaveText(RegisterPage.SUCCESS_REGISTRATION_HEADING);
    await expect(this.page.locator(this.successMessageTextLocator)).toContainText(RegisterPage.SUCCESS_REGISTRATION_MESSAGE);
  }

  async expectUserExistsRegistration() {
    await this.expectErrorMessage(RegisterPage.USER_EXISTS_REGISTRATION_MESSAGE);
  }

  async selectPrivacyStatus(status: boolean) {
    if (status) {
      await this.page.check(this.agreeCheckbox);
    } else {
      await this.page.uncheck(this.agreeCheckbox);
    }
  }

  async selectSubscribeOption(status: boolean) {
    if (status) {
      await this.page.check(this.subscribeYesRadio);
    } else {
      await this.page.check(this.subscribeNoRadio);
    }
  }
}