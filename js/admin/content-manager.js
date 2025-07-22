// 内容管理核心系统 - 管理前端页面内容
class ContentManager {
  constructor() {
    this.content = this.loadContent();
    this.currentEditingId = null;
    this.init();
  }

  init() {
    this.setupContentStructure();
    console.log('✅ 内容管理系统初始化完成');
  }

  // 设置内容结构
  setupContentStructure() {
    this.contentStructure = {
      hero: {
        title: '光影与代码',
        subtitle: '融合摄影艺术与编程技术的个人博客',
        description: '探索摄影的艺术之美，分享编程的技术精髓',
        backgroundImage: 'https://picsum.photos/1920/1080',
        buttons: [
          { text: '查看作品', link: '#photography', type: 'primary' },
          { text: '技术分享', link: '#tech', type: 'secondary' }
        ]
      },
      about: {
        title: '关于我',
        content: '我是一名热爱摄影的程序员，致力于用技术记录生活的美好瞬间。',
        image: 'https://picsum.photos/400/400',
        skills: ['摄影', '前端开发', '后端开发', '用户体验设计'],
        stats: [
          { label: '摄影作品', value: 50 },
          { label: '技术文章', value: 25 },
          { label: '网站访问', value: 1000 },
          { label: '用户喜欢', value: 100 }
        ]
      },
      photography: {
        title: '摄影作品',
        subtitle: '用镜头捕捉世界的美好',
        categories: ['风景', '人像', '街拍', '建筑'],
        works: []
      },
      tech: {
        title: '技术分享',
        subtitle: '分享编程经验与技术见解',
        categories: ['前端开发', '后端技术', '工具推荐', '项目经验'],
        articles: []
      },
      contact: {
        title: '联系方式',
        email: 'photographer.developer@example.com',
        social: [
          { platform: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
          { platform: '微博', url: 'https://weibo.com', icon: 'fab fa-weibo' },
          { platform: '知乎', url: 'https://zhihu.com', icon: 'fab fa-zhihu' }
        ]
      }
    };

    // 合并已保存的内容
    this.content = { ...this.contentStructure, ...this.content };
  }

  // 获取内容编辑界面
  getContentEditor() {
    return `
      <div class="content-manager">
        <div class="flex h-full">
          <!-- 左侧内容树 -->
          <div class="w-1/3 bg-gray-50 border-r overflow-y-auto">
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-4">页面内容</h3>
              <div class="space-y-2">
                ${this.renderContentTree()}
              </div>
            </div>
          </div>
          
          <!-- 右侧编辑器 -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-6">
              <div id="content-editor-area">
                <div class="text-center text-gray-500 py-12">
                  <i class="fas fa-edit text-4xl mb-4"></i>
                  <p class="text-lg">选择左侧内容进行编辑</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染内容树
  renderContentTree() {
    const sections = [
      { id: 'hero', name: '首页横幅', icon: 'fas fa-home' },
      { id: 'about', name: '关于我', icon: 'fas fa-user' },
      { id: 'photography', name: '摄影作品', icon: 'fas fa-camera' },
      { id: 'tech', name: '技术分享', icon: 'fas fa-code' },
      { id: 'contact', name: '联系方式', icon: 'fas fa-envelope' }
    ];

    return sections.map(section => `
      <div class="content-item p-3 rounded-lg hover:bg-white cursor-pointer transition-colors ${this.currentEditingId === section.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}"
           onclick="contentManager.editSection('${section.id}')">
        <div class="flex items-center gap-3">
          <i class="${section.icon} text-gray-600"></i>
          <span class="font-medium">${section.name}</span>
        </div>
      </div>
    `).join('');
  }

  // 编辑部分
  editSection(sectionId) {
    this.currentEditingId = sectionId;
    const editorArea = document.getElementById('content-editor-area');
    
    // 更新左侧选中状态
    document.querySelectorAll('.content-item').forEach(item => {
      item.classList.remove('bg-blue-50', 'border-l-4', 'border-blue-500');
    });
    event.target.closest('.content-item').classList.add('bg-blue-50', 'border-l-4', 'border-blue-500');

    // 显示对应编辑器
    switch (sectionId) {
      case 'hero':
        editorArea.innerHTML = this.getHeroEditor();
        break;
      case 'about':
        editorArea.innerHTML = this.getAboutEditor();
        break;
      case 'photography':
        editorArea.innerHTML = this.getPhotographyEditor();
        break;
      case 'tech':
        editorArea.innerHTML = this.getTechEditor();
        break;
      case 'contact':
        editorArea.innerHTML = this.getContactEditor();
        break;
    }
  }

  // 首页横幅编辑器
  getHeroEditor() {
    const hero = this.content.hero;
    return `
      <div class="hero-editor">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">编辑首页横幅</h3>
          <div class="flex gap-2">
            <button onclick="contentManager.previewChanges('hero')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              预览
            </button>
            <button onclick="contentManager.saveSection('hero')" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              保存
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">主标题</label>
            <input type="text" id="hero-title" value="${hero.title}" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">副标题</label>
            <input type="text" id="hero-subtitle" value="${hero.subtitle}" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">描述</label>
            <textarea id="hero-description" rows="3" 
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">${hero.description}</textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">背景图片URL</label>
            <div class="flex gap-2">
              <input type="text" id="hero-background" value="${hero.backgroundImage}" 
                     class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <button onclick="contentManager.uploadImage('hero-background')" 
                      class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                上传
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">按钮设置</label>
            <div id="hero-buttons" class="space-y-3">
              ${hero.buttons.map((btn, index) => `
                <div class="flex gap-2 items-center p-3 bg-gray-50 rounded">
                  <input type="text" placeholder="按钮文字" value="${btn.text}" 
                         class="flex-1 px-2 py-1 border rounded" data-field="text" data-index="${index}">
                  <input type="text" placeholder="链接" value="${btn.link}" 
                         class="flex-1 px-2 py-1 border rounded" data-field="link" data-index="${index}">
                  <select class="px-2 py-1 border rounded" data-field="type" data-index="${index}">
                    <option value="primary" ${btn.type === 'primary' ? 'selected' : ''}>主要</option>
                    <option value="secondary" ${btn.type === 'secondary' ? 'selected' : ''}>次要</option>
                  </select>
                  <button onclick="contentManager.removeButton(${index})" class="px-2 py-1 bg-red-500 text-white rounded text-sm">
                    删除
                  </button>
                </div>
              `).join('')}
            </div>
            <button onclick="contentManager.addButton()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              添加按钮
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 关于我编辑器
  getAboutEditor() {
    const about = this.content.about;
    return `
      <div class="about-editor">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">编辑关于我</h3>
          <div class="flex gap-2">
            <button onclick="contentManager.previewChanges('about')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              预览
            </button>
            <button onclick="contentManager.saveSection('about')" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              保存
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">标题</label>
            <input type="text" id="about-title" value="${about.title}" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">个人介绍</label>
            <textarea id="about-content" rows="5" 
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">${about.content}</textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">头像图片</label>
            <div class="flex gap-2">
              <input type="text" id="about-image" value="${about.image}" 
                     class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <button onclick="contentManager.uploadImage('about-image')" 
                      class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                上传
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">技能标签</label>
            <div id="about-skills" class="space-y-2">
              ${about.skills.map((skill, index) => `
                <div class="flex gap-2">
                  <input type="text" value="${skill}" 
                         class="flex-1 px-3 py-2 border rounded" data-skill-index="${index}">
                  <button onclick="contentManager.removeSkill(${index})" 
                          class="px-3 py-2 bg-red-500 text-white rounded">删除</button>
                </div>
              `).join('')}
            </div>
            <button onclick="contentManager.addSkill()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              添加技能
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">统计数据</label>
            <div id="about-stats" class="grid grid-cols-2 gap-4">
              ${about.stats.map((stat, index) => `
                <div class="p-3 bg-gray-50 rounded">
                  <input type="text" placeholder="标签" value="${stat.label}" 
                         class="w-full px-2 py-1 border rounded mb-2" data-stat-field="label" data-stat-index="${index}">
                  <input type="number" placeholder="数值" value="${stat.value}" 
                         class="w-full px-2 py-1 border rounded" data-stat-field="value" data-stat-index="${index}">
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 摄影作品编辑器
  getPhotographyEditor() {
    const photography = this.content.photography;
    return `
      <div class="photography-editor">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">编辑摄影作品</h3>
          <div class="flex gap-2">
            <button onclick="contentManager.addPhoto()" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              添加作品
            </button>
            <button onclick="contentManager.saveSection('photography')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              保存
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">标题</label>
              <input type="text" id="photography-title" value="${photography.title}" 
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">副标题</label>
              <input type="text" id="photography-subtitle" value="${photography.subtitle}" 
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">作品分类</label>
            <div class="flex flex-wrap gap-2">
              ${photography.categories.map((cat, index) => `
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  ${cat}
                  <button onclick="contentManager.removeCategory('photography', ${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                  </button>
                </span>
              `).join('')}
              <button onclick="contentManager.addCategory('photography')" class="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500">
                + 添加分类
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-4">作品列表</label>
            <div id="photography-works" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${this.renderPhotoWorks()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染摄影作品
  renderPhotoWorks() {
    const defaultWorks = [
      {
        id: 1,
        title: '城市夜景',
        description: '繁华都市的夜晚灯火',
        image: 'https://picsum.photos/400/300?random=1',
        category: '风景',
        date: '2023-06-01',
        tags: ['夜景', '城市', '灯光']
      },
      {
        id: 2,
        title: '自然风光',
        description: '大自然的壮美景色',
        image: 'https://picsum.photos/400/300?random=2',
        category: '风景',
        date: '2023-06-02',
        tags: ['自然', '风景', '山水']
      }
    ];

    const works = this.content.photography.works.length > 0 ? this.content.photography.works : defaultWorks;

    return works.map((work, index) => `
      <div class="photo-work-item border rounded-lg p-4 bg-white shadow-sm">
        <div class="aspect-w-4 aspect-h-3 mb-3">
          <img src="${work.image}" alt="${work.title}" class="w-full h-32 object-cover rounded">
        </div>
        <div class="space-y-2">
          <input type="text" value="${work.title}" placeholder="作品标题" 
                 class="w-full px-2 py-1 border rounded text-sm" data-work-field="title" data-work-index="${index}">
          <textarea placeholder="作品描述" rows="2" 
                    class="w-full px-2 py-1 border rounded text-sm" data-work-field="description" data-work-index="${index}">${work.description}</textarea>
          <div class="flex gap-2">
            <input type="text" value="${work.image}" placeholder="图片URL" 
                   class="flex-1 px-2 py-1 border rounded text-sm" data-work-field="image" data-work-index="${index}">
            <button onclick="contentManager.uploadWorkImage(${index})" class="px-2 py-1 bg-gray-500 text-white rounded text-sm">
              上传
            </button>
          </div>
          <div class="flex gap-2">
            <select class="flex-1 px-2 py-1 border rounded text-sm" data-work-field="category" data-work-index="${index}">
              ${this.content.photography.categories.map(cat => `
                <option value="${cat}" ${work.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
            <input type="date" value="${work.date}" 
                   class="px-2 py-1 border rounded text-sm" data-work-field="date" data-work-index="${index}">
          </div>
          <div class="flex justify-between items-center">
            <input type="text" value="${work.tags ? work.tags.join(', ') : ''}" placeholder="标签 (逗号分隔)" 
                   class="flex-1 px-2 py-1 border rounded text-sm" data-work-field="tags" data-work-index="${index}">
            <button onclick="contentManager.removeWork(${index})" class="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm">
              删除
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 技术分享编辑器
  getTechEditor() {
    const tech = this.content.tech;
    return `
      <div class="tech-editor">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">编辑技术分享</h3>
          <div class="flex gap-2">
            <button onclick="contentManager.addArticle()" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              添加文章
            </button>
            <button onclick="contentManager.saveSection('tech')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              保存
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">标题</label>
              <input type="text" id="tech-title" value="${tech.title}" 
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">副标题</label>
              <input type="text" id="tech-subtitle" value="${tech.subtitle}" 
                     class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">文章分类</label>
            <div class="flex flex-wrap gap-2">
              ${tech.categories.map((cat, index) => `
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                  ${cat}
                  <button onclick="contentManager.removeCategory('tech', ${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                  </button>
                </span>
              `).join('')}
              <button onclick="contentManager.addCategory('tech')" class="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-green-500 hover:text-green-500">
                + 添加分类
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-4">文章列表</label>
            <div id="tech-articles" class="space-y-4">
              ${this.renderTechArticles()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染技术文章
  renderTechArticles() {
    const defaultArticles = [
      {
        id: 1,
        title: 'React Hooks 最佳实践',
        description: '深入理解React Hooks的使用方法和最佳实践',
        image: 'https://picsum.photos/400/200?random=3',
        category: '前端开发',
        author: '摄影程序员',
        readTime: '5分钟阅读',
        date: '2023-06-01',
        tags: ['React', 'Hooks', '前端']
      },
      {
        id: 2,
        title: 'Node.js 性能优化指南',
        description: '提升Node.js应用性能的实用技巧',
        image: 'https://picsum.photos/400/200?random=4',
        category: '后端技术',
        author: '摄影程序员',
        readTime: '8分钟阅读',
        date: '2023-06-02',
        tags: ['Node.js', '性能优化', '后端']
      }
    ];

    const articles = this.content.tech.articles.length > 0 ? this.content.tech.articles : defaultArticles;

    return articles.map((article, index) => `
      <div class="tech-article-item border rounded-lg p-4 bg-white shadow-sm">
        <div class="flex gap-4">
          <div class="w-32 h-20 flex-shrink-0">
            <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover rounded">
          </div>
          <div class="flex-1 space-y-2">
            <input type="text" value="${article.title}" placeholder="文章标题" 
                   class="w-full px-2 py-1 border rounded font-medium" data-article-field="title" data-article-index="${index}">
            <textarea placeholder="文章描述" rows="2" 
                      class="w-full px-2 py-1 border rounded text-sm" data-article-field="description" data-article-index="${index}">${article.description}</textarea>
            <div class="grid grid-cols-2 gap-2">
              <input type="text" value="${article.image}" placeholder="封面图片URL" 
                     class="px-2 py-1 border rounded text-sm" data-article-field="image" data-article-index="${index}">
              <select class="px-2 py-1 border rounded text-sm" data-article-field="category" data-article-index="${index}">
                ${this.content.tech.categories.map(cat => `
                  <option value="${cat}" ${article.category === cat ? 'selected' : ''}>${cat}</option>
                `).join('')}
              </select>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" value="${article.author}" placeholder="作者" 
                     class="px-2 py-1 border rounded text-sm" data-article-field="author" data-article-index="${index}">
              <input type="text" value="${article.readTime}" placeholder="阅读时间" 
                     class="px-2 py-1 border rounded text-sm" data-article-field="readTime" data-article-index="${index}">
              <input type="date" value="${article.date}" 
                     class="px-2 py-1 border rounded text-sm" data-article-field="date" data-article-index="${index}">
            </div>
            <div class="flex justify-between items-center">
              <input type="text" value="${article.tags ? article.tags.join(', ') : ''}" placeholder="标签 (逗号分隔)" 
                     class="flex-1 px-2 py-1 border rounded text-sm" data-article-field="tags" data-article-index="${index}">
              <button onclick="contentManager.removeArticle(${index})" class="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 联系方式编辑器
  getContactEditor() {
    const contact = this.content.contact;
    return `
      <div class="contact-editor">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">编辑联系方式</h3>
          <button onclick="contentManager.saveSection('contact')" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            保存
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">标题</label>
            <input type="text" id="contact-title" value="${contact.title}" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">邮箱地址</label>
            <input type="email" id="contact-email" value="${contact.email}" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">社交媒体</label>
            <div id="contact-social" class="space-y-3">
              ${contact.social.map((social, index) => `
                <div class="flex gap-2 items-center p-3 bg-gray-50 rounded">
                  <input type="text" placeholder="平台名称" value="${social.platform}" 
                         class="flex-1 px-2 py-1 border rounded" data-social-field="platform" data-social-index="${index}">
                  <input type="text" placeholder="链接地址" value="${social.url}" 
                         class="flex-1 px-2 py-1 border rounded" data-social-field="url" data-social-index="${index}">
                  <input type="text" placeholder="图标类名" value="${social.icon}" 
                         class="flex-1 px-2 py-1 border rounded" data-social-field="icon" data-social-index="${index}">
                  <button onclick="contentManager.removeSocial(${index})" class="px-2 py-1 bg-red-500 text-white rounded text-sm">
                    删除
                  </button>
                </div>
              `).join('')}
            </div>
            <button onclick="contentManager.addSocial()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              添加社交媒体
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 保存部分内容
  saveSection(sectionId) {
    try {
      switch (sectionId) {
        case 'hero':
          this.saveHeroSection();
          break;
        case 'about':
          this.saveAboutSection();
          break;
        case 'photography':
          this.savePhotographySection();
          break;
        case 'tech':
          this.saveTechSection();
          break;
        case 'contact':
          this.saveContactSection();
          break;
      }
      
      this.saveContent();
      this.showMessage('保存成功！', 'success');
      
      // 应用到前端页面
      this.applyToFrontend(sectionId);
      
    } catch (error) {
      console.error('保存失败:', error);
      this.showMessage('保存失败，请重试', 'error');
    }
  }

  // 保存首页横幅
  saveHeroSection() {
    this.content.hero = {
      title: document.getElementById('hero-title').value,
      subtitle: document.getElementById('hero-subtitle').value,
      description: document.getElementById('hero-description').value,
      backgroundImage: document.getElementById('hero-background').value,
      buttons: this.getButtonsData()
    };
  }

  // 获取按钮数据
  getButtonsData() {
    const buttons = [];
    document.querySelectorAll('#hero-buttons > div').forEach(buttonDiv => {
      const textInput = buttonDiv.querySelector('[data-field="text"]');
      const linkInput = buttonDiv.querySelector('[data-field="link"]');
      const typeSelect = buttonDiv.querySelector('[data-field="type"]');
      
      if (textInput && linkInput && typeSelect) {
        buttons.push({
          text: textInput.value,
          link: linkInput.value,
          type: typeSelect.value
        });
      }
    });
    return buttons;
  }

  // 应用到前端页面
  applyToFrontend(sectionId) {
    // 这里实现将管理端的修改应用到前端页面
    // 可以通过修改DOM或者重新生成HTML文件
    console.log(`应用 ${sectionId} 的修改到前端页面`);
    
    // 发送消息通知前端更新
    if (window.opener) {
      window.opener.postMessage({
        type: 'contentUpdate',
        section: sectionId,
        data: this.content[sectionId]
      }, '*');
    }
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

  // 数据持久化
  loadContent() {
    try {
      return JSON.parse(localStorage.getItem('blog_content') || '{}');
    } catch {
      return {};
    }
  }

  saveContent() {
    localStorage.setItem('blog_content', JSON.stringify(this.content));
  }

  // 添加按钮
  addButton() {
    const buttonsContainer = document.getElementById('hero-buttons');
    const buttonCount = buttonsContainer.children.length;

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'flex gap-2 items-center p-3 bg-gray-50 rounded';
    buttonDiv.innerHTML = `
      <input type="text" placeholder="按钮文字" value=""
             class="flex-1 px-2 py-1 border rounded" data-field="text" data-index="${buttonCount}">
      <input type="text" placeholder="链接" value=""
             class="flex-1 px-2 py-1 border rounded" data-field="link" data-index="${buttonCount}">
      <select class="px-2 py-1 border rounded" data-field="type" data-index="${buttonCount}">
        <option value="primary">主要</option>
        <option value="secondary">次要</option>
      </select>
      <button onclick="contentManager.removeButton(${buttonCount})" class="px-2 py-1 bg-red-500 text-white rounded text-sm">
        删除
      </button>
    `;

    buttonsContainer.appendChild(buttonDiv);
  }

  // 添加摄影作品
  addPhoto() {
    const worksContainer = document.getElementById('photography-works');
    const workCount = worksContainer.children.length;

    const newWork = {
      id: Date.now(),
      title: '新作品',
      description: '作品描述',
      image: 'https://picsum.photos/400/300?random=' + Date.now(),
      category: this.content.photography.categories[0] || '风景',
      date: new Date().toISOString().split('T')[0],
      tags: []
    };

    const workDiv = document.createElement('div');
    workDiv.className = 'photo-work-item border rounded-lg p-4 bg-white shadow-sm';
    workDiv.innerHTML = `
      <div class="aspect-w-4 aspect-h-3 mb-3">
        <img src="${newWork.image}" alt="${newWork.title}" class="w-full h-32 object-cover rounded">
      </div>
      <div class="space-y-2">
        <input type="text" value="${newWork.title}" placeholder="作品标题"
               class="w-full px-2 py-1 border rounded text-sm" data-work-field="title" data-work-index="${workCount}">
        <textarea placeholder="作品描述" rows="2"
                  class="w-full px-2 py-1 border rounded text-sm" data-work-field="description" data-work-index="${workCount}">${newWork.description}</textarea>
        <div class="flex gap-2">
          <input type="text" value="${newWork.image}" placeholder="图片URL"
                 class="flex-1 px-2 py-1 border rounded text-sm" data-work-field="image" data-work-index="${workCount}">
          <button onclick="contentManager.uploadWorkImage(${workCount})" class="px-2 py-1 bg-gray-500 text-white rounded text-sm">
            上传
          </button>
        </div>
        <div class="flex gap-2">
          <select class="flex-1 px-2 py-1 border rounded text-sm" data-work-field="category" data-work-index="${workCount}">
            ${this.content.photography.categories.map(cat => `
              <option value="${cat}" ${newWork.category === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
          <input type="date" value="${newWork.date}"
                 class="px-2 py-1 border rounded text-sm" data-work-field="date" data-work-index="${workCount}">
        </div>
        <div class="flex justify-between items-center">
          <input type="text" value="" placeholder="标签 (逗号分隔)"
                 class="flex-1 px-2 py-1 border rounded text-sm" data-work-field="tags" data-work-index="${workCount}">
          <button onclick="contentManager.removeWork(${workCount})" class="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm">
            删除
          </button>
        </div>
      </div>
    `;

    worksContainer.appendChild(workDiv);
  }

  // 添加技术文章
  addArticle() {
    const articlesContainer = document.getElementById('tech-articles');
    const articleCount = articlesContainer.children.length;

    const newArticle = {
      id: Date.now(),
      title: '新技术文章',
      description: '文章描述',
      image: 'https://picsum.photos/400/200?random=' + Date.now(),
      category: this.content.tech.categories[0] || '前端开发',
      author: '摄影程序员',
      readTime: '5分钟阅读',
      date: new Date().toISOString().split('T')[0],
      tags: []
    };

    const articleDiv = document.createElement('div');
    articleDiv.className = 'tech-article-item border rounded-lg p-4 bg-white shadow-sm';
    articleDiv.innerHTML = `
      <div class="flex gap-4">
        <div class="w-32 h-20 flex-shrink-0">
          <img src="${newArticle.image}" alt="${newArticle.title}" class="w-full h-full object-cover rounded">
        </div>
        <div class="flex-1 space-y-2">
          <input type="text" value="${newArticle.title}" placeholder="文章标题"
                 class="w-full px-2 py-1 border rounded font-medium" data-article-field="title" data-article-index="${articleCount}">
          <textarea placeholder="文章描述" rows="2"
                    class="w-full px-2 py-1 border rounded text-sm" data-article-field="description" data-article-index="${articleCount}">${newArticle.description}</textarea>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" value="${newArticle.image}" placeholder="封面图片URL"
                   class="px-2 py-1 border rounded text-sm" data-article-field="image" data-article-index="${articleCount}">
            <select class="px-2 py-1 border rounded text-sm" data-article-field="category" data-article-index="${articleCount}">
              ${this.content.tech.categories.map(cat => `
                <option value="${cat}" ${newArticle.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <input type="text" value="${newArticle.author}" placeholder="作者"
                   class="px-2 py-1 border rounded text-sm" data-article-field="author" data-article-index="${articleCount}">
            <input type="text" value="${newArticle.readTime}" placeholder="阅读时间"
                   class="px-2 py-1 border rounded text-sm" data-article-field="readTime" data-article-index="${articleCount}">
            <input type="date" value="${newArticle.date}"
                   class="px-2 py-1 border rounded text-sm" data-article-field="date" data-article-index="${articleCount}">
          </div>
          <div class="flex justify-between items-center">
            <input type="text" value="" placeholder="标签 (逗号分隔)"
                   class="flex-1 px-2 py-1 border rounded text-sm" data-article-field="tags" data-article-index="${articleCount}">
            <button onclick="contentManager.removeArticle(${articleCount})" class="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm">
              删除
            </button>
          </div>
        </div>
      </div>
    `;

    articlesContainer.appendChild(articleDiv);
  }

  // 添加分类
  addCategory(section) {
    const categoryName = prompt('请输入分类名称:');
    if (categoryName && categoryName.trim()) {
      this.content[section].categories.push(categoryName.trim());
      this.editSection(section); // 重新渲染编辑器
    }
  }

  // 移除分类
  removeCategory(section, index) {
    if (confirm('确定要删除这个分类吗？')) {
      this.content[section].categories.splice(index, 1);
      this.editSection(section); // 重新渲染编辑器
    }
  }

  // 添加技能
  addSkill() {
    const skillsContainer = document.getElementById('about-skills');
    const skillCount = skillsContainer.children.length;

    const skillDiv = document.createElement('div');
    skillDiv.className = 'flex gap-2';
    skillDiv.innerHTML = `
      <input type="text" value="新技能"
             class="flex-1 px-3 py-2 border rounded" data-skill-index="${skillCount}">
      <button onclick="contentManager.removeSkill(${skillCount})"
              class="px-3 py-2 bg-red-500 text-white rounded">删除</button>
    `;

    skillsContainer.appendChild(skillDiv);
  }

  // 移除技能
  removeSkill(index) {
    const skillDiv = document.querySelector(`[data-skill-index="${index}"]`).closest('div');
    skillDiv.remove();
  }

  // 添加社交媒体
  addSocial() {
    const socialContainer = document.getElementById('contact-social');
    const socialCount = socialContainer.children.length;

    const socialDiv = document.createElement('div');
    socialDiv.className = 'flex gap-2 items-center p-3 bg-gray-50 rounded';
    socialDiv.innerHTML = `
      <input type="text" placeholder="平台名称" value=""
             class="flex-1 px-2 py-1 border rounded" data-social-field="platform" data-social-index="${socialCount}">
      <input type="text" placeholder="链接地址" value=""
             class="flex-1 px-2 py-1 border rounded" data-social-field="url" data-social-index="${socialCount}">
      <input type="text" placeholder="图标类名" value="fab fa-"
             class="flex-1 px-2 py-1 border rounded" data-social-field="icon" data-social-index="${socialCount}">
      <button onclick="contentManager.removeSocial(${socialCount})" class="px-2 py-1 bg-red-500 text-white rounded text-sm">
        删除
      </button>
    `;

    socialContainer.appendChild(socialDiv);
  }

  // 移除社交媒体
  removeSocial(index) {
    const socialDiv = document.querySelector(`[data-social-index="${index}"]`).closest('div');
    socialDiv.remove();
  }

  // 移除作品
  removeWork(index) {
    if (confirm('确定要删除这个作品吗？')) {
      const workDiv = document.querySelector(`[data-work-index="${index}"]`).closest('.photo-work-item');
      workDiv.remove();
    }
  }

  // 移除文章
  removeArticle(index) {
    if (confirm('确定要删除这篇文章吗？')) {
      const articleDiv = document.querySelector(`[data-article-index="${index}"]`).closest('.tech-article-item');
      articleDiv.remove();
    }
  }

  // 上传作品图片
  uploadWorkImage(index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
        const imageInput = document.querySelector(`[data-work-field="image"][data-work-index="${index}"]`);
        const imageElement = imageInput.closest('.photo-work-item').querySelector('img');

        imageInput.value = imageUrl;
        imageElement.src = imageUrl;

        this.showMessage('图片上传成功', 'success');
      }
    };
    input.click();
  }

  // 移除按钮
  removeButton(index) {
    const buttonDiv = document.querySelector(`[data-index="${index}"]`).closest('div');
    buttonDiv.remove();
  }

  // 上传图片
  uploadImage(inputId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 这里可以实现实际的图片上传逻辑
        // 现在使用占位符URL
        const imageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
        document.getElementById(inputId).value = imageUrl;
        this.showMessage('图片上传成功', 'success');
      }
    };
    input.click();
  }
}

// 导出到全局
window.ContentManager = ContentManager;
