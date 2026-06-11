import { test, expect } from '@playwright/test';
import { SaucedemoLogin } from '../pages/saucedemo_Login';
import { SaucedemoInventory } from '../pages/saucedemo_Inventory';
import { SaucedemoCart } from '../pages/saucedemo_Cart';

const credentials = require('../data/credentials.json');

test.describe('SauceDemo E2E - Single Continuous Flow', () => {
    
    test('Execute Tests 1, 3, 4, 5, and 6 in a single journey', async ({ page }) => {
        // Initialize Page Objects
        const loginPage = new SaucedemoLogin(page);
        const inventoryPage = new SaucedemoInventory(page);
        const cartPage = new SaucedemoCart(page);

        // --- PRE-CONDITION ---
        await loginPage.navigate();

        // --- TEST 1: Validate for valid login ---
        console.log('Step 1: Executing Test 1 (Valid Login)...');
        await loginPage.login(credentials.validUser, credentials.validPassword);
        await inventoryPage.verifyIsLoaded();

        // --- TEST 3: Validate the number of products in products page ---
        console.log('Step 2: Executing Test 3 (Product Count)...');
        const count = await inventoryPage.getProductCount();
        expect(count).toBe(6);

        // --- TEST 4: Verify the sorting of products (Price Low to High) ---
        console.log('Step 3: Executing Test 4 (Sorting)...');
        await inventoryPage.sortProductsBy('lohi');
        const prices = await inventoryPage.getPricesAsNumbers();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);

        // --- TEST 5: Verify to add any 2 products to cart ---
        console.log('Step 4: Executing Test 5 (Add to Cart)...');
        await inventoryPage.addSpecificNumberOfProductsToCart(2);
        await inventoryPage.navigateToCart();
        
        let cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(2);

        // --- TEST 6: Verify to remove 1 product in the cart ---
        console.log('Step 5: Executing Test 6 (Remove from Cart)...');
        await cartPage.removeSpecificNumberOfItems(1);
        
        cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(1);
        
        console.log(' Single Flow E2E execution completed successfully!');
    });
});