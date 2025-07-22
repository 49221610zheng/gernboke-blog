// 高级主题系统 - 深色模式、主题定制、个性化设置
class ThemeSystem {
  constructor() {
    this.currentTheme = this.loadTheme();
    this.addThemeStyles();
    this.themes = {
      light: {
        name: '浅色模式',
        icon: 'fas fa-sun',
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          background: '#FFFFFF',
          surface: '#F9FAFB',
          text: '#111827',
          textSecondary: '#6B7280'
        }
      },
      dark: {
        name: '深色模式',
        icon: 'fas fa-moon',
        colors: {
          primary: '#60A5FA',
          secondary: '#9CA3AF',
          background: '#111827',
          surface: '#1F2937',
          text: '#F9FAFB',
          textSecondary: '#D1D5DB'
        }
      },
      auto: {
        name: '跟随系统',
        icon: 'fas fa-desktop',
        colors: null // 动态设置
      },
      sepia: {
        name: '护眼模式',
        icon: 'fas fa-eye',
        colors: {
          primary: '#D97706',
          secondary: '#92400E',
          background: '#FEF3C7',
          surface: '#FDE68A',
          text: '#92400E',
          textSecondary: '#B45309'
        }
      },
      highContrast: {
        name: '高对比度',
        icon: 'fas fa-adjust',
        colors: {
          primary: '#000000',
          secondary: '#666666',
          background: '#FFFFFF',
          surface: '#F0F0F0',
          text: '#000000',
          textSecondary: '#333333'
        }
      }
    };
    this.init();
  }

  init() {
    this.createThemeToggle();
    this.createThemePanel();
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
    this.setupAccessibilityFeatures();
    console.log('✅ 主题系统初始化完成');
  }

  // 创建主题切换按钮
  createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'fixed top-20 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform';
    themeToggle.innerHTML = `<i class="${this.themes[this.currentTheme].icon} text-gray-600 dark:text-gray-300"></i>`;
    themeToggle.setAttribute('aria-label', '切换主题');
    
    themeToggle.addEventListener('click', () => {
      this.showThemePanel();
    });

    document.body.appendChild(themeToggle);
  }

  // 创建主题面板
  createThemePanel() {
    const panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.className = 'fixed top-20 right-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 z-50 hidden min-w-64';
    
    panel.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">主题设置</h3>
        <button onclick="themeSystem.hideThemePanel()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-3">
        ${Object.entries(this.themes).map(([key, theme]) => `
          <button onclick="themeSystem.setTheme('${key}')" 
                  class="theme-option w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${key === this.currentTheme ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-500' : 'border-2 border-transparent'}"
                  data-theme="${key}">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br ${this.getThemeGradient(key)} flex items-center justify-center">
              <i class="${theme.icon} text-white text-sm"></i>
            </div>
            <span class="text-gray-900 dark:text-white">${theme.name}</span>
            ${key === this.currentTheme ? '<i class="fas fa-check text-blue-500 ml-auto"></i>' : ''}
          </button>
        `).join('')}
      </div>
      
      <div class="border-t dark:border-gray-700 mt-4 pt-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">个性化设置</h4>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-700 dark:text-gray-300">字体大小</label>
            <div class="flex gap-1">
              <button onclick="themeSystem.setFontSize('small')" class="font-size-btn px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" data-size="small">小</button>
              <button onclick="themeSystem.setFontSize('medium')" class="font-size-btn px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" data-size="medium">中</button>
              <button onclick="themeSystem.setFontSize('large')" class="font-size-btn px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" data-size="large">大</button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-700 dark:text-gray-300">减少动画</label>
            <button onclick="themeSystem.toggleReducedMotion()" id="reduced-motion-toggle" 
                    class="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative transition-colors">
              <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200"></div>
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-700 dark:text-gray-300">自动保存偏好</label>
            <button onclick="themeSystem.toggleAutoSave()" id="auto-save-toggle" 
                    class="w-10 h-6 bg-blue-500 rounded-full relative">
              <div class="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform duration-200"></div>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    
    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !document.getElementById('theme-toggle').contains(e.target)) {
        this.hideThemePanel();
      }
    });
  }

  // 获取主题渐变
  getThemeGradient(theme) {
    const gradients = {
      light: 'from-yellow-400 to-orange-500',
      dark: 'from-indigo-500 to-purple-600',
      auto: 'from-blue-400 to-cyan-500',
      sepia: 'from-amber-400 to-orange-600',
      highContrast: 'from-gray-800 to-black'
    };
    return gradients[theme] || 'from-gray-400 to-gray-600';
  }

  // 显示主题面板
  showThemePanel() {
    const panel = document.getElementById('theme-panel');
    panel.classList.remove('hidden');
    panel.style.animation = 'slideInRight 0.3s ease-out';
  }

  // 隐藏主题面板
  hideThemePanel() {
    const panel = document.getElementById('theme-panel');
    panel.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      panel.classList.add('hidden');
    }, 300);
  }

  // 设置主题
  setTheme(themeName) {
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.saveTheme(themeName);
    this.updateThemeToggle();
    this.updateThemePanel();
    
    // 触发主题变更事件
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeName }
    }));
  }

  // 应用主题
  applyTheme(themeName) {
    const theme = this.themes[themeName];
    
    if (themeName === 'auto') {
      this.applyAutoTheme();
      return;
    }

    if (!theme.colors) return;

    // 移除所有主题类
    document.documentElement.classList.remove('dark', 'sepia', 'high-contrast');
    
    // 添加对应主题类
    if (themeName === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeName === 'sepia') {
      document.documentElement.classList.add('sepia');
    } else if (themeName === 'highContrast') {
      document.documentElement.classList.add('high-contrast');
    }

    // 设置CSS变量
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // 更新meta标签
    this.updateMetaThemeColor(theme.colors.primary);
  }

  // 应用自动主题
  applyAutoTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const autoTheme = prefersDark ? 'dark' : 'light';
    this.applyTheme(autoTheme);
  }

  // 设置系统主题监听
  setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyAutoTheme();
      }
    });
  }

  // 设置字体大小
  setFontSize(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };

    document.documentElement.style.fontSize = sizes[size];
    localStorage.setItem('blog_font_size', size);
    
    // 更新按钮状态
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('bg-gray-100', 'dark:bg-gray-700');
    });
    
    document.querySelector(`[data-size="${size}"]`).classList.remove('bg-gray-100', 'dark:bg-gray-700');
    document.querySelector(`[data-size="${size}"]`).classList.add('bg-blue-500', 'text-white');
  }

  // 切换减少动画
  toggleReducedMotion() {
    const isReduced = document.documentElement.classList.toggle('reduce-motion');
    localStorage.setItem('blog_reduced_motion', isReduced);
    
    const toggle = document.getElementById('reduced-motion-toggle');
    const slider = toggle.querySelector('div');
    
    if (isReduced) {
      toggle.classList.add('bg-blue-500');
      toggle.classList.remove('bg-gray-300', 'dark:bg-gray-600');
      slider.style.transform = 'translateX(16px)';
    } else {
      toggle.classList.remove('bg-blue-500');
      toggle.classList.add('bg-gray-300', 'dark:bg-gray-600');
      slider.style.transform = 'translateX(0)';
    }
  }

  // 切换自动保存
  toggleAutoSave() {
    const autoSave = !localStorage.getItem('blog_auto_save');
    localStorage.setItem('blog_auto_save', autoSave);
    
    const toggle = document.getElementById('auto-save-toggle');
    const slider = toggle.querySelector('div');
    
    if (autoSave) {
      slider.style.transform = 'translateX(16px)';
    } else {
      slider.style.transform = 'translateX(0)';
    }
  }

  // 设置无障碍功能
  setupAccessibilityFeatures() {
    // 加载保存的设置
    const fontSize = localStorage.getItem('blog_font_size') || 'medium';
    const reducedMotion = localStorage.getItem('blog_reduced_motion') === 'true';
    
    this.setFontSize(fontSize);
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }

    // 键盘导航支持
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // 更新主题切换按钮
  updateThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = toggle.querySelector('i');
    icon.className = this.themes[this.currentTheme].icon + ' text-gray-600 dark:text-gray-300';
  }

  // 更新主题面板
  updateThemePanel() {
    document.querySelectorAll('.theme-option').forEach(option => {
      const theme = option.dataset.theme;
      if (theme === this.currentTheme) {
        option.classList.add('bg-blue-50', 'dark:bg-blue-900', 'border-blue-500');
        option.classList.remove('border-transparent');
        option.innerHTML = option.innerHTML.replace(/<i class="fas fa-check.*?<\/i>/, '') + '<i class="fas fa-check text-blue-500 ml-auto"></i>';
      } else {
        option.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'border-blue-500');
        option.classList.add('border-transparent');
        option.innerHTML = option.innerHTML.replace(/<i class="fas fa-check.*?<\/i>/, '');
      }
    });
  }

  // 更新meta主题色
  updateMetaThemeColor(color) {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = color;
  }

  // 数据持久化
  loadTheme() {
    return localStorage.getItem('blog_theme') || 'light';
  }

  saveTheme(theme) {
    localStorage.setItem('blog_theme', theme);
  }

  // 添加主题样式
  addThemeStyles() {
    if (document.getElementById('theme-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'theme-styles';
    styles.textContent = `
      :root {
        --color-primary: #3B82F6;
        --color-secondary: #6B7280;
        --color-background: #FFFFFF;
        --color-surface: #F9FAFB;
        --color-text: #111827;
        --color-text-secondary: #6B7280;
      }

      .dark {
        --color-primary: #60A5FA;
        --color-secondary: #9CA3AF;
        --color-background: #111827;
        --color-surface: #1F2937;
        --color-text: #F9FAFB;
        --color-text-secondary: #D1D5DB;
      }

      .sepia {
        --color-primary: #D97706;
        --color-secondary: #92400E;
        --color-background: #FEF3C7;
        --color-surface: #FDE68A;
        --color-text: #92400E;
        --color-text-secondary: #B45309;
      }

      .high-contrast {
        --color-primary: #000000;
        --color-secondary: #666666;
        --color-background: #FFFFFF;
        --color-surface: #F0F0F0;
        --color-text: #000000;
        --color-text-secondary: #333333;
      }

      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .keyboard-navigation *:focus {
        outline: 2px solid var(--color-primary) !important;
        outline-offset: 2px !important;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(20px);
        }
      }

      #theme-toggle {
        transition: all 0.3s ease;
      }

      #theme-toggle:hover {
        transform: scale(1.1);
      }

      .theme-option {
        transition: all 0.2s ease;
      }
    `;

    document.head.appendChild(styles);
  }
}

// 导出到全局
window.ThemeSystem = ThemeSystem;
