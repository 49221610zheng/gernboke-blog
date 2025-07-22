// 摄影作品管理模块
class PhotographyManager {
  constructor() {
    this.photos = [];
    this.currentPhoto = null;
    this.isEditing = false;
    this.init();
  }
  
  init() {
    this.loadPhotos();
  }
  
  async loadPhotos() {
    try {
      if (window.databaseService && window.databaseService.photographyService) {
        this.photos = await window.databaseService.photographyService.getAll();
        this.renderPhotoGrid();
      }
    } catch (error) {
      console.error('加载摄影作品失败:', error);
    }
  }
  
  renderPhotoGrid() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">摄影作品管理</h1>
          <button onclick="photographyManager.showUploadForm()" class="btn-primary">
            <i class="fas fa-plus mr-2"></i>上传作品
          </button>
        </div>
        
        <!-- 筛选和搜索 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-wrap items-center gap-4">
            <select id="category-filter" class="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">所有分类</option>
              <option value="风景">风景</option>
              <option value="人像">人像</option>
              <option value="街拍">街拍</option>
              <option value="建筑">建筑</option>
              <option value="微距">微距</option>
              <option value="其他">其他</option>
            </select>
            <input type="text" id="search-input" placeholder="搜索作品..." 
                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md">
            <button onclick="photographyManager.filterPhotos()" class="btn-secondary">
              <i class="fas fa-search mr-2"></i>搜索
            </button>
          </div>
        </div>
        
        <!-- 作品网格 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div id="photos-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${this.renderPhotoCards()}
          </div>
        </div>
      </div>
    `;
  }
  
  renderPhotoCards() {
    if (this.photos.length === 0) {
      return `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-camera text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">暂无摄影作品</p>
          <p class="text-gray-400">点击"上传作品"开始添加您的摄影作品</p>
        </div>
      `;
    }
    
    return this.photos.map(photo => `
      <div class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="aspect-w-1 aspect-h-1">
          <img src="${photo.imageUrl}" alt="${photo.title}" 
               class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
        </div>
        
