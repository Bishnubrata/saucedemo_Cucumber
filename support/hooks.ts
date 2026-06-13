import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

// Set a default timeout for Cucumber steps
setDefaultTimeout(60000);

let browser: Browser;
export let page: Page; // We export the page so our steps can use it

// Starts the browser once before all tests
BeforeAll(async () => {
    browser = await chromium.launch({ headless: false }); 
});

// Closes the browser after everything is done
AfterAll(async () => {
    await browser.close();
});

// Creates a fresh browser tab for every new Scenario
Before(async () => {
    page = await browser.newPage();
});

// Closes the tab after the Scenario finishes
After(async () => {
    await page.close();
});