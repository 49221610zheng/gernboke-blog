// Lighthouse 性能测试
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// 测试配置
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'max-potential-fid',
      'interactive',
      'performance-budget',
      'accessibility',
      'best-practices',
      'seo'
    ],
    emulatedFormFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    auditMode: false,
    gatherMode: false,
    disableDeviceEmulation: false,
    disableStorageReset: false,
    locale: 'zh-CN'
  }
};

// 性能阈值
const thresholds = {
  performance: 90,
  accessibility: 95,
  'best-practices': 90,
  seo: 90,
  'first-contentful-paint': 2000,
  'largest-contentful-paint': 2500,
  'cumulative-layout-shift': 0.1,
  'total-blocking-time': 300,
  'speed-index': 3000
};

// 测试页面
const testPages = [
  {
    name: 'Homepage',
    url: 'http://localhost:8000',
    description: '首页性能测试'
  },
  {
    name: 'Admin',
    url: 'http://localhost:8000/admin.html',
    description: '管理后台性能测试'
  }
];

async function runLighthouseTest(url, name) {
  console.log(`🔍 Running Lighthouse test for ${name}...`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      disableDeviceEmulation: false,
      emulatedFormFactor: 'desktop'
    }, config);
    
    if (!runnerResult) {
      throw new Error('Lighthouse failed to return results');
    }
    
    const { lhr } = runnerResult;
    
    // 提取关键指标
    const metrics = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue,
      si: lhr.audits['speed-index'].numericValue,
      fid: lhr.audits['max-potential-fid'].numericValue
    };
    
    // 保存详细报告
    const reportDir = path.join(process.cwd(), 'lighthouse-results');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, `${name.toLowerCase()}-report.html`);
    fs.writeFileSync(reportPath, runnerResult.report);
    
    const jsonPath = path.join(reportDir, `${name.toLowerCase()}-results.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(lhr, null, 2));
    
    console.log(`📊 ${name} Results:`);
    console.log(`   Performance: ${metrics.performance}/100`);
    console.log(`   Accessibility: ${metrics.accessibility}/100`);
    console.log(`   Best Practices: ${metrics.bestPractices}/100`);
    console.log(`   SEO: ${metrics.seo}/100`);
    console.log(`   FCP: ${Math.round(metrics.fcp)}ms`);
    console.log(`   LCP: ${Math.round(metrics.lcp)}ms`);
    console.log(`   CLS: ${metrics.cls.toFixed(3)}`);
    console.log(`   TBT: ${Math.round(metrics.tbt)}ms`);
    console.log(`   Speed Index: ${Math.round(metrics.si)}ms`);
    
    // 检查是否满足阈值
    const failures = [];
    
    if (metrics.performance < thresholds.performance) {
      failures.push(`Performance score ${metrics.performance} below threshold ${thresholds.performance}`);
    }
    
    if (metrics.accessibility < thresholds.accessibility) {
      failures.push(`Accessibility score ${metrics.accessibility} below threshold ${thresholds.accessibility}`);
    }
    
    if (metrics.bestPractices < thresholds['best-practices']) {
      failures.push(`Best Practices score ${metrics.bestPractices} below threshold ${thresholds['best-practices']}`);
    }
    
    if (metrics.seo < thresholds.seo) {
      failures.push(`SEO score ${metrics.seo} below threshold ${thresholds.seo}`);
    }
    
    if (metrics.fcp > thresholds['first-contentful-paint']) {
      failures.push(`FCP ${Math.round(metrics.fcp)}ms above threshold ${thresholds['first-contentful-paint']}ms`);
    }
    
    if (metrics.lcp > thresholds['largest-contentful-paint']) {
      failures.push(`LCP ${Math.round(metrics.lcp)}ms above threshold ${thresholds['largest-contentful-paint']}ms`);
    }
    
    if (metrics.cls > thresholds['cumulative-layout-shift']) {
      failures.push(`CLS ${metrics.cls.toFixed(3)} above threshold ${thresholds['cumulative-layout-shift']}`);
    }
    
    if (metrics.tbt > thresholds['total-blocking-time']) {
      failures.push(`TBT ${Math.round(metrics.tbt)}ms above threshold ${thresholds['total-blocking-time']}ms`);
    }
    
    if (failures.length > 0) {
      console.log(`❌ ${name} failed performance thresholds:`);
      failures.forEach(failure => console.log(`   - ${failure}`));
      return false;
    } else {
      console.log(`✅ ${name} passed all performance thresholds`);
      return true;
    }
    
  } finally {
    await chrome.kill();
  }
}

async function runAllTests() {
  console.log('🚀 Starting Lighthouse performance tests...\n');
  
  let allPassed = true;
  const results = [];
  
  for (const page of testPages) {
    try {
      const passed = await runLighthouseTest(page.url, page.name);
      results.push({ name: page.name, passed });
      
      if (!passed) {
        allPassed = false;
      }
      
      console.log(''); // 空行分隔
    } catch (error) {
      console.error(`❌ Error testing ${page.name}:`, error.message);
      results.push({ name: page.name, passed: false, error: error.message });
      allPassed = false;
    }
  }
  
  // 生成汇总报告
  console.log('📋 Performance Test Summary:');
  console.log('================================');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('');
  
  if (allPassed) {
    console.log('🎉 All performance tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some performance tests failed!');
    process.exit(1);
  }
}

// 检查服务器是否运行
async function checkServer() {
  const http = require('http');
  
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8000', (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// 主函数
async function main() {
  // 检查服务器是否运行
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ Development server is not running on http://localhost:8000');
    console.log('Please start the server with: npm run serve');
    process.exit(1);
  }
  
  await runAllTests();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Lighthouse test failed:', error);
    process.exit(1);
  });
}

module.exports = { runLighthouseTest, runAllTests };
