// 文章阅读器系统 - 提供沉浸式的文章阅读体验
class ArticleReader {
  constructor() {
    this.currentArticle = null;
    this.readingProgress = 0;
    this.fontSize = 16;
    this.lineHeight = 1.6;
    this.theme = 'light';
    this.init();
  }

  init() {
    this.setupArticleHandlers();
    this.setupReadingFeatures();
    this.loadUserPreferences();
    console.log('✅ 文章阅读器初始化完成');
  }

  // 设置文章处理器
  setupArticleHandlers() {
    // 为所有文章添加阅读器功能
    document.querySelectorAll('#tech .card-hover, #diary .border-b').forEach((article, index) => {
      const readButton = article.querySelector('button, a');
      if (readButton) {
        readButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.openArticleReader(article, index);
        });
      }
    });
  }

  // 打开文章阅读器
  openArticleReader(articleElement, index) {
    // 提取文章信息
    const articleData = this.extractArticleData(articleElement);
    this.currentArticle = articleData;
    
    // 创建阅读器界面
    this.createReaderInterface(articleData);
    
    // 开始跟踪阅读进度
    this.startProgressTracking();
  }

  // 提取文章数据
  extractArticleData(element) {
    const title = element.querySelector('h3')?.textContent || '文章标题';
    const description = element.querySelector('p')?.textContent || '文章描述';
    const image = element.querySelector('img')?.src || '';
    const author = element.querySelector('.flex.items-center span')?.textContent || '摄影程序员';
    const date = element.querySelector('.text-sm.text-gray-medium')?.textContent?.split('·')[0]?.trim() || '2023-06-01';
    const readTime = element.querySelector('.text-sm.text-gray-medium')?.textContent?.split('·')[1]?.trim() || '5分钟阅读';
    const category = element.querySelector('.rounded-full')?.textContent || '技术分享';

    return {
      title,
      description,
      image,
      author,
      date,
      readTime,
      category,
      content: this.generateArticleContent(title, description)
    };
  }

  // 生成文章内容
  generateArticleContent(title, description) {
    return `
      <h1>${title}</h1>
      
      <p class="lead">${description}</p>
      
      <h2>引言</h2>
      <p>在现代Web开发中，技术的快速发展要求我们不断学习和适应新的工具和方法。本文将深入探讨相关技术的核心概念和实际应用。</p>
      
      <h2>核心概念</h2>
      <p>理解基础概念是掌握任何技术的第一步。让我们从最基本的原理开始，逐步深入到更复杂的应用场景。</p>
      
      <blockquote>
        <p>"技术的价值不在于其复杂性，而在于它能解决实际问题的能力。"</p>
      </blockquote>
      
      <h3>关键特性</h3>
      <ul>
        <li><strong>性能优化</strong>：通过合理的架构设计提升应用性能</li>
        <li><strong>用户体验</strong>：关注用户交互的流畅性和直观性</li>
        <li><strong>可维护性</strong>：编写清晰、可读的代码结构</li>
        <li><strong>扩展性</strong>：设计灵活的系统架构</li>
      </ul>
      
      <h2>实际应用</h2>
      <p>理论知识需要通过实践来验证和巩固。以下是一些实际的应用场景和解决方案。</p>
      
      <pre><code>// 示例代码
function optimizePerformance() {
  // 实现性能优化逻辑
  const result = processData();
  return result;
}</code></pre>
      
      <h3>最佳实践</h3>
      <ol>
        <li>始终考虑用户体验</li>
        <li>保持代码的简洁性</li>
        <li>定期重构和优化</li>
        <li>编写完善的测试用例</li>
      </ol>
      
      <h2>总结</h2>
      <p>通过本文的学习，我们了解了相关技术的核心概念和实际应用。在实际开发中，要根据具体需求选择合适的技术方案，并持续优化和改进。</p>
      
      <p>技术的学习是一个持续的过程，希望本文能为您的学习之路提供一些帮助和启发。</p>
    `;
  }

  // 创建阅读器界面
  createReaderInterface(article) {
    const reader = document.createElement('div');
    reader.id = 'article-reader';
    reader.className = 'fixed inset-0 bg-white z-50 overflow-hidden';
    
    reader.innerHTML = `
      <!-- 阅读器头部 -->
      <header class="reader-header bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button id="reader-close" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <i class="fas fa-arrow-left text-gray-600"></i>
          </button>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 truncate max-w-md">${article.title}</h1>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span>${article.author}</span>
              <span>•</span>
              <span>${article.date}</span>
              <span>•</span>
              <span>${article.readTime}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- 阅读进度 -->
          <div class="reading-progress-container hidden md:flex items-center gap-2">
            <span class="text-sm text-gray-500">阅读进度</span>
            <div class="w-24 h-2 bg-gray-200 rounded-full">
              <div id="reading-progress-bar" class="h-2 bg-blue-500 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <span id="reading-progress-text" class="text-sm text-gray-500">0%</span>
          </div>
          
          <!-- 工具按钮 -->
          <button id="reader-settings" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors" title="阅读设置">
            <i class="fas fa-cog text-gray-600"></i>
          </button>
          
          <button id="reader-bookmark" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors" title="收藏文章">
            <i class="far fa-bookmark text-gray-600"></i>
          </button>
          
          <button id="reader-share" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors" title="分享文章">
            <i class="fas fa-share text-gray-600"></i>
          </button>
        </div>
      </header>
      
      <!-- 阅读器主体 -->
      <main class="reader-main flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-6 py-8">
          <!-- 文章头部 -->
          <div class="article-header mb-8">
            ${article.image ? `
              <div class="aspect-w-16 aspect-h-9 mb-6">
                <img src="${article.image}" alt="${article.title}" class="w-full h-64 object-cover rounded-lg">
              </div>
            ` : ''}
            
            <div class="flex items-center gap-2 mb-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${article.category}</span>
            </div>
            
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${article.title}</h1>
            <p class="text-xl text-gray-600 leading-relaxed">${article.description}</p>
          </div>
          
          <!-- 文章内容 -->
          <article id="article-content" class="prose prose-lg max-w-none">
            ${article.content}
          </article>
          
          <!-- 文章底部 -->
          <footer class="article-footer mt-12 pt-8 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <img src="https://picsum.photos/id/64/100/100" alt="作者头像" class="w-12 h-12 rounded-full">
                <div>
                  <p class="font-semibold text-gray-900">${article.author}</p>
                  <p class="text-sm text-gray-500">技术博主 · 摄影爱好者</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <button class="like-btn flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors">
                  <i class="far fa-heart"></i>
                  <span>喜欢</span>
                </button>
                <button class="comment-btn flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <i class="far fa-comment"></i>
                  <span>评论</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
      
      <!-- 阅读设置面板 -->
      <div id="reader-settings-panel" class="fixed top-16 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 hidden z-10">
        <h3 class="font-semibold text-gray-900 mb-4">阅读设置</h3>
        
        <div class="space-y-4">
          <!-- 字体大小 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
            <div class="flex items-center gap-2">
              <button id="font-decrease" class="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <i class="fas fa-minus text-xs"></i>
              </button>
              <span id="font-size-display" class="text-sm text-gray-600 min-w-12 text-center">${this.fontSize}px</span>
              <button id="font-increase" class="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>
          </div>
          
          <!-- 行高 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">行高</label>
            <input type="range" id="line-height-slider" min="1.2" max="2.0" step="0.1" value="${this.lineHeight}" 
                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
          </div>
          
          <!-- 主题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">阅读主题</label>
            <div class="grid grid-cols-3 gap-2">
              <button class="theme-btn w-full h-8 rounded border-2 ${this.theme === 'light' ? 'border-blue-500' : 'border-gray-200'} bg-white" data-theme="light"></button>
              <button class="theme-btn w-full h-8 rounded border-2 ${this.theme === 'sepia' ? 'border-blue-500' : 'border-gray-200'} bg-yellow-50" data-theme="sepia"></button>
              <button class="theme-btn w-full h-8 rounded border-2 ${this.theme === 'dark' ? 'border-blue-500' : 'border-gray-200'} bg-gray-900" data-theme="dark"></button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(reader);
    document.body.style.overflow = 'hidden';

    // 绑定事件
    this.bindReaderEvents();
    
    // 应用用户设置
    this.applyReaderSettings();
    
    // 添加进入动画
    setTimeout(() => {
      reader.style.opacity = '1';
    }, 10);
  }

  // 绑定阅读器事件
  bindReaderEvents() {
    // 关闭按钮
    document.getElementById('reader-close').addEventListener('click', () => this.closeReader());
    
    // 设置按钮
    document.getElementById('reader-settings').addEventListener('click', () => this.toggleSettingsPanel());
    
    // 收藏按钮
    document.getElementById('reader-bookmark').addEventListener('click', () => this.toggleBookmark());
    
    // 分享按钮
    document.getElementById('reader-share').addEventListener('click', () => this.shareArticle());
    
    // 字体大小控制
    document.getElementById('font-decrease').addEventListener('click', () => this.decreaseFontSize());
    document.getElementById('font-increase').addEventListener('click', () => this.increaseFontSize());
    
    // 行高控制
    document.getElementById('line-height-slider').addEventListener('input', (e) => {
      this.lineHeight = parseFloat(e.target.value);
      this.applyReaderSettings();
    });
    
    // 主题切换
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.theme = btn.dataset.theme;
        this.applyReaderSettings();
        this.updateThemeButtons();
      });
    });
    
    // 喜欢和评论
    document.querySelector('.like-btn').addEventListener('click', () => this.toggleLike());
    document.querySelector('.comment-btn').addEventListener('click', () => this.showComments());
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('article-reader')) {
        this.closeReader();
      }
    });
  }

  // 设置阅读功能
  setupReadingFeatures() {
    // 阅读进度跟踪将在文章打开时启动
  }

  // 开始进度跟踪
  startProgressTracking() {
    const content = document.getElementById('article-content');
    const progressBar = document.getElementById('reading-progress-bar');
    const progressText = document.getElementById('reading-progress-text');
    
    if (!content || !progressBar) return;

    const updateProgress = () => {
      const scrollTop = content.scrollTop || document.documentElement.scrollTop;
      const scrollHeight = content.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = content.clientHeight || window.innerHeight;
      
      const progress = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100);
      
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${Math.round(progress)}%`;
      
      this.readingProgress = progress;
    };

    // 监听滚动
    document.querySelector('.reader-main').addEventListener('scroll', updateProgress);
    
    // 初始更新
    updateProgress();
  }

  // 应用阅读器设置
  applyReaderSettings() {
    const content = document.getElementById('article-content');
    const reader = document.getElementById('article-reader');
    
    if (!content || !reader) return;

    // 应用字体大小和行高
    content.style.fontSize = `${this.fontSize}px`;
    content.style.lineHeight = this.lineHeight;

    // 应用主题
    reader.className = `fixed inset-0 z-50 overflow-hidden theme-${this.theme}`;
    
    // 更新显示
    const fontDisplay = document.getElementById('font-size-display');
    if (fontDisplay) {
      fontDisplay.textContent = `${this.fontSize}px`;
    }
    
    const lineHeightSlider = document.getElementById('line-height-slider');
    if (lineHeightSlider) {
      lineHeightSlider.value = this.lineHeight;
    }
  }

  // 字体大小控制
  increaseFontSize() {
    this.fontSize = Math.min(this.fontSize + 2, 24);
    this.applyReaderSettings();
    this.saveUserPreferences();
  }

  decreaseFontSize() {
    this.fontSize = Math.max(this.fontSize - 2, 12);
    this.applyReaderSettings();
    this.saveUserPreferences();
  }

  // 切换设置面板
  toggleSettingsPanel() {
    const panel = document.getElementById('reader-settings-panel');
    panel.classList.toggle('hidden');
  }

  // 更新主题按钮
  updateThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      if (btn.dataset.theme === this.theme) {
        btn.classList.add('border-blue-500');
        btn.classList.remove('border-gray-200');
      } else {
        btn.classList.remove('border-blue-500');
        btn.classList.add('border-gray-200');
      }
    });
  }

  // 收藏功能
  toggleBookmark() {
    const bookmarkBtn = document.getElementById('reader-bookmark');
    const icon = bookmarkBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      bookmarkBtn.title = '取消收藏';
      this.showMessage('文章已收藏', 'success');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      bookmarkBtn.title = '收藏文章';
      this.showMessage('已取消收藏', 'info');
    }
  }

  // 分享文章
  shareArticle() {
    if (navigator.share && this.currentArticle) {
      navigator.share({
        title: this.currentArticle.title,
        text: this.currentArticle.description,
        url: window.location.href
      });
    } else {
      // 备用分享方法
      const shareText = `${this.currentArticle.title} - ${this.currentArticle.description}`;
      navigator.clipboard.writeText(shareText).then(() => {
        this.showMessage('文章链接已复制到剪贴板', 'success');
      });
    }
  }

  // 喜欢功能
  toggleLike() {
    const likeBtn = document.querySelector('.like-btn');
    const icon = likeBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      likeBtn.classList.add('text-red-500');
      this.showMessage('感谢您的喜欢！', 'success');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      likeBtn.classList.remove('text-red-500');
    }
  }

  // 显示评论
  showComments() {
    this.showMessage('评论功能开发中...', 'info');
  }

  // 关闭阅读器
  closeReader() {
    const reader = document.getElementById('article-reader');
    if (reader) {
      reader.style.opacity = '0';
      setTimeout(() => {
        reader.remove();
        document.body.style.overflow = '';
      }, 300);
    }
    
    // 保存阅读进度
    this.saveReadingProgress();
  }

  // 用户偏好设置
  loadUserPreferences() {
    const prefs = JSON.parse(localStorage.getItem('reader_preferences') || '{}');
    this.fontSize = prefs.fontSize || 16;
    this.lineHeight = prefs.lineHeight || 1.6;
    this.theme = prefs.theme || 'light';
  }

  saveUserPreferences() {
    const prefs = {
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      theme: this.theme
    };
    localStorage.setItem('reader_preferences', JSON.stringify(prefs));
  }

  saveReadingProgress() {
    if (this.currentArticle) {
      const progress = {
        articleTitle: this.currentArticle.title,
        progress: this.readingProgress,
        timestamp: Date.now()
      };
      localStorage.setItem('reading_progress', JSON.stringify(progress));
    }
  }

  // 显示消息
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
window.ArticleReader = ArticleReader;
