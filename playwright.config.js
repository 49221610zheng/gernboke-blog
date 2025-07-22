// Playwright 端到端测试配置
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 测试目录
  testDir: './tests/e2e',
  
  // 全局设置
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // 全局配置
  use: {
    // 基础URL
    baseURL: 'http://localhost:8000',
    
    // 浏览器配置
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // 等待配置
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // 其他配置
    ignoreHTTPSErrors: true,
    colorScheme: 'light'
  },

  // 项目配置 - 不同浏览器和设备
  projects: [
    // 桌面浏览器
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // 移动设备
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // 平板设备
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    }
  ],

  // 本地开发服务器
  webServer: {
    command: 'npm run serve',
    port: 8000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  // 输出目录
  outputDir: 'test-results/',
  
  // 全局设置和清理
  globalSetup: require.resolve('./tests/e2e/global-setup.js'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.js'),
  
  // 测试超时
  timeout: 30000,
  expect: {
    timeout: 5000
  }
});
