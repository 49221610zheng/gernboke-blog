// 内容交互处理器 - 处理作品详情和文章点击
class ContentInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupPhotoDetailHandlers();
    this.setupArticleHandlers();
    this.setupModalHandlers();
    console.log('✅ 内容交互处理器初始化完成');
  }

  // 设置摄影作品详情处理
  setupPhotoDetailHandlers() {
    // 为所有"查看详情"链接添加点击事件
    document.querySelectorAll('a[href="#"]:contains("查看详情")').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const photoCard = link.closest('.bg-light, .bg-white');
        this.showPhotoDetail(photoCard);
      });
    });

    // 使用更通用的选择器
    document.addEventListener('click', (e) => {
      if (e.target.textContent && e.target.textContent.includes('查看详情')) {
        e.preventDefault();
        const photoCard = e.target.closest('.bg-light, .bg-white, [class*="rounded"]');
        if (photoCard) {
          this.showPhotoDetail(photoCard);
        }
      }
    });
  }

  // 设置技术文章处理
  setupArticleHandlers() {
    // 为技术分享区域的文章卡片添加点击事件
    document.querySelectorAll('#tech .card-hover').forEach(card => {
      card.addEventListener('click', (e) => {
        // 如果点击的不是链接，则显示文章详情
        if (!e.target.closest('a')) {
          this.showArticleDetail(card);
        }
      });
      
      // 添加鼠标悬停效果
      card.style.cursor = 'pointer';
    });
  }

  // 显示摄影作品详情
  showPhotoDetail(photoCard) {
    if (!photoCard) return;

    // 提取作品信息
    const img = photoCard.querySelector('img');
    const title = photoCard.querySelector('h3')?.textContent || '摄影作品';
    const description = photoCard.querySelector('p')?.textContent || '精美的摄影作品';
    const date = photoCard.querySelector('.text-sm.text-gray-medium')?.textContent || '2023-06-01';
    const tags = Array.from(photoCard.querySelectorAll('.rounded-full')).map(tag => tag.textContent);

    // 创建详情模态框
    const modal = this.createPhotoModal({
      src: img?.src || 'https://picsum.photos/800/600',
      alt: img?.alt || title,
      title,
      description,
      date,
      tags
    });

    document.body.appendChild(modal);
    
    // 添加显示动画
    setTimeout(() => {
      modal.classList.add('opacity-100');
      modal.classList.remove('opacity-0');
    }, 10);
  }

  // 显示文章详情
  showArticleDetail(articleCard) {
    if (!articleCard) return;

    // 提取文章信息
    const img = articleCard.querySelector('img');
    const title = articleCard.querySelector('h3')?.textContent || '技术文章';
    const description = articleCard.querySelector('p')?.textContent || '精彩的技术分享';
    const author = articleCard.querySelector('.text-sm:not(.text-gray-medium)')?.textContent || '摄影程序员';
    const readTime = articleCard.querySelector('.text-gray-medium:last-child')?.textContent || '5分钟阅读';
    const tags = Array.from(articleCard.querySelectorAll('.rounded-full')).map(tag => tag.textContent);

    // 创建文章详情模态框
    const modal = this.createArticleModal({
      src: img?.src || 'https://picsum.photos/800/400',
      alt: img?.alt || title,
      title,
      description,
      author,
      readTime,
      tags
    });

    document.body.appendChild(modal);
    
    // 添加显示动画
    setTimeout(() => {
      modal.classList.add('opacity-100');
      modal.classList.remove('opacity-0');
    }, 10);
  }

  // 创建摄影作品模态框
  createPhotoModal({ src, alt, title, description, date, tags }) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300 photo-modal';
    
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative">
        <button class="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors z-10" onclick="this.closest('.photo-modal').remove()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="relative">
          <img src="${src}" alt="${alt}" class="w-full h-96 object-cover rounded-t-xl">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div class="flex flex-wrap gap-2 mb-2">
              ${tags.map(tag => `<span class="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">${title}</h2>
          <p class="text-gray-600 mb-4">${description}</p>
          
          <div class="border-t pt-4">
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>拍摄日期: ${date}</span>
              <div class="flex items-center gap-4">
                <button onclick="contentInteractions.downloadImage('${src}', '${title}')" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-download mr-1"></i>下载
                </button>
                <button onclick="contentInteractions.shareContent('${title}', '${description}')" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-share mr-1"></i>分享
                </button>
              </div>
            </div>
          </div>
          
          <div class="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold mb-2">拍摄参数</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-500">光圈:</span>
                <span class="font-medium ml-1">f/8</span>
              </div>
              <div>
                <span class="text-gray-500">快门:</span>
                <span class="font-medium ml-1">1/125s</span>
              </div>
              <div>
                <span class="text-gray-500">ISO:</span>
                <span class="font-medium ml-1">100</span>
              </div>
              <div>
                <span class="text-gray-500">焦距:</span>
                <span class="font-medium ml-1">50mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // 创建文章详情模态框
  createArticleModal({ src, alt, title, description, author, readTime, tags }) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300 article-modal';
    
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative">
        <button class="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors z-10" onclick="this.closest('.article-modal').remove()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="relative">
          <img src="${src}" alt="${alt}" class="w-full h-64 object-cover rounded-t-xl">
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
                <button onclick="contentInteractions.likeArticle('${title}')" class="text-red-600 hover:text-red-800">
                  <i class="fas fa-heart mr-1"></i>喜欢
                </button>
                <button onclick="contentInteractions.shareContent('${title}', '${description}')" class="text-blue-600 hover:text-blue-800">
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
    `;

    return modal;
  }

  // 设置模态框处理
  setupModalHandlers() {
    // 点击背景关闭模态框
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('photo-modal') || e.target.classList.contains('article-modal')) {
        e.target.remove();
      }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.photo-modal, .article-modal');
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
  }

  // 分享内容
  async shareContent(title, description) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href
        });
      } catch (error) {
        console.log('分享失败:', error);
        this.copyToClipboard(`${title} - ${description} ${window.location.href}`);
      }
    } else {
      this.copyToClipboard(`${title} - ${description} ${window.location.href}`);
    }
  }

  // 喜欢文章
  likeArticle(title) {
    // 这里可以添加实际的点赞逻辑
    this.showMessage(`已喜欢文章: ${title}`, 'success');
  }

  // 复制到剪贴板
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showMessage('内容已复制到剪贴板', 'success');
    }).catch(() => {
      this.showMessage('复制失败', 'error');
    });
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

// 扩展String原型以支持contains方法
if (!String.prototype.contains) {
  String.prototype.contains = function(search) {
    return this.indexOf(search) !== -1;
  };
}

// 扩展NodeList以支持contains选择器
document.querySelectorAll = (function(original) {
  return function(selector) {
    if (selector.includes(':contains(')) {
      const match = selector.match(/(.*):contains\("([^"]+)"\)(.*)/);
      if (match) {
        const [, beforeSelector, text, afterSelector] = match;
        const elements = original.call(document, beforeSelector + afterSelector);
        return Array.from(elements).filter(el => el.textContent.includes(text));
      }
    }
    return original.call(document, selector);
  };
})(document.querySelectorAll);

// 导出到全局
window.ContentInteractions = ContentInteractions;
