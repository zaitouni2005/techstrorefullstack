import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 4,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "./estore-ui/node_modules/.bin/vite --port 5173 --root estore-ui --config vite.e2e.config.ts",
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
