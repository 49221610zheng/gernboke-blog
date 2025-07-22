// Firebase配置验证脚本
const fs = require('fs');

function log(message, type = 'info') {
  const prefix = {
    info: '📝',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    progress: '🔄'
  }[type] || '📝';
  
  console.log(`${prefix} ${message}`);
}

function verifyFirebaseConfig() {
  console.log('🔥 Firebase配置验证');
  console.log('==================\n');
  
  let allValid = true;
  
  // 1. 检查Firebase配置文件
  log('检查Firebase配置文件...', 'progress');
  
  if (fs.existsSync('js/firebase-config.js')) {
    const configContent = fs.readFileSync('js/firebase-config.js', 'utf8');
    
    if (configContent.includes('gernboke')) {
      log('Firebase配置文件已更新', 'success');
    } else {
      log('Firebase配置文件未更新', 'error');
      allValid = false;
    }
    
    // 检查必要字段
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
        log(`✓ ${field} 字段存在`, 'success');
      } else {
        log(`✗ ${field} 字段缺失`, 'error');
        allValid = false;
      }
    });
    
  } else {
    log('Firebase配置文件不存在', 'error');
    allValid = false;
  }
  
  // 2. 检查.firebaserc文件
  log('\n检查.firebaserc文件...', 'progress');
  
  if (fs.existsSync('.firebaserc')) {
    try {
      const firebaserc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
      
      if (firebaserc.projects && firebaserc.projects.default === 'gernboke') {
        log('.firebaserc配置正确', 'success');
      } else {
        log('.firebaserc配置错误', 'error');
        allValid = false;
      }
    } catch (error) {
      log('.firebaserc格式错误', 'error');
      allValid = false;
    }
  } else {
    log('.firebaserc文件不存在', 'error');
    allValid = false;
  }
  
  // 3. 检查环境变量文件
  log('\n检查环境变量文件...', 'progress');
  
  if (fs.existsSync('.env.example')) {
    const envContent = fs.readFileSync('.env.example', 'utf8');
    
    if (envContent.includes('gernboke')) {
      log('环境变量文件已更新', 'success');
    } else {
      log('环境变量文件未更新', 'warning');
    }
  } else {
    log('环境变量文件不存在', 'warning');
  }
  
  // 4. 检查其他必要文件
  log('\n检查其他配置文件...', 'progress');
  
  const requiredFiles = [
    'firebase.json',
    'firestore.rules',
    'storage.rules'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`${file} 存在`, 'success');
    } else {
      log(`${file} 不存在`, 'warning');
    }
  });
  
  // 5. 总结
  console.log('\n📋 验证结果');
  console.log('============');
  
  if (allValid) {
    log('🎉 Firebase配置验证通过！', 'success');
    console.log('\n下一步操作:');
    console.log('1. 生成Firebase CI令牌: firebase login:ci');
    console.log('2. 在GitHub设置Secrets');
    console.log('3. 推送代码测试自动部署');
  } else {
    log('❌ Firebase配置验证失败', 'error');
    console.log('\n请检查上述错误并修复');
  }
  
  return allValid;
}

// 运行验证
if (require.main === module) {
  verifyFirebaseConfig();
}

module.exports = verifyFirebaseConfig;
