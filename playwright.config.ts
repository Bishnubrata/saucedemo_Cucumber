import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Read from default ".env" file
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  
  // Keep the HTML reporter to view your videos and traces easily
  reporter: [['html', { open: 'never' }]], 
  
  /* Shared settings for all the projects below */
  use: {
    // 1. Capture trace for every test ('on', 'retain-on-failure', 'on-first-retry', 'off')
    trace: 'on',
    
    // 2. Record video for every test ('on', 'retain-on-failure', 'on-first-retry', 'off')
    video: 'on',
    
    // 3. Capture a screenshot at the end of every test ('on', 'only-on-failure', 'off')
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    // Uncomment Firefox if you want to run on both browsers again
    // {
    //   name: 'Firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],
});