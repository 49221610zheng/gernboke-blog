// 简单直接的点击处理器
class ClickHandlers {
  constructor() {
    this.init();
  }

  init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupHandlers());
    } else {
      this.setupHandlers();
    }
  }

  setupHandlers() {
    this.setupPhotoHandlers();
    this.setupArticleHandlers();
    this.setupModalHandlers();
    console.log('✅ 点击处理器初始化完成');
  }

  // 设置摄影作品点击处理
  setupPhotoHandlers() {
    // 为所有摄影作品卡片添加点击事件
    const photoCards = document.querySelectorAll('#photography .card-hover');
    photoCards.forEach((card, index) => {
      // 为整个卡片添加点击事件
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // 如果点击的是链接，阻止默认行为
        if (e.target.tagName === 'A') {
          e.preventDefault();
        }
        this.showPhotoDetail(card, index);
      });

      // 为"查看详情"链接添加特殊处理
      const detailLink = card.querySelector('a[href="#"]');
      if (detailLink) {
        detailLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showPhotoDetail(card, index);
        });
      }
    });
  }

  // 设置技术文章点击处理
  setupArticleHandlers() {
    // 为所有技术文章卡片添加点击事件
    const articleCards = document.querySelectorAll('#tech .card-hover');
    articleCards.forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        this.showArticleDetail(card, index);
      });
    });
  }

  // 显示摄影作品详情
  showPhotoDetail(card, index) {
    const img = card.querySelector('img');
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const date = card.querySelector('.text-sm.text-gray-medium').textContent;
    const tag = card.querySelector('.rounded-full').textContent;

    const modal = this.createModal(`
      <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative">
        <button class="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors z-10" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="relative">
          <img src="${img.src}" alt="${img.alt}" class="w-full h-96 object-cover rounded-t-xl">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <span class="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">${tag}</span>
          </div>
        </div>
        
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">${title}</h2>
          <p class="text-gray-600 mb-4">${description}</p>
          
          <div class="border-t pt-4">
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>拍摄日期: ${date}</span>
              <div class="flex items-center gap-4">
                <button onclick="clickHandlers.downloadImage('${img.src}', '${title}')" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-download mr-1"></i>下载
                </button>
                <button onclick="clickHandlers.shareContent('${title}', '${description}')" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-share mr-1"></i>分享
                </button>
              </div>
            </div>
          </div>
          
          <div class="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold mb-2">拍摄参数</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span class="text-gray-500">光圈:</span> <span class="font-medium ml-1">f/8</span></div>
              <div><span class="text-gray-500">快门:</span> <span class="font-medium ml-1">1/125s</span></div>
              <div><span class="text-gray-500">ISO:</span> <span class="font-medium ml-1">100</span></div>
              <div><span class="text-gray-500">焦距:</span> <span class="font-medium ml-1">50mm</span></div>
            </div>
          </div>
        </div>
      </div>
    `);

    document.body.appendChild(modal);
    this.showModal(modal);
  }

  // 显示技术文章详情
  showArticleDetail(card, index) {
    const img = card.querySelector('img');
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const author = card.querySelector('.flex.items-center span').textContent;
    const readTime = card.querySelector('.text-sm.text-gray-medium').textContent;
    const tags = Array.from(card.querySelectorAll('.rounded-full')).map(tag => tag.textContent);

    const modal = this.createModal(`
      <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative">
        <button class="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors z-10" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="relative">
          <img src="${img.src}" alt="${img.alt}" class="w-full h-64 object-cover rounded-t-xl">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div class="flex flex-wrap gap-2">
              ${tags.map(tag => `<span class="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">${title}</h2>
          <div class="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span>作者: ${author}</span>
            <span>${readTime}</span>
          </div>
          
          <div class="prose max-w-none">
            <p class="text-gray-600 mb-6">${description}</p>
            
            <h3>文章概要</h3>
            <p>这是一篇关于${title.toLowerCase()}的详细技术文章。文章深入探讨了相关技术的原理、实现方法和最佳实践。</p>
            
            <h3>主要内容</h3>
            <ul>
              <li>技术背景和应用场景</li>
              <li>核心概念和原理解析</li>
              <li>实际代码示例和演示</li>
              <li>性能优化和最佳实践</li>
              <li>常见问题和解决方案</li>
            </ul>
            
            <h3>适合读者</h3>
            <p>本文适合有一定编程基础的开发者阅读，特别是对相关技术感兴趣的前端和全栈开发者。</p>
          </div>
          
          <div class="border-t pt-4 mt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button onclick="clickHandlers.likeArticle('${title}')" class="text-red-600 hover:text-red-800">
                  <i class="fas fa-heart mr-1"></i>喜欢
                </button>
                <button onclick="clickHandlers.shareContent('${title}', '${description}')" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-share mr-1"></i>分享
                </button>
              </div>
              <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                阅读全文
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    document.body.appendChild(modal);
    this.showModal(modal);
  }

  // 创建模态框
  createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300';
    modal.innerHTML = content;
    return modal;
  }

  // 显示模态框
  showModal(modal) {
    setTimeout(() => {
      modal.classList.add('opacity-100');
      modal.classList.remove('opacity-0');
    }, 10);
  }

  // 设置模态框处理
  setupModalHandlers() {
    // 点击背景关闭模态框
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.remove();
      }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
      }
    });
  }

  // 下载图片
  downloadImage(src, filename) {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${filename}.jpg`;
    link.click();
    this.showMessage('开始下载图片', 'success');
  }

  // 分享内容
  async shareContent(title, description) {
    const shareData = {
      title: title,
      text: description,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        this.copyToClipboard(`${title} - ${description} ${window.location.href}`);
      }
    } else {
      this.copyToClipboard(`${title} - ${description} ${window.location.href}`);
    }
  }

  // 喜欢文章
  likeArticle(title) {
    this.showMessage(`已喜欢文章: ${title}`, 'success');
  }

  // 复制到剪贴板
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showMessage('内容已复制到剪贴板', 'success');
      }).catch(() => {
        this.fallbackCopyTextToClipboard(text);
      });
    } else {
      this.fallbackCopyTextToClipboard(text);
    }
  }

  // 备用复制方法
  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showMessage('内容已复制到剪贴板', 'success');
    } catch (err) {
      this.showMessage('复制失败', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  // 显示消息
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

// 创建全局实例
let clickHandlers;

// 立即初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    clickHandlers = new ClickHandlers();
  });
} else {
  clickHandlers = new ClickHandlers();
}

// 导出到全局
window.clickHandlers = clickHandlers;
window.ClickHandlers = ClickHandlers;
