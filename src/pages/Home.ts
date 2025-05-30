import { Locator, Page } from "@playwright/test";

export class HomePage {
  private static readonly HOME_URL_REGEX = /route=common\/home/;
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
}