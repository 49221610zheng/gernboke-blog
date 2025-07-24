// 管理端增强安全系统
// 提供多层安全保护和访问控制

class AdminSecurityEnhanced {
  constructor() {
    this.securityLevel = 'high';
    this.sessionTimeout = 30 * 60 * 1000; // 30分钟
    this.maxFailedAttempts = 3;
    this.lockoutDuration = 15 * 60 * 1000; // 15分钟锁定
    this.securityLogs = [];
    this.activeSession = null;
    this.permissions = new Set();
    
    this.init();
  }

  init() {
    // 检查安全状态
    this.checkSecurityStatus();
    
    // 设置安全监控
    this.setupSecurityMonitoring();
    
    // 初始化权限系统
    this.initPermissionSystem();
    
    // 设置自动安全检查
    this.setupAutoSecurityCheck();
    
    console.log('🛡️ 管理端增强安全系统已初始化');
  }

  checkSecurityStatus() {
    // 检查是否有有效的管理会话
    const hiddenAccess = sessionStorage.getItem('hiddenAdminAccess');
    const adminToken = sessionStorage.getItem('adminToken');
    const sessionTime = sessionStorage.getItem('adminSessionTime');
    
    if (hiddenAccess === 'true' || adminToken) {
      // 检查会话是否过期
      if (sessionTime) {
        const elapsed = Date.now() - parseInt(sessionTime);
        if (elapsed > this.sessionTimeout) {
          this.terminateSession('session_timeout');
          return false;
        }
      }
      
      this.activeSession = {
        type: hiddenAccess ? 'hidden' : 'token',
        startTime: parseInt(sessionTime) || Date.now(),
        lastActivity: Date.now()
      };
      
      this.grantPermissions();
      return true;
    }
    
    return false;
  }

  grantPermissions() {
    // 根据访问类型授予权限
    if (this.activeSession.type === 'hidden') {
      // 隐藏入口访问 - 完整权限
      this.permissions.add('content_read');
      this.permissions.add('content_write');
      this.permissions.add('content_delete');
      this.permissions.add('system_config');
      this.permissions.add('user_management');
      this.permissions.add('security_logs');
    } else {
      // 令牌访问 - 基础权限
      this.permissions.add('content_read');
      this.permissions.add('content_write');
    }
    
    console.log('🔑 权限已授予:', Array.from(this.permissions));
  }

  hasPermission(permission) {
    return this.permissions.has(permission);
  }

  requirePermission(permission) {
    if (!this.hasPermission(permission)) {
      this.logSecurityEvent('permission_denied', { permission, url: window.location.href });
      throw new Error(`权限不足: 需要 ${permission} 权限`);
    }
  }

