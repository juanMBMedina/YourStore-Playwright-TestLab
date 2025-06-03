import { expect, Locator, Page } from "@playwright/test";
import { HomePage } from "./Home";

export class AccountPage extends HomePage {
  private static readonly ACCOUNT_URL_REGEX = /route=account\/account/;
  readonly accountTitle: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTitle = page.locator(
      'xpath=//h2[contains(text(), "My Account")]'
    );
    this.logoutLink = page.locator(
      "a.list-group-item[href*='logout'], ul.dropdown-menu-right a[href*='logout']"
    );
  }

  async expectAccountUrl() {
    await this.expectUrlMatch(AccountPage.ACCOUNT_URL_REGEX);
  }

  async expectWelcomeMessage() {
    await expect(this.accountTitle).toBeVisible();
  }

  async logout() {
    // Try sidebar first, then dropdown if not visible
    if (await this.logoutLink.first().isVisible()) {
      await this.logoutLink.first().click();
    } else {
      await this.accountDropdown.click();
      await this.logoutLink.nth(1).click();
    }
  }

}
