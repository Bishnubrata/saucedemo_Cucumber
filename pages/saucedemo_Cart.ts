import { Page, Locator } from '@playwright/test';

export class SaucedemoCart {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly removeButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.removeButtons = page.locator('button:has-text("Remove")');
    }

    async getCartItemCount() {
        return await this.cartItems.count();
    }

    async removeSpecificNumberOfItems(count: number) {
        for (let i = 0; i < count; i++) {
            await this.removeButtons.nth(0).click();
        }
    }
}