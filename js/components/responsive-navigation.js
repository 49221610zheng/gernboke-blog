// 响应式导航组件
class ResponsiveNavigation {
  constructor() {
    this.isMenuOpen = false;
    this.currentSection = 'home';
    this.scrollPosition = 0;
    this.isScrollingDown = false;
    this.lastScrollTop = 0;
    this.init();
  }
  
  init() {
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupActiveSection();
    this.setupSmoothScrolling();
    this.setupBreadcrumbs();
    this.setupProgressIndicator();
    console.log('✅ 响应式导航初始化完成');
  }
  
  // 滚动行为
  setupScrollBehavior() {
    let ticking = false;
    
    const updateNavigation = () => {
      const scrollTop = window.pageYOffset;
      const navbar = document.querySelector('.navbar');
      
      if (!navbar) return;
      
      // 检测滚动方向
      this.isScrollingDown = scrollTop > this.lastScrollTop;
      this.lastScrollTop = scrollTop;
      
      // 导航栏显示/隐藏
      if (scrollTop > 100) {
        navbar.classList.add('navbar-scrolled');
        
        if (this.isScrollingDown && scrollTop > 300) {
          navbar.classList.add('navbar-hidden');
        } else {
          navbar.classList.remove('navbar-hidden');
        }
      } else {
        navbar.classList.remove('navbar-scrolled', 'navbar-hidden');
      }
      
      // 更新活动区域
      this.updateActiveSection();
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavigation);
        ticking = true;
      }
    }, { passive: true });
  }
  
  // 移动端菜单
  setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!menuToggle || !mobileMenu) return;
    
    // 创建菜单覆盖层
    if (!menuOverlay) {
      const overlay = document.createElement('div');
      overlay.className = 'menu-overlay fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
      overlay.addEventListener('click', () => this.closeMobileMenu());
      document.body.appendChild(overlay);
    }
    
    // 菜单切换
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // 菜单项点击
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
    
    // ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
    
    // 焦点管理
    this.setupMenuFocusTrap();
  }
  
  // 菜单焦点陷阱
  setupMenuFocusTrap() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;
    
    const focusableElements = mobileMenu.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    mobileMenu.addEventListener('keydown', (e) => {
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
  }
  
  // 活动区域检测
  setupActiveSection() {
    this.sections = Array.from(document.querySelectorAll('section[id]'));
    this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
  }
  
  updateActiveSection() {
    if (this.sections.length === 0) return;
    
    const scrollPosition = window.pageYOffset + 100;
    let currentSection = this.sections[0].id;
    
    for (const section of this.sections) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.id;
        break;
      }
    }
    
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.updateActiveNavLink(currentSection);
      this.updateBreadcrumbs(currentSection);
    }
  }
  
  updateActiveNavLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
  
  // 平滑滚动
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        this.scrollToSection(targetElement);
      }
    });
  }
  
  scrollToSection(element, offset = 80) {
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
    
    // 更新URL但不触发页面跳转
    if (element.id) {
      history.pushState(null, null, `#${element.id}`);
    }
  }
  
  // 面包屑导航
  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) {
      this.createBreadcrumbs();
    }
  }
  
  createBreadcrumbs() {
    const breadcrumbs = document.createElement('nav');
    breadcrumbs.className = 'breadcrumbs fixed top-16 left-4 bg-white shadow-lg rounded-lg px-4 py-2 z-30 hidden lg:block';
    breadcrumbs.setAttribute('aria-label', '面包屑导航');
    
    document.body.appendChild(breadcrumbs);
  }
  
  updateBreadcrumbs(sectionId) {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;
    
    const sectionNames = {
      'home': '首页',
      'photography': '摄影作品',
      'tech': '技术分享',
      'diary': '开发日记',
      'about': '关于我'
    };
    
    const currentName = sectionNames[sectionId] || sectionId;
    
    breadcrumbs.innerHTML = `
      <ol class="flex items-center space-x-2 text-sm">
        <li><a href="#home" class="text-blue-600 hover:text-blue-800">首页</a></li>
        ${sectionId !== 'home' ? `
          <li class="text-gray-500">/</li>
          <li class="text-gray-900 font-medium">${currentName}</li>
        ` : ''}
      </ol>
    `;
  }
  
  // 阅读进度指示器
  setupProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress fixed bottom-4 right-4 w-16 h-16 z-30 hidden';
    progressContainer.innerHTML = `
      <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" stroke-width="4" fill="none"/>
        <circle cx="32" cy="32" r="28" stroke="#3b82f6" stroke-width="4" fill="none"
                stroke-dasharray="175.93" stroke-dashoffset="175.93" 
                class="progress-circle transition-all duration-300"/>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xs font-medium text-gray-600" id="progress-text">0%</span>
      </div>
    `;
    
    document.body.appendChild(progressContainer);
    
    // 更新进度
    window.addEventListener('scroll', () => {
      this.updateReadingProgress();
    }, { passive: true });
  }
  
  updateReadingProgress() {
    const progressContainer = document.querySelector('.reading-progress');
    const progressCircle = document.querySelector('.progress-circle');
    const progressText = document.getElementById('progress-text');
    
    if (!progressContainer || !progressCircle || !progressText) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);
    
    // 显示/隐藏进度指示器
    if (scrollPercent > 0.1) {
      progressContainer.classList.remove('hidden');
    } else {
      progressContainer.classList.add('hidden');
    }
    
    // 更新圆形进度
    const circumference = 175.93;
    const offset = circumference - (scrollPercent * circumference);
    progressCircle.style.strokeDashoffset = offset;
    
    // 更新百分比文字
    progressText.textContent = Math.round(scrollPercent * 100) + '%';
  }
  
  // 菜单操作方法
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuOverlay) {
      this.isMenuOpen = true;
      mobileMenu.classList.add('menu-open');
      menuOverlay.classList.remove('hidden');
      document.body.classList.add('menu-open');
      
      // 更新按钮图标
      if (menuToggle) {
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-times';
        }
      }
      
      // 焦点管理
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
      
      // 添加动画类
      setTimeout(() => {
        mobileMenu.classList.add('menu-animated');
      }, 10);
    }
  }
  
  closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuOverlay) {
      this.isMenuOpen = false;
      mobileMenu.classList.remove('menu-open', 'menu-animated');
      menuOverlay.classList.add('hidden');
      document.body.classList.remove('menu-open');
      
      // 更新按钮图标
      if (menuToggle) {
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-bars';
        }
      }
      
      // 返回焦点到菜单按钮
      if (menuToggle) {
        menuToggle.focus();
      }
    }
  }
  
  // 导航到指定区域
  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      this.scrollToSection(section);
      this.closeMobileMenu();
    }
  }
  
  // 获取当前区域
  getCurrentSection() {
    return this.currentSection;
  }
  
  // 添加导航样式
  addNavigationStyles() {
    if (document.getElementById('navigation-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'navigation-styles';
    styles.textContent = `
      .navbar {
        transition: all 0.3s ease;
      }
      
      .navbar-scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      }
      
      .navbar-hidden {
        transform: translateY(-100%);
      }
      
      .nav-link.active {
        color: #3b82f6;
        font-weight: 600;
      }
      
      .mobile-menu {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .mobile-menu.menu-open {
        transform: translateX(0);
      }
      
      .mobile-menu.menu-animated {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      body.menu-open {
        overflow: hidden;
      }
      
      .breadcrumbs {
        transition: all 0.3s ease;
      }
      
      .reading-progress {
        transition: opacity 0.3s ease;
      }
      
      .reading-progress:hover {
        transform: scale(1.1);
      }
      
      @media (max-width: 768px) {
        .breadcrumbs {
          display: none;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  // 初始化时添加样式
  constructor() {
    this.isMenuOpen = false;
    this.currentSection = 'home';
    this.scrollPosition = 0;
    this.isScrollingDown = false;
    this.lastScrollTop = 0;
    this.addNavigationStyles();
    this.init();
  }
}

// 导出到全局
window.ResponsiveNavigation = ResponsiveNavigation;