        <!-- 悬浮操作层 -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div class="flex space-x-2">
            <button onclick="photographyManager.viewPhoto('${photo.id}')" 
                    class="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="photographyManager.editPhoto('${photo.id}')" 
                    class="p-2 bg-white rounded-full text-gray-700 hover:text-green-600 transition-colors">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="photographyManager.deletePhoto('${photo.id}')" 
                    class="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <!-- 作品信息 -->
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 truncate">${photo.title}</h3>
          <p class="text-sm text-gray-600 mt-1">${photo.category || '未分类'}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-gray-500">${this.formatDate(photo.createdAt)}</span>
            <div class="flex items-center space-x-1 text-xs text-gray-500">
              <i class="fas fa-heart"></i>
              <span>${photo.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  showUploadForm(photoId = null) {
    this.isEditing = !!photoId;
    this.currentPhoto = photoId ? this.photos.find(p => p.id === photoId) : {
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      tags: [],
      location: '',
      camera: '',
      lens: '',
      settings: {
        aperture: '',
        shutter: '',
        iso: '',
        focal: ''
      }
    };
    
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button onclick="photographyManager.renderPhotoGrid()" class="text-gray-600 hover:text-gray-900">
              <i class="fas fa-arrow-left text-xl"></i>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">
              ${this.isEditing ? '编辑作品' : '上传作品'}
            </h1>
          </div>
          <button onclick="photographyManager.savePhoto()" class="btn-primary">
            <i class="fas fa-save mr-2"></i>保存作品
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 图片上传区域 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">作品图片</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">图片URL</label>
                <input type="url" id="photo-url" value="${this.currentPhoto.imageUrl}" 
                       placeholder="输入图片URL或上传图片"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <!-- 图片预览 -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div id="image-preview">
                  ${this.currentPhoto.imageUrl ? 
                    `<img src="${this.currentPhoto.imageUrl}" alt="预览" class="max-w-full h-64 object-contain mx-auto rounded-lg">` :
                    `<div class="text-gray-400">
                      <i class="fas fa-image text-4xl mb-2"></i>
                      <p>图片预览将在这里显示</p>
                    </div>`
                  }
                </div>
              </div>
              
              <!-- 文件上传 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">或上传文件</label>
                <input type="file" id="photo-file" accept="image/*" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <p class="text-xs text-gray-500 mt-1">支持 JPG, PNG, GIF 格式，最大 10MB</p>
              </div>
            </div>
          </div>
          
          <!-- 作品信息 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">作品信息</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">作品标题</label>
                <input type="text" id="photo-title" value="${this.currentPhoto.title}" 
                       placeholder="输入作品标题"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">作品描述</label>
                <textarea id="photo-description" rows="4" 
                          placeholder="描述这张照片的故事..."
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${this.currentPhoto.description}</textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select id="photo-category" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">选择分类</option>
                    <option value="风景" ${this.currentPhoto.category === '风景' ? 'selected' : ''}>风景</option>
                    <option value="人像" ${this.currentPhoto.category === '人像' ? 'selected' : ''}>人像</option>
                    <option value="街拍" ${this.currentPhoto.category === '街拍' ? 'selected' : ''}>街拍</option>
                    <option value="建筑" ${this.currentPhoto.category === '建筑' ? 'selected' : ''}>建筑</option>
                    <option value="微距" ${this.currentPhoto.category === '微距' ? 'selected' : ''}>微距</option>
                    <option value="其他" ${this.currentPhoto.category === '其他' ? 'selected' : ''}>其他</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">拍摄地点</label>
                  <input type="text" id="photo-location" value="${this.currentPhoto.location}" 
                         placeholder="拍摄地点"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <input type="text" id="photo-tags" value="${(this.currentPhoto.tags || []).join(', ')}" 
                       placeholder="标签1, 标签2, 标签3"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="text-xs text-gray-500 mt-1">用逗号分隔多个标签</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 拍摄参数 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">拍摄参数</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">相机型号</label>
              <input type="text" id="photo-camera" value="${this.currentPhoto.camera}" 
                     placeholder="例如: Canon EOS R5"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">镜头</label>
              <input type="text" id="photo-lens" value="${this.currentPhoto.lens}" 
                     placeholder="例如: 24-70mm f/2.8"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">光圈</label>
              <input type="text" id="photo-aperture" value="${this.currentPhoto.settings?.aperture || ''}" 
                     placeholder="例如: f/2.8"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">快门速度</label>
              <input type="text" id="photo-shutter" value="${this.currentPhoto.settings?.shutter || ''}" 
                     placeholder="例如: 1/125s"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ISO</label>
              <input type="text" id="photo-iso" value="${this.currentPhoto.settings?.iso || ''}" 
                     placeholder="例如: 400"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">焦距</label>
              <input type="text" id="photo-focal" value="${this.currentPhoto.settings?.focal || ''}" 
                     placeholder="例如: 50mm"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.bindUploadEvents();
  }
  
  bindUploadEvents() {
    // 图片URL变化时更新预览
    const urlInput = document.getElementById('photo-url');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        this.updateImagePreview(e.target.value);
      });
    }
    
    // 文件上传
    const fileInput = document.getElementById('photo-file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileUpload(e.target.files[0]);
      });
    }
  }
  
  updateImagePreview(url) {
    const preview = document.getElementById('image-preview');
    if (url) {
      preview.innerHTML = `<img src="${url}" alt="预览" class="max-w-full h-64 object-contain mx-auto rounded-lg">`;
    } else {
      preview.innerHTML = `
        <div class="text-gray-400">
          <i class="fas fa-image text-4xl mb-2"></i>
          <p>图片预览将在这里显示</p>
        </div>
      `;
    }
  }
  
  handleFileUpload(file) {
    if (!file) return;
    
    // 这里应该实现文件上传到Firebase Storage
    // 暂时使用URL.createObjectURL进行本地预览
    const url = URL.createObjectURL(file);
    this.updateImagePreview(url);
    document.getElementById('photo-url').value = url;
  }
  
  async savePhoto() {
    try {
      const photoData = {
        title: document.getElementById('photo-title').value,
        description: document.getElementById('photo-description').value,
        imageUrl: document.getElementById('photo-url').value,
        category: document.getElementById('photo-category').value,
        location: document.getElementById('photo-location').value,
        tags: document.getElementById('photo-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        camera: document.getElementById('photo-camera').value,
        lens: document.getElementById('photo-lens').value,
        settings: {
          aperture: document.getElementById('photo-aperture').value,
          shutter: document.getElementById('photo-shutter').value,
          iso: document.getElementById('photo-iso').value,
          focal: document.getElementById('photo-focal').value
        },
        likes: this.currentPhoto.likes || 0
      };
      
      if (this.isEditing && this.currentPhoto.id) {
        await window.databaseService.photographyService.update(this.currentPhoto.id, photoData);
        this.showMessage('作品更新成功', 'success');
      } else {
        await window.databaseService.photographyService.add(photoData);
        this.showMessage('作品上传成功', 'success');
      }
      
      await this.loadPhotos();
    } catch (error) {
      console.error('保存作品失败:', error);
      this.showMessage('保存失败: ' + error.message, 'error');
    }
  }
  
  async editPhoto(id) {
    this.showUploadForm(id);
  }
  
  async deletePhoto(id) {
    if (confirm('确定要删除这个作品吗？此操作不可恢复。')) {
      try {
        await window.databaseService.photographyService.delete(id);
        this.showMessage('作品删除成功', 'success');
        await this.loadPhotos();
      } catch (error) {
        console.error('删除作品失败:', error);
        this.showMessage('删除失败: ' + error.message, 'error');
      }
    }
  }
  
  viewPhoto(id) {
    const photo = this.photos.find(p => p.id === id);
    if (!photo) return;
    
    // 创建模态框显示大图
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="max-w-4xl max-h-full p-4">
        <div class="bg-white rounded-lg overflow-hidden">
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">${photo.title}</h3>
              <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div class="p-4">
            <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-auto max-h-96 object-contain">
            <div class="mt-4">
              <p class="text-gray-600">${photo.description}</p>
              <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>${photo.category}</span>
                <span>${this.formatDate(photo.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  filterPhotos() {
    // 实现筛选功能
    const category = document.getElementById('category-filter').value;
    const search = document.getElementById('search-input').value.toLowerCase();
    
    let filteredPhotos = this.photos;
    
    if (category) {
      filteredPhotos = filteredPhotos.filter(photo => photo.category === category);
    }
    
    if (search) {
      filteredPhotos = filteredPhotos.filter(photo => 
        photo.title.toLowerCase().includes(search) ||
        photo.description.toLowerCase().includes(search) ||
        (photo.tags && photo.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }
    
    // 更新显示
    const grid = document.getElementById('photos-grid');
    if (grid) {
      const originalPhotos = this.photos;
      this.photos = filteredPhotos;
      grid.innerHTML = this.renderPhotoCards();
      this.photos = originalPhotos;
    }
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
window.PhotographyManager = PhotographyManager;
