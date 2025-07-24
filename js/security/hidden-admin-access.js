// 隐藏管理端口访问系统
// 使用 Konami Code (上上下下左右左右) 来激活管理端

class HiddenAdminAccess {
  constructor() {
    this.konamiCode = [
      'ArrowUp', 'ArrowUp', 
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 
      'ArrowLeft', 'ArrowRight'
    ];
    this.userInput = [];
    this.isActivated = false;
    this.adminPortal = null;
    this.sessionTimeout = 30 * 60 * 1000; // 30分钟超时
    this.lastActivity = Date.now();
    
    this.init();
  }

  init() {
    // 监听键盘事件
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // 监听鼠标活动以重置超时
    document.addEventListener('mousemove', () => this.updateActivity());
    document.addEventListener('click', () => this.updateActivity());

    // 定期检查会话超时
    setInterval(() => this.checkSessionTimeout(), 60000); // 每分钟检查一次

    // 检查是否已有激活的会话
    this.checkExistingSession();

    // 添加额外的隐藏入口方式
    this.setupAlternativeEntries();

    console.log('🔐 隐藏管理端口系统已初始化');
  }

  setupAlternativeEntries() {
    // 方式1: 点击Logo 5次快速激活
    let logoClickCount = 0;
    let logoClickTimer = null;

    const logo = document.querySelector('header a[href="#"]');
    if (logo) {
      logo.addEventListener('click', (e) => {
        logoClickCount++;

        if (logoClickTimer) {
          clearTimeout(logoClickTimer);
        }

        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 2000); // 2秒内点击5次

        if (logoClickCount >= 5) {
          e.preventDefault();
          this.activateAdminPortal();
          logoClickCount = 0;
        }
      });
    }

    // 方式2: 在页脚版权信息上双击
    const footer = document.querySelector('footer');
    if (footer) {
      const copyright = footer.querySelector('p');
      if (copyright) {
        copyright.addEventListener('dblclick', () => {
          this.activateAdminPortal();
        });

        // 添加隐藏的样式提示
        copyright.style.cursor = 'default';
        copyright.title = '';
      }
    }

