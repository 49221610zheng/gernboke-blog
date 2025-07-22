// 隐秘管理入口系统
class SecretAccess {
  constructor() {
    this.sequence = [];
    this.secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    this.timeWindow = 3000; // 3秒内输入完成
    this.lastKeyTime = 0;
    this.attempts = 0;
    this.maxAttempts = 3;
    this.lockoutTime = 300000; // 5分钟锁定
    this.isLocked = false;
    
    this.init();
  }
  
  init() {
    // 检查是否被锁定
    this.checkLockout();
    
    // 监听键盘事件
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // 添加隐藏的点击区域
    this.createHiddenTrigger();
    
    // 监听特殊URL参数
    this.checkURLAccess();
  }
  
  checkLockout() {
    const lockoutEnd = localStorage.getItem('adminLockout');
    if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
      this.isLocked = true;
      console.log('管理访问已被锁定');
    }
  }
  
  handleKeyPress(e) {
    if (this.isLocked) return;

    const now = Date.now();

    // 检查时间窗口
    if (now - this.lastKeyTime > this.timeWindow) {
      this.sequence = [];
    }

    this.lastKeyTime = now;
    this.sequence.push(e.code);

    // 调试信息
    console.log('按键序列:', this.sequence.join(' '));
    console.log('目标序列:', this.secretCode.join(' '));

    // 保持序列长度
    if (this.sequence.length > this.secretCode.length) {
      this.sequence.shift();
    }

    // 检查是否匹配
    if (this.sequence.length === this.secretCode.length) {
      if (this.checkSequence()) {
        console.log('✅ 秘密代码匹配成功！');
        this.grantAccess();
      } else {
        console.log('❌ 秘密代码不匹配');
        this.handleFailedAttempt();
      }
      this.sequence = [];
    }
  }
  
  checkSequence() {
    return this.sequence.every((key, index) => key === this.secretCode[index]);
  }
  
  createHiddenTrigger() {
    // 在页脚创建隐藏的触发区域
    const footer = document.querySelector('footer');
    if (footer) {
      const trigger = document.createElement('div');
      trigger.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 50px;
        height: 50px;
        opacity: 0;
        cursor: default;
      `;
      
      let clickCount = 0;
      let clickTimer = null;
      
      trigger.addEventListener('click', () => {
        if (this.isLocked) return;
        
        clickCount++;
        
        if (clickTimer) clearTimeout(clickTimer);
        
        clickTimer = setTimeout(() => {
          if (clickCount === 7) { // 需要连续点击7次
            this.showSecretPrompt();
          }
          clickCount = 0;
        }, 2000);
      });
      
      footer.style.position = 'relative';
      footer.appendChild(trigger);
    }
  }
  
  showSecretPrompt() {
    const password = prompt('请输入管理密码:');
    if (password === 'admin2024!@#') { // 可以改为更复杂的密码
      this.grantAccess();
    } else {
      this.handleFailedAttempt();
    }
  }
  
  checkURLAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessKey = urlParams.get('access');
    const timestamp = urlParams.get('t');
    
    if (accessKey && timestamp) {
      // 验证访问密钥和时间戳
      const expectedKey = this.generateAccessKey(timestamp);
      if (accessKey === expectedKey && this.isValidTimestamp(timestamp)) {
        this.grantAccess();
        // 清除URL参数
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }
  
  generateAccessKey(timestamp) {
    // 简单的密钥生成算法（实际应用中应该更复杂）
    const secret = 'your-secret-key-2024';
    return btoa(secret + timestamp).slice(0, 16);
  }
  
  isValidTimestamp(timestamp) {
    const now = Date.now();
    const accessTime = parseInt(timestamp);
    return Math.abs(now - accessTime) < 300000; // 5分钟有效期
  }
  
  grantAccess() {
    // 清除失败记录
    this.attempts = 0;
    localStorage.removeItem('adminAttempts');
    localStorage.removeItem('adminLockout');

    // 显示成功消息
    this.showAccessMessage('管理访问已授权', 'success');

    // 延迟跳转到管理页面
    setTimeout(() => {
      this.navigateToAdmin();
    }, 1000);
  }

  navigateToAdmin() {
    // 多种路径尝试，确保在不同环境下都能正常工作
    const possiblePaths = [
      './admin.html',
      'admin.html',
      '/admin.html',
      window.location.origin + '/admin.html',
      window.location.origin + window.location.pathname.replace('index.html', '').replace(/\/$/, '') + '/admin.html'
    ];

    console.log('尝试跳转路径:', possiblePaths);

    // 首先尝试相对路径
    let adminUrl = './admin.html';

    // 如果是GitHub Pages，使用特定的路径构建
    if (window.location.hostname.includes('github.io')) {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 2) {
        // 格式: /username/repository-name/
        adminUrl = `/${pathParts[1]}/${pathParts[2]}/admin.html`;
      } else {
        adminUrl = './admin.html';
      }
    }

    console.log('最终跳转URL:', adminUrl);

    // 尝试跳转
    try {
      window.location.href = adminUrl;
    } catch (error) {
      console.error('跳转失败:', error);
      // 备用方法：在新窗口打开
      window.open(adminUrl, '_blank');
    }
  }

  handleFailedAttempt() {
    this.attempts++;
    localStorage.setItem('adminAttempts', this.attempts.toString());
    
    if (this.attempts >= this.maxAttempts) {
      this.lockAccess();
    } else {
      this.showAccessMessage(`访问失败，还有 ${this.maxAttempts - this.attempts} 次机会`, 'warning');
    }
  }
  
  lockAccess() {
    this.isLocked = true;
    const lockoutEnd = Date.now() + this.lockoutTime;
    localStorage.setItem('adminLockout', lockoutEnd.toString());
    
    this.showAccessMessage('访问已被锁定5分钟', 'error');
    
    // 记录安全事件
    this.logSecurityEvent('多次失败访问尝试');
  }
  
  showAccessMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };
    
    messageDiv.style.backgroundColor = colors[type] || colors.success;
    messageDiv.textContent = message;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
      style.remove();
    }, 3000);
  }
  
  logSecurityEvent(event) {
    const log = {
      timestamp: new Date().toISOString(),
      event: event,
      ip: 'client-side', // 实际应用中应该记录真实IP
      userAgent: navigator.userAgent
    };
    
    // 存储到本地（实际应用中应该发送到服务器）
    const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    logs.push(log);
    
    // 只保留最近100条记录
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('securityLogs', JSON.stringify(logs));
  }
  
  // 生成访问链接的方法（供管理员使用）
  static generateAccessLink() {
    const timestamp = Date.now().toString();
    const secret = 'your-secret-key-2024';
    const accessKey = btoa(secret + timestamp).slice(0, 16);
    
    return `${window.location.origin}?access=${accessKey}&t=${timestamp}`;
  }
}

// 初始化隐秘访问系统
document.addEventListener('DOMContentLoaded', () => {
  new SecretAccess();
});

// 在控制台提供生成访问链接的方法
window.generateAdminLink = SecretAccess.generateAccessLink;

// 提供测试访问的方法
window.testAdminAccess = function() {
  const secretAccess = new SecretAccess();
  secretAccess.grantAccess();
};

// 提供直接访问的方法（用于调试）
window.directAdminAccess = function() {
  const secretAccess = new SecretAccess();
  secretAccess.navigateToAdmin();
};
