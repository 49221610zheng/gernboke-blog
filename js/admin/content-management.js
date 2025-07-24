// 管理端内容管理系统
// 提供文章和照片的完整CRUD功能

class ContentManagement {
  constructor() {
    this.articles = this.loadArticles();
    this.photos = this.loadPhotos();
    this.currentEditingId = null;
    this.currentEditingType = null;
    
    this.init();
  }

  init() {
    // 检查管理权限
    if (!this.checkAdminPermission()) {
      this.redirectToLogin();
      return;
    }

    // 初始化内容管理界面
    this.initContentManagement();
    
    // 设置事件监听
    this.setupEventListeners();
    
    console.log('📝 内容管理系统已初始化');
  }

  checkAdminPermission() {
    const hiddenAccess = sessionStorage.getItem('hiddenAdminAccess');
    const adminToken = sessionStorage.getItem('adminToken');
    
    return hiddenAccess === 'true' || adminToken;
  }

  redirectToLogin() {
    window.location.href = 'index.html';
  }

  loadArticles() {
    const defaultArticles = {
      'python-raw-processing': {
        id: 'python-raw-processing',
        title: '使用Python批量处理RAW照片',
        category: 'Python',
        image: 'https://picsum.photos/id/0/1200/600',
        date: '2023-06-12',
        readTime: '8分钟阅读',
        author: '摄影程序员',
        tags: ['Python', '图像处理', 'RAW', '摄影', '自动化'],
        content: '在数字摄影时代，RAW格式照片因其包含更多图像信息而备受专业摄影师青睐...',
        status: 'published',
        views: 1250,
        likes: 89
      },
      'javascript-async': {
        id: 'javascript-async',
        title: 'JavaScript异步编程全解析',
        category: 'JavaScript',
        image: 'https://picsum.photos/id/180/1200/600',
        date: '2023-06-05',
        readTime: '12分钟阅读',
        author: '摄影程序员',
        tags: ['JavaScript', '异步编程', 'Promise', 'async/await'],
        content: 'JavaScript的异步编程是现代Web开发中的核心概念...',
        status: 'published',
        views: 2100,
        likes: 156
      },
      'photography-management': {
        id: 'photography-management',
        title: '摄影作品管理系统设计思路',
        category: '全栈开发',
        image: 'https://picsum.photos/id/96/1200/600',
        date: '2023-05-28',
        readTime: '15分钟阅读',
        author: '摄影程序员',
        tags: ['全栈开发', '项目设计', '数据库', 'API'],
        content: '设计一个摄影作品管理系统需要考虑多个方面...',
        status: 'published',
        views: 890,
        likes: 67
      },
      'css-layout': {
        id: 'css-layout',
        title: '现代CSS布局技巧与实践',
        category: 'CSS',
        image: 'https://picsum.photos/id/48/1200/600',
        date: '2023-05-18',
        readTime: '10分钟阅读',
        author: '摄影程序员',
        tags: ['CSS', '响应式设计', 'Grid', 'Flexbox'],
        content: '现代CSS提供了强大的布局工具...',
        status: 'published',
        views: 1560,
        likes: 123
      }
    };

    const stored = localStorage.getItem('blog_articles');
    return stored ? JSON.parse(stored) : defaultArticles;
  }

  loadPhotos() {
    const defaultPhotos = {
      'city-night': {
        id: 'city-night',
        title: '城市夜景',
        description: '这张照片拍摄于北京CBD核心区域，展现了现代都市的繁华夜景。',
        image: 'https://picsum.photos/id/29/1200/800',
        thumbnail: 'https://picsum.photos/id/29/400/300',
        date: '2023年6月10日',
        location: '北京CBD',
        category: '城市摄影',
        camera: 'Sony A7M3',
        lens: '16-35mm F4',
        focal: '24mm',
        aperture: 'f/8',
        shutter: '30s',
        iso: '100',
        tags: ['城市摄影', '夜景', '长曝光', '光轨', '北京'],
        likes: 128,
        views: 2100,
        status: 'published'
      },
      'mountain-lake': {
        id: 'mountain-lake',
        title: '山间湖泊',
        description: '清晨时分，薄雾缭绕的高山湖泊，宁静而神秘。',
        image: 'https://picsum.photos/id/15/1200/800',
        thumbnail: 'https://picsum.photos/id/15/400/300',
        date: '2023年5月20日',
        location: '四川九寨沟',
        category: '风光摄影',
        camera: 'Sony A7M3',
        lens: '24-70mm F2.8',
        focal: '35mm',
        aperture: 'f/11',
        shutter: '1/60s',
        iso: '200',
        tags: ['风光摄影', '湖泊', '山景', '晨雾', '九寨沟'],
        likes: 256,
        views: 3200,
        status: 'published'
      },
      'street-moment': {
        id: 'street-moment',
        title: '街头瞬间',
        description: '捕捉城市街头的生动瞬间，光影交错中的人文故事。',
        image: 'https://picsum.photos/id/1062/1200/800',
        thumbnail: 'https://picsum.photos/id/1062/400/300',
        date: '2023年4月15日',
        location: '上海外滩',
        category: '街头摄影',
        camera: 'Sony A7M3',
        lens: '85mm F1.8',
        focal: '85mm',
        aperture: 'f/2.8',
        shutter: '1/125s',
        iso: '800',
        tags: ['街头摄影', '人文', '黑白', '瞬间', '上海'],
        likes: 89,
        views: 1450,
        status: 'published'
      }
    };

    const stored = localStorage.getItem('blog_photos');
    return stored ? JSON.parse(stored) : defaultPhotos;
  }

