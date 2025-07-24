// 管理端数据同步系统
// 实现前后端数据的实时同步和管理

class AdminDataSync {
  constructor() {
    this.syncInterval = null;
    this.lastSyncTime = null;
    this.pendingChanges = new Map();
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    
    this.init();
  }

  init() {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // 启动定期同步
    this.startPeriodicSync();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncData();
      }
    });
    
    console.log('🔄 管理端数据同步系统已初始化');
  }

  startPeriodicSync() {
    // 每30秒同步一次数据
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncData();
      }
    }, 30000);
  }

  async syncData() {
    try {
      console.log('🔄 开始数据同步...');
      
      // 同步各种数据类型
      await Promise.all([
        this.syncPosts(),
        this.syncPhotos(),
        this.syncComments(),
        this.syncAnalytics(),
        this.syncSettings()
      ]);
      
      this.lastSyncTime = Date.now();
      console.log('✅ 数据同步完成');
      
      // 更新UI显示
      this.updateSyncStatus('success');
      
    } catch (error) {
      console.error('❌ 数据同步失败:', error);
      this.updateSyncStatus('error');
    }
  }

  async syncPosts() {
    try {
      // 获取本地文章数据
      const localPosts = this.getLocalData('posts');
      
      // 发送到后端
      const response = await window.frontendBackendBridge.syncData('posts', localPosts);
      
      if (response.success) {
        // 更新本地数据
        this.updateLocalData('posts', response.data);
        console.log('📝 文章数据同步成功');
      }
    } catch (error) {
      console.error('📝 文章数据同步失败:', error);
      this.addToSyncQueue('posts', this.getLocalData('posts'));
    }
  }

  async syncPhotos() {
    try {
      const localPhotos = this.getLocalData('photos');
      const response = await window.frontendBackendBridge.syncData('photos', localPhotos);
      
      if (response.success) {
        this.updateLocalData('photos', response.data);
        console.log('📸 摄影作品数据同步成功');
      }
    } catch (error) {
      console.error('📸 摄影作品数据同步失败:', error);
      this.addToSyncQueue('photos', this.getLocalData('photos'));
    }
  }

  async syncComments() {
    try {
      const localComments = this.getLocalData('comments');
      const response = await window.frontendBackendBridge.syncData('comments', localComments);
      
      if (response.success) {
        this.updateLocalData('comments', response.data);
        console.log('💬 评论数据同步成功');
      }
    } catch (error) {
      console.error('💬 评论数据同步失败:', error);
      this.addToSyncQueue('comments', this.getLocalData('comments'));
    }
  }

  async syncAnalytics() {
    try {
      const analytics = await window.frontendBackendBridge.getAnalytics();
      
      if (analytics.success) {
        this.updateLocalData('analytics', analytics.data);
        console.log('📊 统计数据同步成功');
        
        // 更新仪表盘显示
        this.updateDashboard(analytics.data);
      }
    } catch (error) {
      console.error('📊 统计数据同步失败:', error);
    }
  }

  async syncSettings() {
    try {
      const localSettings = this.getLocalData('settings');
      const response = await window.frontendBackendBridge.syncData('settings', localSettings);
      
      if (response.success) {
        this.updateLocalData('settings', response.data);
        console.log('⚙️ 设置数据同步成功');
      }
    } catch (error) {
      console.error('⚙️ 设置数据同步失败:', error);
      this.addToSyncQueue('settings', this.getLocalData('settings'));
    }
  }

  getLocalData(type) {
    try {
      const data = localStorage.getItem(`admin_${type}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`获取本地${type}数据失败:`, error);
      return [];
    }
  }

  updateLocalData(type, data) {
    try {
      localStorage.setItem(`admin_${type}`, JSON.stringify(data));
      
      // 触发数据更新事件
      window.dispatchEvent(new CustomEvent('adminDataUpdated', {
        detail: { type, data }
      }));
    } catch (error) {
      console.error(`更新本地${type}数据失败:`, error);
    }
  }

  addToSyncQueue(type, data) {
    this.syncQueue.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    console.log(`📋 ${type}数据已加入同步队列`);
  }

  async processSyncQueue() {
    if (this.syncQueue.length === 0) return;
    
    console.log(`🔄 处理同步队列，共${this.syncQueue.length}项`);
    
    const queue = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of queue) {
      try {
        const response = await window.frontendBackendBridge.syncData(item.type, item.data);
        if (response.success) {
          console.log(`✅ 队列项${item.type}同步成功`);
        } else {
          // 重新加入队列
          this.addToSyncQueue(item.type, item.data);
        }
      } catch (error) {
        console.error(`❌ 队列项${item.type}同步失败:`, error);
        // 重新加入队列
        this.addToSyncQueue(item.type, item.data);
      }
    }
  }

  updateSyncStatus(status) {
    // 更新同步状态显示
    const statusElement = document.getElementById('sync-status');
    if (!statusElement) {
      this.createSyncStatusIndicator();
      return;
    }
    
    const now = new Date().toLocaleTimeString();
    
    switch (status) {
      case 'success':
        statusElement.innerHTML = `
          <i class="fa fa-check-circle text-green-500"></i>
          <span class="text-sm text-gray-600">最后同步: ${now}</span>
        `;
        break;
      case 'error':
        statusElement.innerHTML = `
          <i class="fa fa-exclamation-triangle text-red-500"></i>
          <span class="text-sm text-red-600">同步失败: ${now}</span>
        `;
        break;
      case 'syncing':
        statusElement.innerHTML = `
          <i class="fa fa-spinner fa-spin text-blue-500"></i>
          <span class="text-sm text-blue-600">正在同步...</span>
        `;
        break;
    }
  }

  createSyncStatusIndicator() {
    // 创建同步状态指示器
    const indicator = document.createElement('div');
    indicator.id = 'sync-status';
    indicator.className = 'fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2 z-50';
    
    // 添加到页面
    document.body.appendChild(indicator);
    
    // 初始状态
    this.updateSyncStatus('success');
  }

  updateDashboard(analyticsData) {
    // 更新仪表盘统计数据
    try {
      // 更新文章数量
      const postsCount = document.querySelector('[data-stat="posts"] h3');
      if (postsCount && analyticsData.posts) {
        postsCount.textContent = analyticsData.posts.total || '0';
      }
      
      // 更新摄影作品数量
      const photosCount = document.querySelector('[data-stat="photos"] h3');
      if (photosCount && analyticsData.photos) {
        photosCount.textContent = analyticsData.photos.total || '0';
      }
      
      // 更新访问量
      const viewsCount = document.querySelector('[data-stat="views"] h3');
      if (viewsCount && analyticsData.views) {
        viewsCount.textContent = this.formatNumber(analyticsData.views.total) || '0';
      }
      
      // 更新评论数量
      const commentsCount = document.querySelector('[data-stat="comments"] h3');
      if (commentsCount && analyticsData.comments) {
        commentsCount.textContent = analyticsData.comments.pending || '0';
      }
      
      console.log('📊 仪表盘数据已更新');
    } catch (error) {
      console.error('📊 仪表盘更新失败:', error);
    }
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  // 手动触发同步
  async forcSync() {
    this.updateSyncStatus('syncing');
    await this.syncData();
  }

  // 清除同步队列
  clearSyncQueue() {
    this.syncQueue = [];
    console.log('🗑️ 同步队列已清空');
  }

  // 获取同步状态
  getSyncStatus() {
    return {
      lastSyncTime: this.lastSyncTime,
      queueLength: this.syncQueue.length,
      isOnline: this.isOnline,
      pendingChanges: this.pendingChanges.size
    };
  }

  // 停止同步
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('⏹️ 数据同步已停止');
  }

  // 重启同步
  restartSync() {
    this.stopSync();
    this.startPeriodicSync();
    console.log('🔄 数据同步已重启');
  }
}

// 全局初始化
window.adminDataSync = new AdminDataSync();

// 监听数据更新事件
window.addEventListener('adminDataUpdated', (event) => {
  const { type, data } = event.detail;
  console.log(`📢 ${type}数据已更新:`, data);
  
  // 可以在这里添加UI更新逻辑
  switch (type) {
    case 'posts':
      // 更新文章列表UI
      break;
    case 'photos':
      // 更新摄影作品UI
      break;
    case 'comments':
      // 更新评论UI
      break;
    case 'analytics':
      // 更新统计UI
      break;
    case 'settings':
      // 更新设置UI
      break;
  }
});
