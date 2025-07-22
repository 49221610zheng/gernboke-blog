// UI增强组件
class UIEnhancements {
  constructor() {
    this.scrollProgress = 0;
    this.isLoading = true;
    this.observers = new Map();
    this.init();
  }
  
  init() {
    this.setupScrollProgress();
    this.setupLoadingScreen();
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupSmoothScrolling();
    this.setupImageLazyLoading();
    this.setupTooltips();
    this.setupBackToTop();
    this.setupThemeToggle();
    console.log('✅ UI增强功能初始化完成');
  }
  
  // 滚动进度指示器
  setupScrollProgress() {
    const progressBar = document.getElementById('scroll-indicator');
    if (!progressBar) return;
    
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      progressBar.style.transform = `scaleX(${scrollPercent})`;
      this.scrollProgress = scrollPercent;
    };
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }
  
  // 加载屏幕
  setupLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) return;
    
    // 模拟加载过程
    const hideLoading = () => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        this.isLoading = false;
        this.triggerEntranceAnimations();
      }, 500);
    };
    
    // 页面加载完成后隐藏
    if (document.readyState === 'complete') {
      setTimeout(hideLoading, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hideLoading, 1000);
      });
    }
  }
  
  // 入场动画
  triggerEntranceAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 100);
    });
  }
  
  // 滚动动画
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // 为卡片添加交错动画
          if (entry.target.classList.contains('stagger-parent')) {
            const children = entry.target.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, index * 150);
            });
          }
        }
      });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.fade-in-up, .stagger-parent').forEach(el => {
      observer.observe(el);
    });
    
    this.observers.set('scroll', observer);
  }
  
  // 视差效果
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length === 0) return;
    
    const updateParallax = () => {
      if (this.isLoading) return;
      
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    };
    
    window.addEventListener('scroll', updateParallax, { passive: true });
  }
  
  // 平滑滚动
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        // 检查href是否有效
        if (href && href !== '#' && href.length > 1) {
          try {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          } catch (error) {
            console.warn('无效的选择器:', href);
          }
        }
      });
    });
  }
  
  // 图片懒加载
  setupImageLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // 创建加载骨架
          const skeleton = this.createImageSkeleton();
          img.parentNode.insertBefore(skeleton, img);
          
          // 加载图片
          const tempImg = new Image();
          tempImg.onload = () => {
            img.src = tempImg.src;
            img.classList.add('loaded');
            skeleton.remove();
          };
          tempImg.src = img.dataset.src || img.src;
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
    
    this.observers.set('image', imageObserver);
  }
  
  // 创建图片加载骨架
  createImageSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'loading-skeleton absolute inset-0 rounded-lg';
    return skeleton;
  }
  
  // 工具提示
  setupTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
      const title = element.getAttribute('title');
      element.removeAttribute('title');
      
      let tooltip = null;
      
      element.addEventListener('mouseenter', (e) => {
        tooltip = this.createTooltip(title);
        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, e.target);
      });
      
      element.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });
      
      element.addEventListener('mousemove', (e) => {
        if (tooltip) {
          this.positionTooltip(tooltip, e.target);
        }
      });
    });
  }
  
  // 创建工具提示
  createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50 pointer-events-none opacity-0 transition-opacity duration-200';
    tooltip.textContent = text;
    
    setTimeout(() => {
      tooltip.classList.remove('opacity-0');
    }, 10);
    
    return tooltip;
  }
  
  // 定位工具提示
  positionTooltip(tooltip, target) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // 边界检查
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
      top = rect.bottom + 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
  
  // 返回顶部按钮
  setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 pointer-events-none z-40';
    backToTop.setAttribute('aria-label', '返回顶部');
    
    document.body.appendChild(backToTop);
    
    // 滚动显示/隐藏
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
        backToTop.classList.add('opacity-100');
      } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
        backToTop.classList.remove('opacity-100');
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
  
  // 主题切换
  setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'fixed top-20 right-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors z-40';
    themeToggle.setAttribute('aria-label', '切换主题');
    
    document.body.appendChild(themeToggle);
    
    // 检查本地存储的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        this.disableDarkMode();
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
      } else {
        this.enableDarkMode();
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
      }
    });
  }
  
  // 启用深色模式
  enableDarkMode() {
    document.documentElement.classList.add('dark');
    
    // 添加深色模式样式
    if (!document.getElementById('dark-mode-styles')) {
      const darkStyles = document.createElement('style');
      darkStyles.id = 'dark-mode-styles';
      darkStyles.textContent = `
        .dark {
          --tw-bg-opacity: 1;
          background-color: rgb(17 24 39 / var(--tw-bg-opacity));
          color: rgb(243 244 246);
        }
        .dark .bg-white { background-color: rgb(31 41 55); }
        .dark .text-dark { color: rgb(243 244 246); }
        .dark .text-gray-medium { color: rgb(156 163 175); }
        .dark .border-gray-200 { border-color: rgb(55 65 81); }
        .dark .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3); }
      `;
      document.head.appendChild(darkStyles);
    }
  }
  
  // 禁用深色模式
  disableDarkMode() {
    document.documentElement.classList.remove('dark');
  }
  
  // 添加页面切换动画
  setupPageTransitions() {
    // 为SPA应用添加页面切换动画
    const pageContainer = document.querySelector('main');
    if (!pageContainer) return;
    
    window.addEventListener('beforeunload', () => {
      pageContainer.style.opacity = '0';
      pageContainer.style.transform = 'translateY(20px)';
    });
  }
  
  // 性能监控
  setupPerformanceMonitoring() {
    // 监控页面性能
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('页面加载性能:', {
            DNS: perfData.domainLookupEnd - perfData.domainLookupStart,
            TCP: perfData.connectEnd - perfData.connectStart,
            Request: perfData.responseStart - perfData.requestStart,
            Response: perfData.responseEnd - perfData.responseStart,
            DOM: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            Total: perfData.loadEventEnd - perfData.navigationStart
          });
        }, 0);
      });
    }
  }
  
  // 清理资源
  destroy() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

// 导出到全局
window.UIEnhancements = UIEnhancements;
