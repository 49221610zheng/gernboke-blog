// 评论管理模块
class CommentManager {
  constructor() {
    this.comments = [];
    this.filteredComments = [];
    this.currentFilter = 'all';
    this.init();
  }
  
  init() {
    this.loadComments();
  }
  
  async loadComments() {
    try {
      if (window.databaseService) {
        // 模拟评论数据，实际应该从数据库加载
        this.comments = await this.getCommentsFromDB();
        this.filteredComments = [...this.comments];
        this.renderCommentList();
      }
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
        content: '这篇文章写得很好，学到了很多！',
        articleId: 'article1',
        articleTitle: 'React Hooks 深度解析',
        status: 'approved',
        createdAt: new Date('2024-01-15'),
        avatar: 'https://picsum.photos/id/1/40/40'
      },
      {
        id: '2',
        author: '李四',
        email: 'lisi@example.com',
        content: '能否详细讲解一下useState的实现原理？',
        articleId: 'article1',
        articleTitle: 'React Hooks 深度解析',
        status: 'pending',
        createdAt: new Date('2024-01-16'),
        avatar: 'https://picsum.photos/id/2/40/40'
      },
      {
        id: '3',
        author: '王五',
        email: 'wangwu@example.com',
        content: '这张照片的构图很棒，请问是在哪里拍摄的？',
        articleId: 'photo1',
        articleTitle: '城市夜景摄影',
        status: 'approved',
        createdAt: new Date('2024-01-17'),
        avatar: 'https://picsum.photos/id/3/40/40'
      },
      {
        id: '4',
        author: '赵六',
        email: 'zhaoliu@example.com',
        content: '垃圾内容，纯属浪费时间',
        articleId: 'article2',
        articleTitle: 'JavaScript 异步编程',
        status: 'spam',
        createdAt: new Date('2024-01-18'),
        avatar: 'https://picsum.photos/id/4/40/40'
      }
    ];
  }
  
  renderCommentList() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">评论管理</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              共 ${this.comments.length} 条评论
            </span>
          </div>
        </div>
        
        <!-- 筛选器 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">状态筛选:</label>
              <select id="status-filter" onchange="commentManager.filterComments()" 
                      class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="all">全部状态</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="spam">垃圾评论</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <input type="text" id="search-input" placeholder="搜索评论内容或作者..." 
                     onkeyup="commentManager.searchComments()"
                     class="px-3 py-2 border border-gray-300 rounded-md text-sm w-64">
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="commentManager.bulkAction('approve')" class="btn-secondary text-sm">
                <i class="fas fa-check mr-1"></i>批量通过
              </button>
              <button onclick="commentManager.bulkAction('spam')" class="btn-danger text-sm">
                <i class="fas fa-ban mr-1"></i>批量标记垃圾
              </button>
            </div>
          </div>
        </div>
        
        <!-- 评论列表 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">评论列表</h2>
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="select-all" onchange="commentManager.toggleSelectAll()" 
                       class="rounded border-gray-300">
                <label for="select-all" class="text-sm text-gray-600">全选</label>
              </div>
            </div>
          </div>
          
          <div id="comments-container" class="divide-y divide-gray-200">
            ${this.renderCommentItems()}
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="fas fa-comments text-blue-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">总评论数</p>
                <p class="text-2xl font-bold text-gray-900">${this.comments.length}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <i class="fas fa-clock text-yellow-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">待审核</p>
                <p class="text-2xl font-bold text-gray-900">${this.getStatusCount('pending')}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="fas fa-check text-green-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">已通过</p>
                <p class="text-2xl font-bold text-gray-900">${this.getStatusCount('approved')}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-red-100 rounded-lg">
                <i class="fas fa-ban text-red-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">垃圾评论</p>
                <p class="text-2xl font-bold text-gray-900">${this.getStatusCount('spam')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderCommentItems() {
    if (this.filteredComments.length === 0) {
      return `
        <div class="p-12 text-center text-gray-500">
          <i class="fas fa-comments text-4xl mb-4 text-gray-300"></i>
          <p>暂无评论</p>
        </div>
      `;
    }
    
    return this.filteredComments.map(comment => `
      <div class="p-6 hover:bg-gray-50 transition-colors">
        <div class="flex items-start space-x-4">
          <input type="checkbox" class="comment-checkbox mt-1" value="${comment.id}" 
                 onchange="commentManager.updateSelection()">
          <img src="${comment.avatar}" alt="${comment.author}" 
               class="w-10 h-10 rounded-full object-cover">
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <h3 class="text-sm font-medium text-gray-900">${comment.author}</h3>
                <span class="text-sm text-gray-500">${comment.email}</span>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${this.getStatusBadgeClass(comment.status)}">
                  ${this.getStatusText(comment.status)}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">${this.formatDate(comment.createdAt)}</span>
                <div class="flex items-center space-x-1">
                  <button onclick="commentManager.approveComment('${comment.id}')" 
                          class="p-1 text-green-600 hover:text-green-800" title="通过">
                    <i class="fas fa-check"></i>
                  </button>
                  <button onclick="commentManager.markAsSpam('${comment.id}')" 
                          class="p-1 text-red-600 hover:text-red-800" title="标记垃圾">
                    <i class="fas fa-ban"></i>
                  </button>
                  <button onclick="commentManager.deleteComment('${comment.id}')" 
                          class="p-1 text-gray-600 hover:text-gray-800" title="删除">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <p class="text-gray-700 mb-2">${comment.content}</p>
            <div class="flex items-center text-sm text-gray-500">
              <i class="fas fa-file-alt mr-1"></i>
              <span>评论于: ${comment.articleTitle}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  getStatusBadgeClass(status) {
    const classes = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'spam': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
  
  getStatusText(status) {
    const texts = {
      'pending': '待审核',
      'approved': '已通过',
      'spam': '垃圾评论'
    };
    return texts[status] || '未知';
  }
  
  getStatusCount(status) {
    return this.comments.filter(comment => comment.status === status).length;
  }
  
  filterComments() {
    const statusFilter = document.getElementById('status-filter').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    
    this.filteredComments = this.comments.filter(comment => {
      const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
      const matchesSearch = !searchInput || 
        comment.content.toLowerCase().includes(searchInput) ||
        comment.author.toLowerCase().includes(searchInput) ||
        comment.articleTitle.toLowerCase().includes(searchInput);
      
      return matchesStatus && matchesSearch;
    });
    
    this.updateCommentsList();
  }
  
  searchComments() {
    this.filterComments();
  }
  
  updateCommentsList() {
    const container = document.getElementById('comments-container');
    container.innerHTML = this.renderCommentItems();
  }
  
  async approveComment(id) {
    try {
      const comment = this.comments.find(c => c.id === id);
      if (comment) {
        comment.status = 'approved';
        // 这里应该更新数据库
        this.showMessage('评论已通过', 'success');
        this.updateCommentsList();
      }
    } catch (error) {
      console.error('通过评论失败:', error);
      this.showMessage('操作失败', 'error');
    }
  }
  
  async markAsSpam(id) {
    try {
      const comment = this.comments.find(c => c.id === id);
      if (comment) {
        comment.status = 'spam';
        // 这里应该更新数据库
        this.showMessage('已标记为垃圾评论', 'success');
        this.updateCommentsList();
      }
    } catch (error) {
      console.error('标记垃圾评论失败:', error);
      this.showMessage('操作失败', 'error');
    }
  }
  
  async deleteComment(id) {
    if (confirm('确定要删除这条评论吗？此操作不可恢复。')) {
      try {
        this.comments = this.comments.filter(c => c.id !== id);
        this.filteredComments = this.filteredComments.filter(c => c.id !== id);
        // 这里应该从数据库删除
        this.showMessage('评论已删除', 'success');
        this.updateCommentsList();
      } catch (error) {
        console.error('删除评论失败:', error);
        this.showMessage('删除失败', 'error');
      }
    }
  }
  
  toggleSelectAll() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.comment-checkbox');
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAll.checked;
    });
  }
  
  updateSelection() {
    const checkboxes = document.querySelectorAll('.comment-checkbox');
    const selectAll = document.getElementById('select-all');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    selectAll.checked = checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
  }
  
  bulkAction(action) {
    const selectedIds = Array.from(document.querySelectorAll('.comment-checkbox:checked'))
      .map(cb => cb.value);
    
    if (selectedIds.length === 0) {
      this.showMessage('请先选择要操作的评论', 'warning');
      return;
    }
    
    const actionText = action === 'approve' ? '通过' : '标记为垃圾';
    if (confirm(`确定要${actionText}选中的 ${selectedIds.length} 条评论吗？`)) {
      selectedIds.forEach(id => {
        if (action === 'approve') {
          this.approveComment(id);
        } else if (action === 'spam') {
          this.markAsSpam(id);
        }
      });
    }
  }
  
  formatDate(date) {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 
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
window.CommentManager = CommentManager;
