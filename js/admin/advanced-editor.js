// 高级文章编辑器
class AdvancedEditor {
  constructor(containerId) {
    this.containerId = containerId;
    this.editor = null;
    this.currentArticle = null;
    this.autosaveInterval = null;
    this.wordCount = 0;
    this.readingTime = 0;
    this.init();
  }
  
  init() {
    this.createEditor();
    this.setupAutosave();
    this.setupShortcuts();
    this.setupWordCount();
  }
  
  createEditor() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="advanced-editor bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- 编辑器工具栏 -->
        <div class="editor-toolbar border-b border-gray-200 p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <button onclick="advancedEditor.goBack()" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left text-xl"></i>
              </button>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  ${this.currentArticle ? '编辑文章' : '新建文章'}
                </h2>
                <p class="text-sm text-gray-500" id="editor-status">准备就绪</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-sm text-gray-500">
                <span id="word-count">0</span> 字 · 
                <span id="reading-time">0</span> 分钟阅读
              </div>
              <button onclick="advancedEditor.saveDraft()" class="btn-secondary">
                <i class="fas fa-save mr-2"></i>保存草稿
              </button>
              <button onclick="advancedEditor.publish()" class="btn-primary">
                <i class="fas fa-paper-plane mr-2"></i>发布
              </button>
            </div>
          </div>
          
          <!-- 格式化工具栏 -->
          <div class="flex items-center space-x-2 flex-wrap">
            <div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <button onclick="advancedEditor.formatText('bold')" class="toolbar-btn" title="粗体 (Ctrl+B)">
                <i class="fas fa-bold"></i>
              </button>
              <button onclick="advancedEditor.formatText('italic')" class="toolbar-btn" title="斜体 (Ctrl+I)">
                <i class="fas fa-italic"></i>
              </button>
              <button onclick="advancedEditor.formatText('underline')" class="toolbar-btn" title="下划线 (Ctrl+U)">
                <i class="fas fa-underline"></i>
              </button>
              <button onclick="advancedEditor.formatText('strikethrough')" class="toolbar-btn" title="删除线">
                <i class="fas fa-strikethrough"></i>
              </button>
            </div>
            
            <div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <select onchange="advancedEditor.formatHeading(this.value)" class="text-sm border border-gray-300 rounded px-2 py-1">
                <option value="">正文</option>
                <option value="h1">标题 1</option>
                <option value="h2">标题 2</option>
                <option value="h3">标题 3</option>
                <option value="h4">标题 4</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <button onclick="advancedEditor.insertList('ul')" class="toolbar-btn" title="无序列表">
                <i class="fas fa-list-ul"></i>
              </button>
              <button onclick="advancedEditor.insertList('ol')" class="toolbar-btn" title="有序列表">
                <i class="fas fa-list-ol"></i>
              </button>
              <button onclick="advancedEditor.insertQuote()" class="toolbar-btn" title="引用">
                <i class="fas fa-quote-left"></i>
              </button>
              <button onclick="advancedEditor.insertCode()" class="toolbar-btn" title="代码">
                <i class="fas fa-code"></i>
              </button>
            </div>
            
            <div class="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
              <button onclick="advancedEditor.insertLink()" class="toolbar-btn" title="链接 (Ctrl+K)">
                <i class="fas fa-link"></i>
              </button>
              <button onclick="advancedEditor.insertImage()" class="toolbar-btn" title="图片">
                <i class="fas fa-image"></i>
              </button>
              <button onclick="advancedEditor.insertTable()" class="toolbar-btn" title="表格">
                <i class="fas fa-table"></i>
              </button>
            </div>
            
            <div class="flex items-center space-x-1">
              <button onclick="advancedEditor.undo()" class="toolbar-btn" title="撤销 (Ctrl+Z)">
                <i class="fas fa-undo"></i>
              </button>
              <button onclick="advancedEditor.redo()" class="toolbar-btn" title="重做 (Ctrl+Y)">
                <i class="fas fa-redo"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 编辑器主体 -->
        <div class="editor-body flex">
          <!-- 左侧：文章信息 -->
          <div class="editor-sidebar w-80 border-r border-gray-200 p-6 bg-gray-50">
            <div class="space-y-6">
              <!-- 基本信息 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">文章标题</label>
                <input type="text" id="article-title" placeholder="输入文章标题..."
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">文章摘要</label>
                <textarea id="article-excerpt" rows="3" placeholder="文章摘要..."
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
              </div>
              
