// 简化版管理系统 - 解决功能点击问题
class SimpleAdminMain {
  constructor() {
    this.currentSection = 'dashboard';
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    console.log('🛠️ 启动简化版管理系统...');
    
    // 等待DOM加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    try {
      // 设置基本UI
      this.setupBasicUI();
      
      // 设置导航
      this.setupNavigation();
      
      // 显示仪表板
      this.showDashboard();
      
      console.log('✅ 简化版管理系统启动成功');
      
    } catch (error) {
      console.error('❌ 管理系统启动失败:', error);
      this.showError('管理系统启动失败');
    }
  }

  // 设置基本UI
  setupBasicUI() {
    // 确保侧边栏可见
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      sidebar.style.display = 'block';
    }

    // 确保主内容区域可见
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.display = 'block';
    }
  }

  // 设置导航
  setupNavigation() {
    // 为所有导航链接添加点击事件
    document.querySelectorAll('[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.showSection(section);
      });
    });

    // 移动端菜单切换
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
      });
    }
  }

  // 显示指定部分
  showSection(section) {
    console.log(`📄 显示部分: ${section}`);
    
    // 更新当前部分
    this.currentSection = section;
    
    // 更新导航状态
    this.updateNavigation(section);
    
    // 显示对应内容
    switch (section) {
      case 'dashboard':
        this.showDashboard();
        break;
      case 'articles':
        this.showArticles();
        break;
      case 'photography':
        this.showPhotography();
        break;
      case 'comments':
        this.showComments();
        break;
      case 'profile':
        this.showProfile();
        break;
      case 'settings':
        this.showSettings();
        break;
      case 'analytics':
        this.showAnalytics();
        break;
      default:
        this.showDashboard();
    }
  }

  // 更新导航状态
  updateNavigation(activeSection) {
    document.querySelectorAll('[data-section]').forEach(link => {
      link.classList.remove('active', 'bg-blue-100', 'text-blue-700');
      if (link.getAttribute('data-section') === activeSection) {
        link.classList.add('active', 'bg-blue-100', 'text-blue-700');
      }
    });
  }

  // 显示仪表板
  showDashboard() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">仪表板</h1>
          <div class="text-sm text-gray-500">
            最后更新: ${new Date().toLocaleString('zh-CN')}
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="fas fa-newspaper text-blue-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">文章总数</p>
                <p class="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="fas fa-camera text-green-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">摄影作品</p>
                <p class="text-2xl font-bold text-gray-900">48</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <i class="fas fa-eye text-purple-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">总访问量</p>
                <p class="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <i class="fas fa-comments text-yellow-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">评论数</p>
                <p class="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onclick="simpleAdminMain.showSection('articles')" class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <i class="fas fa-plus text-blue-600 mr-3"></i>
              <span class="text-blue-700 font-medium">新建文章</span>
            </button>
            <button onclick="simpleAdminMain.showSection('photography')" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <i class="fas fa-upload text-green-600 mr-3"></i>
              <span class="text-green-700 font-medium">上传作品</span>
            </button>
            <button onclick="simpleAdminMain.showSection('profile')" class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <i class="fas fa-user-edit text-purple-600 mr-3"></i>
              <span class="text-purple-700 font-medium">编辑资料</span>
            </button>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div class="space-y-3">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <i class="fas fa-plus-circle text-green-500 mr-3"></i>
              <span class="text-gray-700">系统初始化完成</span>
              <span class="ml-auto text-sm text-gray-500">${new Date().toLocaleTimeString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 显示文章管理
  showArticles() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">内容管理</h1>
          <div class="flex gap-2">
            <button onclick="simpleAdminMain.previewSite()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <i class="fas fa-eye mr-2"></i>预览网站
            </button>
            <button onclick="simpleAdminMain.publishSite()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <i class="fas fa-upload mr-2"></i>发布更新
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow">
          ${this.getContentManager()}
        </div>
      </div>
    `;

    // 初始化内容管理器
    if (typeof ContentManager !== 'undefined') {
      window.contentManager = new ContentManager();
    }
  }

  // 显示摄影作品管理
  showPhotography() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">摄影作品</h1>
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <i class="fas fa-upload mr-2"></i>上传作品
          </button>
        </div>

        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <p class="text-gray-600">摄影作品管理功能正在开发中...</p>
            <p class="text-sm text-gray-500 mt-2">您可以在这里上传和管理摄影作品</p>
          </div>
        </div>
      </div>
    `;
  }

  // 显示评论管理
  showComments() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-900">评论管理</h1>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <p class="text-gray-600">评论管理功能正在开发中...</p>
            <p class="text-sm text-gray-500 mt-2">您可以在这里审核和管理用户评论</p>
          </div>
        </div>
      </div>
    `;
  }

  // 显示个人资料
  showProfile() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-900">个人资料</h1>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <p class="text-gray-600">个人资料管理功能正在开发中...</p>
            <p class="text-sm text-gray-500 mt-2">您可以在这里编辑个人信息和设置</p>
          </div>
        </div>
      </div>
    `;
  }

  // 显示设置
  showSettings() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-900">系统设置</h1>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <p class="text-gray-600">系统设置功能正在开发中...</p>
            <p class="text-sm text-gray-500 mt-2">您可以在这里配置网站设置</p>
          </div>
        </div>
      </div>
    `;
  }

  // 显示分析
  showAnalytics() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-900">数据分析</h1>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <p class="text-gray-600">数据分析功能正在开发中...</p>
            <p class="text-sm text-gray-500 mt-2">您可以在这里查看网站访问统计</p>
          </div>
        </div>
      </div>
    `;
  }

  // 获取内容管理器
  getContentManager() {
    if (typeof ContentManager !== 'undefined') {
      const manager = new ContentManager();
      return manager.getContentEditor();
    }
    return `
      <div class="p-6 text-center">
        <i class="fas fa-cog text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-600">内容管理器加载中...</p>
      </div>
    `;
  }

  // 预览网站
  previewSite() {
    if (typeof PageGenerator !== 'undefined' && window.contentManager) {
      const generator = new PageGenerator();
      generator.previewPage(window.contentManager.content);
    } else {
      window.open('../index.html', '_blank');
    }
  }

  // 发布网站
  publishSite() {
    if (typeof PageGenerator !== 'undefined' && window.contentManager) {
      const generator = new PageGenerator();
      generator.applyToCurrentPage(window.contentManager.content);
      this.showMessage('网站更新已发布！', 'success');
    } else {
      this.showMessage('发布功能暂不可用', 'error');
    }
  }

  // 显示消息
  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  // 显示错误
  showError(message) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">出现错误</h2>
          <p class="text-gray-600">${message}</p>
          <button onclick="location.reload()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            刷新页面
          </button>
        </div>
      </div>
    `;
  }
}

// 创建全局实例
let simpleAdminMain;

// 启动管理系统
document.addEventListener('DOMContentLoaded', () => {
  simpleAdminMain = new SimpleAdminMain();
});

// 导出到全局
window.simpleAdminMain = simpleAdminMain;
