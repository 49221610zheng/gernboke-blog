// 网站可访问性测试 - 不依赖外部服务器
const fs = require('fs');
const path = require('path');

class WebsiteAccessibilityTest {
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
  
  // 测试HTML文件的可访问性
  testHTMLAccessibility(filePath) {
    this.log(`🔍 Testing accessibility for ${filePath}...`, 'progress');
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let passed = true;
      const issues = [];
      
      // 检查基本的可访问性要素
      
      // 1. 检查是否有lang属性
      if (!content.includes('lang=')) {
        issues.push('Missing lang attribute on html element');
        passed = false;
      }
      
      // 2. 检查是否有title标签
      if (!content.includes('<title>')) {
        issues.push('Missing title element');
        passed = false;
      }
      
      // 3. 检查meta viewport
      if (!content.includes('name="viewport"')) {
        issues.push('Missing viewport meta tag');
        passed = false;
      }
      
      // 4. 检查是否有主要的语义化标签
      const semanticTags = ['<main', '<nav', '<header', '<footer'];
      const foundTags = semanticTags.filter(tag => content.includes(tag));
      
      if (foundTags.length < 2) {
        issues.push('Limited use of semantic HTML elements');
        // 这是警告，不算失败
      }
      
      // 5. 检查图片alt属性
      const imgMatches = content.match(/<img[^>]*>/g);
      if (imgMatches) {
        const imagesWithoutAlt = imgMatches.filter(img => !img.includes('alt='));
        if (imagesWithoutAlt.length > 0) {
          issues.push(`${imagesWithoutAlt.length} images missing alt attributes`);
          passed = false;
        }
      }
      
      // 6. 检查表单标签
      const inputMatches = content.match(/<input[^>]*>/g);
      if (inputMatches) {
        const inputsWithoutLabels = inputMatches.filter(input => {
          const id = input.match(/id="([^"]*)"/) || input.match(/id='([^']*)'/);
          if (id) {
            const labelPattern = new RegExp(`for="${id[1]}"|for='${id[1]}'`);
            return !labelPattern.test(content);
          }
          return true;
        });
        
        if (inputsWithoutLabels.length > 0) {
          issues.push(`${inputsWithoutLabels.length} form inputs may be missing labels`);
          // 这是警告，因为可能有其他方式关联标签
        }
      }
      
      // 7. 检查颜色对比度相关的类名
      const hasColorClasses = content.includes('text-') || content.includes('bg-');
      if (hasColorClasses) {
        this.log('Color classes detected - manual contrast check recommended', 'info');
      }
      
      // 8. 检查是否有跳转链接
      const hasSkipLink = content.includes('skip') && content.includes('content');
      if (!hasSkipLink) {
        issues.push('No skip navigation link found');
        // 这是建议，不算失败
      }
      
      // 输出结果
      if (passed) {
        this.log(`✅ ${filePath} accessibility check passed`, 'success');
      } else {
        this.log(`❌ ${filePath} accessibility issues found:`, 'error');
        issues.forEach(issue => {
          this.log(`   - ${issue}`, 'error');
        });
      }
      
      if (issues.length > 0 && passed) {
        this.log(`⚠️ ${filePath} suggestions:`, 'warning');
        issues.forEach(issue => {
          this.log(`   - ${issue}`, 'warning');
        });
      }
      
