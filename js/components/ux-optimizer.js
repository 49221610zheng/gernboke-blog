// 用户体验优化器
class UXOptimizer {
  constructor() {
    this.userPreferences = this.loadUserPreferences();
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      scrollDepth: 0,
      timeOnPage: 0
    };
    this.performanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0
    };
    this.init();
  }
  
  init() {
    this.setupUserTracking();
    this.setupPerformanceMonitoring();
    this.setupAccessibilityFeatures();
    this.setupPersonalization();
    this.setupFeedbackSystem();
    this.setupOfflineSupport();
    this.setupKeyboardNavigation();
    this.setupGestureSupport();
    console.log('✅ 用户体验优化器初始化完成');
  }
  
  // 用户行为追踪
  setupUserTracking() {
    // 页面访问追踪
    this.sessionData.pageViews++;
    
    // 滚动深度追踪
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      this.sessionData.scrollDepth = maxScrollDepth;
    }, { passive: true });
    
    // 交互追踪
    ['click', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        this.sessionData.interactions++;
      }, { passive: true });
    });
    
    // 页面停留时间
    setInterval(() => {
      this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;
    }, 1000);
    
    // 页面离开时保存数据
    window.addEventListener('beforeunload', () => {
      this.saveSessionData();
    });
  }
  
  // 性能监控
  setupPerformanceMonitoring() {
    // 页面加载性能
    window.addEventListener('load', () => {
      if (performance.timing) {
        this.performanceMetrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.performanceMetrics.renderTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      }
      
      // 首次内容绘制
      if (performance.getEntriesByName) {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          this.performanceMetrics.fcp = fcpEntry.startTime;
        }
      }
      
      this.optimizeBasedOnPerformance();
    });
    
    // 交互性能监控
    let interactionStart = 0;
    document.addEventListener('click', () => {
      interactionStart = performance.now();
    });
    
    // 监控长任务
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('长任务检测:', entry.duration + 'ms');
            this.optimizeLongTask();
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    }
  }
  
  // 无障碍功能
  setupAccessibilityFeatures() {
    // 键盘导航增强
    this.setupFocusManagement();
    
    // 屏幕阅读器支持
    this.setupScreenReaderSupport();
    
    // 高对比度模式
    this.setupHighContrastMode();
    
    // 字体大小调节
    this.setupFontSizeControl();
    
    // 动画减少选项
    this.setupReducedMotion();
  }
  
  // 焦点管理
  setupFocusManagement() {
    // 跳过链接
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '跳转到主要内容';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // 焦点陷阱（用于模态框）
    this.setupFocusTrap();
    
    // 焦点指示器增强
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid #3B82F6;
        outline-offset: 2px;
      }
      .focus-visible {
        outline: 2px solid #3B82F6;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // 屏幕阅读器支持
  setupScreenReaderSupport() {
    // 添加ARIA标签
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', '');
    });
    
    // 动态内容更新通知
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // 页面标题更新
    this.updatePageTitle = (title) => {
      document.title = title;
      this.announceToScreenReader(`页面已更新: ${title}`);
    };
  }
  
  // 高对比度模式
  setupHighContrastMode() {
    const contrastToggle = document.createElement('button');
    contrastToggle.innerHTML = '<i class="fas fa-adjust"></i>';
    contrastToggle.className = 'fixed top-32 right-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors z-40';
    contrastToggle.setAttribute('aria-label', '切换高对比度模式');
    contrastToggle.title = '高对比度模式';
    
    contrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHighContrast = document.body.classList.contains('high-contrast');
      this.userPreferences.highContrast = isHighContrast;
      this.saveUserPreferences();
      this.announceToScreenReader(isHighContrast ? '已启用高对比度模式' : '已禁用高对比度模式');
    });
    
    document.body.appendChild(contrastToggle);
    
    // 高对比度样式
    if (!document.getElementById('high-contrast-styles')) {
      const contrastStyles = document.createElement('style');
      contrastStyles.id = 'high-contrast-styles';
      contrastStyles.textContent = `
        .high-contrast {
          filter: contrast(150%) brightness(120%);
        }
        .high-contrast img {
          filter: contrast(120%);
        }
        .high-contrast .text-gray-600 {
          color: #000 !important;
        }
        .high-contrast .bg-gray-50 {
          background-color: #fff !important;
        }
      `;
      document.head.appendChild(contrastStyles);
    }
  }
  
  // 字体大小控制
  setupFontSizeControl() {
    const fontControls = document.createElement('div');
    fontControls.className = 'fixed top-44 right-4 bg-white shadow-lg rounded-lg p-2 z-40';
    fontControls.innerHTML = `
      <div class="flex flex-col space-y-1">
        <button onclick="uxOptimizer.adjustFontSize('increase')" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded" title="增大字体">
          <i class="fas fa-plus text-xs"></i>
        </button>
        <button onclick="uxOptimizer.adjustFontSize('reset')" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded" title="重置字体">
          <i class="fas fa-font text-xs"></i>
        </button>
        <button onclick="uxOptimizer.adjustFontSize('decrease')" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded" title="减小字体">
          <i class="fas fa-minus text-xs"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(fontControls);
  }
  
  // 个性化设置
  setupPersonalization() {
    // 根据用户偏好应用设置
    if (this.userPreferences.theme) {
      document.documentElement.classList.toggle('dark', this.userPreferences.theme === 'dark');
    }
    
    if (this.userPreferences.fontSize) {
      document.documentElement.style.fontSize = this.userPreferences.fontSize;
    }
    
    if (this.userPreferences.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    if (this.userPreferences.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // 个性化内容推荐
    this.setupContentRecommendations();
  }
  
  // 反馈系统
  setupFeedbackSystem() {
    // 创建反馈按钮
    const feedbackBtn = document.createElement('button');
    feedbackBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
    feedbackBtn.className = 'fixed bottom-20 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 pulse-animation';
    feedbackBtn.setAttribute('aria-label', '提供反馈');
    feedbackBtn.title = '提供反馈';
    
    feedbackBtn.addEventListener('click', () => {
      this.showFeedbackModal();
    });
    
    document.body.appendChild(feedbackBtn);
    
    // 页面满意度调查
    this.setupSatisfactionSurvey();
  }
  
  // 离线支持
  setupOfflineSupport() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker 注册成功');
          this.showOfflineIndicator();
        })
        .catch(error => {
          console.log('Service Worker 注册失败:', error);
        });
    }
    
    // 网络状态监控
    window.addEventListener('online', () => {
      this.showNetworkStatus('online');
    });
    
    window.addEventListener('offline', () => {
      this.showNetworkStatus('offline');
    });
  }
  
  // 键盘导航
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Tab键导航增强
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // 快捷键
      if (e.altKey) {
        switch (e.key) {
          case 'h':
            e.preventDefault();
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            break;
          case 'm':
            e.preventDefault();
            this.toggleMobileMenu();
            break;
          case 'f':
            e.preventDefault();
            this.showFeedbackModal();
            break;
        }
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
  
  // 手势支持
  setupGestureSupport() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // 左右滑动
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
      
      // 上下滑动
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          this.handleSwipeDown();
        } else {
          this.handleSwipeUp();
        }
      }
    }, { passive: true });
  }
  
  // 工具方法
  adjustFontSize(action) {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).fontSize);
    
    let newSize;
    switch (action) {
      case 'increase':
        newSize = Math.min(currentSize * 1.1, 24);
        break;
      case 'decrease':
        newSize = Math.max(currentSize * 0.9, 12);
        break;
      case 'reset':
        newSize = 16;
        break;
    }
    
    root.style.fontSize = newSize + 'px';
    this.userPreferences.fontSize = newSize + 'px';
    this.saveUserPreferences();
    this.announceToScreenReader(`字体大小已调整为 ${newSize}px`);
  }
  
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
  
  showFeedbackModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">提供反馈</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">您对网站的整体满意度？</label>
            <div class="flex space-x-2">
              ${[1,2,3,4,5].map(rating => `
                <button onclick="uxOptimizer.setRating(${rating})" 
                        class="rating-btn w-8 h-8 rounded-full border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-100 transition-colors"
                        data-rating="${rating}">
                  <i class="fas fa-star text-gray-300"></i>
                </button>
              `).join('')}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">具体建议</label>
            <textarea id="feedback-text" rows="4" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请告诉我们您的想法..."></textarea>
          </div>
          
          <div class="flex space-x-3">
            <button onclick="uxOptimizer.submitFeedback()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              提交反馈
            </button>
            <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
              取消
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 焦点管理
    const firstInput = modal.querySelector('button, input, textarea');
    if (firstInput) firstInput.focus();
  }
  
  setRating(rating) {
    document.querySelectorAll('.rating-btn').forEach((btn, index) => {
      const star = btn.querySelector('i');
      if (index < rating) {
        star.className = 'fas fa-star text-yellow-400';
        btn.classList.add('border-yellow-400', 'bg-yellow-100');
      } else {
        star.className = 'fas fa-star text-gray-300';
        btn.classList.remove('border-yellow-400', 'bg-yellow-100');
      }
    });
    this.currentRating = rating;
  }
  
  submitFeedback() {
    const feedback = {
      rating: this.currentRating || 0,
      text: document.getElementById('feedback-text').value,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // 这里应该发送到后端
    console.log('用户反馈:', feedback);
    
    // 保存到本地存储
    const feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
    
    // 关闭模态框
    document.querySelector('.fixed.inset-0').remove();
    
    // 显示感谢消息
    this.showMessage('感谢您的反馈！我们会认真考虑您的建议。', 'success');
  }
  
  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
    }`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
  
  loadUserPreferences() {
    try {
      return JSON.parse(localStorage.getItem('userPreferences') || '{}');
    } catch {
      return {};
    }
  }
  
  saveUserPreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
  }
  
  saveSessionData() {
    const sessionKey = `session_${Date.now()}`;
    localStorage.setItem(sessionKey, JSON.stringify(this.sessionData));
  }
  
  // 清理资源
  destroy() {
    // 清理事件监听器和定时器
  }
}

// 导出到全局
window.UXOptimizer = UXOptimizer;
