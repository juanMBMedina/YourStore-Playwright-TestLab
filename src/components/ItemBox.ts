import { Locator, Page } from "@playwright/test";

export class ItemBox {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getProductContainerByName(productName: string): Locator {
    return this.page.locator(
      `xpath=//*[text()='${productName}']/ancestor::div[@class='product-thumb']`
    );
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

  public async addToCart(productName: string): Promise<void> {
    const addToCartButton = this.getAddToCartButtonByName(productName);
    await addToCartButton.click();
  }

  public async addToWishList(productName: string): Promise<void> {
    const addToWishListButton = this.getAddToWishListButtonByName(productName);
    await addToWishListButton.click();
  }

  public async compareProduct(productName: string): Promise<void> {
    const compareButton = this.getCompareButtonByName(productName);
    await compareButton.click();
  }
}
