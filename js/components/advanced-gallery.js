// 高级图片画廊系统 - 提供专业的图片展示体验
class AdvancedGallery {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.isFullscreen = false;
    this.zoomLevel = 1;
    this.init();
  }

  init() {
    this.setupGalleryHandlers();
    this.setupKeyboardControls();
    this.setupTouchControls();
    this.createGalleryInterface();
    console.log('✅ 高级图片画廊初始化完成');
  }

  // 设置画廊处理器
  setupGalleryHandlers() {
    // 为所有图片添加画廊功能
    document.querySelectorAll('#photography img, #tech img').forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openGallery(img, index);
      });
      
      // 添加悬停效果
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
        img.style.transition = 'transform 0.3s ease';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
  }

  // 打开画廊
  openGallery(clickedImg, startIndex = 0) {
    // 收集所有图片
    this.collectImages();
    
    // 找到点击的图片在集合中的索引
    this.currentImageIndex = this.images.findIndex(img => img.src === clickedImg.src);
    if (this.currentImageIndex === -1) {
      this.currentImageIndex = startIndex;
    }

    // 创建画廊界面
    this.showGalleryModal();
  }

  // 收集所有图片
  collectImages() {
    this.images = [];
    
    // 收集摄影作品图片
    document.querySelectorAll('#photography img').forEach(img => {
      this.images.push({
        src: img.src,
        alt: img.alt,
        title: img.closest('.card-hover')?.querySelector('h3')?.textContent || img.alt,
        description: img.closest('.card-hover')?.querySelector('p')?.textContent || '',
        category: 'photography'
      });
    });

    // 收集技术文章图片
    document.querySelectorAll('#tech img').forEach(img => {
      this.images.push({
        src: img.src,
        alt: img.alt,
        title: img.closest('.card-hover')?.querySelector('h3')?.textContent || img.alt,
        description: img.closest('.card-hover')?.querySelector('p')?.textContent || '',
        category: 'tech'
      });
    });
  }

  // 显示画廊模态框
  showGalleryModal() {
    const modal = document.createElement('div');
    modal.id = 'advanced-gallery';
    modal.className = 'fixed inset-0 bg-black z-50 flex items-center justify-center';
    
    modal.innerHTML = `
      <!-- 画廊主体 -->
      <div class="gallery-container relative w-full h-full flex items-center justify-center">
        <!-- 主图片区域 -->
        <div class="gallery-main relative flex-1 flex items-center justify-center p-4">
          <img id="gallery-main-image" src="${this.images[this.currentImageIndex].src}" 
               alt="${this.images[this.currentImageIndex].alt}"
               class="max-w-full max-h-full object-contain transition-transform duration-300 cursor-grab">
        </div>

        <!-- 左侧导航 -->
        <button id="gallery-prev" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors z-10">
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- 右侧导航 -->
        <button id="gallery-next" class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors z-10">
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- 顶部工具栏 -->
        <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div class="flex items-center gap-4">
            <!-- 图片计数 -->
            <span class="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              ${this.currentImageIndex + 1} / ${this.images.length}
            </span>
            
            <!-- 分类标签 -->
            <span class="text-white bg-blue-500 bg-opacity-80 px-3 py-1 rounded-full text-sm">
              ${this.images[this.currentImageIndex].category === 'photography' ? '摄影作品' : '技术文章'}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- 缩放控制 -->
            <button id="gallery-zoom-out" class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
              <i class="fas fa-search-minus"></i>
            </button>
            <button id="gallery-zoom-in" class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
              <i class="fas fa-search-plus"></i>
            </button>
            
            <!-- 全屏切换 -->
            <button id="gallery-fullscreen" class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
              <i class="fas fa-expand"></i>
            </button>
            
            <!-- 下载按钮 -->
            <button id="gallery-download" class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
              <i class="fas fa-download"></i>
            </button>
            
            <!-- 关闭按钮 -->
            <button id="gallery-close" class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- 底部信息栏 -->
        <div class="absolute bottom-4 left-4 right-4 z-10">
          <div class="bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">${this.images[this.currentImageIndex].title}</h3>
            <p class="text-sm text-gray-300">${this.images[this.currentImageIndex].description}</p>
          </div>
        </div>

        <!-- 缩略图导航 -->
        <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div class="flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg max-w-md overflow-x-auto">
            ${this.images.map((img, index) => `
              <img src="${img.src}" alt="${img.alt}" 
                   class="w-12 h-12 object-cover rounded cursor-pointer transition-opacity ${
                     index === this.currentImageIndex ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                   }"
                   onclick="advancedGallery.goToImage(${index})">
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // 绑定事件
    this.bindGalleryEvents();
    
    // 添加进入动画
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }

  // 绑定画廊事件
  bindGalleryEvents() {
    const modal = document.getElementById('advanced-gallery');
    const mainImage = document.getElementById('gallery-main-image');

    // 导航按钮
    document.getElementById('gallery-prev').addEventListener('click', () => this.previousImage());
    document.getElementById('gallery-next').addEventListener('click', () => this.nextImage());
    
    // 工具栏按钮
    document.getElementById('gallery-zoom-in').addEventListener('click', () => this.zoomIn());
    document.getElementById('gallery-zoom-out').addEventListener('click', () => this.zoomOut());
    document.getElementById('gallery-fullscreen').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('gallery-download').addEventListener('click', () => this.downloadImage());
    document.getElementById('gallery-close').addEventListener('click', () => this.closeGallery());

    // 图片拖拽
    this.setupImageDrag(mainImage);

    // 鼠标滚轮缩放
    mainImage.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeGallery();
      }
    });
  }

  // 设置图片拖拽
  setupImageDrag(img) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    img.addEventListener('mousedown', (e) => {
      if (this.zoomLevel > 1) {
        isDragging = true;
        img.style.cursor = 'grabbing';
        
        startX = e.clientX;
        startY = e.clientY;
        
        const transform = img.style.transform;
        const translateMatch = transform.match(/translate\(([^,]+),([^)]+)\)/);
        initialX = translateMatch ? parseFloat(translateMatch[1]) : 0;
        initialY = translateMatch ? parseFloat(translateMatch[2]) : 0;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;
        
        img.style.transform = `scale(${this.zoomLevel}) translate(${newX}px, ${newY}px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      img.style.cursor = 'grab';
    });
  }

  // 设置键盘控制
  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('advanced-gallery')) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextImage();
          break;
        case 'Escape':
          e.preventDefault();
          this.closeGallery();
          break;
        case '+':
        case '=':
          e.preventDefault();
          this.zoomIn();
          break;
        case '-':
          e.preventDefault();
          this.zoomOut();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;
      }
    });
  }

  // 设置触摸控制
  setupTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      if (!document.getElementById('advanced-gallery')) return;
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      if (!document.getElementById('advanced-gallery')) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // 水平滑动切换图片
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.previousImage();
        } else {
          this.nextImage();
        }
      }
      
      // 垂直滑动关闭画廊
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 100) {
        this.closeGallery();
      }
    });
  }

  // 导航方法
  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateGalleryImage();
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateGalleryImage();
  }

  goToImage(index) {
    this.currentImageIndex = index;
    this.updateGalleryImage();
  }

  // 更新画廊图片
  updateGalleryImage() {
    const mainImage = document.getElementById('gallery-main-image');
    const currentImage = this.images[this.currentImageIndex];
    
    // 重置缩放
    this.zoomLevel = 1;
    mainImage.style.transform = 'scale(1) translate(0, 0)';
    
    // 更新图片
    mainImage.src = currentImage.src;
    mainImage.alt = currentImage.alt;
    
    // 更新信息
    this.updateGalleryInfo();
    
    // 更新缩略图
    this.updateThumbnails();
  }

  // 更新画廊信息
  updateGalleryInfo() {
    const currentImage = this.images[this.currentImageIndex];
    
    // 更新计数
    const counter = document.querySelector('.text-white.bg-black.bg-opacity-50');
    if (counter) {
      counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
    }
    
    // 更新分类
    const category = document.querySelector('.text-white.bg-blue-500');
    if (category) {
      category.textContent = currentImage.category === 'photography' ? '摄影作品' : '技术文章';
    }
    
    // 更新标题和描述
    const title = document.querySelector('.absolute.bottom-4 h3');
    const description = document.querySelector('.absolute.bottom-4 p');
    
    if (title) title.textContent = currentImage.title;
    if (description) description.textContent = currentImage.description;
  }

  // 更新缩略图
  updateThumbnails() {
    const thumbnails = document.querySelectorAll('.absolute.bottom-20 img');
    thumbnails.forEach((thumb, index) => {
      if (index === this.currentImageIndex) {
        thumb.className = 'w-12 h-12 object-cover rounded cursor-pointer transition-opacity opacity-100 ring-2 ring-white';
      } else {
        thumb.className = 'w-12 h-12 object-cover rounded cursor-pointer transition-opacity opacity-60 hover:opacity-80';
      }
    });
  }

  // 缩放控制
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
    this.updateZoom();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
    this.updateZoom();
  }

  updateZoom() {
    const mainImage = document.getElementById('gallery-main-image');
    const currentTransform = mainImage.style.transform;
    const translateMatch = currentTransform.match(/translate\(([^)]+)\)/);
    const translatePart = translateMatch ? translateMatch[0] : 'translate(0, 0)';
    
    mainImage.style.transform = `scale(${this.zoomLevel}) ${translatePart}`;
    
    // 更新光标
    mainImage.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
  }

  // 全屏切换
  toggleFullscreen() {
    const modal = document.getElementById('advanced-gallery');
    const fullscreenBtn = document.getElementById('gallery-fullscreen');
    
    if (!this.isFullscreen) {
      if (modal.requestFullscreen) {
        modal.requestFullscreen();
      } else if (modal.webkitRequestFullscreen) {
        modal.webkitRequestFullscreen();
      } else if (modal.msRequestFullscreen) {
        modal.msRequestFullscreen();
      }
      fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      this.isFullscreen = false;
    }
  }

  // 下载图片
  downloadImage() {
    const currentImage = this.images[this.currentImageIndex];
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = `${currentImage.title}.jpg`;
    link.click();
  }

  // 关闭画廊
  closeGallery() {
    const modal = document.getElementById('advanced-gallery');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
    
    // 重置状态
    this.zoomLevel = 1;
    this.isFullscreen = false;
  }

  // 创建画廊界面
  createGalleryInterface() {
    // 为现有图片添加画廊图标
    document.querySelectorAll('#photography .image-zoom, #tech .image-zoom').forEach(container => {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 transition-all duration-300 hover:bg-opacity-30 hover:opacity-100';
      overlay.innerHTML = `
        <div class="text-white text-center">
          <i class="fas fa-search-plus text-2xl mb-2"></i>
          <p class="text-sm">点击查看大图</p>
        </div>
      `;
      
      container.style.position = 'relative';
      container.appendChild(overlay);
    });
  }
}

// 导出到全局
window.AdvancedGallery = AdvancedGallery;
