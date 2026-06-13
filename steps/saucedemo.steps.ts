import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from '../support/hooks'; // Import the page from our hooks
import { SaucedemoLogin } from '../pages/saucedemo_Login';
import { SaucedemoInventory } from '../pages/saucedemo_Inventory';
import { SaucedemoCart } from '../pages/saucedemo_Cart';
import testData from '../data/testData.json';

// Initialize variables for Page Objects
let loginPage: SaucedemoLogin;
let inventoryPage: SaucedemoInventory;
let cartPage: SaucedemoCart;

Given('I navigate to the SauceDemo login page', async () => {
    loginPage = new SaucedemoLogin(page);
    await loginPage.navigate();
});

When('I log in with valid credentials', async () => {
    await loginPage.login(testData.credentials.validUser, testData.credentials.validPassword);
    
    // Initialize next pages after login
    inventoryPage = new SaucedemoInventory(page);
    cartPage = new SaucedemoCart(page);
    await inventoryPage.verifyIsLoaded();
});

Then('I should see exactly {int} products on the inventory page', async (expectedCount: number) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(expectedCount);
});

When('I sort the products by {string}', async (sortString: string) => {
    // Note: If your feature says "Price (low to high)", map it to the actual value 'lohi' here
    await inventoryPage.sortProductsBy(testData.inventorySettings.sortFilterValue);
});

Then('the products should be sorted correctly', async () => {
    const prices = await inventoryPage.getPricesAsNumbers();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
});

When('I add {int} products to the cart', async (itemsToAdd: number) => {
    await inventoryPage.addSpecificNumberOfProductsToCart(itemsToAdd);
});

Then('the cart badge should display {int}', async (expectedCount: number) => {
    // UPDATED: This now asks the Inventory page to look at the red badge!
    const cartCount = await inventoryPage.getCartBadgeCount(); 
    expect(cartCount).toBe(expectedCount);
});

When('I remove {int} product from the cart', async (itemsToRemove: number) => {
    await inventoryPage.navigateToCart();
    await cartPage.removeSpecificNumberOfItems(itemsToRemove);
});

When('I log in with invalid credentials', async () => {
    // Fetches the invalid credentials from your updated JSON file
    await loginPage.login(testData.credentials.invalidUser, testData.credentials.invalidPassword);
});

Then('I should see an error message {string}', async (expectedMessage: string) => {
    // Passes the string from the feature file directly into your Page Object method
    await loginPage.verifyErrorMessage(expectedMessage);
});