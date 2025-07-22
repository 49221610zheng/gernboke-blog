// 主页优化器 - 提升用户体验和视觉效果
class HomepageOptimizer {
  constructor() {
    this.isInitialized = false;
    this.animations = [];
    this.observers = [];
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    try {
      this.setupAdvancedAnimations();
      this.setupParallaxEffects();
      this.setupDynamicContent();
      this.setupAdvancedNavigation();
      this.setupPerformanceOptimizations();
      this.setupInteractiveElements();
      this.setupAdvancedSearch();
      this.setupSocialFeatures();
      
      this.isInitialized = true;
      console.log('✅ 主页优化器初始化完成');
    } catch (error) {
      console.error('❌ 主页优化器初始化失败:', error);
    }
  }

  // 高级动画效果
  setupAdvancedAnimations() {
    // 创建交叉观察器用于动画触发
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerElementAnimation(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // 为各个部分添加动画
    document.querySelectorAll('section, .card-hover, .feature-card').forEach(el => {
      animationObserver.observe(el);
    });

    this.observers.push(animationObserver);
  }

  // 触发元素动画
  triggerElementAnimation(element) {
    if (element.classList.contains('animated')) return;

    element.classList.add('animated');
    
    // 根据元素类型应用不同动画
    if (element.tagName === 'SECTION') {
      element.style.animation = 'fadeInUp 0.8s ease-out forwards';
    } else if (element.classList.contains('card-hover')) {
      element.style.animation = 'slideInUp 0.6s ease-out forwards';
    } else {
      element.style.animation = 'fadeIn 0.6s ease-out forwards';
    }
  }

  // 视差效果
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) {
      // 为现有元素添加视差效果
      this.createParallaxElements();
    }

