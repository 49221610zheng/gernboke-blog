// 前端评论系统
class CommentSystem {
  constructor(containerId, articleId) {
    this.containerId = containerId;
    this.articleId = articleId;
    this.comments = [];
    this.currentUser = null;
    this.init();
  }

  init() {
    this.loadComments();
    this.render();
  }

  async loadComments() {
    try {
      // 模拟加载评论数据
      this.comments = await this.getCommentsFromDB();
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  }

  async getCommentsFromDB() {
    // 模拟评论数据
    return [
      {
        id: '1',
        author: '张三',
        email: 'zhangsan@example.com',
        content: '这篇文章写得很好，学到了很多！感谢分享。',
        avatar: 'https://picsum.photos/id/1/40/40',
        createdAt: new Date('2024-01-15T10:30:00'),
        replies: [
          {
            id: '1-1',
            author: '博主',
            email: 'admin@example.com',
            content: '谢谢你的支持！有任何问题欢迎继续交流。',
            avatar: 'https://picsum.photos/id/64/40/40',
            createdAt: new Date('2024-01-15T11:00:00'),
            isAuthor: true
          }
        ]
      },
      {
        id: '2',
        author: '李四',
        email: 'lisi@example.com',
        content: '能否详细讲解一下这个技术的实现原理？我在实际项目中遇到了一些问题。',
        avatar: 'https://picsum.photos/id/2/40/40',
        createdAt: new Date('2024-01-16T14:20:00'),
        replies: []
      },
      {
        id: '3',
        author: '王五',
        email: 'wangwu@example.com',
        content: '很实用的教程，已经收藏了。希望能看到更多这样的内容！',
        avatar: 'https://picsum.photos/id/3/40/40',
        createdAt: new Date('2024-01-17T09:15:00'),
        replies: []
      }
    ];
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="comment-system">
        <!-- 评论统计 -->
        <div class="comment-header mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            评论 (${this.getTotalCommentCount()})
          </h3>
          <p class="text-gray-600">欢迎留下您的想法和建议</p>
        </div>
        
        <!-- 评论表单 -->
        <div class="comment-form mb-8">
          ${this.renderCommentForm()}
        </div>
        
        <!-- 评论列表 -->
        <div class="comment-list space-y-6">
          ${this.renderCommentList()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderCommentForm(parentId = null, placeholder = '写下您的评论...') {
    const formId = parentId ? `reply-form-${parentId}` : 'main-comment-form';
    const isReply = !!parentId;

    return `
      <div id="${formId}" class="comment-form-container ${isReply ? 'ml-12 mt-4 border-l-2 border-gray-200 pl-4' : ''}">
        <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
              <input type="text" id="${formId}-name" required
                     class="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                     placeholder="您的姓名">
              <div class="error-message text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
              <input type="email" id="${formId}-email" required
                     class="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                     placeholder="您的邮箱">
              <div class="error-message text-red-500 text-xs mt-1 hidden"></div>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">评论内容 *</label>
            <textarea id="${formId}-content" rows="4" required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      placeholder="${placeholder}"></textarea>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span><i class="fas fa-markdown mr-1"></i>支持Markdown</span>
              <span><i class="fas fa-shield-alt mr-1"></i>评论需要审核</span>
            </div>
            <div class="flex items-center space-x-2">
              ${isReply ? `
                <button type="button" onclick="commentSystem.cancelReply('${parentId}')" 
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                  取消
                </button>
              ` : ''}
              <button type="button" onclick="commentSystem.submitComment('${formId}', '${parentId || ''}')" 
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${isReply ? '回复' : '发表评论'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCommentList() {
    if (this.comments.length === 0) {
      return `
        <div class="text-center py-12 text-gray-500">
          <i class="fas fa-comments text-4xl mb-4 text-gray-300"></i>
          <p class="text-lg">暂无评论</p>
          <p class="text-sm">成为第一个评论的人吧！</p>
        </div>
      `;
    }

    return this.comments.map(comment => this.renderComment(comment)).join('');
  }

  renderComment(comment) {
    return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="flex space-x-4">
          <div class="flex-shrink-0">
            <img src="${comment.avatar}" alt="${comment.author}" 
                 class="w-10 h-10 rounded-full object-cover">
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="comment-header flex items-center space-x-2 mb-2">
              <h4 class="text-sm font-medium text-gray-900">${comment.author}</h4>
              ${comment.isAuthor ? '<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">作者</span>' : ''}
              <span class="text-sm text-gray-500">${this.formatDate(comment.createdAt)}</span>
            </div>
            
            <div class="comment-content mb-3">
              <p class="text-gray-700 leading-relaxed">${this.formatContent(comment.content)}</p>
            </div>
            
            <div class="comment-actions flex items-center space-x-4 text-sm">
              <button onclick="commentSystem.likeComment('${comment.id}')" 
                      class="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <i class="far fa-thumbs-up"></i>
                <span>赞 (${comment.likes || 0})</span>
              </button>
              
              <button onclick="commentSystem.showReplyForm('${comment.id}')" 
                      class="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <i class="far fa-comment"></i>
                <span>回复</span>
              </button>
              
              <button onclick="commentSystem.reportComment('${comment.id}')" 
                      class="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                <i class="far fa-flag"></i>
                <span>举报</span>
              </button>
            </div>
            
            <!-- 回复表单容器 -->
            <div id="reply-container-${comment.id}" class="reply-form-container"></div>
            
            <!-- 回复列表 -->
            ${comment.replies && comment.replies.length > 0 ? `
              <div class="replies mt-4 space-y-4">
                ${comment.replies.map(reply => this.renderReply(reply, comment.id)).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderReply(reply, parentId) {
    return `
      <div class="reply-item ml-8 border-l-2 border-gray-100 pl-4" data-reply-id="${reply.id}">
        <div class="flex space-x-3">
          <div class="flex-shrink-0">
            <img src="${reply.avatar}" alt="${reply.author}" 
                 class="w-8 h-8 rounded-full object-cover">
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="reply-header flex items-center space-x-2 mb-1">
              <h5 class="text-sm font-medium text-gray-900">${reply.author}</h5>
              ${reply.isAuthor ? '<span class="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">作者</span>' : ''}
              <span class="text-xs text-gray-500">${this.formatDate(reply.createdAt)}</span>
            </div>
            
            <div class="reply-content mb-2">
              <p class="text-gray-700 text-sm leading-relaxed">${this.formatContent(reply.content)}</p>
            </div>
            
            <div class="reply-actions flex items-center space-x-3 text-xs">
              <button onclick="commentSystem.likeComment('${reply.id}')" 
                      class="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <i class="far fa-thumbs-up"></i>
                <span>赞 (${reply.likes || 0})</span>
              </button>
              
              <button onclick="commentSystem.replyToReply('${parentId}', '${reply.author}')" 
                      class="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <i class="far fa-comment"></i>
                <span>回复</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // 绑定表单提交事件
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        const activeForm = document.activeElement.closest('.comment-form-container');
        if (activeForm) {
          const formId = activeForm.id;
          const parentId = formId.includes('reply-form-') ? formId.replace('reply-form-', '') : '';
          this.submitComment(formId, parentId);
        }
      }
    });
  }

  showReplyForm(commentId) {
    // 隐藏其他回复表单
    document.querySelectorAll('.reply-form-container').forEach(container => {
      if (container.id !== `reply-container-${commentId}`) {
        container.innerHTML = '';
      }
    });

    const container = document.getElementById(`reply-container-${commentId}`);
    if (container) {
      const comment = this.comments.find(c => c.id === commentId);
      const placeholder = `回复 @${comment.author}...`;
      container.innerHTML = this.renderCommentForm(commentId, placeholder);

      // 聚焦到内容输入框
      setTimeout(() => {
        const contentInput = document.getElementById(`reply-form-${commentId}-content`);
        if (contentInput) {
          contentInput.focus();
        }
      }, 100);
    }
  }

  cancelReply(commentId) {
    const container = document.getElementById(`reply-container-${commentId}`);
    if (container) {
      container.innerHTML = '';
    }
  }

  replyToReply(parentId, replyToAuthor) {
    this.showReplyForm(parentId);
    setTimeout(() => {
      const contentInput = document.getElementById(`reply-form-${parentId}-content`);
      if (contentInput) {
        contentInput.value = `@${replyToAuthor} `;
        contentInput.focus();
        contentInput.setSelectionRange(contentInput.value.length, contentInput.value.length);
      }
    }, 100);
  }

  async submitComment(formId, parentId = '') {
    const nameInput = document.getElementById(`${formId}-name`);
    const emailInput = document.getElementById(`${formId}-email`);
    const contentInput = document.getElementById(`${formId}-content`);

    if (!nameInput || !emailInput || !contentInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const content = contentInput.value.trim();

    if (!name || !email || !content) {
      this.showMessage('请填写所有必填字段', 'warning');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showMessage('请输入有效的邮箱地址', 'warning');
      return;
    }

    try {
      const commentData = {
        author: name,
        email: email,
        content: content,
        articleId: this.articleId,
        parentId: parentId || null,
        createdAt: new Date(),
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/40/40`
      };

      // 这里应该发送到后端API
      await this.saveComment(commentData);

      // 清空表单
      nameInput.value = '';
      emailInput.value = '';
      contentInput.value = '';

      // 如果是回复，隐藏回复表单
      if (parentId) {
        this.cancelReply(parentId);
      }

      this.showMessage('评论提交成功，等待审核后显示', 'success');

    } catch (error) {
      console.error('提交评论失败:', error);
      this.showMessage('评论提交失败，请稍后重试', 'error');
    }
  }

  async saveComment(commentData) {
    // 模拟保存评论到数据库
    console.log('保存评论:', commentData);

    // 这里应该调用Firebase或其他后端API
    // await firebase.firestore().collection('comments').add(commentData);

    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  async likeComment(commentId) {
    try {
      // 这里应该调用API更新点赞数
      console.log('点赞评论:', commentId);
      this.showMessage('点赞成功', 'success');
    } catch (error) {
      console.error('点赞失败:', error);
      this.showMessage('点赞失败', 'error');
    }
  }

  reportComment(commentId) {
    if (confirm('确定要举报这条评论吗？')) {
      // 这里应该调用举报API
      console.log('举报评论:', commentId);
      this.showMessage('举报已提交，我们会尽快处理', 'success');
    }
  }

  getTotalCommentCount() {
    let total = this.comments.length;
    this.comments.forEach(comment => {
      if (comment.replies) {
        total += comment.replies.length;
      }
    });
    return total;
  }

  formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatContent(content) {
    // 简单的内容格式化
    return content
      .replace(/\n/g, '<br>')
      .replace(/@(\w+)/g, '<span class="text-blue-600">@$1</span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${type === 'success' ? 'bg-green-500' :
        type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
      }`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}

// 导出到全局
window.CommentSystem = CommentSystem;
