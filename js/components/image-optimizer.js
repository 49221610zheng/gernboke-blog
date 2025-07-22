// 图片优化组件
class ImageOptimizer {
  constructor() {
    this.imageCache = new Map();
    this.loadingImages = new Set();
    this.observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    this.init();
  }
  
  init() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupProgressiveLoading();
    this.setupImageModal();
    this.setupImagePreloading();
    this.setupWebPSupport();
    console.log('✅ 图片优化器初始化完成');
  }
  
  // 懒加载设置
  setupLazyLoading() {
    this.lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.lazyImageObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    // 观察所有懒加载图片
    this.observeImages();
    
    // 监听DOM变化，观察新添加的图片
    this.setupMutationObserver();
  }
  
  // 观察图片
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    lazyImages.forEach(img => {
      this.lazyImageObserver.observe(img);
      this.addImagePlaceholder(img);
    });
  }
  
  // 添加图片占位符
  addImagePlaceholder(img) {
    if (img.dataset.placeholder !== 'false') {
      const placeholder = this.createPlaceholder(img);
      img.parentNode.insertBefore(placeholder, img);
      img.style.display = 'none';
    }
  }
  
  // 创建占位符
  createPlaceholder(img) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder bg-gray-200 animate-pulse rounded-lg';
    placeholder.style.width = img.getAttribute('width') || '100%';
    placeholder.style.height = img.getAttribute('height') || '200px';
    placeholder.style.aspectRatio = img.dataset.aspectRatio || 'auto';
    
    // 添加加载图标
    placeholder.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-gray-400">
          <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    `;
    
    return placeholder;
  }
  
  // 加载图片
  async loadImage(img) {
    const src = img.dataset.src || img.src;
    if (!src || this.loadingImages.has(src)) return;
    
    this.loadingImages.add(src);
    
    try {
      // 检查缓存
      if (this.imageCache.has(src)) {
        this.applyImage(img, this.imageCache.get(src));
        return;
      }
      
      // 预加载图片
      const imageBlob = await this.preloadImage(src);
      const imageUrl = URL.createObjectURL(imageBlob);
      
      // 缓存图片
      this.imageCache.set(src, imageUrl);
      
      // 应用图片
      this.applyImage(img, imageUrl);
      
    } catch (error) {
      console.error('图片加载失败:', error);
      this.handleImageError(img);
    } finally {
      this.loadingImages.delete(src);
    }
  }
  
  // 预加载图片
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      fetch(src)
        .then(response => {
          if (!response.ok) throw new Error('网络响应错误');
          return response.blob();
        })
        .then(resolve)
        .catch(reject);
    });
  }
  
  // 应用图片
  applyImage(img, src) {
    const placeholder = img.previousElementSibling;
    
    // 设置图片源
    img.src = src;
    img.style.opacity = '0';
    img.style.display = 'block';
    
    // 图片加载完成后的处理
    img.onload = () => {
      // 淡入效果
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity = '1';
      
      // 移除占位符
      if (placeholder && placeholder.classList.contains('image-placeholder')) {
        placeholder.style.transition = 'opacity 0.3s ease';
        placeholder.style.opacity = '0';
        setTimeout(() => {
          placeholder.remove();
        }, 300);
      }
      
      // 添加加载完成类
      img.classList.add('image-loaded');
      
      // 触发自定义事件
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { src: img.src }
      }));
    };
    
    img.onerror = () => {
      this.handleImageError(img);
    };
  }
  
  // 处理图片错误
  handleImageError(img) {
    const placeholder = img.previousElementSibling;
    
    if (placeholder && placeholder.classList.contains('image-placeholder')) {
      placeholder.innerHTML = `
        <div class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center">
            <i class="fas fa-image-slash text-2xl mb-2"></i>
            <p class="text-sm">图片加载失败</p>
          </div>
        </div>
      `;
      placeholder.classList.add('image-error');
    }
  }
  
  // 图片优化
  setupImageOptimization() {
    // 自动WebP转换
    this.convertToWebP();
    
    // 响应式图片
    this.setupResponsiveImages();
    
    // 图片压缩
    this.setupImageCompression();
  }
  
  // WebP支持检测
  setupWebPSupport() {
    this.supportsWebP = false;
    
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      this.supportsWebP = (webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }
  
  // WebP转换
  convertToWebP() {
    if (!this.supportsWebP) return;
    
    document.querySelectorAll('img[data-webp]').forEach(img => {
      const webpSrc = img.dataset.webp;
      if (webpSrc) {
        img.dataset.src = webpSrc;
      }
    });
  }
  
  // 响应式图片
  setupResponsiveImages() {
    const images = document.querySelectorAll('img[data-sizes]');
    
    images.forEach(img => {
      const sizes = JSON.parse(img.dataset.sizes || '{}');
      const currentWidth = window.innerWidth;
      
      let bestSrc = img.src;
      let bestWidth = 0;
      
      Object.entries(sizes).forEach(([width, src]) => {
        const w = parseInt(width);
        if (w <= currentWidth && w > bestWidth) {
          bestWidth = w;
          bestSrc = src;
        }
      });
      
      if (bestSrc !== img.src) {
        img.dataset.src = bestSrc;
      }
    });
  }
  
  // 渐进式加载
  setupProgressiveLoading() {
    document.querySelectorAll('img[data-progressive]').forEach(img => {
      const lowQualitySrc = img.dataset.progressive;
      const highQualitySrc = img.dataset.src || img.src;
      
      // 先加载低质量图片
      img.src = lowQualitySrc;
      img.classList.add('progressive-loading');
      
      // 预加载高质量图片
      const highQualityImg = new Image();
      highQualityImg.onload = () => {
        img.src = highQualitySrc;
        img.classList.remove('progressive-loading');
        img.classList.add('progressive-loaded');
      };
      highQualityImg.src = highQualitySrc;
    });
  }
  
  // 图片模态框
  setupImageModal() {
    document.addEventListener('click', (e) => {
      const img = e.target.closest('img[data-modal]');
      if (img) {
        e.preventDefault();
        this.showImageModal(img);
      }
    });
  }
  
  // 显示图片模态框
  showImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 image-modal';
    modal.innerHTML = `
      <div class="relative max-w-full max-h-full p-4">
        <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10" onclick="this.closest('.image-modal').remove()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="relative">
          <img src="${img.src}" alt="${img.alt}" class="max-w-full max-h-screen object-contain">
          
          <div class="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">${img.alt || '图片'}</h3>
            <div class="flex items-center justify-between text-sm">
              <span>点击空白区域关闭</span>
              <div class="flex space-x-4">
                <button onclick="imageOptimizer.downloadImage('${img.src}', '${img.alt || 'image'}')" class="hover:text-blue-300">
                  <i class="fas fa-download mr-1"></i>下载
                </button>
                <button onclick="imageOptimizer.shareImage('${img.src}')" class="hover:text-blue-300">
                  <i class="fas fa-share mr-1"></i>分享
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 点击空白区域关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    document.body.appendChild(modal);
    
    // 添加动画
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }
  
  // 图片预加载
  setupImagePreloading() {
    // 预加载关键图片
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
      this.preloadImage(img.dataset.preload || img.src);
    });
    
    // 预加载下一页图片
    this.preloadNextPageImages();
  }
  
  // 预加载下一页图片
  preloadNextPageImages() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        // 这里可以预加载链接页面的关键图片
      });
    });
  }
  
  // 监听DOM变化
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            const images = node.querySelectorAll ? node.querySelectorAll('img[data-src], img[loading="lazy"]') : [];
            images.forEach(img => {
              this.lazyImageObserver.observe(img);
              this.addImagePlaceholder(img);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 下载图片
  downloadImage(src, filename) {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename + '.jpg';
    link.click();
  }
  
  // 分享图片
  async shareImage(src) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '分享图片',
          url: src
        });
      } catch (error) {
        console.log('分享失败:', error);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(src).then(() => {
        alert('图片链接已复制到剪贴板');
      });
    }
  }
  
  // 添加样式
  addImageStyles() {
    if (document.getElementById('image-optimizer-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'image-optimizer-styles';
    styles.textContent = `
      .image-placeholder {
        transition: opacity 0.3s ease;
      }
      
      .image-placeholder.image-error {
        background-color: #fee2e2;
        border: 2px dashed #fca5a5;
      }
      
      .progressive-loading {
        filter: blur(5px);
        transition: filter 0.3s ease;
      }
      
      .progressive-loaded {
        filter: blur(0);
      }
      
      .image-modal {
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      img[data-modal] {
        cursor: zoom-in;
      }
      
      .image-loaded {
        animation: imageAppear 0.3s ease;
      }
      
      @keyframes imageAppear {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  // 添加样式方法
  addImageStyles() {
    if (document.getElementById('image-optimizer-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'image-optimizer-styles';
    styles.textContent = `
      .image-placeholder {
        transition: opacity 0.3s ease;
      }

      .image-placeholder.image-error {
        background-color: #fee2e2;
        border: 2px dashed #fca5a5;
      }

      .progressive-loading {
        filter: blur(5px);
        transition: filter 0.3s ease;
      }

      .progressive-loaded {
        filter: blur(0);
      }

      .image-modal {
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      img[data-modal] {
        cursor: zoom-in;
      }

      .image-loaded {
        animation: imageAppear 0.3s ease;
      }

      @keyframes imageAppear {
        from {
          opacity: 0;
          transform: scale(0.95);
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
window.ImageOptimizer = ImageOptimizer;
