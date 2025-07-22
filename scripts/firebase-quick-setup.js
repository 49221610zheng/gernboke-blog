// Firebase 快速配置脚本
const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

class FirebaseQuickSetup {
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
  
  async runCommand(command, silent = false) {
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: silent ? 'pipe' : 'inherit'
      });
      return { success: true, output: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // 快速配置流程
  async quickSetup() {
    console.log('🚀 Firebase 快速配置');
    console.log('===================\n');
    
    try {
      // 1. 获取项目信息
      const projectId = await this.question('请输入Firebase项目ID: ');
      
      if (!projectId) {
        throw new Error('项目ID不能为空');
      }
      
      // 2. 更新配置文件
      this.log('📝 更新配置文件...', 'progress');
      await this.updateFirebaseConfig(projectId);
      await this.updateFirebaseRC(projectId);
      
      // 3. 检查Firebase CLI
      this.log('🔍 检查Firebase CLI...', 'progress');
      const cliCheck = await this.runCommand('firebase --version', true);
      
      if (!cliCheck.success) {
        this.log('安装Firebase CLI...', 'progress');
        await this.runCommand('npm install -g firebase-tools');
      }
      
      // 4. 设置项目
      this.log('🔧 设置Firebase项目...', 'progress');
      await this.runCommand(`firebase use ${projectId}`);
      
      // 5. 生成CI令牌
      this.log('🔑 生成CI令牌...', 'progress');
      const tokenResult = await this.runCommand('firebase login:ci', true);
      
      if (tokenResult.success) {
        const token = tokenResult.output.trim();
        
        console.log('\n🎉 配置完成！');
        console.log('\n🔐 GitHub Secrets 配置:');
        console.log('================================');
        console.log(`FIREBASE_PROJECT_ID: ${projectId}`);
        console.log(`FIREBASE_TOKEN: ${token}`);
        console.log('================================');
        
        console.log('\n📋 下一步操作:');
        console.log('1. 复制上面的Secrets到GitHub仓库设置中');
        console.log('2. 访问 https://console.firebase.google.com/');
        console.log('3. 启用Authentication、Firestore、Storage服务');
        console.log('4. 推送代码测试自动部署');
        
      } else {
        this.log('请手动运行: firebase login:ci', 'warning');
      }
      
    } catch (error) {
      this.log(`配置失败: ${error.message}`, 'error');
    } finally {
      this.rl.close();
    }
  }
  
  // 更新Firebase配置
  async updateFirebaseConfig(projectId) {
    const configContent = `// Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // 请在Firebase Console中获取
  authDomain: "${projectId}.firebaseapp.com",
  projectId: "${projectId}",
  storageBucket: "${projectId}.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // 请在Firebase Console中获取
  appId: "YOUR_APP_ID" // 请在Firebase Console中获取
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
    
    fs.writeFileSync('js/firebase-config.js', configContent);
    this.log('Firebase配置已更新', 'success');
  }
  
  // 更新.firebaserc
  async updateFirebaseRC(projectId) {
    const firebaserc = {
      projects: {
        default: projectId,
        production: projectId
      }
    };
    
    fs.writeFileSync('.firebaserc', JSON.stringify(firebaserc, null, 2));
    this.log('.firebaserc已更新', 'success');
  }
}

// 运行快速配置
if (require.main === module) {
  const setup = new FirebaseQuickSetup();
  setup.quickSetup();
}

module.exports = FirebaseQuickSetup;