  saveArticles() {
    localStorage.setItem('blog_articles', JSON.stringify(this.articles));
    this.syncToBackend('articles', this.articles);
  }

  savePhotos() {
    localStorage.setItem('blog_photos', JSON.stringify(this.photos));
    this.syncToBackend('photos', this.photos);
  }

  async syncToBackend(type, data) {
    if (window.frontendBackendBridge) {
      try {
        await window.frontendBackendBridge.syncData(type, data);
        console.log(`✅ ${type}数据已同步到后端`);
      } catch (error) {
        console.error(`❌ ${type}数据同步失败:`, error);
      }
    }
  }

  initContentManagement() {
    // 创建内容管理界面
    this.createContentManagementUI();
    
    // 加载内容列表
    this.loadContentList();
  }

  createContentManagementUI() {
    const mainContent = document.querySelector('main .container');
    if (!mainContent) return;

    const contentManagementHTML = `
      <div class="content-management-section">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">内容管理</h2>
          <div class="flex gap-3">
            <button id="add-article-btn" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <i class="fa fa-plus mr-2"></i>新增文章
            </button>
            <button id="add-photo-btn" class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors">
              <i class="fa fa-camera mr-2"></i>新增照片
            </button>
          </div>
        </div>

        <!-- 内容类型切换 -->
        <div class="mb-6">
          <div class="flex border-b">
            <button id="articles-tab" class="px-4 py-2 border-b-2 border-primary text-primary font-medium">
              文章管理 (${Object.keys(this.articles).length})
            </button>
            <button id="photos-tab" class="px-4 py-2 text-gray-600 hover:text-primary transition-colors">
              照片管理 (${Object.keys(this.photos).length})
            </button>
          </div>
        </div>

        <!-- 内容列表 -->
        <div id="content-list" class="space-y-4">
          <!-- 动态加载内容 -->
        </div>
      </div>

      <!-- 编辑模态框 -->
      <div id="edit-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b">
            <div class="flex justify-between items-center">
              <h3 id="modal-title" class="text-xl font-bold">编辑内容</h3>
              <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                <i class="fa fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div id="modal-content" class="p-6">
            <!-- 动态加载编辑表单 -->
          </div>
        </div>
      </div>
    `;

    // 在现有内容前插入内容管理界面
    mainContent.insertAdjacentHTML('afterbegin', contentManagementHTML);
  }