              <!-- 分类和标签 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <select id="article-category" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">选择分类</option>
                  <option value="技术">技术</option>
                  <option value="摄影">摄影</option>
                  <option value="生活">生活</option>
                  <option value="随笔">随笔</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div id="tags-container" class="mb-2">
                  <!-- 标签将在这里显示 -->
                </div>
                <input type="text" id="tag-input" placeholder="输入标签后按回车"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <!-- 封面图片 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div id="cover-preview" class="hidden">
                    <img id="cover-image" src="" alt="封面预览" class="w-full h-32 object-cover rounded-lg mb-2">
                    <button onclick="advancedEditor.removeCover()" class="text-red-600 text-sm hover:text-red-800">
                      <i class="fas fa-trash mr-1"></i>移除
                    </button>
                  </div>
                  <div id="cover-upload" class="">
                    <i class="fas fa-image text-gray-400 text-2xl mb-2"></i>
                    <p class="text-sm text-gray-600 mb-2">点击上传或拖拽图片</p>
                    <input type="file" id="cover-file" accept="image/*" class="hidden">
                    <input type="url" id="cover-url" placeholder="或输入图片URL"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  </div>
                </div>
              </div>
              
              <!-- 发布设置 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">发布设置</label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input type="checkbox" id="allow-comments" checked class="rounded border-gray-300">
                    <label for="allow-comments" class="ml-2 text-sm text-gray-700">允许评论</label>
                  </div>
                  <div class="flex items-center">
                    <input type="checkbox" id="featured-article" class="rounded border-gray-300">
                    <label for="featured-article" class="ml-2 text-sm text-gray-700">推荐文章</label>
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">发布时间</label>
                    <input type="datetime-local" id="publish-time" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧：编辑器和预览 -->
          <div class="editor-main flex-1 flex">
            <!-- 编辑器 -->
            <div class="editor-content flex-1 p-6">
              <textarea id="content-editor" placeholder="开始写作..."
                        class="w-full h-full border-0 focus:outline-none resize-none text-lg leading-relaxed"
                        style="min-height: 600px;"></textarea>
            </div>
            
