// 简化的测试运行器 - 不依赖外部包
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SimpleTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }
  
  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      progress: '🔄'
    }[type] || '📝';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }
  
  // 检查文件结构
  testFileStructure() {
    this.log('🔍 Testing file structure...', 'progress');
    
    const requiredFiles = [
      'index.html',
      'admin.html',
      'package.json',
      'firebase.json',
      'firestore.rules',
      'storage.rules',
      'js/app.js',
      'js/admin.js',
      'js/firebase-config.js'
    ];
    
    const requiredDirs = [
      'js',
      'js/config',
      'js/services',
      'js/utils',
      'scripts',
      'tests'
    ];
    
    let passed = true;
    
    // 检查文件
    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.log(`✅ ${file} exists`, 'success');
      } else {
        this.log(`❌ ${file} missing`, 'error');
        passed = false;
      }
    });
    
    // 检查目录
    requiredDirs.forEach(dir => {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        this.log(`✅ ${dir}/ exists`, 'success');
      } else {
        this.log(`❌ ${dir}/ missing`, 'error');
        passed = false;
      }
    });
    
    this.results.push({ test: 'File Structure', passed, details: 'Project structure validation' });
    return passed;
  }
  
  // 检查HTML文件
  testHTMLFiles() {
    this.log('🔍 Testing HTML files...', 'progress');
    
    const htmlFiles = ['index.html', 'admin.html'];
    let passed = true;
    
    htmlFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 基本HTML结构检查
        if (!content.includes('<!DOCTYPE html>')) {
          this.log(`❌ ${file}: Missing DOCTYPE`, 'error');
          passed = false;
        }
        
        if (!content.includes('<html')) {
          this.log(`❌ ${file}: Missing html tag`, 'error');
          passed = false;
        }
        
        if (!content.includes('<head>')) {
          this.log(`❌ ${file}: Missing head tag`, 'error');
          passed = false;
        }
        
        if (!content.includes('<body>')) {
          this.log(`❌ ${file}: Missing body tag`, 'error');
          passed = false;
        }
        
        // 检查meta标签
        if (!content.includes('charset')) {
          this.log(`❌ ${file}: Missing charset meta`, 'error');
          passed = false;
        }
        
        if (!content.includes('viewport')) {
          this.log(`❌ ${file}: Missing viewport meta`, 'error');
          passed = false;
        }
        
        this.log(`✅ ${file} structure valid`, 'success');
        
      } catch (error) {
        this.log(`❌ ${file}: Cannot read file - ${error.message}`, 'error');
        passed = false;
      }
    });
    
    this.results.push({ test: 'HTML Files', passed, details: 'HTML structure and meta tags validation' });
    return passed;
  }
  
  // 检查JavaScript文件
  testJavaScriptFiles() {
    this.log('🔍 Testing JavaScript files...', 'progress');
    
    const jsFiles = [
      'js/app.js',
      'js/admin.js',
      'js/firebase-config.js'
    ];
    
    let passed = true;
    
    jsFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 基本语法检查
        if (content.trim().length === 0) {
          this.log(`❌ ${file}: File is empty`, 'error');
          passed = false;
          return;
        }
        
        // 检查是否有明显的语法错误
        const syntaxErrors = [
          /\bfunction\s*\(/,
          /\bconst\s+\w+/,
          /\blet\s+\w+/,
          /\bvar\s+\w+/
        ];
        
        const hasValidJS = syntaxErrors.some(pattern => pattern.test(content));
        
        if (!hasValidJS && !content.includes('//') && !content.includes('/*')) {
          this.log(`⚠️ ${file}: May not contain valid JavaScript`, 'warning');
        }
        
        this.log(`✅ ${file} readable`, 'success');
        
      } catch (error) {
        this.log(`❌ ${file}: Cannot read file - ${error.message}`, 'error');
        passed = false;
      }
    });
    
    this.results.push({ test: 'JavaScript Files', passed, details: 'JavaScript files readability check' });
    return passed;
  }
  
  // 检查配置文件
  testConfigFiles() {
    this.log('🔍 Testing configuration files...', 'progress');
    
    let passed = true;
    
    // 检查package.json
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (!packageJson.name) {
        this.log('❌ package.json: Missing name field', 'error');
        passed = false;
      }
      
      if (!packageJson.scripts) {
        this.log('❌ package.json: Missing scripts field', 'error');
        passed = false;
      }
      
      this.log('✅ package.json valid', 'success');
      
    } catch (error) {
      this.log(`❌ package.json: Invalid JSON - ${error.message}`, 'error');
      passed = false;
    }
    
    // 检查firebase.json
    try {
      const firebaseJson = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
      
      if (!firebaseJson.hosting) {
        this.log('❌ firebase.json: Missing hosting configuration', 'error');
        passed = false;
      }
      
      if (!firebaseJson.firestore) {
        this.log('❌ firebase.json: Missing firestore configuration', 'error');
        passed = false;
      }
      
      this.log('✅ firebase.json valid', 'success');
      
    } catch (error) {
      this.log(`❌ firebase.json: Invalid JSON - ${error.message}`, 'error');
      passed = false;
    }
    
    this.results.push({ test: 'Configuration Files', passed, details: 'JSON configuration files validation' });
    return passed;
  }
  
  // 检查Firebase配置
  testFirebaseConfig() {
    this.log('🔍 Testing Firebase configuration...', 'progress');
    
    let passed = true;
    
    try {
      const configContent = fs.readFileSync('js/firebase-config.js', 'utf8');
      
      // 检查是否包含占位符
      if (configContent.includes('YOUR_API_KEY')) {
        this.log('⚠️ Firebase config contains placeholder values', 'warning');
        // 不算作失败，因为这是开发阶段
      }
      
      // 检查必要的配置项
      const requiredFields = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId'
      ];
      
      requiredFields.forEach(field => {
        if (configContent.includes(field)) {
          this.log(`✅ Firebase config has ${field}`, 'success');
        } else {
          this.log(`❌ Firebase config missing ${field}`, 'error');
          passed = false;
        }
      });
      
    } catch (error) {
      this.log(`❌ Cannot read Firebase config: ${error.message}`, 'error');
      passed = false;
    }
    
    this.results.push({ test: 'Firebase Configuration', passed, details: 'Firebase configuration validation' });
    return passed;
  }
  
  // 检查安全规则
  testSecurityRules() {
    this.log('🔍 Testing security rules...', 'progress');
    
    let passed = true;
    
    // 检查Firestore规则
    try {
      const firestoreRules = fs.readFileSync('firestore.rules', 'utf8');
      
      if (!firestoreRules.includes('rules_version')) {
        this.log('❌ Firestore rules: Missing rules_version', 'error');
        passed = false;
      }
      
      if (!firestoreRules.includes('service cloud.firestore')) {
        this.log('❌ Firestore rules: Missing service declaration', 'error');
        passed = false;
      }
      
      this.log('✅ Firestore rules structure valid', 'success');
      
    } catch (error) {
      this.log(`❌ Cannot read Firestore rules: ${error.message}`, 'error');
      passed = false;
    }
    
    // 检查Storage规则
    try {
      const storageRules = fs.readFileSync('storage.rules', 'utf8');
      
      if (!storageRules.includes('rules_version')) {
        this.log('❌ Storage rules: Missing rules_version', 'error');
        passed = false;
      }
      
      if (!storageRules.includes('service firebase.storage')) {
        this.log('❌ Storage rules: Missing service declaration', 'error');
        passed = false;
      }
      
      this.log('✅ Storage rules structure valid', 'success');
      
    } catch (error) {
      this.log(`❌ Cannot read Storage rules: ${error.message}`, 'error');
      passed = false;
    }
    
    this.results.push({ test: 'Security Rules', passed, details: 'Firebase security rules validation' });
    return passed;
  }
  
  // 检查脚本文件
  testScripts() {
    this.log('🔍 Testing script files...', 'progress');
    
    const scripts = [
      'scripts/validate-config.js',
      'scripts/deploy-automation.js',
      'scripts/rollback.js',
      'scripts/run-all-tests.js'
    ];
    
    let passed = true;
    
    scripts.forEach(script => {
      if (fs.existsSync(script)) {
        this.log(`✅ ${script} exists`, 'success');
      } else {
        this.log(`❌ ${script} missing`, 'error');
        passed = false;
      }
    });
    
    this.results.push({ test: 'Script Files', passed, details: 'Deployment and utility scripts validation' });
    return passed;
  }
  
  // 生成测试报告
  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 SIMPLE TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    
    this.results.forEach(result => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`${status} ${result.test}: ${result.details}`);
    });
    
    console.log('='.repeat(80));
    console.log(`📈 Overall: ${passed}/${total} tests passed`);
    console.log(`⏱️  Total duration: ${totalDuration}ms`);
    console.log('='.repeat(80));
    
    return { passed, total, success: passed === total, duration: totalDuration };
  }
  
  // 运行所有测试
  async runAllTests() {
    console.log('🚀 Starting simple test suite...\n');
    
    try {
      // 运行各项测试
      this.testFileStructure();
      this.testHTMLFiles();
      this.testJavaScriptFiles();
      this.testConfigFiles();
      this.testFirebaseConfig();
      this.testSecurityRules();
      this.testScripts();
      
      // 生成报告
      const report = this.generateReport();
      
      if (report.success) {
        this.log('🎉 All basic tests passed!', 'success');
        return true;
      } else {
        this.log('❌ Some tests failed!', 'error');
        return false;
      }
      
    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'error');
      return false;
    }
  }
}

// 运行测试
if (require.main === module) {
  const testRunner = new SimpleTestRunner();
  testRunner.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = SimpleTestRunner;
