// 管理页面认证和安全系统
class AdminAuth {
  constructor() {
    this.sessionTimeout = 1800000; // 30分钟会话超时
    this.maxIdleTime = 600000; // 10分钟无操作自动登出
    this.lastActivity = Date.now();
    this.isAuthenticated = false;
    this.sessionKey = null;
    
    this.init();
  }
  
  init() {
    // 检查是否在管理页面
    if (window.location.pathname.includes('admin')) {
      this.checkAuthentication();
      this.setupActivityMonitoring();
      this.setupSecurityHeaders();
    }
  }
  
  checkAuthentication() {
    const session = this.getSession();
    
    if (!session || !this.isValidSession(session)) {
      this.redirectToLogin();
      return;
    }
    
    this.isAuthenticated = true;
    this.sessionKey = session.key;
    this.updateLastActivity();
    
    // 设置自动登出
    this.setupAutoLogout();
  }
  
  getSession() {
    try {
      const sessionData = localStorage.getItem('adminSession');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Session data corrupted');
      return null;
    }
  }
  
  isValidSession(session) {
    const now = Date.now();
    
    // 检查会话是否过期
    if (now > session.expires) {
      this.clearSession();
      return false;
    }
    
    // 检查会话密钥
    if (!this.validateSessionKey(session.key, session.created)) {
      this.clearSession();
      return false;
    }
    
    return true;
  }
  
  validateSessionKey(key, created) {
    // 简单的会话密钥验证（实际应用中应该更复杂）
    const expectedKey = btoa(`admin-session-${created}-${navigator.userAgent.slice(0, 50)}`);
    return key === expectedKey;
  }
  
  createSession() {
    const now = Date.now();
    const sessionKey = btoa(`admin-session-${now}-${navigator.userAgent.slice(0, 50)}`);
    
    const session = {
      key: sessionKey,
      created: now,
      expires: now + this.sessionTimeout,
      lastActivity: now
    };
    
    localStorage.setItem('adminSession', JSON.stringify(session));
    this.sessionKey = sessionKey;
    this.isAuthenticated = true;
    
    this.logSecurityEvent('管理员登录成功');
  }
  
  clearSession() {
    localStorage.removeItem('adminSession');
    this.sessionKey = null;
    this.isAuthenticated = false;
  }
  
  redirectToLogin() {
    // 创建登录界面
    this.showLoginModal();
  }
  
  showLoginModal() {
    // 清空页面内容
    document.body.innerHTML = '';
    
    // 创建登录界面
    const loginContainer = document.createElement('div');
    loginContainer.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">管理员登录</h1>
            <p class="text-gray-600">请输入您的凭据以访问管理面板</p>
          </div>
          
          <form id="loginForm" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input type="text" id="username" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input type="password" id="password" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">验证码</label>
              <div class="flex space-x-2">
                <input type="text" id="captcha" required 
                       class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <canvas id="captchaCanvas" width="120" height="40" class="border border-gray-300 rounded cursor-pointer"></canvas>
              </div>
            </div>
            
            <button type="submit" 
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              登录
            </button>
          </form>
          
          <div id="errorMessage" class="mt-4 text-red-600 text-sm text-center hidden"></div>
          
          <div class="mt-6 text-center text-xs text-gray-500">
            <p>安全提示：多次登录失败将导致账户锁定</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loginContainer);
    
    // 生成验证码
    this.generateCaptcha();
    
    // 绑定事件
    this.bindLoginEvents();
  }
  
  generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 生成随机验证码
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.captchaText = '';
    for (let i = 0; i < 4; i++) {
      this.captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // 绘制验证码文字
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < this.captchaText.length; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`;
      const x = (canvas.width / 4) * i + (canvas.width / 8);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      const angle = (Math.random() - 0.5) * 0.5;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(this.captchaText[i], 0, 0);
      ctx.restore();
    }
    
    // 点击刷新验证码
    canvas.onclick = () => this.generateCaptcha();
  }
  
  bindLoginEvents() {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('errorMessage');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const captcha = document.getElementById('captcha').value.toUpperCase();
      
      // 验证验证码
      if (captcha !== this.captchaText) {
        this.showError('验证码错误');
        this.generateCaptcha();
        return;
      }
      
      // 验证用户名和密码
      if (this.validateCredentials(username, password)) {
        this.createSession();
        this.loadAdminInterface();
      } else {
        this.showError('用户名或密码错误');
        this.generateCaptcha();
        this.handleFailedLogin();
      }
    });
  }
  
  validateCredentials(username, password) {
    // 简单的凭据验证（实际应用中应该更安全）
    const validCredentials = [
      { username: 'admin', password: 'Admin@2024!@#' },
      { username: 'blogger', password: 'Blog@2024!@#' }
    ];
    
    return validCredentials.some(cred => 
      cred.username === username && cred.password === password
    );
  }
  
  showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
      errorDiv.classList.add('hidden');
    }, 5000);
  }
  
  handleFailedLogin() {
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
    localStorage.setItem('loginAttempts', attempts.toString());
    
    if (attempts >= 5) {
      const lockoutEnd = Date.now() + 900000; // 15分钟锁定
      localStorage.setItem('loginLockout', lockoutEnd.toString());
      this.showError('登录失败次数过多，账户已被锁定15分钟');
      
      this.logSecurityEvent('登录失败次数过多，账户被锁定');
    }
    
    this.logSecurityEvent(`登录失败，尝试次数: ${attempts}`);
  }
  
  loadAdminInterface() {
    // 重新加载管理界面
    window.location.reload();
  }
  
  setupActivityMonitoring() {
    // 监控用户活动
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateLastActivity();
      }, true);
    });
    
    // 定期检查空闲时间
    setInterval(() => {
      this.checkIdleTime();
    }, 60000); // 每分钟检查一次
  }
  
  updateLastActivity() {
    this.lastActivity = Date.now();
    
    // 更新会话中的最后活动时间
    const session = this.getSession();
    if (session) {
      session.lastActivity = this.lastActivity;
      localStorage.setItem('adminSession', JSON.stringify(session));
    }
  }
  
  checkIdleTime() {
    const idleTime = Date.now() - this.lastActivity;
    
    if (idleTime > this.maxIdleTime) {
      this.logout('会话超时，请重新登录');
    }
  }
  
  setupAutoLogout() {
    // 设置会话超时
    setTimeout(() => {
      if (this.isAuthenticated) {
        this.logout('会话已过期，请重新登录');
      }
    }, this.sessionTimeout);
  }
  
  logout(message = '已安全登出') {
    this.clearSession();
    this.logSecurityEvent('管理员登出');
    
    alert(message);
    window.location.href = '/';
  }
  
  setupSecurityHeaders() {
    // 防止页面被嵌入iframe
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
    
    // 禁用右键菜单和开发者工具快捷键
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      // 禁用F12, Ctrl+Shift+I, Ctrl+U等
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    });
  }
  
  logSecurityEvent(event) {
    const log = {
      timestamp: new Date().toISOString(),
      event: event,
      sessionKey: this.sessionKey,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    const logs = JSON.parse(localStorage.getItem('adminSecurityLogs') || '[]');
    logs.push(log);
    
    // 只保留最近200条记录
    if (logs.length > 200) {
      logs.splice(0, logs.length - 200);
    }
    
    localStorage.setItem('adminSecurityLogs', JSON.stringify(logs));
  }
}

// 初始化管理认证系统
document.addEventListener('DOMContentLoaded', () => {
  new AdminAuth();
});

// 导出登出方法
window.adminLogout = () => {
  const auth = new AdminAuth();
  auth.logout();
};
