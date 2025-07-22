// 搜索系统
class SearchSystem {
  constructor() {
    this.searchIndex = [];
    this.searchResults = [];
    this.isSearching = false;
    this.searchHistory = this.loadSearchHistory();
    this.init();
  }
  
  init() {
    this.buildSearchIndex();
    this.bindEvents();
    this.renderSearchInterface();
  }
  
  async buildSearchIndex() {
    try {
      // 构建搜索索引
      const [articles, photos] = await Promise.all([
        this.getArticles(),
        this.getPhotos()
      ]);
      
      this.searchIndex = [
        ...articles.map(article => ({
          type: 'article',
          id: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags || [],
          url: `/article/${article.id}`,
          image: article.coverImage,
          date: article.publishedAt || article.createdAt
        })),
        ...photos.map(photo => ({
          type: 'photo',
          id: photo.id,
          title: photo.title,
          content: photo.description,
          category: photo.category,
          tags: photo.tags || [],
          url: `/photo/${photo.id}`,
          image: photo.imageUrl,
          date: photo.createdAt
        }))
      ];
      
      console.log(`✅ 搜索索引构建完成，共 ${this.searchIndex.length} 项内容`);
    } catch (error) {
      console.error('构建搜索索引失败:', error);
    }
  }
  
  async getArticles() {
    if (window.databaseService && window.databaseService.articleService) {
      return await window.databaseService.articleService.getPublished();
    }
    return [];
  }
  
  async getPhotos() {
    if (window.databaseService && window.databaseService.photographyService) {
      return await window.databaseService.photographyService.getAll();
    }
    return [];
  }
  
