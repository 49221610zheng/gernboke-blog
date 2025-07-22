// 回滚脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class RollbackManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
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
  
  getAvailableBackups() {
    const backupsDir = path.join(process.cwd(), 'backups');
    
    if (!fs.existsSync(backupsDir)) {
      return [];
    }
    
    return fs.readdirSync(backupsDir)
      .filter(dir => {
        const fullPath = path.join(backupsDir, dir);
        return fs.statSync(fullPath).isDirectory();
      })
      .map(dir => {
        const fullPath = path.join(backupsDir, dir);
        const stats = fs.statSync(fullPath);
        return {
          name: dir,
          path: fullPath,
          created: stats.birthtime,
          size: this.getDirectorySize(fullPath)
        };
      })
      .sort((a, b) => b.created - a.created);
  }
  
  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    function calculateSize(currentPath) {
      const stats = fs.statSync(currentPath);
      
      if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
          calculateSize(path.join(currentPath, file));
        });
      } else {
        totalSize += stats.size;
      }
    }
    
    try {
      calculateSize(dirPath);
    } catch (error) {
      // 忽略权限错误等
    }
    
    return totalSize;
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  async selectBackup() {
    const backups = this.getAvailableBackups();
    
    if (backups.length === 0) {
      throw new Error('No backups available');
    }
    
    console.log('\n📦 Available backups:');
    console.log('='.repeat(80));
    
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.name}`);
      console.log(`   Created: ${backup.created.toLocaleString()}`);
      console.log(`   Size: ${this.formatBytes(backup.size)}`);
      console.log('');
    });
    
    const selection = await this.question('Select backup number (or 0 to cancel): ');
    const index = parseInt(selection) - 1;
    
    if (selection === '0') {
      throw new Error('Rollback cancelled');
    }
    
    if (index < 0 || index >= backups.length) {
      throw new Error('Invalid backup selection');
    }
    
    return backups[index];
  }
  
  async selectEnvironment() {
    console.log('\n🌍 Select environment:');
    console.log('1. Staging');
    console.log('2. Production');
    
    const selection = await this.question('Select environment (1-2): ');
    
    switch (selection) {
      case '1':
        return 'staging';
      case '2':
        return 'production';
      default:
        throw new Error('Invalid environment selection');
    }
  }
  
  async getProjectId(environment) {
    try {
      const configPath = path.join(process.cwd(), 'deployment-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.environments[environment]?.projectId;
      }
    } catch (error) {
      // 配置文件不存在或格式错误
    }
    
    // 从 .firebaserc 获取默认项目
    try {
      const firebaserc = path.join(process.cwd(), '.firebaserc');
      if (fs.existsSync(firebaserc)) {
        const config = JSON.parse(fs.readFileSync(firebaserc, 'utf8'));
        return config.projects?.default;
      }
    } catch (error) {
      // .firebaserc 不存在或格式错误
    }
    
    // 手动输入
    return await this.question('Enter Firebase project ID: ');
  }
  
  async confirmRollback(environment, backup, projectId) {
    console.log('\n⚠️ ROLLBACK CONFIRMATION');
    console.log('='.repeat(50));
    console.log(`Environment: ${environment}`);
    console.log(`Project ID: ${projectId}`);
    console.log(`Backup: ${backup.name}`);
    console.log(`Created: ${backup.created.toLocaleString()}`);
    console.log('='.repeat(50));
    console.log('');
    console.log('⚠️ WARNING: This will overwrite current data with backup data!');
    console.log('⚠️ Make sure you have a recent backup of current data!');
    console.log('');
    
    const confirmation = await this.question('Type "ROLLBACK" to confirm: ');
    
    if (confirmation !== 'ROLLBACK') {
      throw new Error('Rollback cancelled - confirmation failed');
    }
  }
  
  async rollbackFirestore(projectId, backupPath) {
    this.log('🔄 Rolling back Firestore data...', 'progress');
    
    const firestoreBackupPath = path.join(backupPath, 'firestore');
    
    if (!fs.existsSync(firestoreBackupPath)) {
      throw new Error('Firestore backup not found in selected backup');
    }
    
    const importCommand = `firebase firestore:import "${firestoreBackupPath}" --project ${projectId}`;
    const result = await this.runCommand(importCommand);
    
    if (!result.success) {
      throw new Error('Firestore rollback failed');
    }
    
    this.log('Firestore data rolled back successfully', 'success');
  }
  
  async rollbackStorage(projectId, backupPath) {
    this.log('🔄 Rolling back Storage data...', 'progress');
    
    const storageBackupPath = path.join(backupPath, 'storage');
    
    if (!fs.existsSync(storageBackupPath)) {
      this.log('No Storage backup found, skipping...', 'warning');
      return;
    }
    
    // 注意：Firebase Storage 没有直接的导入命令
    // 这里需要自定义实现或使用第三方工具
    this.log('Storage rollback requires manual intervention', 'warning');
    this.log(`Storage backup location: ${storageBackupPath}`, 'info');
  }
  
  async rollbackHosting(projectId, environment) {
    if (environment === 'production') {
      this.log('⚠️ Production hosting rollback requires manual intervention', 'warning');
      this.log('Please use Firebase Console to rollback to a previous release', 'info');
      return;
    }
    
    // 对于 staging 环境，可以重新部署之前的版本
    this.log('Staging hosting can be rolled back by redeploying', 'info');
  }
  
  async verifyRollback(projectId, environment) {
    this.log('🔍 Verifying rollback...', 'progress');
    
    // 基本连接测试
    const baseUrl = environment === 'production' 
      ? `https://${projectId}.web.app`
      : `https://${projectId}--staging.web.app`;
    
    try {
      const testCommand = `curl -f ${baseUrl} -o /dev/null -s`;
      const result = await this.runCommand(testCommand, { silent: true });
      
      if (result.success) {
        this.log('Website is accessible after rollback', 'success');
      } else {
        this.log('Website accessibility check failed', 'warning');
      }
    } catch (error) {
      this.log('Could not verify website accessibility', 'warning');
    }
    
    // 检查 Firestore 连接
    try {
      const firestoreTest = `firebase firestore:databases:list --project ${projectId}`;
      const result = await this.runCommand(firestoreTest, { silent: true });
      
      if (result.success) {
        this.log('Firestore is accessible after rollback', 'success');
      } else {
        this.log('Firestore accessibility check failed', 'warning');
      }
    } catch (error) {
      this.log('Could not verify Firestore accessibility', 'warning');
    }
  }
  
  async rollback() {
    try {
      console.log('🔄 Starting rollback process...\n');
      
      // 选择环境
      const environment = await this.selectEnvironment();
      
      // 获取项目ID
      const projectId = await this.getProjectId(environment);
      if (!projectId) {
        throw new Error('Could not determine project ID');
      }
      
      // 选择备份
      const backup = await this.selectBackup();
      
      // 确认回滚
      await this.confirmRollback(environment, backup, projectId);
      
      // 执行回滚
      this.log('Starting rollback process...', 'progress');
      
      await this.rollbackFirestore(projectId, backup.path);
      await this.rollbackStorage(projectId, backup.path);
      await this.rollbackHosting(projectId, environment);
      
      // 验证回滚
      await this.verifyRollback(projectId, environment);
      
      this.log('🎉 Rollback completed successfully!', 'success');
      this.log(`Environment: ${environment}`, 'info');
      this.log(`Project: ${projectId}`, 'info');
      this.log(`Backup: ${backup.name}`, 'info');
      
    } catch (error) {
      this.log(`Rollback failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const rollbackManager = new RollbackManager();
  rollbackManager.rollback();
}

module.exports = RollbackManager;
