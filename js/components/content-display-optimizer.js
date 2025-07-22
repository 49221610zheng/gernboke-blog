// 内容显示优化器 - 优化文章和图片显示，修复链接问题
class ContentDisplayOptimizer {
  constructor() {
    this.currentPage = {
      photography: 1,
      tech: 1,
      diary: 1
    };
    this.itemsPerPage = 6;
    this.totalItems = {
      photography: 12,
      tech: 8,
      diary: 6
    };
    this.init();
  }

  init() {
    this.setupMoreLinksHandlers();
    this.setupImageOptimization();
    this.setupArticleEnhancements();
    this.setupPagination();
    this.setupFilterSystem();
    this.setupLightbox();
    console.log('✅ 内容显示优化器初始化完成');
  }

  // 设置"更多"链接处理器
  setupMoreLinksHandlers() {
    // 修复所有"更多"链接
    document.querySelectorAll('a[href="#"]').forEach(link => {
      const text = link.textContent;
      
      if (text.includes('查看更多摄影作品')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showMorePhotography();
        });
      } else if (text.includes('查看更多技术文章')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showMoreTechArticles();
        });
      } else if (text.includes('查看更多开发日记')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showMoreDiary();
        });
      }
    });
  }

  // 显示更多摄影作品
  showMorePhotography() {
    const section = document.getElementById('photography');
    const container = section.querySelector('.grid');
    
    // 创建更多作品数据
    const morePhotos = this.generateMorePhotos();
    
    // 添加新作品到容器
    morePhotos.forEach(photo => {
      const photoElement = this.createPhotoElement(photo);
      container.appendChild(photoElement);
    });

    // 更新页码
    this.currentPage.photography++;
    
    // 如果没有更多内容，隐藏"更多"按钮
    if (this.currentPage.photography * this.itemsPerPage >= this.totalItems.photography) {
      const moreLink = section.querySelector('a[href="#"]');
      moreLink.style.display = 'none';
    }

    // 显示加载动画
    this.showLoadingAnimation(section);
    
    // 触发新元素动画
    setTimeout(() => {
      this.animateNewElements(container.children);
    }, 300);
  }

  // 显示更多技术文章
  showMoreTechArticles() {
    const section = document.getElementById('tech');
    const container = section.querySelector('.grid');
    
    // 创建更多文章数据
    const moreArticles = this.generateMoreArticles();
    
    // 添加新文章到容器
    moreArticles.forEach(article => {
      const articleElement = this.createArticleElement(article);
      container.appendChild(articleElement);
    });

    // 更新页码
    this.currentPage.tech++;
    
    // 如果没有更多内容，隐藏"更多"按钮
    if (this.currentPage.tech * this.itemsPerPage >= this.totalItems.tech) {
      const moreLink = section.querySelector('a[href="#"]');
      moreLink.style.display = 'none';
    }

    // 显示加载动画
    this.showLoadingAnimation(section);
    
    // 触发新元素动画
    setTimeout(() => {
      this.animateNewElements(container.children);
    }, 300);
  }

  // 显示更多开发日记
  showMoreDiary() {
    const section = document.getElementById('diary');
    const container = section.querySelector('.bg-white.rounded-2xl');
    
    // 创建更多日记数据
    const moreDiary = this.generateMoreDiary();
    
    // 添加新日记到容器
    moreDiary.forEach(diary => {
      const diaryElement = this.createDiaryElement(diary);
      container.appendChild(diaryElement);
    });

    // 更新页码
    this.currentPage.diary++;
    
    // 如果没有更多内容，隐藏"更多"按钮
    if (this.currentPage.diary * this.itemsPerPage >= this.totalItems.diary) {
      const moreLink = section.querySelector('a[href="#"]');
      moreLink.style.display = 'none';
    }

    // 显示加载动画
    this.showLoadingAnimation(section);
  }

  // 生成更多摄影作品
  generateMorePhotos() {
    const categories = ['风光摄影', '人像摄影', '街头摄影', '建筑摄影', '微距摄影', '夜景摄影'];
    const photos = [];
    
    for (let i = 0; i < 3; i++) {
      const randomId = Date.now() + i;
      photos.push({
        id: randomId,
        title: `摄影作品 ${this.currentPage.photography * 3 + i + 1}`,
        description: '用镜头记录生活中的美好瞬间，展现光影的艺术魅力',
        image: `https://picsum.photos/400/300?random=${randomId}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: this.getRandomDate(),
        tags: ['摄影', '艺术', '生活']
      });
    }
    
    return photos;
  }

  // 生成更多技术文章
  generateMoreArticles() {
    const categories = ['前端开发', '后端技术', '移动开发', '数据库', '云计算', 'AI/ML'];
    const articles = [];
    
    for (let i = 0; i < 2; i++) {
      const randomId = Date.now() + i;
      articles.push({
        id: randomId,
        title: `技术文章 ${this.currentPage.tech * 2 + i + 1}`,
        description: '深入探讨现代Web开发技术，分享实战经验和最佳实践',
        image: `https://picsum.photos/400/200?random=${randomId}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        author: '摄影程序员',
        readTime: `${Math.floor(Math.random() * 10) + 5}分钟阅读`,
        date: this.getRandomDate(),
        tags: ['技术', '开发', '编程']
      });
    }
    
    return articles;
  }

  // 生成更多开发日记
  generateMoreDiary() {
    const diary = [];
    
    for (let i = 0; i < 2; i++) {
      diary.push({
        id: Date.now() + i,
        title: `开发日记 ${this.currentPage.diary * 2 + i + 1}`,
        description: '记录开发过程中的思考、挑战和收获',
        date: this.getRandomDate(),
        status: Math.random() > 0.5 ? '进行中' : '已完成',
        progress: Math.floor(Math.random() * 100)
      });
    }
    
    return diary;
  }

  // 创建摄影作品元素
  createPhotoElement(photo) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl overflow-hidden shadow-md card-hover opacity-0 transform translate-y-4';
    div.innerHTML = `
      <div class="aspect-[4/3] image-zoom">
        <img src="${photo.image}" alt="${photo.title}" class="w-full h-full object-cover lazy-load">
      </div>
      <div class="p-5">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold text-lg">${photo.title}</h3>
          <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">${photo.category}</span>
        </div>
        <p class="text-gray-medium text-sm mb-4">${photo.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-medium">${photo.date}</span>
          <button onclick="contentDisplayOptimizer.showPhotoDetail('${photo.id}')" class="text-primary hover:text-primary/80 text-sm font-medium">查看详情 →</button>
        </div>
      </div>
    `;
    return div;
  }

  // 创建技术文章元素
  createArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'bg-light rounded-xl overflow-hidden shadow-sm card-hover flex flex-col md:flex-row opacity-0 transform translate-y-4';
    div.innerHTML = `
      <div class="md:w-1/3 image-zoom">
        <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover lazy-load">
      </div>
      <div class="md:w-2/3 p-6 flex flex-col">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">${article.category}</span>
          ${article.tags.map(tag => `<span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">${tag}</span>`).join('')}
        </div>
        <h3 class="font-semibold text-xl mb-3">${article.title}</h3>
        <p class="text-gray-medium text-sm mb-4 flex-grow">${article.description}</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img src="https://picsum.photos/id/64/100/100" alt="作者头像" class="w-8 h-8 rounded-full">
            <span class="text-sm">${article.author}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-medium">${article.date} · ${article.readTime}</span>
            <button onclick="contentDisplayOptimizer.showArticleDetail('${article.id}')" class="text-primary hover:text-primary/80 text-sm font-medium">阅读全文 →</button>
          </div>
        </div>
      </div>
    `;
    return div;
  }

  // 创建开发日记元素
  createDiaryElement(diary) {
    const div = document.createElement('div');
    div.className = 'border-b border-gray-200 pb-6 mb-6 opacity-0 transform translate-y-4';
    div.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 class="text-xl font-bold mb-2">${diary.title}</h3>
          <p class="text-gray-medium">${diary.description}</p>
        </div>
        <span class="text-sm ${diary.status === '进行中' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'} px-3 py-1 rounded-full inline-flex items-center gap-1">
          <i class="fa ${diary.status === '进行中' ? 'fa-clock-o' : 'fa-check-circle'}"></i>
          ${diary.status}
        </span>
      </div>
      
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">进度</span>
          <span class="text-sm font-medium">${diary.progress}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: ${diary.progress}%"></div>
        </div>
      </div>
      
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>更新时间: ${diary.date}</span>
        <button onclick="contentDisplayOptimizer.showDiaryDetail('${diary.id}')" class="text-primary hover:text-primary/80 font-medium">查看详情 →</button>
      </div>
    `;
    return div;
  }

  // 显示加载动画
  showLoadingAnimation(section) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation text-center py-8';
    loadingDiv.innerHTML = `
      <div class="inline-flex items-center gap-2 text-gray-500">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span>加载更多内容...</span>
      </div>
    `;
    
    section.appendChild(loadingDiv);
    
    setTimeout(() => {
      loadingDiv.remove();
    }, 1000);
  }

  // 动画新元素
  animateNewElements(elements) {
    const newElements = Array.from(elements).slice(-3); // 获取最后3个元素
    
    newElements.forEach((element, index) => {
      if (element.classList.contains('opacity-0')) {
        setTimeout(() => {
          element.classList.remove('opacity-0', 'translate-y-4');
          element.classList.add('opacity-100', 'translate-y-0');
        }, index * 200);
      }
    });
  }

  // 设置图片优化
  setupImageOptimization() {
    // 懒加载图片
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // 观察所有懒加载图片
    document.querySelectorAll('.lazy-load').forEach(img => {
      imageObserver.observe(img);
    });

    // 图片加载错误处理
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=图片加载失败';
      }
    }, true);
  }

  // 设置文章增强
  setupArticleEnhancements() {
    // 阅读时间估算
    document.querySelectorAll('.article-content').forEach(article => {
      const wordCount = article.textContent.split(' ').length;
      const readTime = Math.ceil(wordCount / 200); // 假设每分钟200字
      
      const readTimeElement = article.querySelector('.read-time');
      if (readTimeElement) {
        readTimeElement.textContent = `${readTime}分钟阅读`;
      }
    });

    // 文章摘要截断
    document.querySelectorAll('.article-excerpt').forEach(excerpt => {
      const maxLength = 150;
      if (excerpt.textContent.length > maxLength) {
        excerpt.textContent = excerpt.textContent.substring(0, maxLength) + '...';
      }
    });
  }

  // 设置分页系统
  setupPagination() {
    // 为每个部分添加分页控制
    ['photography', 'tech', 'diary'].forEach(section => {
      this.createPaginationControls(section);
    });
  }

  // 创建分页控制
  createPaginationControls(sectionId) {
    const section = document.getElementById(sectionId);
    const moreLink = section.querySelector('a[href="#"]');
    
    if (moreLink) {
      // 在"更多"链接旁边添加页码信息
      const pageInfo = document.createElement('span');
      pageInfo.className = 'page-info text-sm text-gray-500 ml-4';
      pageInfo.textContent = `第 ${this.currentPage[sectionId]} 页`;
      
      moreLink.parentNode.appendChild(pageInfo);
    }
  }

  // 设置过滤系统
  setupFilterSystem() {
    // 为摄影作品添加分类过滤
    const photographySection = document.getElementById('photography');
    if (photographySection) {
      this.createCategoryFilter(photographySection, 'photography');
    }

    // 为技术文章添加分类过滤
    const techSection = document.getElementById('tech');
    if (techSection) {
      this.createCategoryFilter(techSection, 'tech');
    }
  }

  // 创建分类过滤器
  createCategoryFilter(section, type) {
    const categories = {
      photography: ['全部', '风光摄影', '人像摄影', '街头摄影', '建筑摄影'],
      tech: ['全部', '前端开发', '后端技术', '移动开发', '数据库']
    };

    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container flex flex-wrap justify-center gap-2 mb-8';
    
    categories[type].forEach(category => {
      const button = document.createElement('button');
      button.className = `filter-btn px-4 py-2 rounded-full text-sm transition-colors ${
        category === '全部' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`;
      button.textContent = category;
      button.addEventListener('click', () => this.filterContent(type, category, button));
      filterContainer.appendChild(button);
    });

    // 插入到标题后面
    const title = section.querySelector('h2').parentNode;
    title.parentNode.insertBefore(filterContainer, title.nextSibling);
  }

  // 过滤内容
  filterContent(type, category, activeButton) {
    // 更新按钮状态
    const filterContainer = activeButton.parentNode;
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.className = 'filter-btn px-4 py-2 rounded-full text-sm transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200';
    });
    activeButton.className = 'filter-btn px-4 py-2 rounded-full text-sm transition-colors bg-primary text-white';

    // 过滤内容项
    const section = document.getElementById(type);
    const items = section.querySelectorAll('.card-hover');
    
    items.forEach(item => {
      const itemCategory = item.querySelector('.rounded-full')?.textContent || '';
      
      if (category === '全部' || itemCategory === category) {
        item.style.display = 'block';
        item.classList.add('filter-show');
      } else {
        item.style.display = 'none';
        item.classList.remove('filter-show');
      }
    });
  }

  // 设置灯箱效果
  setupLightbox() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.image-zoom img')) {
        const img = e.target;
        this.openLightbox(img.src, img.alt);
      }
    });
  }

  // 打开灯箱
  openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    lightbox.innerHTML = `
      <div class="relative max-w-4xl max-h-full p-4">
        <img src="${src}" alt="${alt}" class="max-w-full max-h-full object-contain">
        <button class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors" onclick="this.closest('.lightbox').remove()">
          <i class="fas fa-times"></i>
        </button>
        <div class="absolute bottom-4 left-4 right-4 text-white text-center">
          <p class="text-lg font-medium">${alt}</p>
        </div>
      </div>
    `;

    document.body.appendChild(lightbox);

    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.remove();
      }
    });

    // ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        lightbox.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  // 显示详情方法
  showPhotoDetail(id) {
    console.log('显示摄影作品详情:', id);
    // 这里可以集成之前的点击处理器
    if (window.clickHandlers) {
      // 触发现有的详情显示
      const photoCards = document.querySelectorAll('#photography .card-hover');
      const targetCard = Array.from(photoCards).find(card => 
        card.querySelector('button')?.onclick?.toString().includes(id)
      );
      if (targetCard && window.clickHandlers.showPhotoDetail) {
        window.clickHandlers.showPhotoDetail(targetCard, 0);
      }
    }
  }

  showArticleDetail(id) {
    console.log('显示技术文章详情:', id);
    // 这里可以集成之前的点击处理器
    if (window.clickHandlers) {
      const articleCards = document.querySelectorAll('#tech .card-hover');
      const targetCard = Array.from(articleCards).find(card => 
        card.querySelector('button')?.onclick?.toString().includes(id)
      );
      if (targetCard && window.clickHandlers.showArticleDetail) {
        window.clickHandlers.showArticleDetail(targetCard, 0);
      }
    }
  }

  showDiaryDetail(id) {
    console.log('显示开发日记详情:', id);
    // 可以显示日记详情模态框
    this.showMessage('开发日记详情功能开发中...', 'info');
  }

  // 工具方法
  getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toLocaleDateString('zh-CN');
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}

// 导出到全局
window.ContentDisplayOptimizer = ContentDisplayOptimizer;
