// 部署自动化脚本
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class DeploymentAutomation {
  constructor() {
    this.config = this.loadConfig();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  
  loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'deployment-config.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      console.log('⚠️ No deployment config found, using defaults');
    }
    
    return {
      environments: {
        staging: {
          projectId: 'your-project-staging',
          channel: 'staging',
          expires: '30d'
        },
        production: {
          projectId: 'your-project-id',
          channel: null,
          expires: null
        }
      },
      preDeployChecks: true,
      postDeployTests: true,
      backupBeforeDeploy: true,
      notificationWebhook: null
    };
  }
  
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
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
    
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });
      
      return { success: true, output: result };
    } catch (error) {
      this.log(`Command failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
  
  async validateEnvironment() {
    this.log('🔍 Validating deployment environment...', 'progress');
    
    const checks = [
      {
        name: 'Node.js version',
        command: 'node --version',
        validator: (output) => {
          const version = parseInt(output.match(/v(\d+)/)[1]);
          return version >= 14;
        }
      },
      {
        name: 'Firebase CLI',
        command: 'firebase --version',
        validator: (output) => output.includes('firebase-tools')
      },
      {
        name: 'Git status',
        command: 'git status --porcelain',
        validator: (output) => output.trim() === '',
        warning: 'Working directory is not clean'
      },
      {
        name: 'Firebase login',
        command: 'firebase projects:list',
        validator: (output) => !output.includes('Error')
      }
    ];
    
    let allPassed = true;
    
    for (const check of checks) {
      const result = await this.runCommand(check.command, { silent: true });
      
      if (result.success && check.validator(result.output)) {
        this.log(`${check.name}: ✅ Passed`, 'success');
      } else {
        const message = check.warning || `${check.name}: ❌ Failed`;
        this.log(message, check.warning ? 'warning' : 'error');
        
        if (!check.warning) {
          allPassed = false;
        }
      }
    }
    
    return allPassed;
  }
  
  async runTests() {
    this.log('🧪 Running tests...', 'progress');
    
    const testCommands = [
      'npm run lint',
      'npm run test',
      'npm run validate'
    ];
    
    for (const command of testCommands) {
      const result = await this.runCommand(command);
      if (!result.success) {
        throw new Error(`Test failed: ${command}`);
      }
    }
    
    this.log('All tests passed!', 'success');
  }
  
  async createBackup(environment) {
    if (!this.config.backupBeforeDeploy) {
      return;
    }
    
    this.log('💾 Creating backup...', 'progress');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', timestamp);
    
    // 创建备份目录
    fs.mkdirSync(backupDir, { recursive: true });
    
    // 备份 Firestore 数据
    const projectId = this.config.environments[environment].projectId;
    const backupCommand = `firebase firestore:export ${backupDir}/firestore --project ${projectId}`;
    
    const result = await this.runCommand(backupCommand);
    if (result.success) {
      this.log(`Backup created: ${backupDir}`, 'success');
      return backupDir;
    } else {
      this.log('Backup failed, continuing with deployment...', 'warning');
    }
  }
  
  async deployToEnvironment(environment) {
    const envConfig = this.config.environments[environment];
    if (!envConfig) {
      throw new Error(`Environment ${environment} not configured`);
    }
    
    this.log(`🚀 Deploying to ${environment}...`, 'progress');
    
    let deployCommand;
    
    if (environment === 'production') {
      deployCommand = `firebase deploy --project ${envConfig.projectId}`;
    } else {
      deployCommand = `firebase hosting:channel:deploy ${envConfig.channel} --project ${envConfig.projectId} --expires ${envConfig.expires}`;
    }
    
    const result = await this.runCommand(deployCommand);
    
    if (result.success) {
      this.log(`Deployment to ${environment} successful!`, 'success');
      return true;
    } else {
      throw new Error(`Deployment to ${environment} failed`);
    }
  }
  
  async runPostDeployTests(environment) {
    if (!this.config.postDeployTests) {
      return;
    }
    
    this.log('🔍 Running post-deployment tests...', 'progress');
    
    const envConfig = this.config.environments[environment];
    const baseUrl = environment === 'production' 
      ? `https://${envConfig.projectId}.web.app`
      : `https://${envConfig.projectId}--${envConfig.channel}.web.app`;
    
    // 等待部署生效
    await this.sleep(10000);
    
    const tests = [
      {
        name: 'Homepage accessibility',
        command: `curl -f ${baseUrl} -o /dev/null -s`
      },
      {
        name: 'Admin page accessibility',
        command: `curl -f ${baseUrl}/admin -o /dev/null -s`
      }
    ];
    
    for (const test of tests) {
      const result = await this.runCommand(test.command, { silent: true });
      if (result.success) {
        this.log(`${test.name}: ✅ Passed`, 'success');
      } else {
        this.log(`${test.name}: ❌ Failed`, 'warning');
      }
    }
  }
  
  async sendNotification(environment, success, deploymentUrl = null) {
    if (!this.config.notificationWebhook) {
      return;
    }
    
    const message = {
      environment,
      success,
      timestamp: new Date().toISOString(),
      deploymentUrl,
      project: this.config.environments[environment].projectId
    };
    
    try {
      // 发送 webhook 通知
      const response = await fetch(this.config.notificationWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      
      if (response.ok) {
        this.log('Notification sent', 'success');
      }
    } catch (error) {
      this.log('Failed to send notification', 'warning');
    }
  }
  
  async rollback(environment, backupPath) {
    this.log(`🔄 Rolling back ${environment}...`, 'progress');
    
    if (backupPath && fs.existsSync(backupPath)) {
      const projectId = this.config.environments[environment].projectId;
      const restoreCommand = `firebase firestore:import ${backupPath}/firestore --project ${projectId}`;
      
      const result = await this.runCommand(restoreCommand);
      if (result.success) {
        this.log('Rollback completed', 'success');
      } else {
        this.log('Rollback failed', 'error');
      }
    } else {
      this.log('No backup available for rollback', 'warning');
    }
  }
  
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async deploy() {
    try {
      console.log('🚀 Starting automated deployment process...\n');
      
      // 选择环境
      const environment = await this.question('Select environment (staging/production): ');
      
      if (!['staging', 'production'].includes(environment)) {
        throw new Error('Invalid environment selected');
      }
      
      // 确认部署
      if (environment === 'production') {
        const confirm = await this.question('⚠️ You are deploying to PRODUCTION. Continue? (yes/no): ');
        if (confirm.toLowerCase() !== 'yes') {
          this.log('Deployment cancelled', 'warning');
          return;
        }
      }
      
      // 验证环境
      const envValid = await this.validateEnvironment();
      if (!envValid) {
        throw new Error('Environment validation failed');
      }
      
      // 运行测试
      if (this.config.preDeployChecks) {
        await this.runTests();
      }
      
      // 创建备份
      const backupPath = await this.createBackup(environment);
      
      try {
        // 部署
        await this.deployToEnvironment(environment);
        
        // 后部署测试
        await this.runPostDeployTests(environment);
        
        // 发送成功通知
        const envConfig = this.config.environments[environment];
        const deploymentUrl = environment === 'production' 
          ? `https://${envConfig.projectId}.web.app`
          : `https://${envConfig.projectId}--${envConfig.channel}.web.app`;
        
        await this.sendNotification(environment, true, deploymentUrl);
        
        this.log(`🎉 Deployment to ${environment} completed successfully!`, 'success');
        this.log(`🌐 URL: ${deploymentUrl}`, 'info');
        
      } catch (deployError) {
        this.log(`Deployment failed: ${deployError.message}`, 'error');
        
        // 询问是否回滚
        const shouldRollback = await this.question('Do you want to rollback? (yes/no): ');
        if (shouldRollback.toLowerCase() === 'yes') {
          await this.rollback(environment, backupPath);
        }
        
        await this.sendNotification(environment, false);
        throw deployError;
      }
      
    } catch (error) {
      this.log(`Deployment process failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const deployment = new DeploymentAutomation();
  deployment.deploy();
}

module.exports = DeploymentAutomation;
