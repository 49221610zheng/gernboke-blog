// 前后端联动桥接系统
// 负责前端与后端的安全通信和数据同步

class FrontendBackendBridge {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
    this.heartbeatInterval = null;
    this.messageQueue = [];
    this.eventListeners = new Map();
    
    // 安全配置
    this.securityConfig = {
      encryptionKey: this.generateEncryptionKey(),
      sessionId: this.generateSessionId(),
      apiEndpoint: this.getApiEndpoint()
    };
    
    this.init();
  }

  init() {
    // 检测后端可用性
    this.detectBackend();
    
    // 设置消息监听
    this.setupMessageHandlers();
    
    console.log('🌉 前后端桥接系统已初始化');
  }

  async detectBackend() {
    console.log('🔍 检测后端服务...');
    
    try {
      // 尝试连接 Firebase
      if (typeof firebase !== 'undefined') {
        await this.connectFirebase();
      }
      
      // 尝试连接本地后端
      await this.connectLocalBackend();
      
      // 尝试连接云端API
      await this.connectCloudAPI();
      
    } catch (error) {
      console.warn('⚠️ 后端连接失败，启用离线模式');
      this.enableOfflineMode();
    }
  }

  async connectFirebase() {
    try {
      // 检查 Firebase 配置
      if (window.firebaseConfig) {
        console.log('🔥 连接 Firebase 后端...');
        
        // 初始化 Firebase 连接
        const response = await fetch('https://firebase.googleapis.com/v1/projects/' + window.firebaseConfig.projectId);
        
        if (response.ok) {
          this.isConnected = true;
          this.backendType = 'firebase';
          console.log('✅ Firebase 后端连接成功');
          
          // 启动心跳检测
          this.startHeartbeat();
          
          return true;
        }
      }
    } catch (error) {
      console.log('❌ Firebase 连接失败:', error.message);
    }
    
    return false;
  }

  async connectLocalBackend() {
    try {
      console.log('🏠 尝试连接本地后端...');
      
      const localEndpoints = [
        'http://localhost:3000/api/health',
        'http://localhost:8080/api/health',
        'http://127.0.0.1:3000/api/health'
      ];
      
      for (const endpoint of localEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            timeout: 2000
          });
          
          if (response.ok) {
            this.isConnected = true;
            this.backendType = 'local';
            this.apiEndpoint = endpoint.replace('/health', '');
            console.log('✅ 本地后端连接成功:', this.apiEndpoint);
            
            this.startHeartbeat();
            return true;
          }
        } catch (e) {
          // 继续尝试下一个端点
        }
      }
    } catch (error) {
      console.log('❌ 本地后端连接失败:', error.message);
    }
    
    return false;
  }

  async connectCloudAPI() {
    try {
      console.log('☁️ 尝试连接云端API...');
      
      // 这里可以添加云端API连接逻辑
      // 例如：Vercel、Netlify Functions、AWS Lambda等
      
      const cloudEndpoints = [
        'https://api.example.com/health',
        // 添加更多云端端点
      ];
      
      for (const endpoint of cloudEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.securityConfig.sessionId}`
            }
          });
          
          if (response.ok) {
            this.isConnected = true;
            this.backendType = 'cloud';
            this.apiEndpoint = endpoint.replace('/health', '');
            console.log('✅ 云端API连接成功:', this.apiEndpoint);
            
            this.startHeartbeat();
            return true;
          }
        } catch (e) {
          // 继续尝试下一个端点
        }
      }
    } catch (error) {
      console.log('❌ 云端API连接失败:', error.message);
    }
    
    return false;
  }

  enableOfflineMode() {
    console.log('📴 启用离线模式');
    this.isConnected = false;
    this.backendType = 'offline';
    
    // 使用本地存储模拟后端功能
    this.setupOfflineStorage();
  }

  setupOfflineStorage() {
    // 创建离线数据存储
    if (!localStorage.getItem('offlineData')) {
      const offlineData = {
        posts: [],
        photos: [],
        comments: [],
        analytics: {
          views: 0,
          visitors: 0,
          lastUpdate: Date.now()
        },
        settings: {}
      };
      localStorage.setItem('offlineData', JSON.stringify(offlineData));
    }
    
    console.log('💾 离线存储已设置');
  }

  startHeartbeat() {
    // 每30秒发送心跳检测
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000);
  }

  async sendHeartbeat() {
    try {
      const heartbeatData = {
        timestamp: Date.now(),
        sessionId: this.securityConfig.sessionId,
        type: 'heartbeat'
      };
      
      const response = await this.sendSecureMessage('heartbeat', heartbeatData);
      
      if (!response.success) {
        this.handleConnectionLoss();
      }
    } catch (error) {
      this.handleConnectionLoss();
    }
  }

  handleConnectionLoss() {
    console.warn('💔 后端连接丢失');
    this.isConnected = false;
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // 尝试重新连接
    this.attemptReconnection();
  }

  async attemptReconnection() {
    if (this.connectionAttempts >= this.maxRetries) {
      console.error('🚫 重连次数超限，切换到离线模式');
      this.enableOfflineMode();
      return;
    }
    
    this.connectionAttempts++;
    console.log(`🔄 尝试重新连接 (${this.connectionAttempts}/${this.maxRetries})`);
    
    // 等待一段时间后重试
    setTimeout(() => {
      this.detectBackend();
    }, 5000 * this.connectionAttempts);
  }

  async sendSecureMessage(type, data) {
    const message = {
      type,
      data: this.encryptData(data),
      timestamp: Date.now(),
      sessionId: this.securityConfig.sessionId
    };
    
    if (!this.isConnected) {
      // 离线模式：将消息加入队列
      this.messageQueue.push(message);
      return { success: false, error: 'offline' };
    }
    
    try {
      let response;
      
      switch (this.backendType) {
        case 'firebase':
          response = await this.sendFirebaseMessage(message);
          break;
        case 'local':
          response = await this.sendLocalMessage(message);
          break;
        case 'cloud':
          response = await this.sendCloudMessage(message);
          break;
        default:
          throw new Error('未知的后端类型');
      }
      
      return response;
    } catch (error) {
      console.error('📤 消息发送失败:', error);
      this.messageQueue.push(message);
      return { success: false, error: error.message };
    }
  }

  async sendFirebaseMessage(message) {
    // Firebase 消息发送逻辑
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      const db = firebase.firestore();
      await db.collection('admin_messages').add(message);
      return { success: true };
    }
    throw new Error('Firebase 不可用');
  }

  async sendLocalMessage(message) {
    // 本地后端消息发送
    const response = await fetch(`${this.apiEndpoint}/admin/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.securityConfig.sessionId}`
      },
      body: JSON.stringify(message)
    });
    
    return await response.json();
  }

  async sendCloudMessage(message) {
    // 云端API消息发送
    const response = await fetch(`${this.apiEndpoint}/admin/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.securityConfig.sessionId}`
      },
      body: JSON.stringify(message)
    });
    
    return await response.json();
  }

  encryptData(data) {
    // 简单的数据加密（实际项目中应使用更强的加密）
    try {
      const jsonString = JSON.stringify(data);
      return btoa(jsonString);
    } catch (error) {
      console.error('🔐 数据加密失败:', error);
      return data;
    }
  }

  decryptData(encryptedData) {
    // 数据解密
    try {
      const jsonString = atob(encryptedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('🔓 数据解密失败:', error);
      return encryptedData;
    }
  }

  generateEncryptionKey() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2) + '_' + Date.now();
  }

  getApiEndpoint() {
    // 根据环境确定API端点
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    return 'https://api.yourdomain.com';
  }

  setupMessageHandlers() {
    // 设置消息处理器
    this.on('admin_action', (data) => {
      console.log('🎯 收到管理操作:', data);
      this.handleAdminAction(data);
    });
    
    this.on('system_update', (data) => {
      console.log('🔄 收到系统更新:', data);
      this.handleSystemUpdate(data);
    });
    
    this.on('security_alert', (data) => {
      console.log('🚨 收到安全警报:', data);
      this.handleSecurityAlert(data);
    });
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`事件处理器错误 (${event}):`, error);
        }
      });
    }
  }

  handleAdminAction(data) {
    // 处理管理操作
    switch (data.action) {
      case 'update_content':
        this.updateContent(data.payload);
        break;
      case 'moderate_comment':
        this.moderateComment(data.payload);
        break;
      case 'backup_data':
        this.backupData();
        break;
      default:
        console.log('未知的管理操作:', data.action);
    }
  }

  handleSystemUpdate(data) {
    // 处理系统更新
    console.log('系统更新:', data);
    
    // 可以在这里添加自动更新逻辑
    if (data.autoUpdate) {
      this.applySystemUpdate(data);
    }
  }

  handleSecurityAlert(data) {
    // 处理安全警报
    console.warn('安全警报:', data);
    
    // 显示安全警报通知
    this.showSecurityAlert(data);
  }

  showSecurityAlert(data) {
    // 显示安全警报UI
    const alert = document.createElement('div');
    alert.className = 'security-alert';
    alert.innerHTML = `
      <div class="alert-content">
        <i class="fa fa-exclamation-triangle"></i>
        <span>安全警报: ${data.message}</span>
        <button onclick="this.parentElement.parentElement.remove()">
          <i class="fa fa-times"></i>
        </button>
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .security-alert {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        z-index: 10000;
        animation: alertSlideDown 0.3s ease-out;
      }
      
      .alert-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .alert-content button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
      }
      
      @keyframes alertSlideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(alert);
    
    // 10秒后自动移除
    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 10000);
  }

  // 公共API方法
  async syncData(dataType, data) {
    return await this.sendSecureMessage('sync_data', { dataType, data });
  }

  async getAnalytics() {
    return await this.sendSecureMessage('get_analytics', {});
  }

  async updateSettings(settings) {
    return await this.sendSecureMessage('update_settings', settings);
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      type: this.backendType,
      endpoint: this.apiEndpoint,
      sessionId: this.securityConfig.sessionId
    };
  }
}

// 全局初始化
window.frontendBackendBridge = new FrontendBackendBridge();