  renderSearchInterface() {
    // 检查是否已存在搜索界面
    if (document.getElementById('search-overlay')) return;
    
    const searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden';
    searchOverlay.innerHTML = `
      <div class="flex items-start justify-center min-h-screen pt-16 px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <!-- 搜索头部 -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-4">
              <div class="flex-1 relative">
                <input type="text" id="search-input" 
                       placeholder="搜索文章、摄影作品..." 
                       class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <button onclick="searchSystem.closeSearch()" 
                      class="p-2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <!-- 搜索筛选 -->
            <div class="flex items-center space-x-4 mt-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">类型:</label>
                <select id="search-type" onchange="searchSystem.filterResults()" 
                        class="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="all">全部</option>
                  <option value="article">文章</option>
                  <option value="photo">摄影</option>
                </select>
              </div>
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">排序:</label>
                <select id="search-sort" onchange="searchSystem.sortResults()" 
                        class="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="relevance">相关性</option>
                  <option value="date">时间</option>
                  <option value="title">标题</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 搜索内容 -->
          <div class="max-h-96 overflow-y-auto">
            <div id="search-content" class="p-6">
              ${this.renderSearchHome()}
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(searchOverlay);
  }
  
  renderSearchHome() {
    return `
      <div class="search-home">
        <!-- 搜索提示 -->
        <div class="text-center mb-8">
          <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">搜索内容</h3>
          <p class="text-gray-600">输入关键词搜索文章和摄影作品</p>
        </div>
        
        <!-- 搜索历史 -->
        ${this.searchHistory.length > 0 ? `
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-gray-900">搜索历史</h4>
              <button onclick="searchSystem.clearHistory()" 
                      class="text-sm text-gray-500 hover:text-gray-700">
                清除
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              ${this.searchHistory.map(term => `
                <button onclick="searchSystem.searchFromHistory('${term}')" 
                        class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  ${term}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- 热门标签 -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-900 mb-3">热门标签</h4>
          <div class="flex flex-wrap gap-2">
            ${this.getPopularTags().map(tag => `
              <button onclick="searchSystem.searchByTag('${tag}')" 
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                #${tag}
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- 快速搜索 -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">快速搜索</h4>
          <div class="grid grid-cols-2 gap-3">
            <button onclick="searchSystem.quickSearch('最新文章')" 
                    class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-newspaper text-blue-500 mr-3"></i>
              <span class="text-sm text-gray-700">最新文章</span>
            </button>
            <button onclick="searchSystem.quickSearch('摄影作品')" 
                    class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-camera text-green-500 mr-3"></i>
              <span class="text-sm text-gray-700">摄影作品</span>
            </button>
            <button onclick="searchSystem.quickSearch('技术文章')" 
                    class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-code text-purple-500 mr-3"></i>
              <span class="text-sm text-gray-700">技术文章</span>
            </button>
            <button onclick="searchSystem.quickSearch('开发日记')" 
                    class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-book text-orange-500 mr-3"></i>
              <span class="text-sm text-gray-700">开发日记</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  renderSearchResults() {
    if (this.searchResults.length === 0) {
      return `
        <div class="text-center py-8">
          <i class="fas fa-search text-3xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">未找到相关内容</h3>
          <p class="text-gray-600">尝试使用其他关键词或检查拼写</p>
        </div>
      `;
    }
    
    return `
      <div class="search-results">
        <div class="mb-4">
          <p class="text-sm text-gray-600">找到 ${this.searchResults.length} 个结果</p>
        </div>
        
        <div class="space-y-4">
          ${this.searchResults.map(result => this.renderSearchResult(result)).join('')}
        </div>
      </div>
    `;
  }
  
  renderSearchResult(result) {
    const typeIcon = result.type === 'article' ? 'fas fa-newspaper' : 'fas fa-camera';
    const typeColor = result.type === 'article' ? 'text-blue-500' : 'text-green-500';
    const typeName = result.type === 'article' ? '文章' : '摄影';
    
    return `
      <div class="search-result-item p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
           onclick="searchSystem.openResult('${result.url}')">
        <div class="flex space-x-4">
          ${result.image ? `
            <div class="flex-shrink-0">
              <img src="${result.image}" alt="${result.title}" 
                   class="w-16 h-16 object-cover rounded-lg">
            </div>
          ` : ''}
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-2">
              <i class="${typeIcon} ${typeColor}"></i>
              <span class="text-xs text-gray-500 uppercase">${typeName}</span>
              ${result.category ? `
                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  ${result.category}
                </span>
              ` : ''}
            </div>
            
            <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
              ${this.highlightSearchTerm(result.title)}
            </h3>
            
            <p class="text-sm text-gray-600 line-clamp-2 mb-2">
              ${this.highlightSearchTerm(result.excerpt || result.content || '')}
            </p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>${this.formatDate(result.date)}</span>
              ${result.tags && result.tags.length > 0 ? `
                <div class="flex space-x-1">
                  ${result.tags.slice(0, 3).map(tag => `
                    <span class="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                      #${tag}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    // 绑定键盘快捷键
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
      
      // ESC 关闭搜索
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });
    
    // 点击搜索按钮
    document.addEventListener('click', (e) => {
      if (e.target.closest('.search-trigger')) {
        e.preventDefault();
        this.openSearch();
      }
    });
    
    // 搜索输入事件
    document.addEventListener('input', (e) => {
      if (e.target.id === 'search-input') {
        this.handleSearchInput(e.target.value);
      }
    });
    
    // 点击遮罩关闭
    document.addEventListener('click', (e) => {
      if (e.target.id === 'search-overlay') {
        this.closeSearch();
      }
    });
  }
  
  openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      const input = document.getElementById('search-input');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }
  
  closeSearch() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      this.clearSearchInput();
    }
  }
  
  clearSearchInput() {
    const input = document.getElementById('search-input');
    if (input) {
      input.value = '';
      this.updateSearchContent(this.renderSearchHome());
    }
  }
  
  handleSearchInput(query) {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length === 0) {
      this.updateSearchContent(this.renderSearchHome());
      return;
    }
    
    if (trimmedQuery.length < 2) {
      return; // 至少2个字符才开始搜索
    }
    
    // 防抖搜索
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch(trimmedQuery);
    }, 300);
  }
  
  performSearch(query) {
    this.isSearching = true;
    this.updateSearchContent('<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i></div>');
    
    // 模拟搜索延迟
    setTimeout(() => {
      this.searchResults = this.searchInIndex(query);
      this.updateSearchContent(this.renderSearchResults());
      this.addToSearchHistory(query);
      this.isSearching = false;
    }, 500);
  }
  
  searchInIndex(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return this.searchIndex
      .map(item => {
        let score = 0;
        const searchableText = `${item.title} ${item.content} ${item.category} ${item.tags.join(' ')}`.toLowerCase();
        
        // 计算相关性分数
        searchTerms.forEach(term => {
          // 标题匹配权重更高
          if (item.title.toLowerCase().includes(term)) {
            score += 10;
          }
          
          // 内容匹配
          if (item.content && item.content.toLowerCase().includes(term)) {
            score += 5;
          }
          
          // 分类匹配
          if (item.category && item.category.toLowerCase().includes(term)) {
            score += 8;
          }
          
          // 标签匹配
          if (item.tags.some(tag => tag.toLowerCase().includes(term))) {
            score += 6;
          }
        });
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }
  
  filterResults() {
    const type = document.getElementById('search-type').value;
    let filteredResults = [...this.searchResults];
    
    if (type !== 'all') {
      filteredResults = filteredResults.filter(result => result.type === type);
    }
    
    this.updateSearchContent(this.renderFilteredResults(filteredResults));
  }
  
  sortResults() {
    const sort = document.getElementById('search-sort').value;
    let sortedResults = [...this.searchResults];
    
    switch (sort) {
      case 'date':
        sortedResults.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'title':
        sortedResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
      default:
        sortedResults.sort((a, b) => b.score - a.score);
        break;
    }
    
    this.searchResults = sortedResults;
    this.updateSearchContent(this.renderSearchResults());
  }
  
  renderFilteredResults(results) {
    if (results.length === 0) {
      return `
        <div class="text-center py-8">
          <i class="fas fa-filter text-3xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">该类型下无结果</h3>
          <p class="text-gray-600">尝试选择其他类型或修改搜索条件</p>
        </div>
      `;
    }
    
    return `
      <div class="search-results">
        <div class="mb-4">
          <p class="text-sm text-gray-600">找到 ${results.length} 个结果</p>
        </div>
        
        <div class="space-y-4">
          ${results.map(result => this.renderSearchResult(result)).join('')}
        </div>
      </div>
    `;
  }
  
  updateSearchContent(content) {
    const container = document.getElementById('search-content');
    if (container) {
      container.innerHTML = content;
    }
  }
  
  highlightSearchTerm(text) {
    const input = document.getElementById('search-input');
    if (!input || !input.value.trim()) return text;
    
    const query = input.value.trim();
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  }
  
  searchFromHistory(term) {
    const input = document.getElementById('search-input');
    if (input) {
      input.value = term;
      this.performSearch(term);
    }
  }
  
  searchByTag(tag) {
    const input = document.getElementById('search-input');
    if (input) {
      input.value = tag;
      this.performSearch(tag);
    }
  }
  
  quickSearch(type) {
    const input = document.getElementById('search-input');
    if (input) {
      input.value = type;
      this.performSearch(type);
    }
  }
  
  openResult(url) {
    this.closeSearch();
    // 这里应该根据URL类型进行相应的跳转
    console.log('打开结果:', url);
  }
  
  addToSearchHistory(query) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 10); // 只保留最近10个
      this.saveSearchHistory();
    }
  }
  
  clearHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
    this.updateSearchContent(this.renderSearchHome());
  }
  
  loadSearchHistory() {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      return [];
    }
  }
  
  saveSearchHistory() {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  }
  
  getPopularTags() {
    // 从搜索索引中提取热门标签
    const tagCount = {};
    this.searchIndex.forEach(item => {
      item.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([tag]) => tag);
  }
  
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// 导出到全局
window.SearchSystem = SearchSystem;
