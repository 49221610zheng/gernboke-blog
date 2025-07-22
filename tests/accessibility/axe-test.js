// 可访问性测试 (axe-core)
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs');
const path = require('path');

// 测试配置
const config = {
  rules: {
    // 启用所有规则
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
    'semantic-markup': { enabled: true },
    'image-alt': { enabled: true },
    'form-labels': { enabled: true },
    'heading-structure': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
  locale: 'zh-CN'
};

// 测试页面
const testPages = [
  {
    name: 'Homepage',
    url: 'http://localhost:8000',
    description: '首页可访问性测试',
    actions: []
  },
  {
    name: 'Admin Login',
    url: 'http://localhost:8000/admin.html',
    description: '管理后台登录页面可访问性测试',
    actions: []
  }
];

// 可访问性阈值
const thresholds = {
  violations: 0,        // 严重违规数量
  incomplete: 5,        // 需要手动检查的项目数量
  minor: 10            // 轻微问题数量
};

async function runAxeTest(page, pageName) {
  console.log(`🔍 Running accessibility test for ${pageName}...`);
  
  try {
    // 注入 axe-core
    await page.addScriptTag({
      content: axeCore.source
    });
    
    // 运行 axe 测试
    const results = await page.evaluate((config) => {
      return new Promise((resolve) => {
        axe.run(document, config, (err, results) => {
          if (err) throw err;
          resolve(results);
        });
      });
    }, config);
    
    // 分析结果
    const violations = results.violations || [];
    const incomplete = results.incomplete || [];
    const passes = results.passes || [];
    
    console.log(`📊 ${pageName} Accessibility Results:`);
    console.log(`   ✅ Passed: ${passes.length} rules`);
    console.log(`   ❌ Violations: ${violations.length}`);
    console.log(`   ⚠️  Incomplete: ${incomplete.length}`);
    
    // 详细报告违规项
    if (violations.length > 0) {
      console.log(`\n❌ Accessibility Violations for ${pageName}:`);
      violations.forEach((violation, index) => {
        console.log(`\n   ${index + 1}. ${violation.id} (${violation.impact})`);
        console.log(`      Description: ${violation.description}`);
        console.log(`      Help: ${violation.help}`);
        console.log(`      Nodes affected: ${violation.nodes.length}`);
        
        // 显示前3个受影响的元素
        violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
          console.log(`      ${nodeIndex + 1}. ${node.target.join(' ')}`);
          if (node.failureSummary) {
            console.log(`         Issue: ${node.failureSummary}`);
          }
        });
        
        if (violation.nodes.length > 3) {
          console.log(`      ... and ${violation.nodes.length - 3} more`);
        }
      });
    }
    
    // 报告需要手动检查的项目
    if (incomplete.length > 0) {
      console.log(`\n⚠️  Items requiring manual review for ${pageName}:`);
      incomplete.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.id}: ${item.description}`);
      });
    }
    
    // 保存详细报告
    const reportDir = path.join(process.cwd(), 'accessibility-results');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, `${pageName.toLowerCase()}-accessibility.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    
    // 生成HTML报告
    const htmlReport = generateHTMLReport(results, pageName);
    const htmlPath = path.join(reportDir, `${pageName.toLowerCase()}-accessibility.html`);
    fs.writeFileSync(htmlPath, htmlReport);
    
    // 检查是否通过阈值
    const criticalViolations = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    const minorViolations = violations.filter(v => v.impact === 'moderate' || v.impact === 'minor');
    
    const passed = criticalViolations.length <= thresholds.violations &&
                  incomplete.length <= thresholds.incomplete &&
                  minorViolations.length <= thresholds.minor;
    
    if (passed) {
      console.log(`✅ ${pageName} passed accessibility thresholds`);
    } else {
      console.log(`❌ ${pageName} failed accessibility thresholds:`);
      if (criticalViolations.length > thresholds.violations) {
        console.log(`   - Critical violations: ${criticalViolations.length} (threshold: ${thresholds.violations})`);
      }
      if (incomplete.length > thresholds.incomplete) {
        console.log(`   - Incomplete items: ${incomplete.length} (threshold: ${thresholds.incomplete})`);
      }
      if (minorViolations.length > thresholds.minor) {
        console.log(`   - Minor violations: ${minorViolations.length} (threshold: ${thresholds.minor})`);
      }
    }
    
    return {
      passed,
      violations: violations.length,
      incomplete: incomplete.length,
      passes: passes.length,
      criticalViolations: criticalViolations.length,
      minorViolations: minorViolations.length
    };
    
  } catch (error) {
    console.error(`❌ Error running accessibility test for ${pageName}:`, error);
    throw error;
  }
}

