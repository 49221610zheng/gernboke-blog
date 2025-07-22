// 主应用程序文件 - 前台功能
import moduleLoader, { loadModule } from './utils/module-loader.js';

// 应用程序状态管理
class App {
  constructor() {
    this.services = {};
    this.stateManager = null;
    this.errorHandler = null;

    this.init();
  }

  // 初始化应用
  async init() {
    try {
      // 加载核心模块
      await this.loadCoreModules();

      // 设置初始状态
      this.setupInitialState();

      // 设置事件监听器
      this.setupEventListeners();

      // 加载初始数据
      await this.loadInitialData();

      // 设置交叉观察器
      this.setupIntersectionObserver();

    } catch (error) {
      console.error('App initialization error:', error);
      this.showError('应用初始化失败，请刷新页面重试');
    }
  }

  // 加载核心模块
  async loadCoreModules() {
    try {
      this.stateManager = await loadModule('stateManager');
      this.errorHandler = await loadModule('errorHandler');

      const databaseService = await loadModule('databaseService');
      this.services.photography = databaseService.photographyService;
      this.services.article = databaseService.articleService;

    } catch (error) {
      console.error('Failed to load core modules:', error);
      throw new Error('核心模块加载失败');
    }
  }

  // 设置初始状态
  setupInitialState() {
    this.stateManager.setState({
      photography: [],
      articles: [],
      currentPage: 1,
      hasMore: true
    });

    // 监听状态变化
    this.stateManager.subscribe('loading', (loading) => {
      this.updateLoadingUI(loading);
    });

    this.stateManager.subscribe('error', (error) => {
      if (error) {
        this.showError(error);
      }
    });
  }
  
  // 设置事件监听器
  setupEventListeners() {
    // 导航菜单切换
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
    
    // 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('shadow-md');
          navbar.classList.remove('shadow-sm');
        } else {
          navbar.classList.remove('shadow-md');
          navbar.classList.add('shadow-sm');
        }
      });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 关闭移动菜单
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // 返回顶部按钮
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.remove('opacity-0', 'invisible');
          backToTopButton.classList.add('opacity-100', 'visible');
        } else {
          backToTopButton.classList.add('opacity-0', 'invisible');
          backToTopButton.classList.remove('opacity-100', 'visible');
        }
      });
      
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  // 加载初始数据
  async loadInitialData() {
    this.stateManager.set('loading', true);

    try {
      // 并行加载摄影作品和文章
      const [photography, articles] = await Promise.all([
        this.services.photography.getList(1, 6),
        this.services.article.getList(1, 4)
      ]);

      this.stateManager.batch({
        photography,
        articles,
        loading: false
      });

      this.renderPhotography();
      this.renderArticles();

    } catch (error) {
      console.error('Error loading initial data:', error);
      this.stateManager.batch({
        error: '加载内容失败，请检查网络连接',
        loading: false
      });
    }
  }
  
  // 渲染摄影作品
  renderPhotography() {
    const container = document.querySelector('#photography .grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.state.photography.forEach(photo => {
      const photoElement = this.createPhotoElement(photo);
      container.appendChild(photoElement);
    });
  }
  
  // 创建摄影作品元素
  createPhotoElement(photo) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl overflow-hidden shadow-md card-hover';
    
    div.innerHTML = `
      <div class="aspect-[4/3] image-zoom">
        <img src="${photo.thumbnailUrl || photo.imageUrl}" 
             alt="${photo.title}" 
             class="w-full h-full object-cover"
             loading="lazy">
      </div>
      <div class="p-5">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold text-lg">${photo.title}</h3>
          <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            ${this.getCategoryDisplayName(photo.category)}
          </span>
        </div>
        <p class="text-gray-medium text-sm mb-4">${photo.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-medium">
            ${this.formatDate(photo.createdAt)}
          </span>
          <button class="text-primary hover:text-primary/80 text-sm font-medium view-detail-btn" 
                  data-id="${photo.id}" data-type="photography">
            查看详情 →
          </button>
        </div>
      </div>
    `;
    
    // 添加点击事件
    const viewBtn = div.querySelector('.view-detail-btn');
    viewBtn.addEventListener('click', () => this.viewPhotoDetail(photo.id));
    
    return div;
  }
  
  // 渲染文章
  renderArticles() {
    const container = document.querySelector('#tech .grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.state.articles.forEach(article => {
      const articleElement = this.createArticleElement(article);
      container.appendChild(articleElement);
    });
  }
  
  // 创建文章元素
  createArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'bg-light rounded-xl overflow-hidden shadow-sm card-hover flex flex-col md:flex-row';
    
    div.innerHTML = `
      <div class="md:w-1/3 image-zoom">
        <img src="${article.coverImageUrl || 'https://picsum.photos/600/600'}" 
             alt="${article.title}" 
             class="w-full h-full object-cover"
             loading="lazy">
      </div>
      <div class="md:w-2/3 p-6 flex flex-col">
        <div class="flex items-center gap-2 mb-3">
          ${article.tags ? article.tags.map(tag => 
            `<span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">${tag}</span>`
          ).join('') : ''}
        </div>
        <h3 class="font-semibold text-xl mb-3">${article.title}</h3>
        <p class="text-gray-medium text-sm mb-4 flex-grow">${article.excerpt}</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img src="${article.author?.avatarUrl || 'https://picsum.photos/id/64/100/100'}" 
                 alt="作者头像" 
                 class="w-8 h-8 rounded-full">
            <span class="text-sm">${article.author?.name || '摄影程序员'}</span>
          </div>
          <span class="text-sm text-gray-medium">
            ${this.formatDate(article.createdAt)} · ${article.readTime || 5}分钟阅读
          </span>
        </div>
      </div>
    `;
    
    // 添加点击事件
    div.addEventListener('click', () => this.viewArticleDetail(article.id));
    div.style.cursor = 'pointer';
    
    return div;
  }
  
  // 查看摄影作品详情
  async viewPhotoDetail(id) {
    try {
      // 增加浏览次数
      await photographyService.incrementView(id);
      
      // 这里可以打开模态框或跳转到详情页
      console.log('View photo detail:', id);
      // TODO: 实现详情页面
    } catch (error) {
      console.error('Error viewing photo detail:', error);
    }
  }
  
  // 查看文章详情
  async viewArticleDetail(id) {
    try {
      // 增加浏览次数
      await articleService.incrementView(id);
      
      // 这里可以打开模态框或跳转到详情页
      console.log('View article detail:', id);
      // TODO: 实现详情页面
    } catch (error) {
      console.error('Error viewing article detail:', error);
    }
  }
  
  // 设置加载状态
  setLoading(loading) {
    this.state.loading = loading;
    
    // 可以在这里显示/隐藏加载指示器
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(el => {
      el.style.display = loading ? 'block' : 'none';
    });
  }
  
  // 显示错误信息
  showError(message) {
    this.state.error = message;
    
    // 创建错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 3000);
  }
  
  // 设置交叉观察器（用于懒加载）
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      // 观察所有带有 data-src 的图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  // 格式化日期
  formatDate(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  // 获取分类显示名称
  getCategoryDisplayName(category) {
    const categoryMap = {
      'landscape': '风光摄影',
      'city': '城市摄影',
      'portrait': '人像摄影',
      'street': '街头摄影',
      'architecture': '建筑摄影'
    };
    
    return categoryMap[category] || category;
  }
}

// 当 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// 导出应用实例
export default App;