  setupEventListeners() {
    // 标签切换
    document.getElementById('articles-tab')?.addEventListener('click', () => {
      this.switchTab('articles');
    });
    
    document.getElementById('photos-tab')?.addEventListener('click', () => {
      this.switchTab('photos');
    });

    // 新增按钮
    document.getElementById('add-article-btn')?.addEventListener('click', () => {
      this.openEditModal('article', 'new');
    });
    
    document.getElementById('add-photo-btn')?.addEventListener('click', () => {
      this.openEditModal('photo', 'new');
    });

    // 模态框关闭
    document.getElementById('close-modal')?.addEventListener('click', () => {
      this.closeEditModal();
    });

    // 点击背景关闭模态框
    document.getElementById('edit-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'edit-modal') {
        this.closeEditModal();
      }
    });
  }

  switchTab(type) {
    // 更新标签样式
    const articlesTab = document.getElementById('articles-tab');
    const photosTab = document.getElementById('photos-tab');
    
    if (type === 'articles') {
      articlesTab.className = 'px-4 py-2 border-b-2 border-primary text-primary font-medium';
      photosTab.className = 'px-4 py-2 text-gray-600 hover:text-primary transition-colors';
    } else {
      photosTab.className = 'px-4 py-2 border-b-2 border-primary text-primary font-medium';
      articlesTab.className = 'px-4 py-2 text-gray-600 hover:text-primary transition-colors';
    }
    
    // 加载对应内容
    this.loadContentList(type);
  }

  loadContentList(type = 'articles') {
    const contentList = document.getElementById('content-list');
    if (!contentList) return;

    const data = type === 'articles' ? this.articles : this.photos;
    const items = Object.values(data);

    if (items.length === 0) {
      contentList.innerHTML = `
        <div class="text-center py-12 text-gray-500">
          <i class="fa fa-${type === 'articles' ? 'file-text' : 'camera'} text-4xl mb-4"></i>
          <p>暂无${type === 'articles' ? '文章' : '照片'}</p>
        </div>
      `;
      return;
    }

    const itemsHTML = items.map(item => {
      if (type === 'articles') {
        return this.createArticleItem(item);
      } else {
        return this.createPhotoItem(item);
      }
    }).join('');

    contentList.innerHTML = itemsHTML;
  }

  createArticleItem(article) {
    return `
      <div class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start gap-4">
          <img src="${article.image}" alt="${article.title}" class="w-24 h-16 object-cover rounded">
          <div class="flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">${article.title}</h3>
              <div class="flex gap-2">
                <button onclick="window.contentManagement.editContent('article', '${article.id}')" 
                        class="text-blue-600 hover:text-blue-800">
                  <i class="fa fa-edit"></i>
                </button>
                <button onclick="window.contentManagement.deleteContent('article', '${article.id}')" 
                        class="text-red-600 hover:text-red-800">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span class="bg-${this.getCategoryColor(article.category)}-100 text-${this.getCategoryColor(article.category)}-600 px-2 py-1 rounded">${article.category}</span>
              <span>${article.date}</span>
              <span>${article.readTime}</span>
              <span class="capitalize ${article.status === 'published' ? 'text-green-600' : 'text-yellow-600'}">${article.status}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span><i class="fa fa-eye mr-1"></i>${article.views || 0}</span>
              <span><i class="fa fa-heart mr-1"></i>${article.likes || 0}</span>
              <span><i class="fa fa-tags mr-1"></i>${article.tags.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createPhotoItem(photo) {
    return `
      <div class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start gap-4">
          <img src="${photo.thumbnail}" alt="${photo.title}" class="w-24 h-16 object-cover rounded">
          <div class="flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">${photo.title}</h3>
              <div class="flex gap-2">
                <button onclick="window.contentManagement.editContent('photo', '${photo.id}')" 
                        class="text-blue-600 hover:text-blue-800">
                  <i class="fa fa-edit"></i>
                </button>
                <button onclick="window.contentManagement.deleteContent('photo', '${photo.id}')" 
                        class="text-red-600 hover:text-red-800">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span class="bg-green-100 text-green-600 px-2 py-1 rounded">${photo.category}</span>
              <span>${photo.date}</span>
              <span>${photo.location}</span>
              <span class="capitalize ${photo.status === 'published' ? 'text-green-600' : 'text-yellow-600'}">${photo.status}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span><i class="fa fa-eye mr-1"></i>${photo.views || 0}</span>
              <span><i class="fa fa-heart mr-1"></i>${photo.likes || 0}</span>
              <span><i class="fa fa-camera mr-1"></i>${photo.camera}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getCategoryColor(category) {
    const colors = {
      'Python': 'blue',
      'JavaScript': 'yellow',
      '全栈开发': 'green',
      'CSS': 'purple'
    };
    return colors[category] || 'gray';
  }

  editContent(type, id) {
    this.openEditModal(type, 'edit', id);
  }

  deleteContent(type, id) {
    const itemType = type === 'article' ? '文章' : '照片';
    const data = type === 'article' ? this.articles : this.photos;
    const item = data[id];
    
    if (!item) return;
    
    if (confirm(`确定要删除${itemType}"${item.title}"吗？此操作不可撤销。`)) {
      delete data[id];
      
      if (type === 'article') {
        this.saveArticles();
      } else {
        this.savePhotos();
      }
      
      // 刷新列表
      this.loadContentList(type === 'article' ? 'articles' : 'photos');
      
      // 显示成功消息
      this.showNotification(`${itemType}已删除`, 'success');
      
      console.log(`🗑️ ${itemType}已删除:`, item.title);
    }
  }

  openEditModal(type, mode, id = null) {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    this.currentEditingType = type;
    this.currentEditingId = id;
    
    const isEdit = mode === 'edit';
    const itemType = type === 'article' ? '文章' : '照片';
    
    modalTitle.textContent = `${isEdit ? '编辑' : '新增'}${itemType}`;
    
    if (type === 'article') {
      modalContent.innerHTML = this.createArticleForm(isEdit ? this.articles[id] : null);
    } else {
      modalContent.innerHTML = this.createPhotoForm(isEdit ? this.photos[id] : null);
    }

    // 设置表单提交事件
    setTimeout(() => {
      const form = document.getElementById(type === 'article' ? 'article-form' : 'photo-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleFormSubmit(type, mode, id);
        });
      }
    }, 100);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    this.currentEditingType = null;
    this.currentEditingId = null;
  }

  createArticleForm(article = null) {
    const isEdit = article !== null;

    return `
      <form id="article-form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">文章标题 *</label>
            <input type="text" name="title" value="${article?.title || ''}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                   required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">分类 *</label>
            <select name="category" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary" required>
              <option value="">选择分类</option>
              <option value="Python" ${article?.category === 'Python' ? 'selected' : ''}>Python</option>
              <option value="JavaScript" ${article?.category === 'JavaScript' ? 'selected' : ''}>JavaScript</option>
              <option value="全栈开发" ${article?.category === '全栈开发' ? 'selected' : ''}>全栈开发</option>
              <option value="CSS" ${article?.category === 'CSS' ? 'selected' : ''}>CSS</option>
              <option value="其他" ${article?.category === '其他' ? 'selected' : ''}>其他</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">封面图片URL *</label>
            <input type="url" name="image" value="${article?.image || ''}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                   required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">阅读时间</label>
            <input type="text" name="readTime" value="${article?.readTime || ''}"
                   placeholder="如：8分钟阅读"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">标签 (用逗号分隔)</label>
          <input type="text" name="tags" value="${article?.tags?.join(', ') || ''}"
                 placeholder="如：Python, 图像处理, RAW"
                 class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">文章内容 *</label>
          <textarea name="content" rows="12"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="支持HTML格式..." required>${article?.content || ''}</textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">状态</label>
            <select name="status" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="draft" ${article?.status === 'draft' ? 'selected' : ''}>草稿</option>
              <option value="published" ${article?.status === 'published' ? 'selected' : ''}>已发布</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">作者</label>
            <input type="text" name="author" value="${article?.author || '摄影程序员'}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onclick="window.contentManagement.closeEditModal()"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            ${isEdit ? '更新' : '创建'}文章
          </button>
        </div>
      </form>
    `;
  }

  createPhotoForm(photo = null) {
    const isEdit = photo !== null;

    return `
      <form id="photo-form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">照片标题 *</label>
            <input type="text" name="title" value="${photo?.title || ''}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                   required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">分类 *</label>
            <select name="category" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary" required>
              <option value="">选择分类</option>
              <option value="城市摄影" ${photo?.category === '城市摄影' ? 'selected' : ''}>城市摄影</option>
              <option value="风光摄影" ${photo?.category === '风光摄影' ? 'selected' : ''}>风光摄影</option>
              <option value="街头摄影" ${photo?.category === '街头摄影' ? 'selected' : ''}>街头摄影</option>
              <option value="人像摄影" ${photo?.category === '人像摄影' ? 'selected' : ''}>人像摄影</option>
              <option value="建筑摄影" ${photo?.category === '建筑摄影' ? 'selected' : ''}>建筑摄影</option>
              <option value="其他" ${photo?.category === '其他' ? 'selected' : ''}>其他</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">照片URL *</label>
            <input type="url" name="image" value="${photo?.image || ''}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                   required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">缩略图URL</label>
            <input type="url" name="thumbnail" value="${photo?.thumbnail || ''}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">照片描述</label>
          <textarea name="description" rows="3"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="描述这张照片的故事...">${photo?.description || ''}</textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">拍摄地点</label>
            <input type="text" name="location" value="${photo?.location || ''}"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">拍摄日期</label>
            <input type="text" name="date" value="${photo?.date || ''}"
                   placeholder="如：2023年6月10日"
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
          </div>
        </div>

        <!-- EXIF信息 -->
        <div class="border-t pt-6">
          <h4 class="font-medium mb-4">EXIF信息</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">相机</label>
              <input type="text" name="camera" value="${photo?.camera || ''}"
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">镜头</label>
              <input type="text" name="lens" value="${photo?.lens || ''}"
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">焦距</label>
              <input type="text" name="focal" value="${photo?.focal || ''}"
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">光圈</label>
              <input type="text" name="aperture" value="${photo?.aperture || ''}"
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">快门</label>
              <input type="text" name="shutter" value="${photo?.shutter || ''}"
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">ISO</label>
              <input type="text" name="iso" value="${photo?.iso || ''}"
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">标签 (用逗号分隔)</label>
          <input type="text" name="tags" value="${photo?.tags?.join(', ') || ''}"
                 placeholder="如：城市摄影, 夜景, 长曝光"
                 class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">状态</label>
          <select name="status" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <option value="draft" ${photo?.status === 'draft' ? 'selected' : ''}>草稿</option>
            <option value="published" ${photo?.status === 'published' ? 'selected' : ''}>已发布</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onclick="window.contentManagement.closeEditModal()"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            ${isEdit ? '更新' : '创建'}照片
          </button>
        </div>
      </form>
    `;
  }

  handleFormSubmit(type, mode, id) {
    const form = document.getElementById(type === 'article' ? 'article-form' : 'photo-form');
    if (!form) return;

    const formData = new FormData(form);
    const data = {};

    // 收集表单数据
    for (let [key, value] of formData.entries()) {
      if (key === 'tags') {
        data[key] = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else {
        data[key] = value;
      }
    }

    // 生成ID（新建时）
    if (mode === 'new') {
      data.id = this.generateId(data.title);
    } else {
      data.id = id;
    }

    // 添加时间戳
    if (mode === 'new') {
      data.date = new Date().toLocaleDateString('zh-CN');
      data.views = 0;
      data.likes = 0;
    } else {
      // 保留原有的统计数据
      const original = type === 'article' ? this.articles[id] : this.photos[id];
      data.views = original.views || 0;
      data.likes = original.likes || 0;
      if (original.date) data.date = original.date;
    }

    // 处理缩略图（照片）
    if (type === 'photo' && !data.thumbnail && data.image) {
      data.thumbnail = data.image;
    }

    try {
      // 保存数据
      if (type === 'article') {
        this.articles[data.id] = data;
        this.saveArticles();
      } else {
        this.photos[data.id] = data;
        this.savePhotos();
      }

      // 关闭模态框
      this.closeEditModal();

      // 刷新列表
      this.loadContentList(type === 'article' ? 'articles' : 'photos');

      // 显示成功消息
      const itemType = type === 'article' ? '文章' : '照片';
      this.showNotification(`${itemType}${mode === 'new' ? '创建' : '更新'}成功`, 'success');

      // 更新主页内容
      this.updateHomepageContent();

      console.log(`✅ ${itemType}${mode === 'new' ? '创建' : '更新'}成功:`, data.title);

    } catch (error) {
      console.error('保存失败:', error);
      this.showNotification('保存失败，请重试', 'error');
    }
  }

  generateId(title) {
    // 生成基于标题的ID
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now();
  }

  updateHomepageContent() {
    // 更新主页的文章和照片数据
    const homepageData = {
      articles: this.articles,
      photos: this.photos,
      lastUpdate: Date.now()
    };

    // 保存到localStorage供主页使用
    localStorage.setItem('homepage_content', JSON.stringify(homepageData));

    // 如果有前后端桥接，同步到后端
    if (window.frontendBackendBridge) {
      window.frontendBackendBridge.syncData('homepage_content', homepageData);
    }

    console.log('🔄 主页内容已更新');
  }

  // 导出数据功能
  exportData() {
    const data = {
      articles: this.articles,
      photos: this.photos,
      exportTime: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('数据导出成功', 'success');
  }

  // 导入数据功能
  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.articles) {
          this.articles = { ...this.articles, ...data.articles };
          this.saveArticles();
        }

        if (data.photos) {
          this.photos = { ...this.photos, ...data.photos };
          this.savePhotos();
        }

        this.loadContentList();
        this.updateHomepageContent();
        this.showNotification('数据导入成功', 'success');

      } catch (error) {
        console.error('导入失败:', error);
        this.showNotification('数据格式错误，导入失败', 'error');
      }
    };
    reader.readAsText(file);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300`;

    switch (type) {
      case 'success':
        notification.classList.add('bg-green-500');
        break;
      case 'error':
        notification.classList.add('bg-red-500');
        break;
      case 'warning':
        notification.classList.add('bg-yellow-500');
        break;
      default:
        notification.classList.add('bg-blue-500');
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// 全局初始化
window.contentManagement = new ContentManagement();