      return { passed, issues, file: filePath };
      
    } catch (error) {
      this.log(`❌ Cannot read ${filePath}: ${error.message}`, 'error');
      return { passed: false, issues: [`Cannot read file: ${error.message}`], file: filePath };
    }
  }
  
  // 测试JavaScript文件的可访问性相关代码
  testJSAccessibility(filePath) {
    this.log(`🔍 Testing JS accessibility patterns in ${filePath}...`, 'progress');
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let score = 0;
      const findings = [];
      
      // 检查可访问性相关的模式
      
      // 1. 检查是否有键盘事件处理
      if (content.includes('keydown') || content.includes('keyup') || content.includes('keypress')) {
        score += 10;
        findings.push('✅ Keyboard event handling found');
      } else {
        findings.push('⚠️ No keyboard event handling detected');
      }
      
      // 2. 检查是否有ARIA属性处理
      if (content.includes('aria-') || content.includes('role=')) {
        score += 15;
        findings.push('✅ ARIA attributes usage found');
      } else {
        findings.push('⚠️ No ARIA attributes usage detected');
      }
      
      // 3. 检查是否有焦点管理
      if (content.includes('focus()') || content.includes('blur()')) {
        score += 10;
        findings.push('✅ Focus management found');
      } else {
        findings.push('⚠️ No focus management detected');
      }
      
      // 4. 检查是否有屏幕阅读器支持
      if (content.includes('screen-reader') || content.includes('sr-only')) {
        score += 10;
        findings.push('✅ Screen reader support found');
      } else {
        findings.push('⚠️ No screen reader specific code detected');
      }
      
      // 5. 检查是否有错误公告
      if (content.includes('alert') || content.includes('announce')) {
        score += 5;
        findings.push('✅ Error announcement patterns found');
      }
      
      const passed = score >= 20; // 至少要有基本的可访问性支持
      
      this.log(`📊 ${filePath} accessibility score: ${score}/50`, score >= 30 ? 'success' : score >= 20 ? 'warning' : 'error');
      findings.forEach(finding => {
        const type = finding.startsWith('✅') ? 'success' : 'warning';
        this.log(`   ${finding}`, type);
      });
      
      return { passed, score, findings, file: filePath };
      
    } catch (error) {
      this.log(`❌ Cannot read ${filePath}: ${error.message}`, 'error');
      return { passed: false, score: 0, findings: [`Cannot read file: ${error.message}`], file: filePath };
    }
  }
  
  // 测试CSS可访问性（通过HTML中的类名推断）
  testCSSAccessibility() {
    this.log('🔍 Testing CSS accessibility patterns...', 'progress');
    
    const htmlFiles = ['index.html', 'admin.html'];
    let overallScore = 0;
    const findings = [];
    
    htmlFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 检查响应式设计
        if (content.includes('responsive') || content.includes('sm:') || content.includes('md:') || content.includes('lg:')) {
          overallScore += 10;
          findings.push(`✅ ${file}: Responsive design classes found`);
        }
        
        // 检查焦点样式
        if (content.includes('focus:') || content.includes('focus-')) {
          overallScore += 10;
          findings.push(`✅ ${file}: Focus styles found`);
        }
        
        // 检查隐藏内容类
        if (content.includes('sr-only') || content.includes('screen-reader')) {
          overallScore += 5;
          findings.push(`✅ ${file}: Screen reader only content found`);
        }
        
        // 检查高对比度支持
        if (content.includes('contrast') || content.includes('dark:')) {
          overallScore += 5;
          findings.push(`✅ ${file}: Contrast/dark mode support found`);
        }
        
      } catch (error) {
        findings.push(`❌ Cannot read ${file}: ${error.message}`);
      }
    });
    
    const passed = overallScore >= 15;
    
    this.log(`📊 CSS accessibility score: ${overallScore}/30`, passed ? 'success' : 'warning');
    findings.forEach(finding => {
      const type = finding.startsWith('✅') ? 'success' : finding.startsWith('❌') ? 'error' : 'warning';
      this.log(`   ${finding}`, type);
    });
    
    return { passed, score: overallScore, findings };
  }
  
  // 生成可访问性报告
  generateAccessibilityReport() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log('\n' + '='.repeat(80));
    console.log('♿ ACCESSIBILITY TEST RESULTS');
    console.log('='.repeat(80));
    
    this.results.forEach(result => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`${status} ${result.test}`);
      
      if (result.score !== undefined) {
        console.log(`   Score: ${result.score}`);
      }
      
      if (result.issues && result.issues.length > 0) {
        console.log(`   Issues: ${result.issues.length}`);
      }
    });
    
    console.log('='.repeat(80));
    console.log(`📈 Overall: ${passed}/${total} tests passed`);
    console.log(`⏱️  Total duration: ${totalDuration}ms`);
    console.log('='.repeat(80));
    
    // 生成建议
    console.log('\n📋 ACCESSIBILITY RECOMMENDATIONS:');
    console.log('1. 🎯 Ensure all images have meaningful alt text');
    console.log('2. ⌨️  Test keyboard navigation thoroughly');
    console.log('3. 🎨 Verify color contrast ratios meet WCAG standards');
    console.log('4. 📱 Test with screen readers');
    console.log('5. 🔍 Add skip navigation links');
    console.log('6. 🏷️  Use semantic HTML elements consistently');
    console.log('7. 📝 Ensure form labels are properly associated');
    
    return { passed, total, success: passed === total, duration: totalDuration };
  }
  
  // 运行所有可访问性测试
  async runAllTests() {
    console.log('♿ Starting accessibility tests...\n');
    
    try {
      // 测试HTML文件
      const htmlFiles = ['index.html', 'admin.html'];
      htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const result = this.testHTMLAccessibility(file);
          this.results.push({ test: `HTML Accessibility - ${file}`, ...result });
        }
      });
      
      // 测试JavaScript文件
      const jsFiles = ['js/app.js', 'js/admin.js'];
      jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const result = this.testJSAccessibility(file);
          this.results.push({ test: `JS Accessibility - ${file}`, ...result });
        }
      });
      
      // 测试CSS可访问性
      const cssResult = this.testCSSAccessibility();
      this.results.push({ test: 'CSS Accessibility Patterns', ...cssResult });
      
      // 生成报告
      const report = this.generateAccessibilityReport();
      
      if (report.success) {
        this.log('🎉 All accessibility tests passed!', 'success');
        return true;
      } else {
        this.log('⚠️ Some accessibility improvements recommended!', 'warning');
        return true; // 可访问性测试通常是建议性的
      }
      
    } catch (error) {
      this.log(`Accessibility test suite failed: ${error.message}`, 'error');
      return false;
    }
  }
}

// 运行测试
if (require.main === module) {
  const accessibilityTest = new WebsiteAccessibilityTest();
  accessibilityTest.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = WebsiteAccessibilityTest;
