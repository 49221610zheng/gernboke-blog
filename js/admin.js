// 后台管理应用程序
import { photographyService, articleService, commentService, settingsService } from './services/database.js';
import authService from './services/auth.js';
import storageService from './services/storage.js';

// 后台管理应用类
class AdminApp {
  constructor() {
    this.state = {
      user: null,
      currentView: 'dashboard',
      loading: false,
      data: {
        articles: [],
        photography: [],
        comments: [],
        stats: {}
      }
    };
    
    this.init();
  }
  
  // 初始化应用
  async init() {
    try {
      // 等待认证状态初始化
      await authService.waitForAuthInit();
      
      // 检查认证状态
      if (!authService.isAuthenticated() || !authService.isAdminUser()) {
        this.showLoginForm();
        return;
      }
      
      this.state.user = authService.getCurrentUser();
      this.setupEventListeners();
      this.setupAuthStateListener();
      await this.loadDashboardData();
      this.showDashboard();
      
    } catch (error) {
      console.error('Admin app initialization error:', error);
      this.showError('应用初始化失败');
    }
  }
  
  // 设置认证状态监听器
  setupAuthStateListener() {
    authService.addAuthStateListener((user, isAdmin) => {
      if (!user || !isAdmin) {
        this.showLoginForm();
      } else {
        this.state.user = user;
        this.updateUserInfo();
      }
    });
  }
  
