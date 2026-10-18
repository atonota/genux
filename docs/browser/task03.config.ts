import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: '.',
  testMatch: 'task03.spec.ts',
  outputDir: process.env.GENUX_TASK03_ARTIFACTS ?? '/tmp/genux-task03-browser',
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4337',
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
    command: `python3 -m http.server 4337 --bind 127.0.0.1 --directory "${process.env.GENUX_TASK03_STATIC_ROOT ?? 'docs/dist'}"`,
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    url: 'http://127.0.0.1:4337',
    reuseExistingServer: false,
  },
});