function generateHTMLReport(results, pageName) {
  const violations = results.violations || [];
  const incomplete = results.incomplete || [];
  const passes = results.passes || [];
  
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageName} - 可访问性测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; }
        .violation { background: #ffebee; padding: 15px; margin: 10px 0; border-left: 4px solid #f44336; }
        .incomplete { background: #fff3e0; padding: 15px; margin: 10px 0; border-left: 4px solid #ff9800; }
        .pass { background: #e8f5e8; padding: 15px; margin: 10px 0; border-left: 4px solid #4caf50; }
        .impact-critical { color: #d32f2f; font-weight: bold; }
        .impact-serious { color: #f57c00; font-weight: bold; }
        .impact-moderate { color: #1976d2; }
        .impact-minor { color: #388e3c; }
        .node { background: #f9f9f9; padding: 10px; margin: 5px 0; border-radius: 3px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .stat { text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px; }
        .stat-number { font-size: 2em; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${pageName} - 可访问性测试报告</h1>
        <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
    </div>
    
    <div class="section">
        <h2>测试摘要</h2>
        <div class="summary">
            <div class="stat">
                <div class="stat-number" style="color: #4caf50;">${passes.length}</div>
                <div>通过的规则</div>
            </div>
            <div class="stat">
                <div class="stat-number" style="color: #f44336;">${violations.length}</div>
                <div>违规项</div>
            </div>
            <div class="stat">
                <div class="stat-number" style="color: #ff9800;">${incomplete.length}</div>
                <div>需要手动检查</div>
            </div>
        </div>
    </div>
    
    ${violations.length > 0 ? `
    <div class="section">
        <h2>违规项 (${violations.length})</h2>
        ${violations.map(violation => `
            <div class="violation">
                <h3>${violation.id} <span class="impact-${violation.impact}">(${violation.impact})</span></h3>
                <p><strong>描述:</strong> ${violation.description}</p>
                <p><strong>帮助:</strong> ${violation.help}</p>
                <p><strong>受影响的元素:</strong> ${violation.nodes.length}</p>
                ${violation.nodes.map(node => `
                    <div class="node">
                        <strong>选择器:</strong> ${node.target.join(' ')}<br>
                        ${node.failureSummary ? `<strong>问题:</strong> ${node.failureSummary}` : ''}
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${incomplete.length > 0 ? `
    <div class="section">
        <h2>需要手动检查的项目 (${incomplete.length})</h2>
        ${incomplete.map(item => `
            <div class="incomplete">
                <h3>${item.id}</h3>
                <p>${item.description}</p>
            </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div class="section">
        <h2>通过的规则 (${passes.length})</h2>
        ${passes.slice(0, 10).map(pass => `
            <div class="pass">
                <strong>${pass.id}:</strong> ${pass.description}
            </div>
        `).join('')}
        ${passes.length > 10 ? `<p>... 还有 ${passes.length - 10} 个通过的规则</p>` : ''}
    </div>
</body>
</html>
  `;
}

async function runAllAccessibilityTests() {
  console.log('🚀 Starting accessibility tests...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  let allPassed = true;
  const results = [];
  
  try {
    for (const testPage of testPages) {
      const page = await browser.newPage();
      
      try {
        await page.goto(testPage.url, { waitUntil: 'networkidle0' });
        
        // 执行页面特定的操作
        for (const action of testPage.actions) {
          await action(page);
        }
        
        const result = await runAxeTest(page, testPage.name);
        results.push({ name: testPage.name, ...result });
        
        if (!result.passed) {
          allPassed = false;
        }
        
      } catch (error) {
        console.error(`❌ Error testing ${testPage.name}:`, error.message);
        results.push({ name: testPage.name, passed: false, error: error.message });
        allPassed = false;
      } finally {
        await page.close();
      }
      
      console.log(''); // 空行分隔
    }
    
  } finally {
    await browser.close();
  }
  
  // 生成汇总报告
  console.log('📋 Accessibility Test Summary:');
  console.log('=================================');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (result.violations !== undefined) {
      console.log(`   Violations: ${result.violations}, Incomplete: ${result.incomplete}, Passes: ${result.passes}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('');
  
  if (allPassed) {
    console.log('🎉 All accessibility tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some accessibility tests failed!');
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
  
  await runAllAccessibilityTests();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Accessibility test failed:', error);
    process.exit(1);
  });
}

module.exports = { runAxeTest, runAllAccessibilityTests };