  // 显示登录表单
  showLoginForm() {
    document.body.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <i class="fa fa-camera-retro text-2xl"></i>
            </div>
            <h1 class="text-2xl font-bold">管理员登录</h1>
            <p class="text-gray-medium">请输入您的管理员凭据</p>
          </div>
          
          <form id="login-form">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">邮箱地址</label>
              <input type="email" id="email" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2">密码</label>
              <input type="password" id="password" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            
            <button type="submit" id="login-btn" 
                    class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
              登录
            </button>
          </form>
          
          <div id="login-error" class="mt-4 text-red-500 text-sm hidden"></div>
        </div>
      </div>
    `;
    
    this.setupLoginForm();
  }
  
  // 设置登录表单事件
  setupLoginForm() {
    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const loginBtn = document.getElementById('login-btn');
      
      try {
        loginBtn.textContent = '登录中...';
        loginBtn.disabled = true;
        errorDiv.classList.add('hidden');
        
        await authService.adminLogin(email, password);
        
        // 登录成功，重新初始化应用
        location.reload();
        
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      } finally {
        loginBtn.textContent = '登录';
        loginBtn.disabled = false;
      }
    });
  }
  
  // 显示仪表盘
  showDashboard() {
    // 恢复原始的admin.html内容
    location.reload();
  }
  
  // 设置事件监听器
  setupEventListeners() {
    // 侧边栏导航
    this.setupSidebarNavigation();
    
    // 模态框控制
    this.setupModalControls();
    
    // 文件上传
    this.setupFileUpload();
    
    // 登出按钮
    this.setupLogoutButton();
  }
  
  // 设置侧边栏导航
  setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const views = document.querySelectorAll('.view');
    
    sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 移除所有活跃状态
        sidebarItems.forEach(i => i.classList.remove('active'));
        views.forEach(v => v.classList.add('hidden'));
        
        // 添加当前活跃状态
        item.classList.add('active');
        const targetView = item.getAttribute('data-target');
        const viewElement = document.getElementById(targetView);
        
        if (viewElement) {
          viewElement.classList.remove('hidden');
          this.state.currentView = targetView.replace('-view', '');
          this.loadViewData(this.state.currentView);
        }
      });
    });
  }
  
  // 设置模态框控制
  setupModalControls() {
    // 文章模态框
    const articleModal = document.getElementById('article-modal');
    const addArticleBtn = document.getElementById('add-article-btn');
    const closeArticleModal = document.getElementById('close-article-modal');
    
    if (addArticleBtn) {
      addArticleBtn.addEventListener('click', () => this.openModal(articleModal));
    }
    
    if (closeArticleModal) {
      closeArticleModal.addEventListener('click', () => this.closeModal(articleModal));
    }
    
    // 摄影作品模态框
    const photoModal = document.getElementById('photo-modal');
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const closePhotoModal = document.getElementById('close-photo-modal');
    
    if (uploadPhotoBtn) {
      uploadPhotoBtn.addEventListener('click', () => this.openModal(photoModal));
    }
    
    if (closePhotoModal) {
      closePhotoModal.addEventListener('click', () => this.closeModal(photoModal));
    }
  }
  
  // 设置文件上传
  setupFileUpload() {
    const dropArea = document.getElementById('drop-area');
    
    if (dropArea) {
      // 拖放上传
      dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('border-primary');
      });
      
      dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('border-primary');
      });
      
      dropArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropArea.classList.remove('border-primary');
        
        const files = Array.from(e.dataTransfer.files);
        await this.handleFileUpload(files);
      });
      
      // 点击上传
      dropArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        
        input.addEventListener('change', async (e) => {
          const files = Array.from(e.target.files);
          await this.handleFileUpload(files);
        });
        
        input.click();
      });
    }
  }
  
  // 处理文件上传
  async handleFileUpload(files) {
    if (files.length === 0) return;
    
    try {
      this.showLoading('上传中...');
      
      const results = await storageService.uploadMultipleImages(
        files, 
        'photography',
        (progress) => {
          console.log('Upload progress:', progress);
          // 可以在这里更新进度条
        }
      );
      
      if (results.errors.length > 0) {
        this.showError(`部分文件上传失败: ${results.errors.map(e => e.file).join(', ')}`);
      }
      
      if (results.results.length > 0) {
        this.showSuccess(`成功上传 ${results.results.length} 个文件`);
        // 刷新摄影作品列表
        await this.loadPhotographyData();
      }
      
    } catch (error) {
      console.error('File upload error:', error);
      this.showError('文件上传失败');
    } finally {
      this.hideLoading();
    }
  }
  
  // 设置登出按钮
  setupLogoutButton() {
    // 在用户头像区域添加登出功能
    const userArea = document.querySelector('.flex.items-center.gap-3');
    if (userArea) {
      userArea.style.cursor = 'pointer';
      userArea.addEventListener('click', () => {
        if (confirm('确定要登出吗？')) {
          authService.logout();
        }
      });
    }
  }
  
  // 加载仪表盘数据
  async loadDashboardData() {
    try {
      this.showLoading('加载数据中...');
      
      const [articles, photography, comments] = await Promise.all([
        articleService.getList(1, 10),
        photographyService.getList(1, 12),
        commentService.getList('article', '', 1, 20)
      ]);
      
      this.state.data = {
        articles,
        photography,
        comments,
        stats: {
          totalArticles: articles.length,
          totalPhotography: photography.length,
          totalComments: comments.length,
          totalViews: this.calculateTotalViews(articles, photography)
        }
      };
      
      this.updateDashboardStats();
      this.updateRecentContent();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showError('加载数据失败');
    } finally {
      this.hideLoading();
    }
  }
  
  // 加载视图数据
  async loadViewData(viewName) {
    switch (viewName) {
      case 'articles':
        await this.loadArticlesData();
        break;
      case 'photography':
        await this.loadPhotographyData();
        break;
      case 'comments':
        await this.loadCommentsData();
        break;
      default:
        break;
    }
  }
  
  // 加载文章数据
  async loadArticlesData() {
    try {
      const articles = await articleService.getList(1, 50);
      this.renderArticlesList(articles);
    } catch (error) {
      console.error('Error loading articles:', error);
      this.showError('加载文章失败');
    }
  }
  
  // 加载摄影作品数据
  async loadPhotographyData() {
    try {
      const photography = await photographyService.getList(1, 50);
      this.renderPhotographyGrid(photography);
    } catch (error) {
      console.error('Error loading photography:', error);
      this.showError('加载摄影作品失败');
    }
  }
  
  // 加载评论数据
  async loadCommentsData() {
    try {
      const comments = await commentService.getList('', '', 1, 50);
      this.renderCommentsList(comments);
    } catch (error) {
      console.error('Error loading comments:', error);
      this.showError('加载评论失败');
    }
  }
  
  // 渲染文章列表
  renderArticlesList(articles) {
    const container = document.querySelector('#articles-list');
    if (!container) return;

    container.innerHTML = '';

    if (articles.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fa fa-file-text-o text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">暂无文章</p>
          <button class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                  onclick="document.getElementById('add-article-btn').click()">
            创建第一篇文章
          </button>
        </div>
      `;
      return;
    }

