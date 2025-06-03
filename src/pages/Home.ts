import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
  private static readonly HOME_URL_REGEX = /route=common\/home/;
  private static readonly LOGOUT_SUCCESS_REGEX = /route=account\/logout/;
  private static readonly CATEGORY_URL_REGEX = /route=product\/category&path/;
  private static readonly LOGOUT_HEADER_TEXT = "Account";
  private static readonly LOGOUT_MESSAGE_1 =
    "You have been logged off your account. It is now safe to leave the computer.";
  private static readonly LOGOUT_MESSAGE_2 =
    "Your shopping cart has been saved, the items inside it will be restored whenever you log back into your account.";
  private static readonly ADD_TO_CART_SUCCESS_MESSAGE = (productName: string) =>
    `Success: You have added ${productName} to your shopping cart!`;
  private static readonly ADD_TO_WISHLIST_LOGIN_REQUIRED_MESSAGE = (
    productName: string
  ) =>
    `You must login or create an account to save ${productName} to your wish list!`;
  private static readonly ADD_TO_COMPARISON_SUCCESS_MESSAGE = (
    productName: string
  ) => `Success: You have added ${productName} to your product comparison!`;
  protected readonly topBar: Locator;
  protected readonly accountDropdown: Locator;
  protected readonly loginLink: Locator;
  protected readonly registerLink: Locator;
  protected readonly itemsBar: Locator;
  protected readonly alertDanger: Locator;
  protected readonly page: Page;
  protected readonly successMessageLocator = "#content h1";
  protected readonly successMessageTextLocator = "#content p:first-of-type";
  protected readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topBar = page.locator("nav#top");
    this.accountDropdown = page.locator(
      '#top-links .dropdown a[title="My Account"]'
    );
    this.loginLink = page.locator('ul.dropdown-menu-right a:text("Login")');
    this.registerLink = page.locator(
      'ul.dropdown-menu-right a:text("Register")'
    );
    this.alertDanger = page.locator(".alert.alert-danger.alert-dismissible");
    this.itemsBar = page.locator("nav#menu");
    this.successAlert = page.locator(".alert.alert-success.alert-dismissible");
  }

  async goto() {
    await this.page.goto(
      "https://opencart.abstracta.us/index.php?route=common/home"
    );
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
    // Use only unique text to avoid conflicts with other elements
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
    await expect(this.page.locator(this.successMessageLocator)).toHaveText(
      HomePage.LOGOUT_HEADER_TEXT
    );
    await this.checkTextIsVisible(HomePage.LOGOUT_MESSAGE_1);
    await this.checkTextIsVisible(HomePage.LOGOUT_MESSAGE_2);
  }

  protected getNavbarCategoryLocator(category: string): Locator {
    return this.itemsBar.locator(`xpath=//a[text()='${category}']`);
  }

  protected getNavbarSubcategoryLocator(
    category: string,
    subcategory: string
  ): Locator {
    return this.getNavbarCategoryLocator(category).locator(
      `xpath=..//a[contains(text(),'${subcategory}')]`
    );
  }

  async selectNavbarCategory(category: string, subcategory?: string) {
    const categoryLocator = this.getNavbarCategoryLocator(category);
    await categoryLocator.hover();
    await categoryLocator.click();

    if (subcategory) {
      const subcategoryLocator = this.getNavbarSubcategoryLocator(
        category,
        subcategory
      );
      await subcategoryLocator.click();
    }
  }

  async validateCategory() {
    await this.expectUrlMatch(HomePage.CATEGORY_URL_REGEX);
  }

  private getProductContainerByName(productName: string): Locator {
    return this.page.locator(`xpath=//*[text()='${productName}']/ancestor::div[@class='product-thumb']`);
  }

  private getAddToCartButtonByName(productName: string): Locator {
    return this.getProductContainerByName(productName).locator(
      "button:has-text('Add to Cart')"
    );
  }

  private getAddToWishListButtonByName(productName: string): Locator {
    return this.getProductContainerByName(productName).locator(
      "button[data-original-title='Add to Wish List']"
    );
  }

  private getCompareButtonByName(productName: string): Locator {
    return this.getProductContainerByName(productName).locator(
      "button[data-original-title='Compare this Product']"
    );
  }

  public async addToCart(productName: string) {
    const addToCartButton = this.getAddToCartButtonByName(productName);
    await addToCartButton.click();
  }

  public async addToWishList(productName: string) {
    const addToWishListButton = this.getAddToWishListButtonByName(productName);
    await addToWishListButton.click();
  }

  public async compareProduct(productName: string) {
    const compareButton = this.getCompareButtonByName(productName);
    await compareButton.click();
  }

  private async validateSuccessAlert(expectedMessage: string) {
    await this.successAlert.waitFor({ state: "visible", timeout: 5000 });
    await expect(this.successAlert).toBeVisible();
    await expect(this.successAlert).toContainText(expectedMessage);
  }

  public async validateAddToCartSuccess(productName: string) {
    await this.validateSuccessAlert(
      HomePage.ADD_TO_CART_SUCCESS_MESSAGE(productName)
    );
  }

  public async validateWishListLoginRequired(productName: string) {
    await this.validateSuccessAlert(
      HomePage.ADD_TO_WISHLIST_LOGIN_REQUIRED_MESSAGE(productName)
    );
  }

  public async validateComparisonSuccess(productName: string) {
    await this.validateSuccessAlert(
      HomePage.ADD_TO_COMPARISON_SUCCESS_MESSAGE(productName)
    );
  }
}
