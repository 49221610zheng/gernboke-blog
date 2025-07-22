// 配置验证脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 验证项目配置...\n');

let hasErrors = false;
const warnings = [];
const errors = [];

// 检查必要文件
const requiredFiles = [
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  'js/firebase-config.js',
  'index.html',
  'admin.html'
];

console.log('📁 检查必要文件...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    errors.push(`缺少必要文件: ${file}`);
    hasErrors = true;
  }
});

// 检查 Firebase 配置
console.log('\n🔥 检查 Firebase 配置...');
try {
  const configPath = 'js/firebase-config.js';
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // 检查是否包含占位符
    if (configContent.includes('YOUR_API_KEY')) {
      console.log('❌ Firebase 配置包含占位符，请更新为实际配置');
      errors.push('Firebase 配置尚未更新');
      hasErrors = true;
    } else {
      console.log('✅ Firebase 配置已更新');
    }
    
    // 检查必要的配置项
    const requiredConfigKeys = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId'
    ];
    
    requiredConfigKeys.forEach(key => {
      if (configContent.includes(key)) {
        console.log(`✅ ${key} 配置存在`);
      } else {
        console.log(`❌ ${key} 配置缺失`);
        errors.push(`Firebase 配置缺少 ${key}`);
        hasErrors = true;
      }
    });
  }
} catch (error) {
  console.log('❌ 读取 Firebase 配置失败:', error.message);
  errors.push('无法读取 Firebase 配置文件');
  hasErrors = true;
}

// 检查 firebase.json 配置
console.log('\n⚙️ 检查 firebase.json 配置...');
try {
  const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  
  // 检查必要的服务配置
  const requiredServices = ['firestore', 'hosting', 'storage'];
  requiredServices.forEach(service => {
    if (firebaseConfig[service]) {
      console.log(`✅ ${service} 服务已配置`);
    } else {
      console.log(`⚠️ ${service} 服务未配置`);
      warnings.push(`建议配置 ${service} 服务`);
    }
  });
  
  // 检查 hosting 配置
  if (firebaseConfig.hosting) {
    if (firebaseConfig.hosting.public) {
      console.log(`✅ Hosting public 目录: ${firebaseConfig.hosting.public}`);
    } else {
      console.log('❌ Hosting public 目录未配置');
      errors.push('Hosting 配置缺少 public 目录');
      hasErrors = true;
    }
  }
  
} catch (error) {
  console.log('❌ 解析 firebase.json 失败:', error.message);
  errors.push('firebase.json 格式错误');
  hasErrors = true;
}

// 检查 .firebaserc 文件
console.log('\n🎯 检查项目配置...');
try {
  if (fs.existsSync('.firebaserc')) {
    const firebaserc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
    
    if (firebaserc.projects && firebaserc.projects.default) {
      if (firebaserc.projects.default === 'your-project-id') {
        console.log('❌ .firebaserc 包含占位符项目ID');
        errors.push('请在 .firebaserc 中设置正确的项目ID');
        hasErrors = true;
      } else {
        console.log(`✅ 默认项目: ${firebaserc.projects.default}`);
      }
    } else {
      console.log('❌ .firebaserc 缺少默认项目配置');
      errors.push('.firebaserc 配置不完整');
      hasErrors = true;
    }
  } else {
    console.log('⚠️ .firebaserc 文件不存在');
    warnings.push('建议创建 .firebaserc 文件来管理项目配置');
  }
} catch (error) {
  console.log('❌ 解析 .firebaserc 失败:', error.message);
  errors.push('.firebaserc 格式错误');
  hasErrors = true;
}

// 检查安全规则文件
console.log('\n🛡️ 检查安全规则...');
try {
  // 检查 Firestore 规则
  if (fs.existsSync('firestore.rules')) {
    const firestoreRules = fs.readFileSync('firestore.rules', 'utf8');
    if (firestoreRules.includes('allow read, write: if false')) {
      console.log('⚠️ Firestore 规则过于严格，可能影响应用功能');
      warnings.push('检查 Firestore 安全规则是否过于严格');
    } else {
      console.log('✅ Firestore 安全规则存在');
    }
  }
  
  // 检查 Storage 规则
  if (fs.existsSync('storage.rules')) {
    console.log('✅ Storage 安全规则存在');
  }
} catch (error) {
  console.log('❌ 检查安全规则失败:', error.message);
  warnings.push('无法验证安全规则');
}

// 检查依赖项
console.log('\n📦 检查依赖项...');
try {
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // 检查必要的脚本
    const requiredScripts = ['dev', 'deploy', 'serve'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`✅ ${script} 脚本已配置`);
      } else {
        console.log(`⚠️ ${script} 脚本未配置`);
        warnings.push(`建议添加 ${script} 脚本`);
      }
    });
  }
} catch (error) {
  console.log('❌ 检查 package.json 失败:', error.message);
  warnings.push('无法验证 package.json');
}

// 输出结果
console.log('\n' + '='.repeat(50));
console.log('📊 验证结果汇总');
console.log('='.repeat(50));

if (errors.length > 0) {
  console.log('\n❌ 发现错误:');
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️ 警告信息:');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

if (!hasErrors && warnings.length === 0) {
  console.log('\n🎉 所有检查通过！项目配置正确。');
} else if (!hasErrors) {
  console.log('\n✅ 基本配置正确，但有一些建议改进的地方。');
} else {
  console.log('\n❌ 发现配置错误，请修复后重试。');
}

console.log('\n📚 更多帮助:');
console.log('   - Firebase 配置: ./FIREBASE_SETUP.md');
console.log('   - 部署指南: ./DEPLOYMENT_GUIDE.md');
console.log('   - 项目文档: ./PROJECT_SETUP.md');

// 退出码
process.exit(hasErrors ? 1 : 0);
