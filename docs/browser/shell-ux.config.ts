import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: '.',
  testMatch: ['shell-ux.spec.ts', 'shell-journeys.spec.ts'],
  outputDir: process.env.GENUX_SHELL_UX_ARTIFACTS ?? '/tmp/genux-shell-ux-browser',
  retries: 0,
  workers: 1,
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4335',
    viewport: { width: 320, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    colorScheme: 'light',
  },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({
    name: browserName,
    use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit' },
  })),
  webServer: {
    command: 'python3 -m http.server 4335 --bind 127.0.0.1 --directory docs/dist',
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    url: 'http://127.0.0.1:4335',
    reuseExistingServer: false,
  },
});
