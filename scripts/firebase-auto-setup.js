// Firebase 自动化配置脚本
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class FirebaseAutoSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.config = {
      projectId: '',
      projectName: '',
      region: 'asia-east1', // 默认香港区域
      apiKey: '',
      authDomain: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };
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
  
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
  
  async runCommand(command, options = {}) {
    this.log(`执行命令: ${command}`, 'progress');
    
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });
      
      return { success: true, output: result };
    } catch (error) {
      this.log(`命令执行失败: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
  
  // 检查Firebase CLI
  async checkFirebaseCLI() {
    this.log('🔍 检查Firebase CLI...', 'progress');
    
    const result = await this.runCommand('firebase --version', { silent: true });
    
    if (result.success) {
      this.log('Firebase CLI已安装', 'success');
      return true;
    } else {
      this.log('Firebase CLI未安装，正在安装...', 'warning');
      
      const installResult = await this.runCommand('npm install -g firebase-tools');
      if (installResult.success) {
        this.log('Firebase CLI安装成功', 'success');
        return true;
      } else {
        this.log('Firebase CLI安装失败', 'error');
        return false;
      }
    }
  }
  
  // Firebase登录
  async loginFirebase() {
    this.log('🔐 Firebase登录...', 'progress');
    
    // 检查是否已登录
    const whoamiResult = await this.runCommand('firebase login:list', { silent: true });
    
    if (whoamiResult.success && whoamiResult.output.includes('@')) {
      this.log('已登录Firebase', 'success');
      return true;
    }
    
    this.log('需要登录Firebase，将打开浏览器...', 'info');
    const loginResult = await this.runCommand('firebase login');
    
    if (loginResult.success) {
      this.log('Firebase登录成功', 'success');
      return true;
    } else {
      this.log('Firebase登录失败', 'error');
      return false;
    }
  }
  
  // 创建或选择Firebase项目
  async setupFirebaseProject() {
    this.log('🏗️ 设置Firebase项目...', 'progress');
    
    // 获取现有项目列表
    const projectsResult = await this.runCommand('firebase projects:list', { silent: true });
    
    if (projectsResult.success) {
      console.log('\n现有Firebase项目:');
      console.log(projectsResult.output);
    }
    
    const createNew = await this.question('\n是否创建新项目？(y/n): ');
    
    if (createNew.toLowerCase() === 'y') {
      await this.createNewProject();
    } else {
      await this.selectExistingProject();
    }
  }
  
  // 创建新项目
  async createNewProject() {
    this.log('🆕 创建新Firebase项目...', 'progress');
    
    this.config.projectId = await this.question('输入项目ID (例: my-blog-2024): ');
    this.config.projectName = await this.question('输入项目名称 (例: 我的博客): ');
    
    // 注意：Firebase项目创建需要通过Web Console，CLI不支持
    this.log('⚠️ Firebase项目需要通过Web Console创建', 'warning');
    this.log('请访问: https://console.firebase.google.com/', 'info');
    this.log(`项目ID: ${this.config.projectId}`, 'info');
    this.log(`项目名称: ${this.config.projectName}`, 'info');
    
    const created = await this.question('项目创建完成后，按回车继续...');
    
    // 验证项目是否存在
    const verifyResult = await this.runCommand(`firebase projects:list | grep ${this.config.projectId}`, { silent: true });
    
    if (verifyResult.success) {
      this.log('项目验证成功', 'success');
    } else {
      this.log('项目验证失败，请检查项目ID', 'error');
      throw new Error('项目验证失败');
    }
  }
  
  // 选择现有项目
  async selectExistingProject() {
    this.config.projectId = await this.question('输入现有项目ID: ');
    
    // 验证项目
    const verifyResult = await this.runCommand(`firebase use ${this.config.projectId}`, { silent: true });
    
    if (verifyResult.success) {
      this.log('项目选择成功', 'success');
    } else {
      this.log('项目不存在或无权限访问', 'error');
      throw new Error('项目验证失败');
    }
  }
  
  // 初始化Firebase项目
  async initFirebaseProject() {
    this.log('🔧 初始化Firebase项目...', 'progress');
    
    // 使用项目
    await this.runCommand(`firebase use ${this.config.projectId}`);
    
    // 获取项目配置
    await this.getProjectConfig();
    
    // 启用必要的服务
    await this.enableFirebaseServices();
    
    // 部署安全规则
    await this.deploySecurityRules();
  }
  
  // 获取项目配置
  async getProjectConfig() {
    this.log('📋 获取项目配置...', 'progress');
    
    // 设置基本配置
    this.config.authDomain = `${this.config.projectId}.firebaseapp.com`;
    this.config.storageBucket = `${this.config.projectId}.appspot.com`;
    
    // 尝试获取Web应用配置
    const appsResult = await this.runCommand(`firebase apps:list --project ${this.config.projectId}`, { silent: true });
    
    if (appsResult.success && appsResult.output.includes('WEB')) {
      this.log('发现现有Web应用', 'info');
      // 这里可以解析现有应用的配置
    } else {
      this.log('需要创建Web应用...', 'info');
      await this.createWebApp();
    }
  }
  
  // 创建Web应用
  async createWebApp() {
    const appName = await this.question('输入Web应用名称 (例: 博客前端): ') || '博客应用';
    
    const createAppResult = await this.runCommand(
      `firebase apps:create web "${appName}" --project ${this.config.projectId}`,
      { silent: true }
    );
    
    if (createAppResult.success) {
      this.log('Web应用创建成功', 'success');
      
      // 解析输出获取配置信息
      const output = createAppResult.output;
      const appIdMatch = output.match(/App ID: ([^\s]+)/);
      if (appIdMatch) {
        this.config.appId = appIdMatch[1];
      }
    }
  }
  
  // 启用Firebase服务
  async enableFirebaseServices() {
    this.log('🔥 启用Firebase服务...', 'progress');
    
    const services = [
      'firestore.googleapis.com',
      'firebase.googleapis.com',
      'storage-component.googleapis.com',
      'identitytoolkit.googleapis.com'
    ];
    
    for (const service of services) {
      this.log(`启用服务: ${service}`, 'info');
      await this.runCommand(`gcloud services enable ${service} --project=${this.config.projectId}`, { silent: true });
    }
  }
  
  // 部署安全规则
  async deploySecurityRules() {
    this.log('🛡️ 部署安全规则...', 'progress');
    
    const deployResult = await this.runCommand(
      `firebase deploy --only firestore:rules,storage --project ${this.config.projectId}`
    );
    
    if (deployResult.success) {
      this.log('安全规则部署成功', 'success');
    } else {
      this.log('安全规则部署失败', 'warning');
    }
  }
  
  // 更新配置文件
  async updateConfigFiles() {
    this.log('📝 更新配置文件...', 'progress');
    
    // 更新Firebase配置
    await this.updateFirebaseConfig();
    
    // 更新.firebaserc
    await this.updateFirebaseRC();
    
    // 创建环境配置
    await this.createEnvironmentConfig();
  }
  
  // 更新Firebase配置文件
  async updateFirebaseConfig() {
    const configPath = 'js/firebase-config.js';
    
    // 生成配置内容
    const configContent = `// Firebase 配置 - 自动生成
const firebaseConfig = {
  apiKey: "${this.config.apiKey || 'YOUR_API_KEY'}",
  authDomain: "${this.config.authDomain}",
  projectId: "${this.config.projectId}",
  storageBucket: "${this.config.storageBucket}",
  messagingSenderId: "${this.config.messagingSenderId || 'YOUR_MESSAGING_SENDER_ID'}",
  appId: "${this.config.appId || 'YOUR_APP_ID'}"
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
    
    fs.writeFileSync(configPath, configContent);
    this.log(`Firebase配置已更新: ${configPath}`, 'success');
  }
  
  // 更新.firebaserc
  async updateFirebaseRC() {
    const firebaserc = {
      projects: {
        default: this.config.projectId,
        production: this.config.projectId,
        staging: `${this.config.projectId}-staging`
      }
    };
    
    fs.writeFileSync('.firebaserc', JSON.stringify(firebaserc, null, 2));
    this.log('.firebaserc已更新', 'success');
  }
  
  // 创建环境配置
  async createEnvironmentConfig() {
    const envConfig = `# Firebase 环境配置
FIREBASE_PROJECT_ID=${this.config.projectId}
FIREBASE_AUTH_DOMAIN=${this.config.authDomain}
FIREBASE_STORAGE_BUCKET=${this.config.storageBucket}

# 生产环境
VITE_FIREBASE_PROJECT_ID=${this.config.projectId}
VITE_FIREBASE_AUTH_DOMAIN=${this.config.authDomain}
VITE_FIREBASE_STORAGE_BUCKET=${this.config.storageBucket}
`;
    
    fs.writeFileSync('.env.example', envConfig);
    this.log('环境配置示例已创建: .env.example', 'success');
  }
  
  // 生成CI令牌
  async generateCIToken() {
    this.log('🔑 生成CI部署令牌...', 'progress');
    
    const tokenResult = await this.runCommand('firebase login:ci', { silent: true });
    
    if (tokenResult.success) {
      const token = tokenResult.output.trim();
      this.log('CI令牌生成成功', 'success');
      
      console.log('\n🔐 GitHub Secrets 配置:');
      console.log('================================');
      console.log(`FIREBASE_PROJECT_ID: ${this.config.projectId}`);
      console.log(`FIREBASE_TOKEN: ${token}`);
      console.log('================================');
      console.log('\n请将以上信息添加到GitHub仓库的Secrets中');
      
      return token;
    } else {
      this.log('CI令牌生成失败', 'error');
      return null;
    }
  }
  
  // 验证配置
  async validateSetup() {
    this.log('🔍 验证配置...', 'progress');
    
    // 运行配置验证脚本
    const validateResult = await this.runCommand('node scripts/validate-config.js');
    
    if (validateResult.success) {
      this.log('配置验证通过', 'success');
    } else {
      this.log('配置验证失败', 'warning');
    }
  }
  
  // 主要设置流程
  async setup() {
    try {
      console.log('🔥 Firebase 自动化配置工具');
      console.log('============================\n');
      
      // 1. 检查Firebase CLI
      const cliReady = await this.checkFirebaseCLI();
      if (!cliReady) {
        throw new Error('Firebase CLI设置失败');
      }
      
      // 2. Firebase登录
      const loginSuccess = await this.loginFirebase();
      if (!loginSuccess) {
        throw new Error('Firebase登录失败');
      }
      
      // 3. 设置项目
      await this.setupFirebaseProject();
      
      // 4. 初始化项目
      await this.initFirebaseProject();
      
      // 5. 更新配置文件
      await this.updateConfigFiles();
      
      // 6. 生成CI令牌
      await this.generateCIToken();
      
      // 7. 验证配置
      await this.validateSetup();
      
      this.log('🎉 Firebase配置完成！', 'success');
      
      console.log('\n📋 下一步操作:');
      console.log('1. 将GitHub Secrets添加到仓库设置中');
      console.log('2. 推送代码测试自动部署');
      console.log('3. 访问Firebase Console配置认证方式');
      console.log('4. 运行 npm run deploy 测试部署');
      
    } catch (error) {
      this.log(`配置失败: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const setup = new FirebaseAutoSetup();
  setup.setup();
}

module.exports = FirebaseAutoSetup;
