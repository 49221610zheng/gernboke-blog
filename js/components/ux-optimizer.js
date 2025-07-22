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

  // 设置焦点陷阱
  setupFocusTrap() {
    // 焦点陷阱实现
    this.focusTrapElements = [];

    // 监听模态框的打开
    document.addEventListener('modalOpen', (e) => {
      const modal = e.detail.modal;
      this.trapFocus(modal);
    });
  }

  // 陷阱焦点在模态框内
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    firstElement.focus();
  }

  // 基于性能优化
  optimizeBasedOnPerformance() {
    const metrics = this.performanceMetrics;

    // 如果FCP较慢，减少动画
    if (metrics.fcp > 2000) {
      document.documentElement.classList.add('reduce-animations');
    }

    // 如果内存使用较高，启用节能模式
    if (performance.memory && performance.memory.usedJSHeapSize > 50000000) {
      document.documentElement.classList.add('memory-saver');
    }
  }

  // 优化长任务
  optimizeLongTask() {
    // 延迟非关键任务
    if (this.longTaskCount > 3) {
      document.documentElement.classList.add('performance-mode');

      // 禁用一些非关键动画
      const style = document.createElement('style');
      style.textContent = `
        .performance-mode * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    }

    this.longTaskCount = (this.longTaskCount || 0) + 1;
  }

  // 设置动画减少选项
  setupReducedMotion() {
    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // 应用减少动画设置
    const applyReducedMotion = (shouldReduce) => {
      if (shouldReduce) {
        document.documentElement.classList.add('reduce-motion');

        // 添加减少动画的CSS
        const style = document.createElement('style');
        style.textContent = `
          .reduce-motion *,
          .reduce-motion *::before,
          .reduce-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };

    // 初始应用
    applyReducedMotion(prefersReducedMotion.matches);

    // 监听变化
    prefersReducedMotion.addEventListener('change', (e) => {
      applyReducedMotion(e.matches);
    });

    // 添加用户控制选项
    this.addMotionControl();
  }

  // 添加动画控制选项
  addMotionControl() {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'motion-control-panel';
    controlPanel.innerHTML = `
      <button class="motion-toggle-btn" aria-label="切换动画效果">
        <i class="fas fa-play"></i>
        <span>动画效果</span>
      </button>
    `;

    const toggleBtn = controlPanel.querySelector('.motion-toggle-btn');
    let motionEnabled = !document.documentElement.classList.contains('reduce-motion');

    const updateButton = () => {
      const icon = toggleBtn.querySelector('i');
      const text = toggleBtn.querySelector('span');
      if (motionEnabled) {
        icon.className = 'fas fa-play';
        text.textContent = '动画效果';
        toggleBtn.setAttribute('aria-pressed', 'true');
      } else {
        icon.className = 'fas fa-pause';
        text.textContent = '减少动画';
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
    };

    toggleBtn.addEventListener('click', () => {
      motionEnabled = !motionEnabled;
      if (motionEnabled) {
        document.documentElement.classList.remove('reduce-motion');
      } else {
        document.documentElement.classList.add('reduce-motion');
      }
      updateButton();

      // 保存用户偏好
      localStorage.setItem('motionEnabled', motionEnabled.toString());
    });

    // 恢复用户偏好
    const savedPreference = localStorage.getItem('motionEnabled');
    if (savedPreference !== null) {
      motionEnabled = savedPreference === 'true';
      if (!motionEnabled) {
        document.documentElement.classList.add('reduce-motion');
      }
    }

    updateButton();

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .motion-control-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
      }

      .motion-control-panel:hover {
        opacity: 1;
      }

      .motion-toggle-btn {
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
      }

      .motion-toggle-btn:hover {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      .motion-toggle-btn:focus {
        outline: 2px solid #60a5fa;
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        .motion-control-panel {
          bottom: 80px;
          right: 16px;
        }

        .motion-toggle-btn {
          padding: 10px 14px;
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(style);

    // 添加到页面
    document.body.appendChild(controlPanel);
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

  // 设置内容推荐系统
  setupContentRecommendations() {
    // 基于用户行为的内容推荐
    this.contentRecommendations = {
      readingHistory: JSON.parse(localStorage.getItem('readingHistory') || '[]'),
      preferences: JSON.parse(localStorage.getItem('contentPreferences') || '{}'),
      interactions: JSON.parse(localStorage.getItem('userInteractions') || '{}')
    };

    // 跟踪用户阅读行为
    this.trackReadingBehavior();

    // 生成推荐内容
    this.generateRecommendations();

    // 显示推荐内容
    this.displayRecommendations();
  }

  // 跟踪用户阅读行为
  trackReadingBehavior() {
    // 跟踪文章阅读时间
    let readingStartTime = null;
    let currentArticle = null;

    // 监听文章点击
    document.addEventListener('click', (e) => {
      const articleLink = e.target.closest('.article-link, .post-link, [data-article-id]');
      if (articleLink) {
        readingStartTime = Date.now();
        currentArticle = {
          id: articleLink.dataset.articleId || articleLink.href,
          title: articleLink.textContent.trim(),
          category: articleLink.dataset.category || 'general',
          timestamp: readingStartTime
        };
      }
    });

    // 跟踪页面停留时间
    let pageStartTime = Date.now();
    window.addEventListener('beforeunload', () => {
      if (currentArticle && readingStartTime) {
        const readingTime = Date.now() - readingStartTime;
        this.recordReadingSession(currentArticle, readingTime);
      }
    });

    // 跟踪滚动行为
    let scrollDepth = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentDepth = Math.round((currentScroll / maxScroll) * 100);
      scrollDepth = Math.max(scrollDepth, currentDepth);
    });

    // 定期保存滚动深度
    setInterval(() => {
      if (currentArticle && scrollDepth > 0) {
        currentArticle.scrollDepth = scrollDepth;
      }
    }, 5000);
  }

  // 记录阅读会话
  recordReadingSession(article, readingTime) {
    const session = {
      ...article,
      readingTime,
      scrollDepth: article.scrollDepth || 0,
      completedReading: article.scrollDepth > 80,
      date: new Date().toISOString()
    };

    // 更新阅读历史
    this.contentRecommendations.readingHistory.unshift(session);

    // 保持最近100条记录
    if (this.contentRecommendations.readingHistory.length > 100) {
      this.contentRecommendations.readingHistory = this.contentRecommendations.readingHistory.slice(0, 100);
    }

    // 更新偏好
    this.updateContentPreferences(session);

    // 保存到本地存储
    localStorage.setItem('readingHistory', JSON.stringify(this.contentRecommendations.readingHistory));
    localStorage.setItem('contentPreferences', JSON.stringify(this.contentRecommendations.preferences));
  }

  // 更新内容偏好
  updateContentPreferences(session) {
    const { category, readingTime, completedReading } = session;

    if (!this.contentRecommendations.preferences[category]) {
      this.contentRecommendations.preferences[category] = {
        interest: 0,
        totalTime: 0,
        completedCount: 0,
        totalCount: 0
      };
    }

    const pref = this.contentRecommendations.preferences[category];
    pref.totalTime += readingTime;
    pref.totalCount += 1;

    if (completedReading) {
      pref.completedCount += 1;
      pref.interest += 2; // 完整阅读增加更多兴趣分
    } else if (readingTime > 30000) { // 超过30秒
      pref.interest += 1;
    }

    // 计算兴趣度（0-100）
    pref.interestLevel = Math.min(100, (pref.interest / pref.totalCount) * 10);
  }

  // 生成推荐内容
  generateRecommendations() {
    const preferences = this.contentRecommendations.preferences;
    const history = this.contentRecommendations.readingHistory;

    // 获取最感兴趣的分类
    const topCategories = Object.entries(preferences)
      .sort((a, b) => b[1].interestLevel - a[1].interestLevel)
      .slice(0, 3)
      .map(([category]) => category);

    // 获取最近阅读的文章类型
    const recentCategories = history
      .slice(0, 10)
      .map(session => session.category)
      .filter((category, index, arr) => arr.indexOf(category) === index);

    // 合并推荐分类
    this.recommendedCategories = [...new Set([...topCategories, ...recentCategories])];

    // 生成推荐理由
    this.generateRecommendationReasons();
  }

  // 生成推荐理由
  generateRecommendationReasons() {
    this.recommendationReasons = {
      'technology': '基于您对技术文章的阅读偏好',
      'photography': '您经常浏览摄影相关内容',
      'travel': '根据您的旅行文章阅读历史',
      'lifestyle': '符合您的生活方式偏好',
      'general': '为您精选的优质内容'
    };
  }

  // 显示推荐内容
  displayRecommendations() {
    // 创建推荐内容区域
    const recommendationContainer = document.createElement('div');
    recommendationContainer.className = 'content-recommendations';
    recommendationContainer.innerHTML = `
      <div class="recommendations-header">
        <h3><i class="fas fa-magic"></i> 为您推荐</h3>
        <p class="recommendations-subtitle">基于您的阅读偏好</p>
      </div>
      <div class="recommendations-list" id="recommendationsList">
        <!-- 推荐内容将在这里动态加载 -->
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .content-recommendations {
        background: var(--card-bg, #ffffff);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color, #e5e7eb);
      }

      .recommendations-header {
        margin-bottom: 20px;
        text-align: center;
      }

      .recommendations-header h3 {
        color: var(--primary-color, #3b82f6);
        margin: 0 0 8px 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .recommendations-header h3 i {
        margin-right: 8px;
        color: #f59e0b;
      }

      .recommendations-subtitle {
        color: var(--text-secondary, #6b7280);
        margin: 0;
        font-size: 0.875rem;
      }

      .recommendations-list {
        display: grid;
        gap: 16px;
      }

      .recommendation-item {
        display: flex;
        align-items: center;
        padding: 16px;
        background: var(--bg-secondary, #f8fafc);
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid transparent;
      }

      .recommendation-item:hover {
        background: var(--bg-hover, #e2e8f0);
        border-color: var(--primary-color, #3b82f6);
        transform: translateY(-2px);
      }

      .recommendation-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-color, #3b82f6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        margin-right: 16px;
        flex-shrink: 0;
      }

      .recommendation-content {
        flex: 1;
      }

      .recommendation-title {
        font-weight: 600;
        color: var(--text-primary, #1f2937);
        margin: 0 0 4px 0;
        font-size: 0.95rem;
      }

      .recommendation-reason {
        color: var(--text-secondary, #6b7280);
        font-size: 0.8rem;
        margin: 0;
      }

      .recommendation-badge {
        background: var(--primary-color, #3b82f6);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .content-recommendations {
          margin: 16px 0;
          padding: 20px;
        }

        .recommendation-item {
          padding: 12px;
        }

        .recommendation-icon {
          width: 36px;
          height: 36px;
          margin-right: 12px;
        }
      }
    `;
    document.head.appendChild(style);

    // 生成推荐项目
    this.populateRecommendations(recommendationContainer);

    // 插入到合适的位置
    const targetContainer = document.querySelector('.main-content, .content-area, main') || document.body;
    const firstArticle = targetContainer.querySelector('.article, .post, .content-item');

    if (firstArticle) {
      firstArticle.parentNode.insertBefore(recommendationContainer, firstArticle.nextSibling);
    } else {
      targetContainer.appendChild(recommendationContainer);
    }
  }

  // 填充推荐内容
  populateRecommendations(container) {
    const listContainer = container.querySelector('#recommendationsList');

    // 示例推荐内容
    const recommendations = [
      {
        icon: 'fas fa-camera',
        title: '摄影技巧：光影的艺术',
        reason: this.recommendationReasons['photography'] || '为您推荐',
        category: 'photography',
        badge: '热门'
      },
      {
        icon: 'fas fa-code',
        title: '前端开发最佳实践',
        reason: this.recommendationReasons['technology'] || '为您推荐',
        category: 'technology',
        badge: '新文章'
      },
      {
        icon: 'fas fa-map-marker-alt',
        title: '城市探索指南',
        reason: this.recommendationReasons['travel'] || '为您推荐',
        category: 'travel',
        badge: '精选'
      }
    ];

    // 根据用户偏好排序
    const sortedRecommendations = recommendations.sort((a, b) => {
      const aInterest = this.contentRecommendations.preferences[a.category]?.interestLevel || 0;
      const bInterest = this.contentRecommendations.preferences[b.category]?.interestLevel || 0;
      return bInterest - aInterest;
    });

    // 渲染推荐项目
    listContainer.innerHTML = sortedRecommendations.map(item => `
      <div class="recommendation-item" data-category="${item.category}">
        <div class="recommendation-icon">
          <i class="${item.icon}"></i>
        </div>
        <div class="recommendation-content">
          <h4 class="recommendation-title">${item.title}</h4>
          <p class="recommendation-reason">${item.reason}</p>
        </div>
        <span class="recommendation-badge">${item.badge}</span>
      </div>
    `).join('');

    // 添加点击事件
    listContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.recommendation-item');
      if (item) {
        const category = item.dataset.category;
        this.handleRecommendationClick(category);
      }
    });
  }

  // 处理推荐点击
  handleRecommendationClick(category) {
    // 记录点击行为
    const interactions = this.contentRecommendations.interactions;
    interactions[category] = (interactions[category] || 0) + 1;
    localStorage.setItem('userInteractions', JSON.stringify(interactions));

    // 显示相关内容或跳转
    console.log(`用户点击了${category}类别的推荐内容`);

    // 可以在这里添加实际的跳转逻辑
    // 例如：筛选显示该类别的文章
    this.filterContentByCategory(category);
  }

  // 按分类筛选内容
  filterContentByCategory(category) {
    const articles = document.querySelectorAll('.article, .post, .content-item');

    articles.forEach(article => {
      const articleCategory = article.dataset.category || 'general';
      if (category === 'all' || articleCategory === category) {
        article.style.display = '';
        article.classList.add('highlight-recommended');
      } else {
        article.style.display = 'none';
      }
    });

    // 添加高亮样式
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
      .highlight-recommended {
        animation: recommendationHighlight 2s ease-in-out;
      }

      @keyframes recommendationHighlight {
        0% { background-color: transparent; }
        50% { background-color: rgba(59, 130, 246, 0.1); }
        100% { background-color: transparent; }
      }
    `;
    document.head.appendChild(highlightStyle);

    // 3秒后移除高亮
    setTimeout(() => {
      articles.forEach(article => {
        article.classList.remove('highlight-recommended');
      });
    }, 3000);
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
