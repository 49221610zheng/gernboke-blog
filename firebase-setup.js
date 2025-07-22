#!/usr/bin/env node

// Firebase 配置主菜单
const readline = require('readline');
const { spawn } = require('child_process');

class FirebaseSetupMenu {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  
  log(message, type = 'info') {
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      progress: '🔄'
    }[type] || '📝';
    
    console.log(`${prefix} ${message}`);
  }
  
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
  
  showMenu() {
    console.clear();
    console.log('🔥 Firebase 自动化配置工具');
    console.log('============================');
    console.log('');
    console.log('请选择配置方式:');
    console.log('');
    console.log('1. 🧙 配置向导 (推荐新手)');
    console.log('   • 交互式配置');
    console.log('   • 详细说明和指导');
    console.log('   • 适合第一次使用');
    console.log('');
    console.log('2. ⚡ 快速配置');
    console.log('   • 最少输入');
    console.log('   • 适合有经验的用户');
    console.log('   • 快速生成基础配置');
    console.log('');
    console.log('3. 🔧 完整自动化配置');
    console.log('   • 全自动配置');
    console.log('   • 包含项目创建和服务启用');
    console.log('   • 适合完整的新项目');
    console.log('');
    console.log('4. 📋 查看当前配置');
    console.log('5. 🆘 帮助和文档');
    console.log('6. 🚪 退出');
    console.log('');
  }
  
  async runScript(scriptPath) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [scriptPath], {
        stdio: 'inherit',
        shell: true
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`脚本执行失败，退出码: ${code}`));
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }
  
  showCurrentConfig() {
    console.log('📋 当前Firebase配置状态');
    console.log('========================');
    
    const fs = require('fs');
    
    // 检查配置文件
    const files = [
      { path: 'js/firebase-config.js', name: 'Firebase配置' },
      { path: '.firebaserc', name: 'Firebase项目配置' },
      { path: 'firebase.json', name: 'Firebase部署配置' },
      { path: '.env.example', name: '环境变量示例' }
    ];
    
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        this.log(`${file.name}: ✅ 已配置`, 'success');
      } else {
        this.log(`${file.name}: ❌ 未配置`, 'error');
      }
    });
    
    console.log('');
    
    // 检查Firebase配置内容
    if (fs.existsSync('js/firebase-config.js')) {
      const configContent = fs.readFileSync('js/firebase-config.js', 'utf8');
      
      if (configContent.includes('YOUR_API_KEY')) {
        this.log('配置包含占位符，需要更新实际值', 'warning');
      } else {
        this.log('配置看起来已完成', 'success');
      }
    }
    
    // 检查.firebaserc
    if (fs.existsSync('.firebaserc')) {
      try {
        const firebaserc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
        if (firebaserc.projects && firebaserc.projects.default) {
          this.log(`当前项目: ${firebaserc.projects.default}`, 'info');
        }
      } catch (error) {
        this.log('.firebaserc文件格式错误', 'error');
      }
    }
    
    console.log('');
  }
  
  showHelp() {
    console.log('🆘 Firebase配置帮助');
    console.log('==================');
    console.log('');
    console.log('📚 配置步骤:');
    console.log('1. 在Firebase Console创建项目');
    console.log('2. 运行配置工具生成配置文件');
    console.log('3. 在GitHub设置Secrets');
    console.log('4. 测试部署');
    console.log('');
    console.log('🔗 相关链接:');
    console.log('• Firebase Console: https://console.firebase.google.com/');
    console.log('• Firebase文档: https://firebase.google.com/docs');
    console.log('• GitHub Secrets设置: 仓库设置 > Secrets and variables > Actions');
    console.log('');
    console.log('🛠️ 可用命令:');
    console.log('• npm run firebase:wizard  - 配置向导');
    console.log('• npm run firebase:quick   - 快速配置');
    console.log('• npm run firebase:setup   - 完整配置');
    console.log('• npm run validate         - 验证配置');
    console.log('');
  }
  
  async handleChoice(choice) {
    switch (choice) {
      case '1':
        this.log('启动配置向导...', 'progress');
        await this.runScript('scripts/firebase-wizard.js');
        break;
        
      case '2':
        this.log('启动快速配置...', 'progress');
        await this.runScript('scripts/firebase-quick-setup.js');
        break;
        
      case '3':
        this.log('启动完整自动化配置...', 'progress');
        await this.runScript('scripts/firebase-auto-setup.js');
        break;
        
      case '4':
        this.showCurrentConfig();
        await this.question('按回车继续...');
        return false; // 不退出，继续显示菜单
        
      case '5':
        this.showHelp();
        await this.question('按回车继续...');
        return false; // 不退出，继续显示菜单
        
      case '6':
        this.log('退出配置工具', 'info');
        return true; // 退出
        
      default:
        this.log('无效选择，请重试', 'error');
        await this.question('按回车继续...');
        return false; // 不退出，继续显示菜单
    }
    
    return true; // 退出
  }
  
  async run() {
    try {
      while (true) {
        this.showMenu();
        const choice = await this.question('请选择 (1-6): ');
        
        const shouldExit = await this.handleChoice(choice);
        if (shouldExit) {
          break;
        }
      }
    } catch (error) {
      this.log(`错误: ${error.message}`, 'error');
    } finally {
      this.rl.close();
    }
  }
}

// 运行主菜单
if (require.main === module) {
  const menu = new FirebaseSetupMenu();
  menu.run();
}

module.exports = FirebaseSetupMenu;
