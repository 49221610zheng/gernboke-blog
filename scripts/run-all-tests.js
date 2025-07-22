// 完整测试运行脚本
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      lint: null,
      unit: null,
      e2e: null,
      performance: null,
      accessibility: null
    };
    
    this.startTime = Date.now();
  }
  
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      progress: '🔄'
    }[type] || '📝';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }
  
  async runCommand(command, options = {}) {
    this.log(`Running: ${command}`, 'progress');
    
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      try {
        const result = execSync(command, {
          encoding: 'utf8',
          stdio: options.silent ? 'pipe' : 'inherit',
          ...options
        });
        
        const duration = Date.now() - startTime;
        resolve({ 
          success: true, 
          output: result, 
          duration,
          command 
        });
        
      } catch (error) {
        const duration = Date.now() - startTime;
        resolve({ 
          success: false, 
          error: error.message, 
          duration,
          command 
        });
      }
    });
  }
  
  async startDevServer() {
    this.log('🌐 Starting development server...', 'progress');
    
    return new Promise((resolve, reject) => {
      const server = spawn('npm', ['run', 'serve'], {
        stdio: 'pipe',
        detached: false
      });
      
      let output = '';
      
      server.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('Available on:') || output.includes('Local:')) {
          this.log('Development server started', 'success');
          resolve(server);
        }
      });
      
      server.stderr.on('data', (data) => {
        console.error(data.toString());
      });
      
      server.on('error', (error) => {
        reject(error);
      });
      
      // 超时处理
      setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 30000);
    });
  }
  
  async checkServerHealth() {
    this.log('🔍 Checking server health...', 'progress');
    
    const maxRetries = 10;
    const retryDelay = 2000;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await this.runCommand('curl -f http://localhost:8000 -o /dev/null -s', { silent: true });
        if (result.success) {
          this.log('Server is healthy', 'success');
          return true;
        }
      } catch (error) {
        // 忽略错误，继续重试
      }
      
      if (i < maxRetries - 1) {
        this.log(`Server not ready, retrying in ${retryDelay/1000}s... (${i + 1}/${maxRetries})`, 'progress');
        await this.sleep(retryDelay);
      }
    }
    
    throw new Error('Server health check failed');
  }
  
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async runLintTests() {
    this.log('🔍 Running lint tests...', 'progress');
    
    const result = await this.runCommand('npm run lint');
    this.results.lint = result;
    
    if (result.success) {
      this.log('Lint tests passed', 'success');
    } else {
      this.log('Lint tests failed', 'error');
    }
    
    return result.success;
  }
  
  async runUnitTests() {
    this.log('🧪 Running unit tests...', 'progress');
    
    const result = await this.runCommand('npm run test:coverage');
    this.results.unit = result;
    
    if (result.success) {
      this.log('Unit tests passed', 'success');
    } else {
      this.log('Unit tests failed', 'error');
    }
    
    return result.success;
  }
  
  async runE2ETests() {
    this.log('🎭 Running E2E tests...', 'progress');
    
    const result = await this.runCommand('npm run test:e2e');
    this.results.e2e = result;
    
    if (result.success) {
      this.log('E2E tests passed', 'success');
    } else {
      this.log('E2E tests failed', 'error');
    }
    
    return result.success;
  }
  
  async runPerformanceTests() {
    this.log('⚡ Running performance tests...', 'progress');
    
    const result = await this.runCommand('npm run test:lighthouse');
    this.results.performance = result;
    
    if (result.success) {
      this.log('Performance tests passed', 'success');
    } else {
      this.log('Performance tests failed', 'error');
    }
    
    return result.success;
  }
  
  async runAccessibilityTests() {
    this.log('♿ Running accessibility tests...', 'progress');
    
    const result = await this.runCommand('npm run test:accessibility');
    this.results.accessibility = result;
    
    if (result.success) {
      this.log('Accessibility tests passed', 'success');
    } else {
      this.log('Accessibility tests failed', 'error');
    }
    
    return result.success;
  }
  
  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const passed = Object.values(this.results).filter(r => r && r.success).length;
    const total = Object.values(this.results).filter(r => r !== null).length;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    
    Object.entries(this.results).forEach(([testType, result]) => {
      if (result === null) {
        console.log(`⏭️  ${testType.toUpperCase()}: SKIPPED`);
      } else if (result.success) {
        console.log(`✅ ${testType.toUpperCase()}: PASSED (${result.duration}ms)`);
      } else {
        console.log(`❌ ${testType.toUpperCase()}: FAILED (${result.duration}ms)`);
      }
    });
    
    console.log('='.repeat(80));
    console.log(`📈 Overall: ${passed}/${total} tests passed`);
    console.log(`⏱️  Total duration: ${totalDuration}ms`);
    console.log('='.repeat(80));
    
    // 生成 JSON 报告
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration,
      passed,
      total,
      success: passed === total,
      results: this.results
    };
    
    const reportPath = path.join(process.cwd(), 'test-results', 'summary.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Test report saved: ${reportPath}`, 'info');
    
    return report;
  }
  
  async runAllTests(options = {}) {
    const {
      skipLint = false,
      skipUnit = false,
      skipE2E = false,
      skipPerformance = false,
      skipAccessibility = false,
      startServer = true
    } = options;
    
    let server = null;
    
    try {
      console.log('🚀 Starting comprehensive test suite...\n');
      
      // 启动开发服务器
      if (startServer) {
        server = await this.startDevServer();
        await this.checkServerHealth();
      }
      
      // 运行测试
      const testResults = [];
      
      if (!skipLint) {
        testResults.push(await this.runLintTests());
      }
      
      if (!skipUnit) {
        testResults.push(await this.runUnitTests());
      }
      
      if (!skipE2E) {
        testResults.push(await this.runE2ETests());
      }
      
      if (!skipPerformance) {
        testResults.push(await this.runPerformanceTests());
      }
      
      if (!skipAccessibility) {
        testResults.push(await this.runAccessibilityTests());
      }
      
      // 生成报告
      const report = this.generateReport();
      
      if (report.success) {
        this.log('🎉 All tests passed!', 'success');
        process.exit(0);
      } else {
        this.log('❌ Some tests failed!', 'error');
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      // 清理服务器
      if (server) {
        this.log('🛑 Stopping development server...', 'progress');
        server.kill('SIGTERM');
        
        // 强制杀死进程组
        setTimeout(() => {
          try {
            process.kill(-server.pid, 'SIGKILL');
          } catch (error) {
            // 忽略错误
          }
        }, 5000);
      }
    }
  }
}

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  args.forEach(arg => {
    switch (arg) {
      case '--skip-lint':
        options.skipLint = true;
        break;
      case '--skip-unit':
        options.skipUnit = true;
        break;
      case '--skip-e2e':
        options.skipE2E = true;
        break;
      case '--skip-performance':
        options.skipPerformance = true;
        break;
      case '--skip-accessibility':
        options.skipAccessibility = true;
        break;
      case '--no-server':
        options.startServer = false;
        break;
    }
  });
  
  return options;
}

// 如果直接运行此脚本
if (require.main === module) {
  const options = parseArgs();
  const testRunner = new TestRunner();
  testRunner.runAllTests(options);
}

module.exports = TestRunner;
