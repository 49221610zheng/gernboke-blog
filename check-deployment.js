// 部署状态检查脚本
const https = require('https');
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

function checkUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        url,
        status: response.statusCode,
        success: response.statusCode === 200
      });
    });
    
    request.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function checkDeployment() {
  console.log('🔍 检查Firebase部署状态');
  console.log('========================\n');
  
  // 检查配置文件
  log('检查本地配置文件...', 'progress');
  
  const configFiles = [
    { file: 'firebase.json', name: 'Firebase配置' },
    { file: '.firebaserc', name: 'Firebase项目配置' },
    { file: 'js/firebase-config.js', name: 'Firebase应用配置' },
    { file: 'index.html', name: '主页文件' },
    { file: 'admin.html', name: '管理页面' }
  ];
  
  configFiles.forEach(({ file, name }) => {
    if (fs.existsSync(file)) {
      log(`${name}: 存在`, 'success');
    } else {
      log(`${name}: 缺失`, 'error');
    }
  });
  
  console.log('');
  
  // 检查网站可访问性
  log('检查网站可访问性...', 'progress');
  
  const urls = [
    'https://gernboke.web.app',
    'https://gernboke.firebaseapp.com',
    'https://gernboke.web.app/admin',
    'https://gernboke.firebaseapp.com/admin'
  ];
  
  const results = await Promise.all(urls.map(checkUrl));
  
  results.forEach(result => {
    if (result.success) {
      log(`${result.url}: 可访问 (${result.status})`, 'success');
    } else {
      log(`${result.url}: 不可访问 (${result.status || result.error})`, 'error');
    }
  });
  
  console.log('');
  
  // 生成报告
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  if (successCount === totalCount) {
    log('🎉 部署检查完全通过！', 'success');
    console.log('\n🌐 您的网站已成功部署并可以访问:');
    console.log('• 主域名: https://gernboke.web.app');
    console.log('• 备用域名: https://gernboke.firebaseapp.com');
    console.log('• 管理后台: https://gernboke.web.app/admin');
  } else if (successCount > 0) {
    log(`部分成功: ${successCount}/${totalCount} 个URL可访问`, 'warning');
    console.log('\n可能需要等待几分钟让部署完全生效');
  } else {
    log('部署检查失败', 'error');
    console.log('\n💡 可能的原因:');
    console.log('1. 网站尚未部署');
    console.log('2. 部署正在进行中');
    console.log('3. 网络连接问题');
    console.log('4. Firebase项目配置错误');
    console.log('\n🔧 建议操作:');
    console.log('1. 运行 deploy-now.bat 进行部署');
    console.log('2. 检查Firebase Console: https://console.firebase.google.com/project/gernboke');
    console.log('3. 等待几分钟后重新检查');
  }
  
  console.log('\n📊 详细信息:');
  console.log('• Firebase Console: https://console.firebase.google.com/project/gernboke');
  console.log('• 托管管理: https://console.firebase.google.com/project/gernboke/hosting');
  console.log('• 部署历史: https://console.firebase.google.com/project/gernboke/hosting/main');
}

// 运行检查
if (require.main === module) {
  checkDeployment().catch(error => {
    log(`检查失败: ${error.message}`, 'error');
  });
}

module.exports = checkDeployment;
