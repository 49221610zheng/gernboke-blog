// Jest 配置文件
module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',
  
  // 测试文件匹配模式
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // 忽略的文件和目录
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
    '/tests/performance/',
    '/tests/accessibility/'
  ],
  
  // 覆盖率配置
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/firebase-config.js',
    '!js/config/**',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // 设置文件
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // 模块映射
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/js/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  
  // 转换配置
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // 模拟模块
  moduleFileExtensions: ['js', 'json'],
  
  // 测试超时
  testTimeout: 10000,
  
  // 详细输出
  verbose: true,
  
  // 清除模拟
  clearMocks: true,
  
  // 恢复模拟
  restoreMocks: true
};
