import { expect, Locator, Page } from "@playwright/test";
import { HomePage } from "./Home";

export class AccountPage extends HomePage {
	private static readonly ACCOUNT_URL_REGEX = /route=account\/account/;
	readonly accountTitle: Locator;

	constructor(page: Page) {
		super(page);
		this.accountTitle = page.locator('xpath=//h2[contains(text(), "My Account")]');
	}

	async expectAccountUrl() {
		await this.expectUrlMatch(AccountPage.ACCOUNT_URL_REGEX);
	}

	async expectWelcomeMessage() {
		await expect(this.accountTitle).toBeVisible();
	}
}
