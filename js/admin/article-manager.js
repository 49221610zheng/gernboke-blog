// 文章管理模块
class ArticleManager {
  constructor() {
    this.articles = [];
    this.currentArticle = null;
    this.isEditing = false;
    this.init();
  }
  
  init() {
    this.loadArticles();
  }
  
  async loadArticles() {
    try {
      if (window.databaseService && window.databaseService.articleService) {
        this.articles = await window.databaseService.articleService.getAll();
        this.renderArticleList();
      }
    } catch (error) {
      console.error('加载文章失败:', error);
    }
  }
  
  renderArticleList() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">文章管理</h1>
          <button onclick="articleManager.showEditor()" class="btn-primary">
            <i class="fas fa-plus mr-2"></i>新建文章
          </button>
        </div>
        
        <!-- 文章列表 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">文章列表</h2>
              <div class="flex items-center space-x-4">
                <select class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="">所有状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
                <input type="text" placeholder="搜索文章..." 
                       class="px-3 py-2 border border-gray-300 rounded-md text-sm">
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${this.renderArticleRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  
  renderArticleRows() {
    if (this.articles.length === 0) {
      return `
        <tr>
          <td colspan="5" class="px-6 py-12 text-center text-gray-500">
            <i class="fas fa-file-alt text-4xl mb-4 text-gray-300"></i>
            <p>暂无文章，点击"新建文章"开始创作</p>
          </td>
        </tr>
      `;
    }
    
    return this.articles.map(article => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-lg object-cover" 
                   src="${article.coverImage || '/images/default-article.jpg'}" 
                   alt="${article.title}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${article.title}</div>
              <div class="text-sm text-gray-500">${this.truncateText(article.excerpt || '', 50)}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            article.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }">
            ${article.status === 'published' ? '已发布' : '草稿'}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${article.category || '未分类'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${this.formatDate(article.createdAt)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex items-center space-x-2">
            <button onclick="articleManager.editArticle('${article.id}')" 
                    class="text-blue-600 hover:text-blue-900">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="articleManager.deleteArticle('${article.id}')" 
                    class="text-red-600 hover:text-red-900">
              <i class="fas fa-trash"></i>
            </button>
            <button onclick="articleManager.previewArticle('${article.id}')" 
                    class="text-green-600 hover:text-green-900">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  showEditor(articleId = null) {
    this.isEditing = !!articleId;
    this.currentArticle = articleId ? this.articles.find(a => a.id === articleId) : {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      category: '',
      tags: [],
      status: 'draft'
    };
    
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button onclick="articleManager.renderArticleList()" class="text-gray-600 hover:text-gray-900">
              <i class="fas fa-arrow-left text-xl"></i>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">
              ${this.isEditing ? '编辑文章' : '新建文章'}
            </h1>
          </div>
          <div class="flex items-center space-x-3">
            <button onclick="articleManager.saveDraft()" class="btn-secondary">
              <i class="fas fa-save mr-2"></i>保存草稿
            </button>
            <button onclick="articleManager.publishArticle()" class="btn-primary">
              <i class="fas fa-paper-plane mr-2"></i>发布文章
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 主编辑区域 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 标题 -->
            <div class="bg-white rounded-lg shadow p-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">文章标题</label>
              <input type="text" id="article-title" value="${this.currentArticle.title}" 
                     placeholder="输入文章标题..."
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
            </div>
            
            <!-- 内容编辑器 -->
            <div class="bg-white rounded-lg shadow p-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">文章内容</label>
              <div class="border border-gray-300 rounded-md">
                <div class="border-b border-gray-300 p-3 bg-gray-50">
                  <div class="flex items-center space-x-2">
                    <button type="button" onclick="articleManager.formatText('bold')" 
                            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                      <i class="fas fa-bold"></i>
                    </button>
                    <button type="button" onclick="articleManager.formatText('italic')" 
                            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                      <i class="fas fa-italic"></i>
                    </button>
                    <button type="button" onclick="articleManager.formatText('underline')" 
                            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                      <i class="fas fa-underline"></i>
                    </button>
                    <div class="border-l border-gray-300 h-6 mx-2"></div>
                    <button type="button" onclick="articleManager.insertImage()" 
                            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                      <i class="fas fa-image"></i>
                    </button>
                    <button type="button" onclick="articleManager.insertLink()" 
                            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                      <i class="fas fa-link"></i>
                    </button>
                  </div>
                </div>
                <textarea id="article-content" rows="20" 
                          placeholder="开始写作..."
                          class="w-full p-4 border-0 focus:outline-none resize-none">${this.currentArticle.content}</textarea>
              </div>
            </div>
          </div>
          
          <!-- 侧边栏 -->
          <div class="space-y-6">
            <!-- 文章设置 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">文章设置</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">文章摘要</label>
                  <textarea id="article-excerpt" rows="3" 
                            placeholder="文章摘要..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${this.currentArticle.excerpt}</textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
                  <input type="url" id="article-cover" value="${this.currentArticle.coverImage}" 
                         placeholder="图片URL..."
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select id="article-category" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">选择分类</option>
                    <option value="技术" ${this.currentArticle.category === '技术' ? 'selected' : ''}>技术</option>
                    <option value="摄影" ${this.currentArticle.category === '摄影' ? 'selected' : ''}>摄影</option>
                    <option value="生活" ${this.currentArticle.category === '生活' ? 'selected' : ''}>生活</option>
                    <option value="随笔" ${this.currentArticle.category === '随笔' ? 'selected' : ''}>随笔</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
                  <input type="text" id="article-tags" value="${(this.currentArticle.tags || []).join(', ')}" 
                         placeholder="标签1, 标签2, 标签3"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <p class="text-xs text-gray-500 mt-1">用逗号分隔多个标签</p>
                </div>
              </div>
            </div>
            
            <!-- 预览 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">预览</h3>
              <div id="article-preview" class="prose prose-sm max-w-none">
                <p class="text-gray-500">在左侧编辑内容以查看预览</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.bindEditorEvents();
  }
  
  bindEditorEvents() {
    // 绑定实时预览
    const contentTextarea = document.getElementById('article-content');
    const titleInput = document.getElementById('article-title');
    
    if (contentTextarea) {
      contentTextarea.addEventListener('input', () => {
        this.updatePreview();
      });
    }
    
    if (titleInput) {
      titleInput.addEventListener('input', () => {
        this.updatePreview();
      });
    }
    
    // 初始预览
    this.updatePreview();
  }
  
  updatePreview() {
    const title = document.getElementById('article-title')?.value || '';
    const content = document.getElementById('article-content')?.value || '';
    const preview = document.getElementById('article-preview');
    
    if (preview) {
      preview.innerHTML = `
        ${title ? `<h1>${title}</h1>` : ''}
        ${content ? this.markdownToHtml(content) : '<p class="text-gray-500">在左侧编辑内容以查看预览</p>'}
      `;
    }
  }
  
  markdownToHtml(markdown) {
    // 简单的Markdown转换
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
  
  async saveDraft() {
    await this.saveArticle('draft');
  }
  
  async publishArticle() {
    await this.saveArticle('published');
  }
  
  async saveArticle(status) {
    try {
      const articleData = {
        title: document.getElementById('article-title').value,
        content: document.getElementById('article-content').value,
        excerpt: document.getElementById('article-excerpt').value,
        coverImage: document.getElementById('article-cover').value,
        category: document.getElementById('article-category').value,
        tags: document.getElementById('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: status,
        publishedAt: status === 'published' ? new Date() : null
      };
      
      if (this.isEditing && this.currentArticle.id) {
        await window.databaseService.articleService.update(this.currentArticle.id, articleData);
        this.showMessage('文章更新成功', 'success');
      } else {
        const id = await window.databaseService.articleService.add(articleData);
        this.showMessage('文章保存成功', 'success');
        this.currentArticle.id = id;
        this.isEditing = true;
      }
      
      await this.loadArticles();
    } catch (error) {
      console.error('保存文章失败:', error);
      this.showMessage('保存失败: ' + error.message, 'error');
    }
  }
  
  async editArticle(id) {
    this.showEditor(id);
  }
  
  async deleteArticle(id) {
    if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      try {
        await window.databaseService.articleService.delete(id);
        this.showMessage('文章删除成功', 'success');
        await this.loadArticles();
      } catch (error) {
        console.error('删除文章失败:', error);
        this.showMessage('删除失败: ' + error.message, 'error');
      }
    }
  }
  
  formatText(command) {
    document.execCommand(command, false, null);
  }
  
  insertImage() {
    const url = prompt('请输入图片URL:');
    if (url) {
      const textarea = document.getElementById('article-content');
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const textAfter = textarea.value.substring(cursorPos);
      textarea.value = textBefore + `![图片](${url})` + textAfter;
      this.updatePreview();
    }
  }
  
  insertLink() {
    const url = prompt('请输入链接URL:');
    if (url) {
      const text = prompt('请输入链接文字:') || url;
      const textarea = document.getElementById('article-content');
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const textAfter = textarea.value.substring(cursorPos);
      textarea.value = textBefore + `[${text}](${url})` + textAfter;
      this.updatePreview();
    }
  }
  
  truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
  
  formatDate(date) {
    if (!date) return '未知';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('zh-CN');
  }
  
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
}

// 导出到全局
window.ArticleManager = ArticleManager;
