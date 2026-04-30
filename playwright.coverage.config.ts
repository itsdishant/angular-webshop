import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  webServer: {
    command: 'node tools/serve-static.mjs dist/lifestyle-stores-instrumented 4201',
    url: 'http://127.0.0.1:4201',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4201',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-coverage',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
