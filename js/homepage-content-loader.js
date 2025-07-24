// 主页内容动态加载系统
// 从管理端同步内容到主页显示

class HomepageContentLoader {
  constructor() {
    this.articles = {};
    this.photos = {};
    this.isLoaded = false;
    
    this.init();
  }

  init() {
    // 加载内容数据
    this.loadContent();
    
    // 监听存储变化
    this.setupStorageListener();
    
    console.log('🏠 主页内容加载器已初始化');
  }

  loadContent() {
    try {
      // 从localStorage加载管理端更新的内容
      const homepageData = localStorage.getItem('homepage_content');
      if (homepageData) {
        const data = JSON.parse(homepageData);
        this.articles = data.articles || {};
        this.photos = data.photos || {};
        console.log('📄 从管理端加载内容:', Object.keys(this.articles).length, '篇文章,', Object.keys(this.photos).length, '张照片');
      } else {
        // 加载默认内容
        this.loadDefaultContent();
      }

      // 更新页面内容
      this.updatePageContent();
      this.isLoaded = true;

    } catch (error) {
      console.error('❌ 内容加载失败:', error);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent() {
    // 默认文章数据
    this.articles = {
      'python-raw-processing': {
        id: 'python-raw-processing',
        title: '使用Python批量处理RAW照片',
        category: 'Python',
        image: 'https://picsum.photos/id/0/300/300',
        date: '2023-06-12',
        readTime: '8分钟阅读',
        author: '摄影程序员',
        tags: ['Python', '图像处理', 'RAW', '摄影', '自动化'],
        content: '介绍如何利用Python的RawPy库处理RAW格式照片，批量调整参数、转换格式，提高摄影后期效率。',
        status: 'published'
      },
      'javascript-async': {
        id: 'javascript-async',
        title: 'JavaScript异步编程全解析',
        category: 'JavaScript',
        image: 'https://picsum.photos/id/180/300/300',
        date: '2023-06-05',
        readTime: '12分钟阅读',
        author: '摄影程序员',
        tags: ['JavaScript', '异步编程', 'Promise', 'async/await'],
        content: '从回调函数到Promise，再到async/await，全面解析JavaScript异步编程的演进和最佳实践。',
        status: 'published'
      },
      'photography-management': {
        id: 'photography-management',
        title: '摄影作品管理系统设计思路',
        category: '全栈开发',
        image: 'https://picsum.photos/id/96/300/300',
        date: '2023-05-28',
        readTime: '15分钟阅读',
        author: '摄影程序员',
        tags: ['全栈开发', '项目设计', '数据库', 'API'],
        content: '分享如何设计和开发一个个人摄影作品管理系统，包括数据库设计、API开发和前端展示。',
        status: 'published'
      },
      'css-layout': {
        id: 'css-layout',
        title: '现代CSS布局技巧与实践',
        category: 'CSS',
        image: 'https://picsum.photos/id/48/300/300',
        date: '2023-05-18',
        readTime: '10分钟阅读',
        author: '摄影程序员',
        tags: ['CSS', '响应式设计', 'Grid', 'Flexbox'],
        content: '探讨Grid和Flexbox在现代网页布局中的应用，以及如何构建灵活且响应式的界面设计。',
        status: 'published'
      }
    };

    // 默认照片数据
    this.photos = {
      'city-night': {
        id: 'city-night',
        title: '城市夜景',
        description: '繁华都市的夜晚，霓虹灯光与车流交织成美丽的光影画卷',
        image: 'https://picsum.photos/id/29/400/300',
        date: '2023-06-10',
        category: '城市摄影',
        status: 'published'
      },
      'mountain-lake': {
        id: 'mountain-lake',
        title: '山间湖泊',
        description: '清晨薄雾中的高山湖泊，宁静致远的自然美景',
        image: 'https://picsum.photos/id/15/400/300',
        date: '2023-05-28',
        category: '风光摄影',
        status: 'published'
      },
      'street-moment': {
        id: 'street-moment',
        title: '街头瞬间',
        description: '城市街头的生动瞬间，记录平凡生活中的不平凡',
        image: 'https://picsum.photos/id/1062/400/300',
        date: '2023-05-15',
        category: '街头摄影',
        status: 'published'
      }
    };

    console.log('📄 加载默认内容');
  }

  setupStorageListener() {
    // 监听localStorage变化
    window.addEventListener('storage', (e) => {
      if (e.key === 'homepage_content') {
        console.log('🔄 检测到内容更新，重新加载');
        this.loadContent();
      }
    });

    // 监听自定义事件（同页面更新）
    window.addEventListener('contentUpdated', () => {
      console.log('🔄 收到内容更新事件');
      this.loadContent();
    });
  }

  updatePageContent() {
    // 更新技术分享部分
    this.updateTechSection();
    
    // 更新摄影作品部分
    this.updatePhotographySection();
    
    // 更新统计数据
    this.updateStats();
  }

  updateTechSection() {
    const publishedArticles = Object.values(this.articles)
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4); // 只显示最新的4篇

    const techContainer = document.querySelector('#tech .grid');
    if (!techContainer || publishedArticles.length === 0) return;

    const articlesHTML = publishedArticles.map(article => {
      const categoryColor = this.getCategoryColor(article.category);
      
      return `
        <a href="article-detail.html?id=${article.id}" class="bg-light rounded-xl overflow-hidden shadow-sm card-hover flex flex-col md:flex-row group">
          <div class="md:w-1/3 image-zoom">
            <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
          </div>
          <div class="md:w-2/3 p-6 flex flex-col">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs bg-${categoryColor}-100 text-${categoryColor}-600 px-2 py-0.5 rounded-full">${article.category}</span>
              <span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">${article.tags[0] || '技术'}</span>
            </div>
            <h3 class="font-semibold text-xl mb-3 group-hover:text-primary transition-colors">${article.title}</h3>
            <p class="text-gray-medium text-sm mb-4 flex-grow">
              ${article.content.substring(0, 100)}...
            </p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img src="https://picsum.photos/id/64/64/64" alt="作者头像" class="w-8 h-8 rounded-full">
                <span class="text-sm">${article.author}</span>
              </div>
              <span class="text-sm text-gray-medium">${article.date} · ${article.readTime}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    techContainer.innerHTML = articlesHTML;
    console.log('📝 技术分享部分已更新');
  }

  updatePhotographySection() {
    const publishedPhotos = Object.values(this.photos)
      .filter(photo => photo.status === 'published')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3); // 只显示最新的3张

    const photoContainer = document.querySelector('#photography .grid');
    if (!photoContainer || publishedPhotos.length === 0) return;

    const photosHTML = publishedPhotos.map(photo => {
      return `
        <div class="bg-white rounded-xl overflow-hidden shadow-sm card-hover">
          <div class="aspect-[4/3] overflow-hidden image-zoom">
            <img src="${photo.image}" alt="${photo.title}" class="w-full h-full object-cover">
          </div>
          <div class="p-6">
            <div class="flex justify-between items-center mb-3">
              <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">${photo.category}</span>
              <span class="text-xs text-gray-medium">${photo.date}</span>
            </div>
            <h3 class="font-semibold text-lg mb-2">${photo.title}</h3>
            <p class="text-gray-medium text-sm mb-4">
              ${photo.description}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-medium">${photo.date}</span>
              <a href="photo-detail.html?id=${photo.id}" class="text-primary hover:text-primary/80 text-sm font-medium">查看详情 →</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    photoContainer.innerHTML = photosHTML;
    console.log('📸 摄影作品部分已更新');
  }

  updateStats() {
    // 更新特色分类的数量
    const publishedArticles = Object.values(this.articles).filter(a => a.status === 'published');
    const publishedPhotos = Object.values(this.photos).filter(p => p.status === 'published');

    // 按分类统计照片
    const photoCategories = {};
    publishedPhotos.forEach(photo => {
      photoCategories[photo.category] = (photoCategories[photo.category] || 0) + 1;
    });

    // 更新统计卡片
    const statsCards = document.querySelectorAll('.stats-card');
    if (statsCards.length >= 4) {
      // 风光摄影
      const landscapeCount = photoCategories['风光摄影'] || 0;
      if (statsCards[0]) {
        const countElement = statsCards[0].querySelector('h3');
        if (countElement) countElement.textContent = landscapeCount;
      }

      // 城市夜景
      const cityCount = photoCategories['城市摄影'] || 0;
      if (statsCards[1]) {
        const countElement = statsCards[1].querySelector('h3');
        if (countElement) countElement.textContent = cityCount;
      }

      // 技术分享
      if (statsCards[2]) {
        const countElement = statsCards[2].querySelector('h3');
        if (countElement) countElement.textContent = publishedArticles.length;
      }

      // 开发日记（可以是特定分类的文章）
      const devDiaryCount = publishedArticles.filter(a => a.category === '全栈开发').length;
      if (statsCards[3]) {
        const countElement = statsCards[3].querySelector('h3');
        if (countElement) countElement.textContent = devDiaryCount;
      }
    }

    console.log('📊 统计数据已更新');
  }

  getCategoryColor(category) {
    const colors = {
      'Python': 'blue',
      'JavaScript': 'yellow',
      '全栈开发': 'green',
      'CSS': 'purple',
      '其他': 'gray'
    };
    return colors[category] || 'gray';
  }

  // 公共API
  getArticles() {
    return this.articles;
  }

  getPhotos() {
    return this.photos;
  }

  getArticle(id) {
    return this.articles[id];
  }

  getPhoto(id) {
    return this.photos[id];
  }

  isContentLoaded() {
    return this.isLoaded;
  }
}

// 全局初始化
document.addEventListener('DOMContentLoaded', () => {
  window.homepageContentLoader = new HomepageContentLoader();
});
