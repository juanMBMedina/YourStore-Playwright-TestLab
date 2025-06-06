import { Locator, Page, expect } from "@playwright/test";

export class ItemsTable {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getTableResponsive(): Locator {
    return this.page.locator("div.table-responsive");
  }

  private getItemRow(productName: string): Locator {
    return this.page.locator(
      `xpath=//div[@class='table-responsive']//td[@class='text-left']//a[text()='${productName}']/ancestor::tr`
    );
  }

  public getItemName(productName: string): Locator {
    return this.getItemRow(productName).locator(
      `xpath=//td[@class='text-left']//a[text()='${productName}']`
    );
  }

  public getRemoveButton(productName: string): Locator {
    return this.getItemRow(productName).locator(
      "xpath=//*[@data-original-title='Remove']"
    );
  }

  public async removeItem(productName: string): Promise<void> {
    const removeButton = this.getRemoveButton(productName);
    await removeButton.click();
  }

  public async validateItemRemoved(productName: string): Promise<void> {
    const tableResponsive = this.getTableResponsive();
    const itemRow = this.getItemRow(productName);

    if (await tableResponsive.isVisible()) {
      await expect(itemRow).not.toBeVisible();
    } else {
      await expect(tableResponsive).not.toBeVisible();
    }
  }

  public async validateItemExists(productName: string): Promise<void> {
    const itemName = this.getItemName(productName);
    await expect(itemName).toBeVisible();
  }
}
