// 社交功能组件 - 分享、点赞、评论等
class SocialFeatures {
  constructor() {
    this.likes = this.loadLikes();
    this.shares = this.loadShares();
    this.bookmarks = this.loadBookmarks();
    this.addSocialStyles();
    this.init();
  }

  init() {
    this.setupSocialButtons();
    this.setupShareModal();
    this.setupLikeSystem();
    this.setupBookmarkSystem();
    this.setupSocialStats();
    console.log('✅ 社交功能初始化完成');
  }

  // 设置社交按钮
  setupSocialButtons() {
    // 为每个内容项添加社交按钮
    document.querySelectorAll('.card-hover').forEach((card, index) => {
      this.addSocialButtons(card, index);
    });

    // 添加浮动社交分享栏
    this.createFloatingSocialBar();
  }

  // 添加社交按钮到卡片
  addSocialButtons(card, index) {
    const socialBar = document.createElement('div');
    socialBar.className = 'social-bar absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300';
    
    const itemId = `item-${index}`;
    const isLiked = this.likes.includes(itemId);
    const isBookmarked = this.bookmarks.includes(itemId);

    socialBar.innerHTML = `
      <button onclick="socialFeatures.toggleLike('${itemId}', this)" 
              class="social-btn like-btn w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${isLiked ? 'liked' : ''}"
              data-tooltip="喜欢">
        <i class="fas fa-heart text-sm ${isLiked ? 'text-red-500' : 'text-gray-400'}"></i>
      </button>
      
      <button onclick="socialFeatures.toggleBookmark('${itemId}', this)" 
              class="social-btn bookmark-btn w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${isBookmarked ? 'bookmarked' : ''}"
              data-tooltip="收藏">
        <i class="fas fa-bookmark text-sm ${isBookmarked ? 'text-blue-500' : 'text-gray-400'}"></i>
      </button>
      
      <button onclick="socialFeatures.shareContent('${itemId}', this)" 
              class="social-btn share-btn w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              data-tooltip="分享">
        <i class="fas fa-share text-sm text-gray-400"></i>
      </button>
    `;

    card.style.position = 'relative';
    card.appendChild(socialBar);

    // 悬停显示社交按钮
    card.addEventListener('mouseenter', () => {
      socialBar.classList.remove('opacity-0');
      socialBar.classList.add('opacity-100');
    });

    card.addEventListener('mouseleave', () => {
      socialBar.classList.add('opacity-0');
      socialBar.classList.remove('opacity-100');
    });
  }

  // 创建浮动社交分享栏
  createFloatingSocialBar() {
    const floatingBar = document.createElement('div');
    floatingBar.className = 'floating-social fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3';
    
    floatingBar.innerHTML = `
      <div class="bg-white rounded-full shadow-lg p-2">
        <button onclick="socialFeatures.shareToWeChat()" 
                class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                data-tooltip="分享到微信">
          <i class="fab fa-weixin"></i>
        </button>
      </div>
      
      <div class="bg-white rounded-full shadow-lg p-2">
        <button onclick="socialFeatures.shareToWeibo()" 
                class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                data-tooltip="分享到微博">
          <i class="fab fa-weibo"></i>
        </button>
      </div>
      
      <div class="bg-white rounded-full shadow-lg p-2">
        <button onclick="socialFeatures.shareToQQ()" 
                class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                data-tooltip="分享到QQ">
          <i class="fab fa-qq"></i>
        </button>
      </div>
      
      <div class="bg-white rounded-full shadow-lg p-2">
        <button onclick="socialFeatures.copyPageLink()" 
                class="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                data-tooltip="复制链接">
          <i class="fas fa-link"></i>
        </button>
      </div>
    `;

    document.body.appendChild(floatingBar);
  }

  // 点赞系统
  toggleLike(itemId, button) {
    const icon = button.querySelector('i');
    const isLiked = this.likes.includes(itemId);

    if (isLiked) {
      // 取消点赞
      this.likes = this.likes.filter(id => id !== itemId);
      icon.classList.remove('text-red-500');
      icon.classList.add('text-gray-400');
      button.classList.remove('liked');
      this.showMessage('已取消喜欢', 'info');
    } else {
      // 添加点赞
      this.likes.push(itemId);
      icon.classList.remove('text-gray-400');
      icon.classList.add('text-red-500');
      button.classList.add('liked');
      this.showMessage('已添加到喜欢', 'success');
      
      // 添加点赞动画
      this.createLikeAnimation(button);
    }

    this.saveLikes();
    this.updateSocialStats();
  }

  // 收藏系统
  toggleBookmark(itemId, button) {
    const icon = button.querySelector('i');
    const isBookmarked = this.bookmarks.includes(itemId);

    if (isBookmarked) {
      // 取消收藏
      this.bookmarks = this.bookmarks.filter(id => id !== itemId);
      icon.classList.remove('text-blue-500');
      icon.classList.add('text-gray-400');
      button.classList.remove('bookmarked');
      this.showMessage('已取消收藏', 'info');
    } else {
      // 添加收藏
      this.bookmarks.push(itemId);
      icon.classList.remove('text-gray-400');
      icon.classList.add('text-blue-500');
      button.classList.add('bookmarked');
      this.showMessage('已添加到收藏', 'success');
    }

    this.saveBookmarks();
    this.updateSocialStats();
  }

  // 分享内容
  shareContent(itemId, button) {
    const card = button.closest('.card-hover');
    const title = card.querySelector('h3')?.textContent || '精彩内容';
    const description = card.querySelector('p')?.textContent || '来自光影与代码博客';
    const image = card.querySelector('img')?.src || '';

    this.showShareModal({
      title,
      description,
      image,
      url: window.location.href + '#' + itemId
    });
  }