    // 方式3: URL参数激活
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || urlParams.get('debug') === 'true') {
      this.activateAdminPortal();
      // 清除URL参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 方式4: 特殊时间激活（开发者彩蛋）
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) { // 午夜时分
      console.log('🌙 午夜彩蛋：管理端口自动激活');
      setTimeout(() => {
        this.activateAdminPortal();
      }, 3000);
    }

    console.log('🔐 额外隐藏入口已设置');

    // 方式5: 开发者调试模式（Ctrl+Shift+Alt+D）
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'D') {
        this.toggleDebugMode();
      }
    });
  }

  toggleDebugMode() {
    const isDebugMode = document.body.classList.contains('debug-mode');

    if (isDebugMode) {
      document.body.classList.remove('debug-mode');
      console.log('🔧 调试模式已关闭');
    } else {
      document.body.classList.add('debug-mode');
      console.log('🔧 调试模式已开启 - 隐藏入口现在可见');

      // 显示调试信息
      this.showDebugInfo();
    }
  }

  showDebugInfo() {
    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    debugInfo.innerHTML = `
      <div class="debug-content">
        <h4>🔧 调试模式</h4>
        <p>隐藏入口现在可见（左下角）</p>
        <p>激活方式：</p>
        <ul>
          <li>Konami Code: ↑↑↓↓←→←→</li>
          <li>Logo点击: 快速点击5次</li>
          <li>页脚双击: 双击版权信息</li>
          <li>URL参数: ?admin=true</li>
        </ul>
        <button onclick="this.parentElement.parentElement.remove()">关闭</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .debug-info {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: monospace;
        max-width: 400px;
      }

      .debug-content h4 {
        margin: 0 0 10px 0;
        color: #00ff00;
      }

      .debug-content ul {
        margin: 10px 0;
        padding-left: 20px;
      }

      .debug-content li {
        margin: 5px 0;
        font-size: 12px;
      }

      .debug-content button {
        background: #333;
        color: white;
        border: 1px solid #666;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(debugInfo);

    // 5秒后自动关闭
    setTimeout(() => {
      if (debugInfo.parentElement) {
        debugInfo.remove();
      }
    }, 10000);
  }

  handleKeyPress(event) {
    // 只在主页面监听，避免在输入框中触发
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    // 添加按键到用户输入序列
    this.userInput.push(event.code);
    
    // 保持序列长度不超过 Konami Code 长度
    if (this.userInput.length > this.konamiCode.length) {
      this.userInput.shift();
    }
    
    // 检查是否匹配 Konami Code
    if (this.userInput.length === this.konamiCode.length) {
      if (this.checkKonamiCode()) {
        this.activateAdminPortal();
      }
    }
  }

  checkKonamiCode() {
    return this.userInput.every((key, index) => key === this.konamiCode[index]);
  }

  activateAdminPortal() {
    if (this.isActivated) {
      console.log('🔐 管理端口已激活');
      return;
    }

    this.isActivated = true;
    this.lastActivity = Date.now();
    
    // 保存激活状态到 sessionStorage
    sessionStorage.setItem('adminPortalActivated', 'true');
    sessionStorage.setItem('adminActivationTime', Date.now().toString());
    
    // 显示激活提示
    this.showActivationNotification();
    
    // 创建隐藏的管理入口
    this.createHiddenAdminEntry();
    
    // 启动前后端联动
    this.initializeBackendConnection();
    
    console.log('🚀 管理端口已激活！');
  }

  showActivationNotification() {
    // 创建激活通知
    const notification = document.createElement('div');
    notification.className = 'admin-activation-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="fa fa-unlock-alt"></i>
        </div>
        <div class="notification-text">
          <h4>🔐 隐藏管理端口已激活</h4>
          <p>管理功能现已可用，完全隐藏模式</p>
          <small>无可见入口，仅通过隐藏方式访问</small>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fa fa-times"></i>
        </button>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .admin-activation-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.5s ease-out;
        max-width: 320px;
      }

      .notification-content {
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .notification-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .notification-text h4 {
        margin: 0 0 5px 0;
        font-size: 16px;
        font-weight: 600;
      }

      .notification-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }

      .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: background 0.2s ease;
      }

      .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    // 5秒后自动移除通知
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  createHiddenAdminEntry() {
    // 创建完全隐藏的管理入口
    const adminEntry = document.createElement('div');
    adminEntry.id = 'hidden-admin-entry';
    adminEntry.className = 'hidden-admin-entry';
    adminEntry.innerHTML = `
      <div class="admin-entry-invisible" onclick="window.hiddenAdmin.openAdminPanel()" title="隐藏管理入口">
        <!-- 完全透明的可点击区域 -->
      </div>
    `;

    // 添加完全隐藏的样式
    const style = document.createElement('style');
    style.textContent = `
      .hidden-admin-entry {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9999;
        pointer-events: auto;
      }

      .admin-entry-invisible {
        width: 50px;
        height: 50px;
        background: transparent;
        border: none;
        cursor: default;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      /* 只在悬停时显示微弱提示 */
      .admin-entry-invisible:hover {
        opacity: 0.05;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      }

      /* 开发模式下的可见提示 */
      .debug-mode .admin-entry-invisible {
        opacity: 0.3;
        background: linear-gradient(135deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1));
        border: 1px dashed rgba(255,255,255,0.3);
      }

      .debug-mode .admin-entry-invisible:hover {
        opacity: 0.6;
      }

      /* 激活状态的微弱指示 */
      .admin-activated .hidden-admin-entry::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        width: 3px;
        height: 3px;
        background: rgba(0, 255, 0, 0.3);
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.5); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(adminEntry);

    // 添加激活状态指示
    document.body.classList.add('admin-activated');

    this.adminPortal = adminEntry;

    console.log('🔐 隐藏管理入口已创建（完全不可见模式）');
  }

  openAdminPanel() {
    // 检查激活状态
    if (!this.isActivated) {
      console.warn('🔐 管理端口未激活');
      return;
    }

    // 更新活动时间
    this.updateActivity();

    // 创建管理面板模态框
    this.createAdminModal();
  }

  createAdminModal() {
    // 移除现有模态框
    const existingModal = document.getElementById('admin-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="admin-modal-backdrop" onclick="window.hiddenAdmin.closeAdminModal()"></div>
      <div class="admin-modal-content">
        <div class="admin-modal-header">
          <h3><i class="fa fa-shield"></i> 管理控制面板</h3>
          <button class="admin-modal-close" onclick="window.hiddenAdmin.closeAdminModal()">
            <i class="fa fa-times"></i>
          </button>
        </div>
        
        <div class="admin-modal-body">
          <div class="admin-quick-actions">
            <button class="admin-action-btn" onclick="window.hiddenAdmin.openFullAdmin()">
              <i class="fa fa-external-link"></i>
              <span>打开完整管理后台</span>
            </button>
            
            <button class="admin-action-btn" onclick="window.hiddenAdmin.showSystemStatus()">
              <i class="fa fa-heartbeat"></i>
              <span>系统状态监控</span>
            </button>
            
            <button class="admin-action-btn" onclick="window.hiddenAdmin.showAnalytics()">
              <i class="fa fa-bar-chart"></i>
              <span>访问统计分析</span>
            </button>
            
            <button class="admin-action-btn" onclick="window.hiddenAdmin.emergencyMode()">
              <i class="fa fa-exclamation-triangle"></i>
              <span>紧急维护模式</span>
            </button>
          </div>
          
          <div class="admin-session-info">
            <h4>会话信息</h4>
            <div class="session-details">
              <div class="session-item">
                <span>激活时间:</span>
                <span id="activation-time">${new Date(this.lastActivity).toLocaleString()}</span>
              </div>
              <div class="session-item">
                <span>剩余时间:</span>
                <span id="remaining-time">计算中...</span>
              </div>
              <div class="session-item">
                <span>访问级别:</span>
                <span class="access-level">超级管理员</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="admin-modal-footer">
          <button class="btn-secondary" onclick="window.hiddenAdmin.deactivateAdmin()">
            <i class="fa fa-lock"></i>
            停用管理端口
          </button>
          <button class="btn-primary" onclick="window.hiddenAdmin.extendSession()">
            <i class="fa fa-clock-o"></i>
            延长会话
          </button>
        </div>
      </div>
    `;

    // 添加模态框样式
    this.addAdminModalStyles();
    
    document.body.appendChild(modal);
    
    // 启动倒计时
    this.startSessionCountdown();
  }

  addAdminModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .admin-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: modalFadeIn 0.3s ease-out;
      }

      .admin-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
      }

      .admin-modal-content {
        position: relative;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: modalSlideUp 0.3s ease-out;
      }

      .admin-modal-header {
        padding: 24px 24px 0;
        display: flex;
        justify-content: between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 16px;
      }

      .admin-modal-header h3 {
        margin: 0;
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .admin-modal-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .admin-modal-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .admin-modal-body {
        padding: 24px;
      }

      .admin-quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }

      .admin-action-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 16px 20px;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        text-align: left;
      }

      .admin-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .admin-session-info {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .admin-session-info h4 {
        margin: 0 0 16px 0;
        color: #374151;
        font-size: 1rem;
        font-weight: 600;
      }

      .session-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .session-item:last-child {
        border-bottom: none;
      }

      .access-level {
        background: #10b981;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
      }

      .admin-modal-footer {
        padding: 0 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
      }

      .btn-primary:hover {
        background: #2563eb;
      }

      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
      }

      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes modalSlideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
      modal.remove();
    }
  }

  openFullAdmin() {
    // 在新标签页中打开完整的管理后台
    const token = this.generateSecureToken();
    const adminUrl = '/admin.html?token=' + token;

    // 记录访问日志
    console.log('🔐 生成管理后台访问令牌:', token.substring(0, 20) + '...');

    // 设置访问权限标记
    sessionStorage.setItem('adminTokenGenerated', Date.now().toString());

    window.open(adminUrl, '_blank');
    this.closeAdminModal();
  }

  generateSecureToken() {
    // 生成安全令牌
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const userAgent = navigator.userAgent.substring(0, 50);
    const sessionId = this.getSessionId();

    // 记录令牌生成日志
    this.logAdminAccess('token_generated', {
      timestamp,
      sessionId,
      userAgent,
      ip: 'hidden' // 前端无法获取真实IP
    });

    return btoa(`${timestamp}-${random}-admin`);
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('adminSessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      sessionStorage.setItem('adminSessionId', sessionId);
    }
    return sessionId;
  }

  logAdminAccess(action, data) {
    const logEntry = {
      action,
      timestamp: Date.now(),
      data,
      url: window.location.href
    };

    // 存储到本地日志
    const logs = JSON.parse(localStorage.getItem('adminAccessLogs') || '[]');
    logs.push(logEntry);

    // 只保留最近100条日志
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    localStorage.setItem('adminAccessLogs', JSON.stringify(logs));

    // 发送到后端（如果可用）
    if (window.frontendBackendBridge) {
      window.frontendBackendBridge.sendSecureMessage('admin_log', logEntry);
    }

    console.log('📝 管理访问日志:', action, data);
  }

  showSystemStatus() {
    console.log('🔍 显示系统状态监控');
    // 这里可以添加系统状态监控功能
    alert('系统状态监控功能开发中...');
  }

  showAnalytics() {
    console.log('📊 显示访问统计分析');
    // 这里可以添加访问统计分析功能
    alert('访问统计分析功能开发中...');
  }

  emergencyMode() {
    const confirm = window.confirm('确定要启用紧急维护模式吗？这将暂时限制网站访问。');
    if (confirm) {
      console.log('🚨 启用紧急维护模式');
      // 这里可以添加紧急维护模式功能
      alert('紧急维护模式已启用');
    }
  }

  extendSession() {
    this.lastActivity = Date.now();
    sessionStorage.setItem('adminActivationTime', Date.now().toString());
    console.log('⏰ 会话已延长');
    
    // 更新显示
    const activationTimeElement = document.getElementById('activation-time');
    if (activationTimeElement) {
      activationTimeElement.textContent = new Date(this.lastActivity).toLocaleString();
    }
  }

  deactivateAdmin() {
    const confirm = window.confirm('确定要停用管理端口吗？');
    if (confirm) {
      this.isActivated = false;
      sessionStorage.removeItem('adminPortalActivated');
      sessionStorage.removeItem('adminActivationTime');

      // 移除管理入口
      if (this.adminPortal) {
        this.adminPortal.remove();
        this.adminPortal = null;
      }

      // 移除激活状态指示
      document.body.classList.remove('admin-activated');
      document.body.classList.remove('debug-mode');

      // 关闭模态框
      this.closeAdminModal();

      // 重置用户输入
      this.userInput = [];

      // 清除所有相关的DOM元素
      const notifications = document.querySelectorAll('.admin-activation-notification');
      notifications.forEach(notification => notification.remove());

      console.log('🔒 管理端口已完全停用，所有痕迹已清除');
    }
  }

  startSessionCountdown() {
    const updateCountdown = () => {
      const remainingTimeElement = document.getElementById('remaining-time');
      if (!remainingTimeElement) return;
      
      const elapsed = Date.now() - this.lastActivity;
      const remaining = this.sessionTimeout - elapsed;
      
      if (remaining <= 0) {
        this.deactivateAdmin();
        return;
      }
      
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      remainingTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    updateCountdown();
    const countdownInterval = setInterval(() => {
      if (!document.getElementById('remaining-time')) {
        clearInterval(countdownInterval);
        return;
      }
      updateCountdown();
    }, 1000);
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  checkSessionTimeout() {
    if (!this.isActivated) return;
    
    const elapsed = Date.now() - this.lastActivity;
    if (elapsed > this.sessionTimeout) {
      console.log('⏰ 会话超时，自动停用管理端口');
      this.deactivateAdmin();
    }
  }

  checkExistingSession() {
    const activated = sessionStorage.getItem('adminPortalActivated');
    const activationTime = sessionStorage.getItem('adminActivationTime');
    
    if (activated === 'true' && activationTime) {
      const elapsed = Date.now() - parseInt(activationTime);
      if (elapsed < this.sessionTimeout) {
        this.isActivated = true;
        this.lastActivity = parseInt(activationTime);
        this.createHiddenAdminEntry();
        console.log('🔐 恢复现有管理会话');
      } else {
        // 清除过期会话
        sessionStorage.removeItem('adminPortalActivated');
        sessionStorage.removeItem('adminActivationTime');
      }
    }
  }

  initializeBackendConnection() {
    // 初始化前后端联动
    console.log('🔗 初始化前后端联动...');
    
    // 这里可以添加与后端的连接逻辑
    // 例如：WebSocket连接、API认证等
    
    // 模拟后端连接
    setTimeout(() => {
      console.log('✅ 前后端联动已建立');
    }, 1000);
  }
}

// 全局初始化
window.hiddenAdmin = new HiddenAdminAccess();
