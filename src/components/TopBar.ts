import { Locator, Page } from "@playwright/test";

export class TopBar {
  private readonly accountDropdown: Locator;
  private readonly loginLink: Locator;
  private readonly registerLink: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly currencyDropdown: Locator;
  private readonly wishListLink: Locator;
  private readonly checkoutLink: Locator;
  private readonly logoutLink: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.accountDropdown = page.locator('nav#top #top-links .dropdown a[title="My Account"]');
    this.loginLink = page.locator('nav#top ul.dropdown-menu-right a:text("Login")');
    this.registerLink = page.locator('nav#top ul.dropdown-menu-right a:text("Register")');
    this.shoppingCartLink = page.locator('nav#top li a[title="Shopping Cart"]');
    this.currencyDropdown = page.locator('nav#top #form-currency .dropdown-toggle');
    this.wishListLink = page.locator('nav#top #top-links a[title="Wish List"]');
    this.checkoutLink = page.locator('nav#top #top-links a[title="Checkout"]');
    this.logoutLink = page.locator("#top-links ul.dropdown-menu-right a[href*='logout']");
  }

  async gotoLoginPage() {
    await this.accountDropdown.click();
    await this.loginLink.click();
  }

  async gotoRegisterPage() {
    await this.accountDropdown.click();
    await this.registerLink.click();
  }

  public async goToShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  public async selectCurrency(currency: string): Promise<void> {
    await this.currencyDropdown.click();
    const currencyButton = this.page.locator(`button.currency-select[name="${currency}"]`);
    await currencyButton.click();
  }

  public async goToWishList(): Promise<void> {
    await this.wishListLink.click();
  }

  public async goToCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }

  public async logout(): Promise<void> {
    await this.accountDropdown.click();
    await this.logoutLink.click();
  }
}
