// 简化的自动化部署脚本
const { execSync } = require('child_process');

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

function runCommand(command) {
  try {
    log(`执行: ${command}`, 'progress');
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    log(`命令失败: ${command}`, 'error');
    return false;
  }
}

async function deploy() {
  console.log('🚀 简化自动化部署');
  console.log('==================\n');
  
  // 步骤1: 检查环境
  log('步骤1: 检查环境', 'progress');
  if (!runCommand('node --version')) {
    log('Node.js未安装，请先安装Node.js', 'error');
    return;
  }
  
  // 步骤2: 安装Firebase CLI
  log('步骤2: 安装Firebase CLI', 'progress');
  if (!runCommand('npm install -g firebase-tools')) {
    log('Firebase CLI安装失败，请以管理员身份运行', 'error');
    return;
  }
  
  // 步骤3: 验证安装
  log('步骤3: 验证Firebase CLI', 'progress');
  if (!runCommand('firebase --version')) {
    log('Firebase CLI验证失败', 'error');
    return;
  }
  
  // 步骤4: 登录提示
  log('步骤4: Firebase登录', 'progress');
  log('请在打开的浏览器中完成Google账户登录', 'info');
  if (!runCommand('firebase login')) {
    log('Firebase登录失败', 'error');
    return;
  }
  
  // 步骤5: 设置项目
  log('步骤5: 设置项目', 'progress');
  if (!runCommand('firebase use gernboke')) {
    log('项目设置失败，请确认项目ID是否正确', 'error');
    return;
  }
  
  // 步骤6: 部署
  log('步骤6: 部署到Firebase Hosting', 'progress');
  if (!runCommand('firebase deploy --only hosting')) {
    log('部署失败', 'error');
    return;
  }
  
  // 完成
  console.log('\n🎉 部署完成！');
  console.log('================');
  console.log('');
  console.log('🌐 您的网站地址:');
  console.log('• https://gernboke.web.app');
  console.log('• https://gernboke.firebaseapp.com');
  console.log('');
  console.log('🔧 Firebase Console:');
  console.log('• https://console.firebase.google.com/project/gernboke');
}

// 运行部署
deploy();