    articles.forEach(article => {
      const articleElement = this.createArticleListItem(article);
      container.appendChild(articleElement);
    });
  }

  // 创建文章列表项
  createArticleListItem(article) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow';

    const statusColor = article.status === 'published' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
    const statusText = article.status === 'published' ? '已发布' : '草稿';

    div.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="font-semibold text-lg">${article.title}</h3>
            <span class="px-2 py-1 text-xs rounded-full ${statusColor}">${statusText}</span>
          </div>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">${article.excerpt || ''}</p>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span><i class="fa fa-folder-o mr-1"></i>${article.category}</span>
            <span><i class="fa fa-eye mr-1"></i>${article.viewCount || 0} 浏览</span>
            <span><i class="fa fa-clock-o mr-1"></i>${this.formatDate(article.createdAt)}</span>
          </div>
          ${article.tags && article.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mt-2">
              ${article.tags.map(tag => `<span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="flex items-center gap-2 ml-4">
          <button class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  onclick="adminApp.editArticle('${article.id}')" title="编辑">
            <i class="fa fa-edit"></i>
          </button>
          <button class="p-2 text-red-600 hover:bg-red-50 rounded"
                  onclick="adminApp.deleteArticle('${article.id}')" title="删除">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    return div;
  }

  // 渲染摄影作品网格
  renderPhotographyGrid(photography) {
    const container = document.querySelector('#photography-grid');
    if (!container) return;

    container.innerHTML = '';

    if (photography.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fa fa-camera text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">暂无摄影作品</p>
          <button class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                  onclick="document.getElementById('upload-photo-btn').click()">
            上传第一张作品
          </button>
        </div>
      `;
      return;
    }

    photography.forEach(photo => {
      const photoElement = this.createPhotoGridItem(photo);
      container.appendChild(photoElement);
    });
  }

  // 创建摄影作品网格项
  createPhotoGridItem(photo) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group';

    div.innerHTML = `
      <div class="aspect-[4/3] relative overflow-hidden">
        <img src="${photo.thumbnailUrl || photo.imageUrl}"
             alt="${photo.title}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="flex gap-1">
            <button class="p-1.5 bg-white/90 text-blue-600 rounded hover:bg-white"
                    onclick="adminApp.editPhoto('${photo.id}')" title="编辑">
              <i class="fa fa-edit text-sm"></i>
            </button>
            <button class="p-1.5 bg-white/90 text-red-600 rounded hover:bg-white"
                    onclick="adminApp.deletePhoto('${photo.id}')" title="删除">
              <i class="fa fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-medium mb-1 line-clamp-1">${photo.title}</h3>
        <p class="text-sm text-gray-600 mb-2 line-clamp-2">${photo.description}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>${this.getCategoryDisplayName(photo.category)}</span>
          <span><i class="fa fa-eye mr-1"></i>${photo.viewCount || 0}</span>
        </div>
      </div>
    `;

    return div;
  }

  // 渲染评论列表
  renderCommentsList(comments) {
    const container = document.querySelector('#comments-list');
    if (!container) return;

    container.innerHTML = '';

    if (comments.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fa fa-comments-o text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">暂无评论</p>
        </div>
      `;
      return;
    }

    comments.forEach(comment => {
      const commentElement = this.createCommentListItem(comment);
      container.appendChild(commentElement);
    });
  }

  // 创建评论列表项
  createCommentListItem(comment) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow';

    const statusColor = comment.isApproved ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
    const statusText = comment.isApproved ? '已审核' : '待审核';

    div.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex items-center gap-2">
              <img src="${comment.author?.avatarUrl || 'https://picsum.photos/32/32'}"
                   alt="${comment.author?.name}"
                   class="w-8 h-8 rounded-full">
              <div>
                <p class="font-medium text-sm">${comment.author?.name}</p>
                <p class="text-xs text-gray-500">${comment.author?.email}</p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs rounded-full ${statusColor}">${statusText}</span>
          </div>
          <p class="text-gray-700 mb-3">${comment.content}</p>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span><i class="fa fa-${comment.targetType === 'article' ? 'file-text-o' : 'camera'} mr-1"></i>${comment.targetType === 'article' ? '文章' : '摄影作品'}</span>
            <span><i class="fa fa-clock-o mr-1"></i>${this.formatDate(comment.createdAt)}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 ml-4">
          ${!comment.isApproved ? `
            <button class="p-2 text-green-600 hover:bg-green-50 rounded"
                    onclick="adminApp.approveComment('${comment.id}')" title="审核通过">
              <i class="fa fa-check"></i>
            </button>
          ` : ''}
          <button class="p-2 text-red-600 hover:bg-red-50 rounded"
                  onclick="adminApp.deleteComment('${comment.id}')" title="删除">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    return div;
  }
  
  // 更新仪表盘统计
  updateDashboardStats() {
    // TODO: 更新统计数据显示
  }
  
  // 更新最近内容
  updateRecentContent() {
    // TODO: 更新最近内容列表
  }
  
  // 计算总浏览量
  calculateTotalViews(articles, photography) {
    const articleViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);
    const photoViews = photography.reduce((sum, photo) => sum + (photo.viewCount || 0), 0);
    return articleViews + photoViews;
  }
  
  // 更新用户信息显示
  updateUserInfo() {
    const userNameElement = document.querySelector('.font-medium');
    if (userNameElement && this.state.user) {
      userNameElement.textContent = this.state.user.displayName || this.state.user.email;
    }
  }
  
  // 工具方法
  openModal(modal) {
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }
  
  showLoading(message = '加载中...') {
    // TODO: 实现加载指示器
    console.log('Loading:', message);
  }
  
  hideLoading() {
    // TODO: 隐藏加载指示器
    console.log('Loading complete');
  }
  
  showError(message) {
    // TODO: 实现错误提示
    console.error('Error:', message);
    alert(message); // 临时使用alert
  }
  
  showSuccess(message) {
    // TODO: 实现成功提示
    console.log('Success:', message);
  }

  // 编辑文章
  async editArticle(articleId) {
    try {
      const databaseService = await loadModule('databaseService');
      const article = await databaseService.articleService.getDetail(articleId);

      // 填充表单数据
      this.fillArticleForm(article);

      // 打开模态框
      const modal = document.getElementById('article-modal');
      this.openModal(modal);

      // 设置为编辑模式
      const form = document.getElementById('article-form');
      form.dataset.mode = 'edit';
      form.dataset.articleId = articleId;

    } catch (error) {
      console.error('Error loading article for edit:', error);
      this.showError('加载文章失败');
    }
  }

  // 填充文章表单
  fillArticleForm(article) {
    const form = document.getElementById('article-form');
    if (!form) return;

    // 填充基本信息
    const titleInput = form.querySelector('#article-title');
    const contentInput = form.querySelector('#article-content');
    const excerptInput = form.querySelector('#article-excerpt');
    const categorySelect = form.querySelector('#article-category');
    const statusSelect = form.querySelector('#article-status');
    const tagsInput = form.querySelector('#article-tags');

    if (titleInput) titleInput.value = article.title || '';
    if (contentInput) contentInput.value = article.content || '';
    if (excerptInput) excerptInput.value = article.excerpt || '';
    if (categorySelect) categorySelect.value = article.category || '';
    if (statusSelect) statusSelect.value = article.status || 'draft';
    if (tagsInput) tagsInput.value = article.tags ? article.tags.join(', ') : '';
  }

  // 删除文章
  async deleteArticle(articleId) {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }

    try {
      const databaseService = await loadModule('databaseService');
      await databaseService.articleService.delete(articleId);

      this.showSuccess('文章删除成功');
      await this.loadArticlesData();

    } catch (error) {
      console.error('Error deleting article:', error);
      this.showError('删除文章失败');
    }
  }

  // 编辑摄影作品
  async editPhoto(photoId) {
    try {
      const databaseService = await loadModule('databaseService');
      const photo = await databaseService.photographyService.getDetail(photoId);

      // 填充表单数据
      this.fillPhotoForm(photo);

      // 打开模态框
      const modal = document.getElementById('photo-modal');
      this.openModal(modal);

      // 设置为编辑模式
      const form = document.getElementById('photo-form');
      form.dataset.mode = 'edit';
      form.dataset.photoId = photoId;

    } catch (error) {
      console.error('Error loading photo for edit:', error);
      this.showError('加载摄影作品失败');
    }
  }

  // 填充摄影作品表单
  fillPhotoForm(photo) {
    const form = document.getElementById('photo-form');
    if (!form) return;

    // 填充基本信息
    const titleInput = form.querySelector('#photo-title');
    const descriptionInput = form.querySelector('#photo-description');
    const categorySelect = form.querySelector('#photo-category');
    const locationInput = form.querySelector('#photo-location');

    if (titleInput) titleInput.value = photo.title || '';
    if (descriptionInput) descriptionInput.value = photo.description || '';
    if (categorySelect) categorySelect.value = photo.category || '';
    if (locationInput) locationInput.value = photo.location || '';

    // 填充拍摄参数
    if (photo.shootingParams) {
      const cameraInput = form.querySelector('#photo-camera');
      const lensInput = form.querySelector('#photo-lens');
      const isoInput = form.querySelector('#photo-iso');
      const apertureInput = form.querySelector('#photo-aperture');
      const shutterInput = form.querySelector('#photo-shutter');
      const focalInput = form.querySelector('#photo-focal');

      if (cameraInput) cameraInput.value = photo.shootingParams.camera || '';
      if (lensInput) lensInput.value = photo.shootingParams.lens || '';
      if (isoInput) isoInput.value = photo.shootingParams.iso || '';
      if (apertureInput) apertureInput.value = photo.shootingParams.aperture || '';
      if (shutterInput) shutterInput.value = photo.shootingParams.shutterSpeed || '';
      if (focalInput) focalInput.value = photo.shootingParams.focalLength || '';
    }

    // 显示现有图片
    if (photo.imageUrl) {
      this.showExistingImage(photo.imageUrl);
    }
  }

  // 显示现有图片
  showExistingImage(imageUrl) {
    const previewContainer = document.querySelector('#image-preview');
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div class="relative">
          <img src="${imageUrl}" alt="当前图片" class="w-full h-48 object-cover rounded-lg">
          <div class="absolute top-2 right-2">
            <button type="button" class="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onclick="this.parentElement.parentElement.remove()">
              <i class="fa fa-times text-sm"></i>
            </button>
          </div>
        </div>
      `;
    }
  }

  // 删除摄影作品
  async deletePhoto(photoId) {
    if (!confirm('确定要删除这张摄影作品吗？此操作不可恢复。')) {
      return;
    }

    try {
      const databaseService = await loadModule('databaseService');
      await databaseService.photographyService.delete(photoId);

      this.showSuccess('摄影作品删除成功');
      await this.loadPhotographyData();

    } catch (error) {
      console.error('Error deleting photo:', error);
      this.showError('删除摄影作品失败');
    }
  }

  // 审核评论
  async approveComment(commentId) {
    try {
      const databaseService = await loadModule('databaseService');
      await databaseService.commentService.approve(commentId);

      this.showSuccess('评论审核通过');
      await this.loadCommentsData();

    } catch (error) {
      console.error('Error approving comment:', error);
      this.showError('审核评论失败');
    }
  }

  // 删除评论
  async deleteComment(commentId) {
    if (!confirm('确定要删除这条评论吗？此操作不可恢复。')) {
      return;
    }

    try {
      const databaseService = await loadModule('databaseService');
      await databaseService.commentService.delete(commentId);

      this.showSuccess('评论删除成功');
      await this.loadCommentsData();

    } catch (error) {
      console.error('Error deleting comment:', error);
      this.showError('删除评论失败');
    }
  }

  // 格式化日期
  formatDate(timestamp) {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 获取分类显示名称
  getCategoryDisplayName(category) {
    const categoryMap = {
      'landscape': '风光摄影',
      'city': '城市摄影',
      'portrait': '人像摄影',
      'street': '街头摄影',
      'architecture': '建筑摄影',
      'frontend': '前端开发',
      'backend': '后端开发',
      'devops': 'DevOps',
      'tutorial': '教程'
    };

    return categoryMap[category] || category;
  }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
});

export default AdminApp;
