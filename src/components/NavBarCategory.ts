import { Locator, Page } from "@playwright/test";

export class NavBarCategory {
  private readonly page: Page;
  private readonly itemsBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemsBar = page.locator("nav#menu");
  }

  public getNavbarCategoryLocator(category: string): Locator {
    return this.itemsBar.locator(`xpath=//a[text()='${category}']`);
  }

  public getNavbarSubcategoryLocator(category: string, subcategory: string): Locator {
    return this.getNavbarCategoryLocator(category).locator(
      `xpath=..//a[contains(text(),'${subcategory}')]`
    );
  }

  public async selectNavbarCategory(category: string, subcategory?: string): Promise<void> {
    const categoryLocator = this.getNavbarCategoryLocator(category);
    await categoryLocator.hover();
    await categoryLocator.click();

    if (subcategory) {
      const subcategoryLocator = this.getNavbarSubcategoryLocator(category, subcategory);
      await subcategoryLocator.click();
    }
  }

}
