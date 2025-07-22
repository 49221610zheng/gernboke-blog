// 管理后台主控制器
class AdminMain {
  constructor() {
    this.currentSection = 'dashboard';
    this.managers = {};
    this.stats = {
      articles: 0,
      photos: 0,
      views: 0,
      comments: 0
    };
    this.init();
  }

  async init() {
    try {
      // 等待Firebase初始化
      if (typeof waitForFirebase !== 'undefined') {
        await waitForFirebase();
      }

      // 初始化管理模块
      this.initializeManagers();

      // 绑定事件
      this.bindEvents();

      // 显示仪表板
      this.showSection('dashboard');

      // 更新统计数据
      this.updateStats();

      console.log('✅ 管理后台初始化完成');
    } catch (error) {
      console.error('❌ 管理后台初始化失败:', error);
    }
  }

  initializeManagers() {
    // 延迟初始化管理模块，避免循环依赖
    this.managers.profile = null;
    this.managers.article = null;
    this.managers.photography = null;
    this.managers.comment = null;
    this.managers.settings = null;
    this.managers.analytics = null;
  }

  bindEvents() {
    // 绑定侧边栏导航事件
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('[data-section]');
      if (navItem) {
        e.preventDefault();
        const section = navItem.dataset.section;
        this.showSection(section);
      }
    });

    // 绑定移动端菜单切换
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
      });
    }
  }

  async showSection(section) {
    this.currentSection = section;

    // 更新导航状态
    this.updateNavigation(section);

    // 显示对应内容
    switch (section) {
      case 'dashboard':
        this.showDashboard();
        break;
      case 'profile':
        await this.showProfile();
        break;
      case 'articles':
        await this.showArticles();
        break;
      case 'photography':
        await this.showPhotography();
        break;
      case 'comments':
        await this.showComments();
        break;
      case 'settings':
        await this.showSettings();
        break;
      case 'analytics':
        await this.showAnalytics();
        break;
      default:
        this.showDashboard();
    }
  }

  updateNavigation(activeSection) {
    // 移除所有活动状态
    document.querySelectorAll('[data-section]').forEach(item => {
      item.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-500');
      item.classList.add('text-gray-600', 'hover:text-gray-900');
    });

    // 添加活动状态到当前项
    const activeItem = document.querySelector(`[data-section="${activeSection}"]`);
    if (activeItem) {
      activeItem.classList.remove('text-gray-600', 'hover:text-gray-900');
      activeItem.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-500');
    }
  }

  showDashboard() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <!-- 欢迎横幅 -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-2">欢迎回来！</h1>
              <p class="text-blue-100">今天是 ${new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })}</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold">${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</div>
              <div class="text-blue-100 text-sm">最后登录: ${new Date().toLocaleString('zh-CN')}</div>
            </div>
          </div>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">文章总数</p>
                <p id="articles-count" class="text-3xl font-bold text-gray-900">${this.stats.articles}</p>
                <p class="text-sm text-green-600 mt-1">
                  <i class="fas fa-arrow-up mr-1"></i>+12% 本月
                </p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-newspaper text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">摄影作品</p>
                <p id="photos-count" class="text-3xl font-bold text-gray-900">${this.stats.photos}</p>
                <p class="text-sm text-green-600 mt-1">
                  <i class="fas fa-arrow-up mr-1"></i>+8% 本月
                </p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <i class="fas fa-camera text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">总访问量</p>
                <p id="views-count" class="text-3xl font-bold text-gray-900">${this.stats.views}</p>
                <p class="text-sm text-green-600 mt-1">
                  <i class="fas fa-arrow-up mr-1"></i>+25% 本月
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <i class="fas fa-eye text-purple-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">评论数</p>
                <p id="comments-count" class="text-3xl font-bold text-gray-900">${this.stats.comments}</p>
                <p class="text-sm text-red-600 mt-1">
                  <i class="fas fa-arrow-down mr-1"></i>-3% 本月
                </p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-full">
                <i class="fas fa-comments text-yellow-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 快速操作和图表 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 快速操作 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div class="space-y-3">
                <button onclick="adminMain.showSection('articles')" class="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group">
                  <div class="p-2 bg-blue-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <i class="fas fa-plus text-white"></i>
                  </div>
                  <span class="text-blue-700 font-medium">新建文章</span>
                </button>
                <button onclick="adminMain.showSection('photography')" class="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 group">
                  <div class="p-2 bg-green-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <i class="fas fa-upload text-white"></i>
                  </div>
                  <span class="text-green-700 font-medium">上传作品</span>
                </button>
                <button onclick="adminMain.showSection('profile')" class="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group">
                  <div class="p-2 bg-purple-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <i class="fas fa-user-edit text-white"></i>
                  </div>
                  <span class="text-purple-700 font-medium">编辑资料</span>
                </button>
                <button onclick="adminMain.showSection('analytics')" class="w-full flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group">
                  <div class="p-2 bg-orange-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <i class="fas fa-chart-bar text-white"></i>
                  </div>
                  <span class="text-orange-700 font-medium">查看分析</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 访问趋势图 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">访问趋势</h3>
                <select class="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option>最近7天</option>
                  <option>最近30天</option>
                  <option>最近90天</option>
                </select>
              </div>
              <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center text-gray-500">
                  <i class="fas fa-chart-line text-4xl mb-2"></i>
                  <p>访问趋势图表</p>
                  <p class="text-sm">(需要集成图表库)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 最近活动和系统状态 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 最近活动 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">最近活动</h3>
              <button class="text-sm text-blue-600 hover:text-blue-800">查看全部</button>
            </div>
            <div id="recent-activities" class="space-y-3">
              <div class="flex items-start p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div class="p-1 bg-green-500 rounded-full mr-3 mt-1">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">系统初始化完成</p>
                  <p class="text-xs text-gray-500">${new Date().toLocaleTimeString('zh-CN')}</p>
                </div>
              </div>
              <div class="flex items-start p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div class="p-1 bg-blue-500 rounded-full mr-3 mt-1">
                  <i class="fas fa-user text-white text-xs"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">管理员登录</p>
                  <p class="text-xs text-gray-500">${new Date().toLocaleTimeString('zh-CN')}</p>
                </div>
              </div>
              <div class="flex items-start p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <div class="p-1 bg-purple-500 rounded-full mr-3 mt-1">
                  <i class="fas fa-cog text-white text-xs"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">安全系统启动</p>
                  <p class="text-xs text-gray-500">${new Date().toLocaleTimeString('zh-CN')}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统状态 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">系统状态</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span class="text-sm font-medium text-gray-900">数据库连接</span>
                </div>
                <span class="text-sm text-green-600 font-medium">正常</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span class="text-sm font-medium text-gray-900">安全系统</span>
                </div>
                <span class="text-sm text-green-600 font-medium">运行中</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span class="text-sm font-medium text-gray-900">备份状态</span>
                </div>
                <span class="text-sm text-yellow-600 font-medium">待更新</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span class="text-sm font-medium text-gray-900">CDN状态</span>
                </div>
                <span class="text-sm text-blue-600 font-medium">优化中</span>
              </div>
            </div>

            <!-- 系统信息 -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-3">系统信息</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">版本:</span>
                  <span class="font-medium ml-2">v2.1.0</span>
                </div>
                <div>
                  <span class="text-gray-600">运行时间:</span>
                  <span class="font-medium ml-2">2天</span>
                </div>
                <div>
                  <span class="text-gray-600">存储使用:</span>
                  <span class="font-medium ml-2">68%</span>
                </div>
                <div>
                  <span class="text-gray-600">带宽:</span>
                  <span class="font-medium ml-2">正常</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async showProfile() {
    if (!this.managers.profile) {
      await this.loadScript('js/admin/profile-manager.js');
      this.managers.profile = new ProfileManager();
    }
    this.managers.profile.renderProfile();
  }

  async showArticles() {
    if (!this.managers.article) {
      await this.loadScript('js/admin/article-manager.js');
      this.managers.article = new ArticleManager();
    }
    this.managers.article.renderArticleList();
  }

  async showPhotography() {
    if (!this.managers.photography) {
      await this.loadScript('js/admin/photography-manager.js');
      this.managers.photography = new PhotographyManager();
    }
    this.managers.photography.renderPhotoGrid();
  }

  async showComments() {
    if (!this.managers.comment) {
      await this.loadScript('js/admin/comment-manager.js');
      this.managers.comment = new CommentManager();
    }
    this.managers.comment.renderCommentList();
  }

  async showSettings() {
    if (!this.managers.settings) {
      await this.loadScript('js/admin/settings-manager.js');
      this.managers.settings = new SettingsManager();
    }
    this.managers.settings.renderSettings();
  }

  async showAnalytics() {
    if (!this.managers.analytics) {
      await this.loadScript('js/admin/analytics-manager.js');
      this.managers.analytics = new AnalyticsManager();
    }
    this.managers.analytics.renderAnalytics();
  }

  async updateStats() {
    try {
      if (window.databaseService) {
        // 获取文章数量
        const articles = await window.databaseService.articleService.getAll();
        this.stats.articles = articles.length;

        // 获取摄影作品数量
        const photos = await window.databaseService.photographyService.getAll();
        this.stats.photos = photos.length;

        // 更新显示
        this.updateStatsDisplay();
      }
    } catch (error) {
      console.error('更新统计数据失败:', error);
    }
  }

  updateStatsDisplay() {
    const articlesCount = document.getElementById('articles-count');
    const photosCount = document.getElementById('photos-count');
    const viewsCount = document.getElementById('views-count');
    const commentsCount = document.getElementById('comments-count');

    if (articlesCount) articlesCount.textContent = this.stats.articles;
    if (photosCount) photosCount.textContent = this.stats.photos;
    if (viewsCount) viewsCount.textContent = this.stats.views;
    if (commentsCount) commentsCount.textContent = this.stats.comments;
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// 初始化管理后台
document.addEventListener('DOMContentLoaded', () => {
  window.adminMain = new AdminMain();
});

// 全局函数供HTML调用
window.showSection = (section) => {
  if (window.adminMain) {
    window.adminMain.showSection(section);
  }
};
