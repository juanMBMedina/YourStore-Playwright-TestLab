import { Locator, Page, expect } from "@playwright/test";

export class AlertSuccess {
  private readonly alertSuccess: Locator;

  constructor(page: Page) {
    this.alertSuccess = page.locator(".alert.alert-success.alert-dismissible");
  }

  public async waitForVisibility(timeout: number = 5000): Promise<void> {
    await this.alertSuccess.waitFor({ state: "visible", timeout });
  }

  public async expectVisible(): Promise<void> {
    await expect(this.alertSuccess).toBeVisible();
  }

  public async expectContainsText(text: string): Promise<void> {
    await expect(this.alertSuccess).toContainText(text);
  }

  public async expectSuccessMessage(text: string): Promise<void> {
    await this.waitForVisibility();
    await this.expectVisible();
    if (text) {
      await this.expectContainsText(text);
    }
  }
}
