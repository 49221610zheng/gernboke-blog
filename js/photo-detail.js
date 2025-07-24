// 照片详情页面功能
class PhotoDetail {
  constructor() {
    this.photos = {
      'city-night': {
        title: '城市夜景',
        description: '这张照片拍摄于北京CBD核心区域，展现了现代都市的繁华夜景。通过长曝光技术捕捉了车流的光轨，与高楼大厦的灯光形成了美丽的对比。',
        image: 'https://picsum.photos/id/29/1200/800',
        date: '2023年6月10日',
        location: '北京CBD',
        category: '城市摄影',
        camera: 'Sony A7M3',
        lens: '16-35mm F4',
        focal: '24mm',
        aperture: 'f/8',
        shutter: '30s',
        iso: '100',
        tags: ['城市摄影', '夜景', '长曝光', '光轨', '北京'],
        likes: 128
      },
      'mountain-lake': {
        title: '山间湖泊',
        description: '清晨时分，薄雾缭绕的高山湖泊，宁静而神秘。远山如黛，湖水如镜，完美诠释了大自然的宁静之美。',
        image: 'https://picsum.photos/id/15/1200/800',
        date: '2023年5月20日',
        location: '四川九寨沟',
        category: '风光摄影',
        camera: 'Sony A7M3',
        lens: '24-70mm F2.8',
        focal: '35mm',
        aperture: 'f/11',
        shutter: '1/60s',
        iso: '200',
        tags: ['风光摄影', '湖泊', '山景', '晨雾', '九寨沟'],
        likes: 256
      },
      'street-moment': {
        title: '街头瞬间',
        description: '捕捉城市街头的生动瞬间，光影交错中的人文故事。每一个路过的行人都有自己的故事，而摄影师的任务就是定格这些珍贵的瞬间。',
        image: 'https://picsum.photos/id/1062/1200/800',
        date: '2023年4月15日',
        location: '上海外滩',
        category: '街头摄影',
        camera: 'Sony A7M3',
        lens: '85mm F1.8',
        focal: '85mm',
        aperture: 'f/2.8',
        shutter: '1/125s',
        iso: '800',
        tags: ['街头摄影', '人文', '黑白', '瞬间', '上海'],
        likes: 89
      }
    };
    
    this.currentPhotoId = null;
    this.isLiked = false;
    
    this.init();
  }

  init() {
    // 从URL获取照片ID
    const urlParams = new URLSearchParams(window.location.search);
    const photoId = urlParams.get('id') || 'city-night';

    // 尝试从主页内容加载器获取数据
    this.loadDynamicPhotos();

    // 加载照片内容
    this.loadPhoto(photoId);

    // 设置移动端菜单
    this.setupMobileMenu();

    // 设置键盘导航
    this.setupKeyboardNavigation();

    console.log('📸 照片详情页面已初始化');
  }

  loadDynamicPhotos() {
    try {
      // 从localStorage加载管理端更新的照片
      const homepageData = localStorage.getItem('homepage_content');
      if (homepageData) {
        const data = JSON.parse(homepageData);
        if (data.photos) {
          this.photos = { ...this.photos, ...data.photos };
          console.log('📸 从管理端加载照片数据');
        }
      }
    } catch (error) {
      console.error('❌ 动态照片加载失败:', error);
    }
  }

  loadPhoto(photoId) {
    const photo = this.photos[photoId];
    if (!photo) {
      console.error('照片未找到:', photoId);
      return;
    }

    this.currentPhotoId = photoId;
    
    // 更新页面标题
    document.title = `${photo.title} - 光影与代码`;
    
    // 更新照片信息
    document.getElementById('photo-title').textContent = photo.title;
    document.getElementById('photo-description').textContent = photo.description;
    document.getElementById('main-photo').src = photo.image;
    document.getElementById('main-photo').alt = photo.title;
    
    // 更新拍摄信息
    this.updatePhotoInfo(photo);
    
    // 更新EXIF信息
    this.updateExifInfo(photo);
    
    // 更新标签
    this.updateTags(photo.tags);
    
    // 更新点赞数
    this.updateLikeCount(photo.likes);
    
    console.log('📷 照片已加载:', photo.title);
  }

  updatePhotoInfo(photo) {
    const infoContainer = document.querySelector('.space-y-3');
    if (infoContainer) {
      const dateInfo = infoContainer.children[0].querySelector('span');
      const locationInfo = infoContainer.children[1].querySelector('span');
      const categoryInfo = infoContainer.children[2].querySelector('span');
      
      if (dateInfo) dateInfo.textContent = `拍摄时间：${photo.date}`;
      if (locationInfo) locationInfo.textContent = `拍摄地点：${photo.location}`;
      if (categoryInfo) categoryInfo.textContent = `分类：${photo.category}`;
    }
  }

  updateExifInfo(photo) {
    const exifGrid = document.querySelector('.exif-grid');
    if (exifGrid) {
      const exifItems = exifGrid.children;
      
      // 更新EXIF信息
      if (exifItems[0]) exifItems[0].querySelector('.font-medium').textContent = photo.camera;
      if (exifItems[1]) exifItems[1].querySelector('.font-medium').textContent = photo.lens;
      if (exifItems[2]) exifItems[2].querySelector('.font-medium').textContent = photo.focal;
      if (exifItems[3]) exifItems[3].querySelector('.font-medium').textContent = photo.aperture;
      if (exifItems[4]) exifItems[4].querySelector('.font-medium').textContent = photo.shutter;
      if (exifItems[5]) exifItems[5].querySelector('.font-medium').textContent = photo.iso;
    }
  }

