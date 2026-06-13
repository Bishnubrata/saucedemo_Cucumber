import { Page, Locator, expect } from '@playwright/test';

export class SaucedemoInventory {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly productItems: Locator;
    readonly sortDropdown: Locator;
    readonly itemPrices: Locator;
    readonly cartIcon: Locator;
    readonly addToCartButtons: Locator;
    readonly cartBadge: Locator; // NEW

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('.title');
        this.productItems = page.locator('.inventory_item');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.itemPrices = page.locator('.inventory_item_price');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.addToCartButtons = page.locator('button:has-text("Add to cart")');
        this.cartBadge = page.locator('.shopping_cart_badge'); // NEW
    }

    async verifyIsLoaded() {
        await expect(this.pageTitle).toHaveText('Products');
    }

    async getProductCount() {
        return await this.productItems.count();
    }

    async sortProductsBy(optionValue: string) {
        // "lohi" stands for Price (low to high) in the SauceDemo dropdown
        await this.sortDropdown.selectOption(optionValue);
    }

    async getPricesAsNumbers(): Promise<number[]> {
        const priceTexts = await this.itemPrices.allInnerTexts();
        // Removes the '$' sign and converts the string to a float number for mathematical comparison
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    async addSpecificNumberOfProductsToCart(count: number) {
        for (let i = 0; i < count; i++) {
            // We use .nth(0) repeatedly because once a button is clicked, 
            // its text changes to "Remove", making the *next* available "Add to cart" button index 0.
            await this.addToCartButtons.nth(0).click(); 
        }
    }

    async navigateToCart() {
        await this.cartIcon.click();
    }

    // NEW METHOD: Reads the red notification badge on the inventory page
    async getCartBadgeCount() {
        // SauceDemo completely removes the badge from the DOM when the cart is 0
        const isVisible = await this.cartBadge.isVisible();
        if (!isVisible) {
            return 0;
        }
        
        // Grab the text and convert it from a string to a number
        const text = await this.cartBadge.innerText();
        return parseInt(text);
    }
}