// 简化版应用程序 - 解决加载问题
class SimpleApp {
  constructor() {
    this.isLoading = true;
    this.components = {};
    this.init();
  }

  // 初始化应用
  init() {
    console.log('🚀 启动简化版应用...');
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  // 启动应用
  start() {
    try {
      // 隐藏加载屏幕
      this.hideLoadingScreen();
      
      // 初始化基本组件
      this.initializeBasicComponents();
      
      // 设置导航
      this.setupNavigation();
      
      // 设置基本交互
      this.setupBasicInteractions();
      
      // 尝试初始化Firebase（可选）
      this.initializeFirebaseOptional();
      
      console.log('✅ 应用启动成功');
      this.isLoading = false;
      
    } catch (error) {
      console.error('❌ 应用启动失败:', error);
      this.showErrorMessage('应用启动失败，请刷新页面重试');
    }
  }

  // 隐藏加载屏幕
  hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }
  }

  // 初始化基本组件
  initializeBasicComponents() {
    try {
      // 初始化UI增强功能
      if (typeof UIEnhancements !== 'undefined') {
        this.components.uiEnhancements = new UIEnhancements();
        console.log('✅ UI增强功能初始化完成');
      }
      
      // 初始化用户体验优化器
      if (typeof UXOptimizer !== 'undefined') {
        this.components.uxOptimizer = new UXOptimizer();
        console.log('✅ 用户体验优化器初始化完成');
      }
      
      // 初始化响应式导航
      if (typeof ResponsiveNavigation !== 'undefined') {
        this.components.responsiveNavigation = new ResponsiveNavigation();
        console.log('✅ 响应式导航初始化完成');
      }
      
      // 初始化图片优化器
      if (typeof ImageOptimizer !== 'undefined') {
        this.components.imageOptimizer = new ImageOptimizer();
        console.log('✅ 图片优化器初始化完成');
      }
      
      // 初始化搜索系统
      if (typeof SearchSystem !== 'undefined') {
        this.components.searchSystem = new SearchSystem();
        console.log('✅ 搜索系统初始化完成');
      }
      
    } catch (error) {
      console.warn('⚠️ 部分组件初始化失败:', error);
    }
  }

  // 设置导航
  setupNavigation() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // 移动端菜单
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  // 设置基本交互
  setupBasicInteractions() {
    // 返回顶部按钮
    this.createBackToTopButton();
    
    // 主题切换（如果存在）
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', 
          document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        );
      });
    }
  }

  // 创建返回顶部按钮
  createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 pointer-events-none z-40';
    backToTop.setAttribute('aria-label', '返回顶部');
    
    document.body.appendChild(backToTop);
    
    // 滚动显示/隐藏
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
      }
    }, { passive: true });
    
    // 点击返回顶部
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 可选的Firebase初始化
  initializeFirebaseOptional() {
    try {
      if (typeof firebase !== 'undefined' && typeof initializeFirebase === 'function') {
        const firebaseInitialized = initializeFirebase();
        if (firebaseInitialized) {
          console.log('✅ Firebase可选功能已启用');
          this.initializeFirebaseComponents();
        } else {
          console.log('⚠️ Firebase未初始化，使用离线模式');
        }
      } else {
        console.log('ℹ️ Firebase未加载，使用基本功能');
      }
    } catch (error) {
      console.warn('⚠️ Firebase初始化失败，继续使用基本功能:', error);
    }
  }

  // 初始化Firebase相关组件
  initializeFirebaseComponents() {
    try {
      // 初始化评论系统（如果页面有评论容器）
      const commentContainer = document.getElementById('comments-section');
      if (commentContainer && typeof CommentSystem !== 'undefined') {
        this.components.commentSystem = new CommentSystem('comments-section', 'main-page');
        console.log('✅ 评论系统初始化完成');
      }
    } catch (error) {
      console.warn('⚠️ Firebase组件初始化失败:', error);
    }
  }

  // 显示错误消息
  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // 获取组件
  getComponent(name) {
    return this.components[name];
  }

  // 检查是否正在加载
  isAppLoading() {
    return this.isLoading;
  }
}

// 创建全局应用实例
let simpleApp;

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  simpleApp = new SimpleApp();
});

// 导出到全局
window.simpleApp = simpleApp;