    window.addEventListener('scroll', () => {
      this.updateParallaxElements();
    }, { passive: true });
  }

  // 创建视差元素
  createParallaxElements() {
    // 为英雄区域添加视差背景
    const heroSection = document.querySelector('#home');
    if (heroSection) {
      const parallaxBg = document.createElement('div');
      parallaxBg.className = 'parallax-bg absolute inset-0 opacity-10';
      parallaxBg.style.background = 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
      heroSection.style.position = 'relative';
      heroSection.appendChild(parallaxBg);
    }

    // 为各个部分添加装饰性视差元素
    document.querySelectorAll('section').forEach((section, index) => {
      if (index % 2 === 0) {
        this.addDecorativeElements(section);
      }
    });
  }

  // 添加装饰性元素
  addDecorativeElements(section) {
    const decorator = document.createElement('div');
    decorator.className = 'section-decorator absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none';
    decorator.innerHTML = `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="1"/>
        <circle cx="50" cy="50" r="10" fill="currentColor"/>
      </svg>
    `;
    
    section.style.position = 'relative';
    section.appendChild(decorator);
  }

  // 更新视差元素
  updateParallaxElements() {
    const scrollY = window.pageYOffset;
    
    document.querySelectorAll('.parallax-bg').forEach(el => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });

    document.querySelectorAll('.section-decorator').forEach((el, index) => {
      const speed = 0.2 + (index * 0.1);
      el.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.1}deg)`;
    });
  }

  // 动态内容
  setupDynamicContent() {
    this.setupTypingEffect();
    this.setupCounterAnimations();
    this.setupProgressBars();
    this.setupDynamicStats();
  }

  // 打字机效果
  setupTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    if (typingElements.length === 0) {
      // 为主标题添加打字机效果
      const mainTitle = document.querySelector('#home h1');
      if (mainTitle) {
        mainTitle.classList.add('typing-effect');
        this.createTypingEffect(mainTitle);
      }
    }
  }

  // 创建打字机效果
  createTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #3B82F6';
    
    let index = 0;
    const typeInterval = setInterval(() => {
      element.textContent += text[index];
      index++;
      
      if (index >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 1000);
      }
    }, 100);
  }

  // 计数器动画
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) {
      this.createCounters();
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
        }
      });
    });

    document.querySelectorAll('.counter').forEach(counter => {
      counterObserver.observe(counter);
    });

    this.observers.push(counterObserver);
  }

  // 创建计数器
  createCounters() {
    const statsSection = document.querySelector('#about') || document.querySelector('#home');
    if (!statsSection) return;

    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container grid grid-cols-2 md:grid-cols-4 gap-6 my-12';
    statsContainer.innerHTML = `
      <div class="text-center">
        <div class="counter text-3xl font-bold text-blue-600" data-target="50">0</div>
        <div class="text-sm text-gray-600">摄影作品</div>
      </div>
      <div class="text-center">
        <div class="counter text-3xl font-bold text-green-600" data-target="25">0</div>
        <div class="text-sm text-gray-600">技术文章</div>
      </div>
      <div class="text-center">
        <div class="counter text-3xl font-bold text-purple-600" data-target="1000">0</div>
        <div class="text-sm text-gray-600">网站访问</div>
      </div>
      <div class="text-center">
        <div class="counter text-3xl font-bold text-red-600" data-target="100">0</div>
        <div class="text-sm text-gray-600">用户喜欢</div>
      </div>
    `;

    statsSection.appendChild(statsContainer);
  }

  // 动画计数器
  animateCounter(counter) {
    if (counter.classList.contains('counted')) return;
    
    counter.classList.add('counted');
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  }

  // 高级导航
  setupAdvancedNavigation() {
    this.setupSmoothScrolling();
    this.setupActiveSection();
    this.setupNavigationProgress();
  }

  // 平滑滚动增强
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // 添加导航动画
          this.highlightNavigation(anchor);
        }
      });
    });
  }

  // 高亮导航
  highlightNavigation(anchor) {
    // 移除其他高亮
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('nav-active');
    });
    
    // 添加当前高亮
    anchor.classList.add('nav-active');
    
    // 添加临时动画效果
    anchor.style.transform = 'scale(1.1)';
    setTimeout(() => {
      anchor.style.transform = 'scale(1)';
    }, 200);
  }

  // 交互式元素
  setupInteractiveElements() {
    this.setupHoverEffects();
    this.setupClickEffects();
    this.setupTooltips();
  }

  // 悬停效果
  setupHoverEffects() {
    document.querySelectorAll('.card-hover').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      });
    });
  }

  // 点击效果
  setupClickEffects() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        this.createRippleEffect(e);
      }
    });
  }

  // 创建涟漪效果
  createRippleEffect(e) {
    const button = e.target.closest('.btn') || e.target;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // 工具提示
  setupTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      });
      
      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  // 显示工具提示
  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip absolute bg-gray-900 text-white text-sm px-2 py-1 rounded z-50';
    tooltip.textContent = text;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 30 + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
  }

  // 隐藏工具提示
  hideTooltip() {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
      tooltip.remove();
    });
  }

  // 性能优化
  setupPerformanceOptimizations() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupResourcePreloading();
  }

  // 懒加载优化
  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) {
      // 为现有图片添加懒加载
      document.querySelectorAll('img').forEach(img => {
        if (!img.dataset.src && img.src) {
          img.dataset.src = img.src;
          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
          img.classList.add('lazy-image');
        }
      });
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadLazyImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('.lazy-image').forEach(img => {
      imageObserver.observe(img);
    });

    this.observers.push(imageObserver);
  }

  // 加载懒加载图片
  loadLazyImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.remove('lazy-image');
      img.classList.add('loaded');
    }
  }

  // 添加CSS动画
  addAnimationStyles() {
    if (document.getElementById('homepage-animations')) return;

    const styles = document.createElement('style');
    styles.id = 'homepage-animations';
    styles.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      .card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .nav-active {
        transition: transform 0.2s ease;
      }

      .lazy-image {
        filter: blur(5px);
        transition: filter 0.3s ease;
      }

      .lazy-image.loaded {
        filter: blur(0);
      }

      .typing-effect {
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: #3B82F6; }
      }
    `;

    document.head.appendChild(styles);
  }

  // 清理资源
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.animations.forEach(animation => animation.cancel());
    this.observers = [];
    this.animations = [];
  }

  constructor() {
    this.isInitialized = false;
    this.animations = [];
    this.observers = [];
    this.addAnimationStyles();
    this.init();
  }
}

// 导出到全局
window.HomepageOptimizer = HomepageOptimizer;
