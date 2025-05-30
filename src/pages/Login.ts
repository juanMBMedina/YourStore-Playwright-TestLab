import { Locator } from "@playwright/test";
import { HomePage } from "./Home";
import { UserLogin } from "../models/UserLogin";

export class LoginPage extends HomePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  private static readonly LOGIN_URL_REGEX = /route=account\/login/;

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

}
