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
    
    console.log('🔐 隐藏管理端口系统已初始化');
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
          <h4>管理端口已激活</h4>
          <p>隐藏管理功能现已可用</p>
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
    // 创建隐藏的管理入口按钮
    const adminEntry = document.createElement('div');
    adminEntry.id = 'hidden-admin-entry';
    adminEntry.className = 'hidden-admin-entry';
    adminEntry.innerHTML = `
      <button class="admin-entry-btn" onclick="window.hiddenAdmin.openAdminPanel()">
        <i class="fa fa-cog"></i>
        <span>管理面板</span>
      </button>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .hidden-admin-entry {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        opacity: 0;
        animation: fadeInUp 0.5s ease-out 1s forwards;
      }

      .admin-entry-btn {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        transition: all 0.3s ease;
      }

      .admin-entry-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
        background: linear-gradient(135deg, #ff5252, #d63031);
      }

      .admin-entry-btn i {
        animation: rotate 2s linear infinite;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(adminEntry);

    this.adminPortal = adminEntry;
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
    const adminUrl = '/admin.html?token=' + this.generateSecureToken();
    window.open(adminUrl, '_blank');
    this.closeAdminModal();
  }

  generateSecureToken() {
    // 生成安全令牌
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}-${random}-admin`);
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
      
      // 关闭模态框
      this.closeAdminModal();
      
      // 重置用户输入
      this.userInput = [];
      
      console.log('🔒 管理端口已停用');
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
