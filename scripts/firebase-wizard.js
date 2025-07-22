// Firebase 配置向导
const readline = require('readline');
const fs = require('fs');

class FirebaseWizard {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.config = {};
  }
  
  log(message, type = 'info') {
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      progress: '🔄',
      question: '❓'
    }[type] || '📝';
    
    console.log(`${prefix} ${message}`);
  }
  
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
  
  // 显示欢迎信息
  showWelcome() {
    console.clear();
    console.log('🔥 Firebase 配置向导');
    console.log('===================');
    console.log('');
    console.log('这个向导将帮助您配置Firebase项目');
    console.log('请准备好以下信息:');
    console.log('• Firebase项目ID');
    console.log('• Firebase Web应用配置信息');
    console.log('');
  }
  
  // 收集项目信息
  async collectProjectInfo() {
    this.log('收集项目信息...', 'progress');
    console.log('');
    
    // 项目ID
    this.config.projectId = await this.question('🏗️ Firebase项目ID: ');
    
    if (!this.config.projectId) {
      throw new Error('项目ID不能为空');
    }
    
    // 自动生成其他配置
    this.config.authDomain = `${this.config.projectId}.firebaseapp.com`;
    this.config.storageBucket = `${this.config.projectId}.appspot.com`;
    
    console.log('');
    this.log(`认证域名: ${this.config.authDomain}`, 'info');
    this.log(`存储桶: ${this.config.storageBucket}`, 'info');
    console.log('');
  }
  
  // 收集Web应用配置
  async collectWebAppConfig() {
    this.log('收集Web应用配置...', 'progress');
    console.log('');
    console.log('请访问Firebase Console获取以下信息:');
    console.log('https://console.firebase.google.com/project/' + this.config.projectId + '/settings/general');
    console.log('');
    
    const hasConfig = await this.question('❓ 您是否已有Web应用配置信息？(y/n): ');
    
    if (hasConfig.toLowerCase() === 'y') {
      this.config.apiKey = await this.question('🔑 API Key: ');
      this.config.messagingSenderId = await this.question('📨 Messaging Sender ID: ');
      this.config.appId = await this.question('📱 App ID: ');
    } else {
      this.log('将使用占位符，请稍后在Firebase Console中获取实际值', 'warning');
      this.config.apiKey = 'YOUR_API_KEY';
      this.config.messagingSenderId = 'YOUR_MESSAGING_SENDER_ID';
      this.config.appId = 'YOUR_APP_ID';
    }
    
    console.log('');
  }
  
  // 显示配置摘要
  showConfigSummary() {
    console.log('📋 配置摘要');
    console.log('============');
    console.log(`项目ID: ${this.config.projectId}`);
    console.log(`认证域名: ${this.config.authDomain}`);
    console.log(`存储桶: ${this.config.storageBucket}`);
    console.log(`API Key: ${this.config.apiKey}`);
    console.log(`Messaging Sender ID: ${this.config.messagingSenderId}`);
    console.log(`App ID: ${this.config.appId}`);
    console.log('');
  }
  
  // 生成配置文件
  async generateConfigFiles() {
    this.log('生成配置文件...', 'progress');
    
    // 生成Firebase配置
    const firebaseConfigContent = `// Firebase 配置 - 由向导生成
const firebaseConfig = {
  apiKey: "${this.config.apiKey}",
  authDomain: "${this.config.authDomain}",
  projectId: "${this.config.projectId}",
  storageBucket: "${this.config.storageBucket}",
  messagingSenderId: "${this.config.messagingSenderId}",
  appId: "${this.config.appId}"
};

// 初始化Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const app = initializeApp(firebaseConfig);

// 导出Firebase服务
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

// 配置信息
export { firebaseConfig };
`;
    
    // 生成.firebaserc
    const firebaserc = {
      projects: {
        default: this.config.projectId,
        production: this.config.projectId
      }
    };
    
    // 生成环境变量示例
    const envExample = `# Firebase 环境变量
FIREBASE_PROJECT_ID=${this.config.projectId}
FIREBASE_AUTH_DOMAIN=${this.config.authDomain}
FIREBASE_STORAGE_BUCKET=${this.config.storageBucket}

# 用于构建工具
VITE_FIREBASE_PROJECT_ID=${this.config.projectId}
VITE_FIREBASE_AUTH_DOMAIN=${this.config.authDomain}
VITE_FIREBASE_STORAGE_BUCKET=${this.config.storageBucket}
`;
    
    // 写入文件
    fs.writeFileSync('js/firebase-config.js', firebaseConfigContent);
    fs.writeFileSync('.firebaserc', JSON.stringify(firebaserc, null, 2));
    fs.writeFileSync('.env.example', envExample);
    
    this.log('Firebase配置文件已生成', 'success');
    this.log('.firebaserc文件已生成', 'success');
    this.log('.env.example文件已生成', 'success');
  }
  
  // 显示下一步操作
  showNextSteps() {
    console.log('');
    console.log('🎉 配置完成！');
    console.log('');
    console.log('📋 下一步操作:');
    console.log('');
    console.log('1. 🔧 完善Firebase配置:');
    console.log('   • 访问 Firebase Console');
    console.log('   • 启用 Authentication、Firestore、Storage 服务');
    console.log('   • 如使用占位符，请更新实际的API密钥');
    console.log('');
    console.log('2. 🔐 设置GitHub Secrets:');
    console.log(`   • FIREBASE_PROJECT_ID: ${this.config.projectId}`);
    console.log('   • FIREBASE_TOKEN: 运行 "firebase login:ci" 获取');
    console.log('');
    console.log('3. 🚀 测试部署:');
    console.log('   • 运行 "npm run validate" 验证配置');
    console.log('   • 推送代码测试自动部署');
    console.log('');
    console.log('4. 📚 相关链接:');
    console.log(`   • Firebase Console: https://console.firebase.google.com/project/${this.config.projectId}`);
    console.log('   • GitHub Secrets设置: 仓库设置 > Secrets and variables > Actions');
    console.log('');
  }
  
  // 主要向导流程
  async runWizard() {
    try {
      this.showWelcome();
      
      const proceed = await this.question('❓ 是否继续配置？(y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        this.log('配置已取消', 'info');
        return;
      }
      
      await this.collectProjectInfo();
      await this.collectWebAppConfig();
      
      this.showConfigSummary();
      
      const confirm = await this.question('❓ 确认生成配置文件？(y/n): ');
      if (confirm.toLowerCase() === 'y') {
        await this.generateConfigFiles();
        this.showNextSteps();
      } else {
        this.log('配置已取消', 'info');
      }
      
    } catch (error) {
      this.log(`配置失败: ${error.message}`, 'error');
    } finally {
      this.rl.close();
    }
  }
}

// 运行向导
if (require.main === module) {
  const wizard = new FirebaseWizard();
  wizard.runWizard();
}

module.exports = FirebaseWizard;
