import { Locator, expect } from "@playwright/test";
import { HomePage } from "./Home";
import { UserLogin } from "../models/UserLogin";

export class LoginPage extends HomePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  private static readonly LOGIN_URL_REGEX = /route=account\/login/;
  private static readonly LOGIN_ERROR_MESSAGE = 'No match for E-Mail Address and/or Password';

  constructor(page) {
    super(page);
    this.emailInput = page.locator("#input-email");
    this.passwordInput = page.locator("#input-password");
    this.loginButton = page.locator('input[type="submit"][value="Login"]');
  }

  async expectLoginUrl() {
    await this.page.waitForURL(LoginPage.LOGIN_URL_REGEX);
  }

  async login(user: UserLogin) {
    await this.page.fill('input[name="email"]', user.email);
    await this.page.fill('input[name="password"]', user.password);
    await this.page.click('input[type="submit"]');
  }

  async expectLoginErrorMessage() {
    await this.alertDanger.waitFor({ state: 'visible' });
    await expect(this.alertDanger).toBeVisible();
    await expect(this.alertDanger).toContainText(LoginPage.LOGIN_ERROR_MESSAGE);
  }
}