            <!-- 预览面板 -->
            <div id="preview-panel" class="preview-content w-1/2 border-l border-gray-200 p-6 bg-gray-50 hidden">
              <div class="prose prose-lg max-w-none">
                <div id="preview-content">
                  <p class="text-gray-500">在左侧编辑内容以查看预览</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部状态栏 -->
        <div class="editor-footer border-t border-gray-200 px-6 py-3 bg-gray-50">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <div class="flex items-center space-x-4">
              <span>最后保存: <span id="last-saved">从未</span></span>
              <button onclick="advancedEditor.togglePreview()" class="text-blue-600 hover:text-blue-800">
                <i class="fas fa-eye mr-1"></i>预览
              </button>
              <button onclick="advancedEditor.toggleFullscreen()" class="text-blue-600 hover:text-blue-800">
                <i class="fas fa-expand mr-1"></i>全屏
              </button>
            </div>
            <div class="flex items-center space-x-4">
              <span>字符: <span id="char-count">0</span></span>
              <span>段落: <span id="paragraph-count">0</span></span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.bindEvents();
  }
  
  bindEvents() {
    // 绑定内容变化事件
    const contentEditor = document.getElementById('content-editor');
    if (contentEditor) {
      contentEditor.addEventListener('input', () => {
        this.updateWordCount();
        this.updatePreview();
        this.markAsModified();
      });
    }
    
    // 绑定标签输入
    const tagInput = document.getElementById('tag-input');
    if (tagInput) {
      tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addTag(tagInput.value.trim());
          tagInput.value = '';
        }
      });
    }
    
    // 绑定封面图片
    const coverFile = document.getElementById('cover-file');
    const coverUrl = document.getElementById('cover-url');
    
    if (coverFile) {
      coverFile.addEventListener('change', (e) => {
        this.handleCoverUpload(e.target.files[0]);
      });
    }
    
    if (coverUrl) {
      coverUrl.addEventListener('change', (e) => {
        this.setCoverImage(e.target.value);
      });
    }
  }
  
  setupAutosave() {
    this.autosaveInterval = setInterval(() => {
      this.autosave();
    }, 30000); // 每30秒自动保存
  }
  
  setupShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            this.formatText('bold');
            break;
          case 'i':
            e.preventDefault();
            this.formatText('italic');
            break;
          case 'u':
            e.preventDefault();
            this.formatText('underline');
            break;
          case 'k':
            e.preventDefault();
            this.insertLink();
            break;
          case 's':
            e.preventDefault();
            this.saveDraft();
            break;
          case 'Enter':
            e.preventDefault();
            this.publish();
            break;
        }
      }
    });
  }
  
  setupWordCount() {
    this.updateWordCount();
  }
  
  updateWordCount() {
    const content = document.getElementById('content-editor').value;
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = content.length;
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    
    this.wordCount = words.length;
    this.readingTime = Math.ceil(this.wordCount / 200); // 假设每分钟200字
    
    document.getElementById('word-count').textContent = this.wordCount;
    document.getElementById('reading-time').textContent = this.readingTime;
    document.getElementById('char-count').textContent = chars;
    document.getElementById('paragraph-count').textContent = paragraphs.length;
  }
  
  updatePreview() {
    const content = document.getElementById('content-editor').value;
    const title = document.getElementById('article-title').value;
    const previewContent = document.getElementById('preview-content');
    
    if (previewContent) {
      previewContent.innerHTML = `
        ${title ? `<h1>${title}</h1>` : ''}
        ${this.markdownToHtml(content)}
      `;
    }
  }
  
  markdownToHtml(markdown) {
    // 简单的Markdown转换
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
  
  formatText(command) {
    document.execCommand(command, false, null);
  }
  
  insertLink() {
    const url = prompt('请输入链接URL:');
    if (url) {
      const text = prompt('请输入链接文字:') || url;
      this.insertAtCursor(`[${text}](${url})`);
    }
  }
  
  insertImage() {
    const url = prompt('请输入图片URL:');
    if (url) {
      const alt = prompt('请输入图片描述:') || '图片';
      this.insertAtCursor(`![${alt}](${url})`);
    }
  }
  
  insertAtCursor(text) {
    const editor = document.getElementById('content-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    
    editor.value = value.substring(0, start) + text + value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + text.length;
    editor.focus();
    
    this.updateWordCount();
    this.updatePreview();
  }
  
  addTag(tag) {
    if (!tag) return;
    
    const container = document.getElementById('tags-container');
    const tagElement = document.createElement('span');
    tagElement.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2';
    tagElement.innerHTML = `
      ${tag}
      <button onclick="this.parentElement.remove()" class="ml-1 text-blue-600 hover:text-blue-800">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(tagElement);
  }
  
  togglePreview() {
    const panel = document.getElementById('preview-panel');
    if (panel.classList.contains('hidden')) {
      panel.classList.remove('hidden');
      this.updatePreview();
    } else {
      panel.classList.add('hidden');
    }
  }
  
  async saveDraft() {
    // 实现保存草稿逻辑
    this.updateStatus('保存中...');
    
    setTimeout(() => {
      this.updateStatus('草稿已保存');
      document.getElementById('last-saved').textContent = new Date().toLocaleTimeString('zh-CN');
    }, 1000);
  }
  
  async publish() {
    // 实现发布逻辑
    this.updateStatus('发布中...');
    
    setTimeout(() => {
      this.updateStatus('发布成功');
      this.showMessage('文章发布成功！', 'success');
    }, 1500);
  }
  
  updateStatus(status) {
    document.getElementById('editor-status').textContent = status;
  }
  
  markAsModified() {
    this.updateStatus('已修改');
  }
  
  autosave() {
    if (document.getElementById('content-editor').value.trim()) {
      this.saveDraft();
    }
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
  
  destroy() {
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
    }
  }
}

// 导出到全局
window.AdvancedEditor = AdvancedEditor;