  // 显示分享模态框
  showShareModal(content) {
    const modal = document.createElement('div');
    modal.className = 'share-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">分享内容</h3>
          <button onclick="this.closest('.share-modal').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="mb-6">
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            ${content.image ? `<img src="${content.image}" alt="" class="w-16 h-16 object-cover rounded">` : ''}
            <div class="flex-1">
              <h4 class="font-medium text-sm">${content.title}</h4>
              <p class="text-xs text-gray-600 mt-1">${content.description.substring(0, 100)}...</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-4">
          <button onclick="socialFeatures.shareToWeChat('${content.url}')" class="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <i class="fab fa-weixin"></i>
            <span class="text-sm">微信</span>
          </button>
          
          <button onclick="socialFeatures.shareToWeibo('${content.title}', '${content.url}')" class="flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <i class="fab fa-weibo"></i>
            <span class="text-sm">微博</span>
          </button>
          
          <button onclick="socialFeatures.shareToQQ('${content.title}', '${content.url}')" class="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fab fa-qq"></i>
            <span class="text-sm">QQ</span>
          </button>
          
          <button onclick="socialFeatures.copyToClipboard('${content.url}')" class="flex items-center justify-center gap-2 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            <i class="fas fa-copy"></i>
            <span class="text-sm">复制</span>
          </button>
        </div>
        
        <div class="border-t pt-4">
          <label class="block text-sm text-gray-600 mb-2">分享链接</label>
          <div class="flex gap-2">
            <input type="text" value="${content.url}" readonly 
                   class="flex-1 px-3 py-2 bg-gray-50 border rounded text-sm">
            <button onclick="socialFeatures.copyToClipboard('${content.url}')" 
                    class="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
              复制
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // 分享到微信
  shareToWeChat(url = window.location.href) {
    // 生成二维码用于微信分享
    this.showQRCode(url, '微信扫码分享');
  }

  // 分享到微博
  shareToWeibo(title = document.title, url = window.location.href) {
    const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  // 分享到QQ
  shareToQQ(title = document.title, url = window.location.href) {
    const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  // 显示二维码
  showQRCode(url, title) {
    const modal = document.createElement('div');
    modal.className = 'qr-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 text-center">
        <h3 class="text-lg font-semibold mb-4">${title}</h3>
        <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <div id="qrcode"></div>
        </div>
        <p class="text-sm text-gray-600 mb-4">使用微信扫描二维码分享</p>
        <button onclick="this.closest('.qr-modal').remove()" 
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          关闭
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // 这里可以集成二维码生成库
    document.getElementById('qrcode').innerHTML = `
      <div class="text-gray-400">
        <i class="fas fa-qrcode text-4xl mb-2"></i>
        <p class="text-xs">二维码生成中...</p>
      </div>
    `;
  }

  // 复制到剪贴板
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showMessage('链接已复制到剪贴板', 'success');
      
      // 关闭分享模态框
      document.querySelector('.share-modal')?.remove();
    } catch (error) {
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
      this.showMessage('链接已复制到剪贴板', 'success');
      document.querySelector('.share-modal')?.remove();
    } catch (err) {
      this.showMessage('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  // 复制页面链接
  copyPageLink() {
    this.copyToClipboard(window.location.href);
  }

  // 创建点赞动画
  createLikeAnimation(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
    heart.className = 'absolute pointer-events-none';
    heart.style.cssText = `
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      animation: likeFloat 1s ease-out forwards;
    `;

    button.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }

  // 更新社交统计
  updateSocialStats() {
    const stats = {
      likes: this.likes.length,
      bookmarks: this.bookmarks.length,
      shares: this.shares.length
    };

    // 更新页面上的统计显示
    document.querySelectorAll('.social-stats').forEach(el => {
      el.innerHTML = `
        <span class="text-red-500"><i class="fas fa-heart"></i> ${stats.likes}</span>
        <span class="text-blue-500"><i class="fas fa-bookmark"></i> ${stats.bookmarks}</span>
        <span class="text-green-500"><i class="fas fa-share"></i> ${stats.shares}</span>
      `;
    });
  }

  // 设置社交统计
  setupSocialStats() {
    // 在页面底部添加社交统计
    const footer = document.querySelector('footer') || document.body;
    const statsContainer = document.createElement('div');
    statsContainer.className = 'social-stats text-center py-4 text-sm text-gray-600';
    
    footer.appendChild(statsContainer);
    this.updateSocialStats();
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

  // 数据持久化
  loadLikes() {
    try {
      return JSON.parse(localStorage.getItem('blog_likes') || '[]');
    } catch {
      return [];
    }
  }

  saveLikes() {
    localStorage.setItem('blog_likes', JSON.stringify(this.likes));
  }

  loadShares() {
    try {
      return JSON.parse(localStorage.getItem('blog_shares') || '[]');
    } catch {
      return [];
    }
  }

  saveShares() {
    localStorage.setItem('blog_shares', JSON.stringify(this.shares));
  }

  loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
    } catch {
      return [];
    }
  }

  saveBookmarks() {
    localStorage.setItem('blog_bookmarks', JSON.stringify(this.bookmarks));
  }

  // 添加CSS动画
  addSocialStyles() {
    if (document.getElementById('social-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'social-styles';
    styles.textContent = `
      @keyframes likeFloat {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -150%) scale(1.5);
        }
      }

      .social-btn:hover {
        transform: scale(1.1);
      }

      .social-btn.liked {
        animation: pulse 0.3s ease;
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }

      .floating-social {
        transition: opacity 0.3s ease;
      }

      .share-modal {
        animation: modalFadeIn 0.3s ease;
      }

      @keyframes modalFadeIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;

    document.head.appendChild(styles);
  }
}

// 导出到全局
window.SocialFeatures = SocialFeatures;
