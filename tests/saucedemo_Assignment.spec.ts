import { test, expect } from '@playwright/test';
import { SaucedemoLogin } from '../pages/saucedemo_Login';
import { SaucedemoInventory } from '../pages/saucedemo_Inventory';
import { SaucedemoCart } from '../pages/saucedemo_Cart';

// IMPORT THE JSON DATA HERE
// Notice how TypeScript can natively read JSON files!
const credentials = require('../data/credentials.json');

test.describe('SauceDemo E2E Assignment', () => {
    let loginPage: SaucedemoLogin;
    let inventoryPage: SaucedemoInventory;
    let cartPage: SaucedemoCart;

    test.beforeEach(async ({ page }) => {
        loginPage = new SaucedemoLogin(page);
        inventoryPage = new SaucedemoInventory(page);
        cartPage = new SaucedemoCart(page);
        await loginPage.navigate();
    });

    test('1. Validate for valid login', async () => {
        // Read the valid credentials directly from the JSON object
        await loginPage.login(credentials.validUser, credentials.validPassword);
        
        await inventoryPage.verifyIsLoaded();
    });

    test('2. Validate for invalid login', async () => {
        // Read the invalid credentials directly from the JSON object
        await loginPage.login(credentials.invalidUser, credentials.invalidPassword);
        
        await loginPage.verifyErrorMessage('Username and password do not match');
    });

    test('3. Validate the number of products in products page', async () => {
        await loginPage.login(credentials.validUser, credentials.validPassword);
        
        const count = await inventoryPage.getProductCount();
        expect(count).toBe(6);
    });

    test('4. Verify the sorting of products (Price Low to High)', async () => {
        await loginPage.login(credentials.validUser, credentials.validPassword);
        
        await inventoryPage.sortProductsBy('lohi');
        
        const prices = await inventoryPage.getPricesAsNumbers();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });

    test('5. Verify to add any 2 products to cart', async () => {
        await loginPage.login(credentials.validUser, credentials.validPassword);
        
        await inventoryPage.addSpecificNumberOfProductsToCart(2);
        await inventoryPage.navigateToCart();
        
        const cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(2);
    });

    test('6. Verify to remove 1 product in the cart', async () => {
        await loginPage.login(credentials.validUser, credentials.validPassword);
        
        await inventoryPage.addSpecificNumberOfProductsToCart(2);
        await inventoryPage.navigateToCart();
        await cartPage.removeSpecificNumberOfItems(1);
        
        const cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(1);
    });
});