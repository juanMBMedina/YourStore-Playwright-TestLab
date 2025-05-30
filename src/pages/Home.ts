import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
  public static readonly containsText = (text: String) => `xpath=//*[contains(text(), '${text}')]`;
  private static readonly HOME_URL_REGEX = /route=common\/home/;
  private static readonly LOGOUT_SUCCESS_REGEX = /route=account\/logout/;
  private static readonly LOGOUT_HEADER_TEXT = 'Account';
  private static readonly LOGOUT_MESSAGE_1 = 'You have been logged off your account. It is now safe to leave the computer.';
  private static readonly LOGOUT_MESSAGE_2 = 'Your shopping cart has been saved, the items inside it will be restored whenever you log back into your account.';
  readonly topBar: Locator;
  readonly accountDropdown: Locator;
  readonly loginLink: Locator;
  readonly itemsBar: Locator;
  readonly alertDanger: Locator;
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.topBar = page.locator("nav#top");
    this.accountDropdown = page.locator('#top-links .dropdown a[title="My Account"]');
    this.loginLink = page.locator('ul.dropdown-menu-right a:text("Login")');
    this.itemsBar = page.locator('nav#menu');
    this.alertDanger = page.locator('.alert-danger');
  }

  async goto() {
    await this.page.goto("https://opencart.abstracta.us/index.php?route=common/home");
  }

  async gotoLoginPage() {
    await this.accountDropdown.click();
    await this.loginLink.click();
  }

  async expectUrlMatch(regex: RegExp) {
    await this.page.waitForURL(regex);
  }

  async expectHomeUrl() {
    await this.expectUrlMatch(HomePage.HOME_URL_REGEX);
  }

  getContainsTextLocator(text: string): Locator {
    return this.page.locator(HomePage.containsText(text));
  }

  protected async expectErrorMessage(text: string) {
    await this.alertDanger.waitFor({ state: "visible", timeout: 5000 });
    await expect(this.alertDanger).toBeVisible();
    if (text) {
      await expect(this.alertDanger).toContainText(text);
    }
  }

  async expectLogoutSuccess() {
    await this.expectUrlMatch(HomePage.LOGOUT_SUCCESS_REGEX);
    await this.getContainsTextLocator(HomePage.LOGOUT_HEADER_TEXT);
    await this.getContainsTextLocator(HomePage.LOGOUT_MESSAGE_1);
    await this.getContainsTextLocator(HomePage.LOGOUT_MESSAGE_2);
  }
}