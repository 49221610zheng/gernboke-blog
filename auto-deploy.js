// 自动化Firebase部署脚本
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoDeploy {
  constructor() {
    this.steps = [
      'checkEnvironment',
      'installFirebaseCLI', 
      'loginFirebase',
      'setProject',
      'deployToHosting',
      'verifyDeployment'
    ];
    this.currentStep = 0;
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
  
  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      this.log(`执行命令: ${command}`, 'progress');
      
      const child = exec(command, {
        cwd: process.cwd(),
        encoding: 'utf8',
        ...options
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => {
        stdout += data;
        if (!options.silent) {
          process.stdout.write(data);
        }
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data;
        if (!options.silent) {
          process.stderr.write(data);
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, stdout, stderr });
        } else {
          reject({ success: false, code, stdout, stderr });
        }
      });
      
      child.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  }
  
  async checkEnvironment() {
    this.log('🔍 检查环境...', 'progress');
    
    try {
      // 检查Node.js
      const nodeResult = await this.runCommand('node --version', { silent: true });
      this.log(`Node.js版本: ${nodeResult.stdout.trim()}`, 'success');
      
      // 检查npm
      const npmResult = await this.runCommand('npm --version', { silent: true });
      this.log(`npm版本: ${npmResult.stdout.trim()}`, 'success');
      
      return true;
    } catch (error) {
      this.log('环境检查失败', 'error');
      this.log('请确保已安装Node.js和npm', 'error');
      return false;
    }
  }
  
  async installFirebaseCLI() {
    this.log('📦 安装Firebase CLI...', 'progress');
    
    try {
      // 先检查是否已安装
      try {
        await this.runCommand('firebase --version', { silent: true });
        this.log('Firebase CLI已安装', 'success');
        return true;
      } catch (error) {
        // 未安装，开始安装
        this.log('正在安装Firebase CLI...', 'progress');
      }
      
      await this.runCommand('npm install -g firebase-tools');
      this.log('Firebase CLI安装成功', 'success');
      return true;
    } catch (error) {
      this.log('Firebase CLI安装失败', 'error');
      this.log('请尝试以管理员身份运行', 'warning');
      return false;
    }
  }
  
  async loginFirebase() {
    this.log('🔐 Firebase登录...', 'progress');
    
    try {
      // 检查是否已登录
      try {
        await this.runCommand('firebase projects:list', { silent: true });
        this.log('已登录Firebase', 'success');
        return true;
      } catch (error) {
        // 未登录，需要登录
        this.log('需要登录Firebase，将打开浏览器...', 'info');
      }
      
      await this.runCommand('firebase login --interactive');
      this.log('Firebase登录成功', 'success');
      return true;
    } catch (error) {
      this.log('Firebase登录失败', 'error');
      this.log('请手动运行: firebase login', 'warning');
      return false;
    }
  }
  
  async setProject() {
    this.log('🏗️ 设置Firebase项目...', 'progress');
    
    try {
      await this.runCommand('firebase use gernboke');
      this.log('项目设置成功', 'success');
      return true;
    } catch (error) {
      this.log('项目设置失败', 'error');
      this.log('请确认项目ID "gernboke" 是否正确', 'warning');
      return false;
    }
  }
  
  async deployToHosting() {
    this.log('🚀 部署到Firebase Hosting...', 'progress');
    
    try {
      await this.runCommand('firebase deploy --only hosting');
      this.log('部署成功！', 'success');
      return true;
    } catch (error) {
      this.log('部署失败', 'error');
      return false;
    }
  }
  
  async verifyDeployment() {
    this.log('🔍 验证部署...', 'progress');
    
    const urls = [
      'https://gernboke.web.app',
      'https://gernboke.firebaseapp.com'
    ];
    
    for (const url of urls) {
      try {
        // 使用curl检查网站可访问性
        await this.runCommand(`curl -f ${url} -o nul -s`, { silent: true });
        this.log(`${url} 可访问`, 'success');
      } catch (error) {
        this.log(`${url} 暂时不可访问（可能需要等待几分钟）`, 'warning');
      }
    }
    
    return true;
  }
  
  async deploy() {
    console.log('🚀 开始自动化Firebase部署');
    console.log('============================\n');
    
    for (let i = 0; i < this.steps.length; i++) {
      const stepName = this.steps[i];
      this.currentStep = i + 1;
      
      this.log(`步骤 ${this.currentStep}/${this.steps.length}: ${stepName}`, 'progress');
      
      try {
        const success = await this[stepName]();
        
        if (!success) {
          this.log(`步骤 ${stepName} 失败，停止部署`, 'error');
          return false;
        }
        
        this.log(`步骤 ${stepName} 完成`, 'success');
        console.log('');
        
      } catch (error) {
        this.log(`步骤 ${stepName} 出错: ${error.message || error}`, 'error');
        return false;
      }
    }
    
    // 部署完成
    console.log('🎉 自动化部署完成！');
    console.log('========================');
    console.log('');
    console.log('🌐 您的网站现在可以访问:');
    console.log('• 主域名: https://gernboke.web.app');
    console.log('• 备用域名: https://gernboke.firebaseapp.com');
    console.log('• 管理后台: https://gernboke.web.app/admin');
    console.log('');
    console.log('🔧 Firebase管理面板:');
    console.log('• 项目概览: https://console.firebase.google.com/project/gernboke');
    console.log('• 托管管理: https://console.firebase.google.com/project/gernboke/hosting');
    console.log('');
    
    return true;
  }
}

// 运行自动化部署
if (require.main === module) {
  const autoDeploy = new AutoDeploy();
  autoDeploy.deploy().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('部署过程中发生错误:', error);
    process.exit(1);
  });
}

module.exports = AutoDeploy;
