import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
  private static readonly HOME_URL_REGEX = /route=common\/home/;
  private static readonly LOGOUT_SUCCESS_REGEX = /route=account\/logout/;
  private static readonly LOGOUT_HEADER_TEXT = 'Account';
  private static readonly LOGOUT_MESSAGE_1 = 'You have been logged off your account. It is now safe to leave the computer.';
  private static readonly LOGOUT_MESSAGE_2 = 'Your shopping cart has been saved, the items inside it will be restored whenever you log back into your account.';
  protected readonly topBar: Locator;
  protected readonly accountDropdown: Locator;
  protected readonly loginLink: Locator;
  protected readonly registerLink: Locator;
  protected readonly itemsBar: Locator;
  protected readonly alertDanger: Locator;
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.topBar = page.locator("nav#top");
    this.accountDropdown = page.locator('#top-links .dropdown a[title="My Account"]');
    this.loginLink = page.locator('ul.dropdown-menu-right a:text("Login")');
    this.registerLink = page.locator('ul.dropdown-menu-right a:text("Register")');
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

  async gotoRegisterPage() {
    await this.accountDropdown.click();
    await this.registerLink.click();
  }

  async expectUrlMatch(regex: RegExp) {
    await this.page.waitForURL(regex);
  }

  async expectHomeUrl() {
    await this.expectUrlMatch(HomePage.HOME_URL_REGEX);
  }

  async checkTextIsVisible(text: string) {
    await this.page.waitForSelector(`text=${text}`);
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
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
    await this.checkTextIsVisible(HomePage.LOGOUT_HEADER_TEXT);
    await this.checkTextIsVisible(HomePage.LOGOUT_MESSAGE_1);
    await this.checkTextIsVisible(HomePage.LOGOUT_MESSAGE_2);
  }
}