  updateTags(tags) {
    const tagsContainer = document.querySelector('.flex.flex-wrap.gap-2');
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      
      tags.forEach((tag, index) => {
        const tagElement = document.createElement('span');
        tagElement.className = index === 0 
          ? 'text-xs bg-primary/10 text-primary px-3 py-1 rounded-full'
          : 'text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }
  }

  updateLikeCount(likes) {
    const likeButton = document.querySelector('button[onclick="likePhoto()"] span');
    if (likeButton) {
      likeButton.textContent = `收藏 (${likes})`;
    }
  }

  setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        console.log('移动端菜单点击');
      });
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Escape':
          this.closePhotoViewer();
          break;
        case ' ':
        case 'Enter':
          if (!document.getElementById('photo-viewer').classList.contains('hidden')) {
            e.preventDefault();
            this.closePhotoViewer();
          } else {
            this.openPhotoViewer();
          }
          break;
        case 'ArrowLeft':
          this.previousPhoto();
          break;
        case 'ArrowRight':
          this.nextPhoto();
          break;
      }
    });
  }

  openPhotoViewer() {
    const viewer = document.getElementById('photo-viewer');
    const viewerPhoto = document.getElementById('viewer-photo');
    const mainPhoto = document.getElementById('main-photo');
    
    viewerPhoto.src = mainPhoto.src;
    viewerPhoto.alt = mainPhoto.alt;
    
    viewer.classList.remove('hidden');
    viewer.classList.add('flex');
    
    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
    
    console.log('🔍 全屏查看器已打开');
  }

  closePhotoViewer() {
    const viewer = document.getElementById('photo-viewer');
    
    viewer.classList.add('hidden');
    viewer.classList.remove('flex');
    
    // 恢复页面滚动
    document.body.style.overflow = '';
    
    console.log('❌ 全屏查看器已关闭');
  }

  downloadPhoto() {
    const photo = this.photos[this.currentPhotoId];
    if (!photo) return;
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = photo.image;
    link.download = `${photo.title}.jpg`;
    link.target = '_blank';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📥 照片下载已触发:', photo.title);
    
    // 显示下载提示
    this.showNotification('照片下载已开始', 'success');
  }

  sharePhoto() {
    const photo = this.photos[this.currentPhotoId];
    if (!photo) return;
    
    const shareData = {
      title: photo.title,
      text: photo.description,
      url: window.location.href
    };
    
    if (navigator.share) {
      // 使用原生分享API
      navigator.share(shareData).then(() => {
        console.log('📤 照片分享成功');
        this.showNotification('分享成功', 'success');
      }).catch((error) => {
        console.error('分享失败:', error);
        this.fallbackShare(shareData);
      });
    } else {
      // 降级到复制链接
      this.fallbackShare(shareData);
    }
  }

  fallbackShare(shareData) {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(shareData.url).then(() => {
      this.showNotification('链接已复制到剪贴板', 'success');
    }).catch(() => {
      this.showNotification('分享失败，请手动复制链接', 'error');
    });
  }

  likePhoto() {
    const photo = this.photos[this.currentPhotoId];
    if (!photo) return;
    
    this.isLiked = !this.isLiked;
    
    if (this.isLiked) {
      photo.likes++;
      this.showNotification('已添加到收藏', 'success');
    } else {
      photo.likes--;
      this.showNotification('已从收藏中移除', 'info');
    }
    
    // 更新点赞按钮样式
    const likeButton = document.querySelector('button[onclick="likePhoto()"]');
    const icon = likeButton.querySelector('i');
    
    if (this.isLiked) {
      icon.className = 'fa fa-heart';
      likeButton.classList.add('border-red-500', 'text-red-500');
      likeButton.classList.remove('border-gray-300', 'text-gray-700');
    } else {
      icon.className = 'fa fa-heart-o';
      likeButton.classList.remove('border-red-500', 'text-red-500');
      likeButton.classList.add('border-gray-300', 'text-gray-700');
    }
    
    // 更新点赞数
    this.updateLikeCount(photo.likes);
    
    console.log('❤️ 点赞状态已更新:', this.isLiked);
  }

  previousPhoto() {
    const photoIds = Object.keys(this.photos);
    const currentIndex = photoIds.indexOf(this.currentPhotoId);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : photoIds.length - 1;
    const previousPhotoId = photoIds[previousIndex];
    
    // 更新URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('id', previousPhotoId);
    window.history.pushState({}, '', newUrl);
    
    // 加载新照片
    this.loadPhoto(previousPhotoId);
  }

  nextPhoto() {
    const photoIds = Object.keys(this.photos);
    const currentIndex = photoIds.indexOf(this.currentPhotoId);
    const nextIndex = currentIndex < photoIds.length - 1 ? currentIndex + 1 : 0;
    const nextPhotoId = photoIds[nextIndex];
    
    // 更新URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('id', nextPhotoId);
    window.history.pushState({}, '', newUrl);
    
    // 加载新照片
    this.loadPhoto(nextPhotoId);
  }

  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300`;
    
    // 根据类型设置样式
    switch (type) {
      case 'success':
        notification.classList.add('bg-green-500');
        break;
      case 'error':
        notification.classList.add('bg-red-500');
        break;
      case 'info':
      default:
        notification.classList.add('bg-blue-500');
        break;
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }
}

// 全局函数（供HTML调用）
function openPhotoViewer() {
  window.photoDetail.openPhotoViewer();
}

function closePhotoViewer() {
  window.photoDetail.closePhotoViewer();
}

function downloadPhoto() {
  window.photoDetail.downloadPhoto();
}

function sharePhoto() {
  window.photoDetail.sharePhoto();
}

function likePhoto() {
  window.photoDetail.likePhoto();
}

// 初始化照片详情页面
document.addEventListener('DOMContentLoaded', () => {
  window.photoDetail = new PhotoDetail();
});
