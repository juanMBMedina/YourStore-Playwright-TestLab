import { Locator, Page, expect } from "@playwright/test";

export class AlertDanger {
  private readonly alertDanger: Locator;

  constructor(page: Page) {
    this.alertDanger = page.locator(".alert.alert-danger");
  }

  public async waitForVisibility(timeout: number = 5000): Promise<void> {
    await this.alertDanger.waitFor({ state: "visible", timeout });
  }

  public async expectVisible(): Promise<void> {
    await expect(this.alertDanger).toBeVisible();
  }

  public async expectContainsText(text: string): Promise<void> {
    await expect(this.alertDanger).toContainText(text);
  }

  public async expectErrorMessage(text: string): Promise<void> {
    await this.waitForVisibility();
    await this.expectVisible();
    if (text) {
      await this.expectContainsText(text);
    }
  }
}
