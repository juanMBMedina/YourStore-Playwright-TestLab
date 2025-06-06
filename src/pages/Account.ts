import { expect, Locator, Page } from "@playwright/test";
import { HomePage } from "./Home";

export class AccountPage extends HomePage {
  private static readonly ACCOUNT_URL_REGEX = /route=account\/account/;
  private static readonly LOGOUT_SUCCESS_REGEX = /route=account\/logout/;
  private static readonly LOGOUT_HEADER_TEXT = "Account";
  private static readonly LOGOUT_MESSAGE_1 =
    "You have been logged off your account. It is now safe to leave the computer.";
  private static readonly LOGOUT_MESSAGE_2 =
    "Your shopping cart has been saved, the items inside it will be restored whenever you log back into your account.";
  readonly accountTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTitle = page.locator(
      'xpath=//h2[contains(text(), "My Account")]'
    );
  }

  async expectAccountUrl() {
    await this.expectUrlMatch(AccountPage.ACCOUNT_URL_REGEX);
  }

  async expectWelcomeMessage() {
    await expect(this.accountTitle).toBeVisible();
  }

  async logout() {
    await this.topBarComponent.logout();
  }

  async expectLogoutSuccess(): Promise<void> {
    await this.page.waitForURL(AccountPage.LOGOUT_SUCCESS_REGEX, { timeout: 5000 });
    await expect(this.page.locator("#content h1")).toHaveText(AccountPage.LOGOUT_HEADER_TEXT);
    await expect(this.page.locator("text=" + AccountPage.LOGOUT_MESSAGE_1)).toBeVisible();
    await expect(this.page.locator("text=" + AccountPage.LOGOUT_MESSAGE_2)).toBeVisible();
  }
}
