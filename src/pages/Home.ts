import { Locator, Page, expect } from "@playwright/test";
import { ItemsTable } from "../components/ItemsTable";
import { ItemBox } from "../components/ItemBox";
import { NavBarCategory } from "../components/NavBarCategory";
import { TopBar } from "../components/TopBar";
import { AlertDanger } from "../components/AlertDanger";
import { AlertSuccess } from "../components/AlertSuccess";

export class HomePage {
  private static readonly HOME_URL_REGEX = /route=common\/home/;
  private static readonly ADD_TO_CART_SUCCESS_MESSAGE = (productName: string) =>
    `Success: You have added ${productName} to your shopping cart!`;
  private static readonly ADD_TO_WISHLIST_LOGIN_REQUIRED_MESSAGE = (
    productName: string
  ) =>
    `Success: You have added ${productName} to your wish list!`;
  private static readonly ADD_TO_COMPARISON_SUCCESS_MESSAGE = (
    productName: string
  ) => `Success: You have added ${productName} to your product comparison!`;
  protected readonly successMessageLocator = "#content h1";
  protected readonly successMessageTextLocator = "#content p:first-of-type";
  protected readonly successAlert: Locator;
  private readonly itemsTable: ItemsTable;
  private readonly itemBox: ItemBox;
  private readonly navBarCategory: NavBarCategory;
  protected readonly topBarComponent: TopBar;
  protected readonly alertDangerComponent: AlertDanger;
  protected readonly successAlertComponent: AlertSuccess;
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.alertDangerComponent = new AlertDanger(page);
    this.itemsTable = new ItemsTable(page);
    this.itemBox = new ItemBox(page);
    this.navBarCategory = new NavBarCategory(page);
    this.topBarComponent = new TopBar(page);
    this.successAlertComponent = new AlertSuccess(page);
  }

  async goto() {
    await this.page.goto(
      "https://opencart.abstracta.us/index.php?route=common/home",
      { waitUntil: "networkidle" }
    );
  }

  async gotoLoginPage() {
    await this.topBarComponent.gotoLoginPage();
  }

  async gotoRegisterPage() {
    await this.topBarComponent.gotoRegisterPage();
  }

  async expectUrlMatch(regex: RegExp) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const currentUrl = this.page.url();
        console.log(`Attempt ${attempts + 1}: Current URL is ${currentUrl}`);
        await this.page.waitForURL(regex, { timeout: 5000 });
        return;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(
            `Failed to match URL after ${maxAttempts} attempts: ${error.message}`
          );
        }
      }
    }
  }

  async expectHomeUrl() {
    await this.expectUrlMatch(HomePage.HOME_URL_REGEX);
  }

  async checkTextIsVisible(text: string) {
    // Use only unique text to avoid conflicts with other elements
    await this.page.waitForSelector(`text=${text}`);
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }

  public async expectErrorMessage(text: string) {
    await this.alertDangerComponent.expectErrorMessage(text);
  }

  async selectNavbarCategory(category: string, subcategory?: string) {
    await this.navBarCategory.selectNavbarCategory(category, subcategory);
  }

  async validateCategory() {
    await this.navBarCategory.validateCategory();
  }

  private async validateSuccessAlert(expectedMessage: string) {
    await this.successAlertComponent.expectSuccessMessage(expectedMessage);
  }

  public async validateAddToCartSuccess(productName: string) {
    await this.validateSuccessAlert(
      HomePage.ADD_TO_CART_SUCCESS_MESSAGE(productName)
    );
  }

  public async validateWishListSuccess(productName: string) {
    await this.validateSuccessAlert(
      HomePage.ADD_TO_WISHLIST_LOGIN_REQUIRED_MESSAGE(productName)
    );
  }

  public async validateComparisonSuccess(productName: string) {
    await this.validateSuccessAlert(
      HomePage.ADD_TO_COMPARISON_SUCCESS_MESSAGE(productName)
    );
  }

  public async goToShoppingCart(): Promise<void> {
    await this.topBarComponent.goToShoppingCart();
  }

  async goToWishList() {
    await this.topBarComponent.goToWishList();
  }

  public async validateProductInTable(productName: string) {
    await this.itemsTable.validateItemExists(productName);
  }

  public async removeItemFromTable(productName: string): Promise<void> {
    await this.itemsTable.removeItem(productName);
  }

  public async validateItemRemovedFromTable(productName: string): Promise<void> {
    await this.itemsTable.validateItemRemoved(productName);
  }

  public async addToCart(productName: string): Promise<void> {
    await this.itemBox.addToCart(productName);
  }

  public async addToWishList(productName: string): Promise<void> {
    await this.itemBox.addToWishList(productName);
  }

  public async compareProduct(productName: string): Promise<void> {
    await this.itemBox.compareProduct(productName);
  }
}