  setupSecurityMonitoring() {
    // 监控页面可见性
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.logSecurityEvent('page_hidden');
      } else {
        this.logSecurityEvent('page_visible');
        this.updateActivity();
      }
    });

    // 监控鼠标和键盘活动
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), true);
    });

    // 监控开发者工具
    this.detectDevTools();

    // 监控网络状态
    window.addEventListener('online', () => this.logSecurityEvent('network_online'));
    window.addEventListener('offline', () => this.logSecurityEvent('network_offline'));
  }

  detectDevTools() {
    let devtools = { open: false, orientation: null };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          this.logSecurityEvent('devtools_opened', { 
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
          });
        }
      } else {
        if (devtools.open) {
          devtools.open = false;
          this.logSecurityEvent('devtools_closed');
        }
      }
    }, 500);
  }

  updateActivity() {
    if (this.activeSession) {
      this.activeSession.lastActivity = Date.now();
      sessionStorage.setItem('adminSessionTime', this.activeSession.lastActivity.toString());
    }
  }

  initPermissionSystem() {
    // 创建权限检查装饰器
    window.requirePermission = (permission) => {
      return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
          window.adminSecurity.requirePermission(permission);
          return originalMethod.apply(this, args);
        };
        return descriptor;
      };
    };
  }

  setupAutoSecurityCheck() {
    // 每分钟检查一次安全状态
    setInterval(() => {
      this.performSecurityCheck();
    }, 60000);

    // 每5分钟清理过期日志
    setInterval(() => {
      this.cleanupSecurityLogs();
    }, 5 * 60000);
  }

  performSecurityCheck() {
    if (!this.activeSession) return;

    const now = Date.now();
    const inactiveTime = now - this.activeSession.lastActivity;
    const sessionTime = now - this.activeSession.startTime;

    // 检查会话超时
    if (inactiveTime > this.sessionTimeout) {
      this.terminateSession('inactivity_timeout');
      return;
    }

    // 检查最大会话时间（2小时）
    if (sessionTime > 2 * 60 * 60 * 1000) {
      this.terminateSession('max_session_time');
      return;
    }

    // 检查可疑活动
    this.detectSuspiciousActivity();

    this.logSecurityEvent('security_check_passed');
  }

  detectSuspiciousActivity() {
    const recentLogs = this.securityLogs.filter(log => 
      Date.now() - log.timestamp < 5 * 60 * 1000 // 最近5分钟
    );

    // 检查频繁的权限拒绝
    const permissionDenials = recentLogs.filter(log => log.event === 'permission_denied');
    if (permissionDenials.length > 5) {
      this.logSecurityEvent('suspicious_activity', { 
        type: 'frequent_permission_denials',
        count: permissionDenials.length 
      });
    }

    // 检查异常的页面访问模式
    const pageVisits = recentLogs.filter(log => log.event === 'page_access');
    if (pageVisits.length > 20) {
      this.logSecurityEvent('suspicious_activity', { 
        type: 'excessive_page_visits',
        count: pageVisits.length 
      });
    }
  }

  terminateSession(reason) {
    this.logSecurityEvent('session_terminated', { reason });

    // 清除会话数据
    sessionStorage.removeItem('hiddenAdminAccess');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminSessionTime');
    sessionStorage.removeItem('adminSessionId');

    // 清除权限
    this.permissions.clear();
    this.activeSession = null;

    // 显示终止通知
    this.showSessionTerminatedNotification(reason);

    // 延迟跳转到主页
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  }

  showSessionTerminatedNotification(reason) {
    const reasons = {
      'session_timeout': '会话超时',
      'inactivity_timeout': '长时间无活动',
      'max_session_time': '超过最大会话时间',
      'security_violation': '安全违规',
      'manual_logout': '手动登出'
    };

    const notification = document.createElement('div');
    notification.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    notification.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-shield text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold mb-2">会话已终止</h3>
        <p class="text-gray-600 mb-4">原因: ${reasons[reason] || reason}</p>
        <p class="text-sm text-gray-500">3秒后自动返回主页...</p>
      </div>
    `;
    
    document.body.appendChild(notification);
  }

  logSecurityEvent(event, data = {}) {
    const logEntry = {
      timestamp: Date.now(),
      event,
      data,
      userAgent: navigator.userAgent.substring(0, 100),
      url: window.location.href,
      sessionId: this.activeSession?.startTime || 'no_session'
    };

    this.securityLogs.push(logEntry);
    
    // 保存到localStorage
    this.saveSecurityLogs();

    // 发送到后端（如果可用）
    if (window.frontendBackendBridge) {
      window.frontendBackendBridge.sendSecureMessage('security_log', logEntry);
    }

    console.log('🔒 安全事件:', event, data);
  }

  saveSecurityLogs() {
    try {
      // 只保留最近1000条日志
      if (this.securityLogs.length > 1000) {
        this.securityLogs = this.securityLogs.slice(-1000);
      }
      
      localStorage.setItem('admin_security_logs', JSON.stringify(this.securityLogs));
    } catch (error) {
      console.error('保存安全日志失败:', error);
    }
  }

  loadSecurityLogs() {
    try {
      const logs = localStorage.getItem('admin_security_logs');
      if (logs) {
        this.securityLogs = JSON.parse(logs);
      }
    } catch (error) {
      console.error('加载安全日志失败:', error);
      this.securityLogs = [];
    }
  }

  cleanupSecurityLogs() {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24小时前
    this.securityLogs = this.securityLogs.filter(log => log.timestamp > cutoff);
    this.saveSecurityLogs();
  }

  getSecurityReport() {
    this.requirePermission('security_logs');
    
    const now = Date.now();
    const last24h = this.securityLogs.filter(log => now - log.timestamp < 24 * 60 * 60 * 1000);
    
    const eventCounts = {};
    last24h.forEach(log => {
      eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
    });

    return {
      totalEvents: last24h.length,
      eventCounts,
      suspiciousEvents: last24h.filter(log => 
        log.event.includes('suspicious') || 
        log.event.includes('violation') || 
        log.event.includes('denied')
      ),
      sessionInfo: this.activeSession,
      permissions: Array.from(this.permissions)
    };
  }

  // 手动登出
  logout() {
    this.terminateSession('manual_logout');
  }

  // 紧急锁定
  emergencyLock() {
    this.logSecurityEvent('emergency_lock');
    this.terminateSession('security_violation');
  }
}

// 全局初始化
window.adminSecurity = new AdminSecurityEnhanced();
