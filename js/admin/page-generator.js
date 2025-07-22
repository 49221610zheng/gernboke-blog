// 页面生成器 - 将管理端的修改应用到前端页面
class PageGenerator {
  constructor() {
    this.templates = {};
    this.init();
  }

  init() {
    this.loadTemplates();
    console.log('✅ 页面生成器初始化完成');
  }

  // 加载模板
  loadTemplates() {
    this.templates = {
      hero: this.getHeroTemplate(),
      about: this.getAboutTemplate(),
      photography: this.getPhotographyTemplate(),
      tech: this.getTechTemplate(),
      contact: this.getContactTemplate()
    };
  }

  // 生成完整页面
  generatePage(content) {
    const pageHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.hero?.title || '光影与代码'} - 个人博客</title>
  <meta name="description" content="${content.hero?.description || '融合摄影艺术与编程技术的个人博客'}">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- 自定义样式 -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="font-sans">
  <!-- 导航栏 -->
  ${this.generateNavigation(content)}
  
  <!-- 主要内容 -->
  <main>
    ${this.generateHeroSection(content.hero)}
    ${this.generateAboutSection(content.about)}
    ${this.generatePhotographySection(content.photography)}
    ${this.generateTechSection(content.tech)}
    ${this.generateContactSection(content.contact)}
  </main>
  
  <!-- 页脚 -->
  ${this.generateFooter(content)}
  
  <!-- JavaScript -->
  ${this.generateScripts()}
</body>
</html>
    `;

    return pageHTML;
  }

  // 生成导航栏
  generateNavigation(content) {
    return `
    <nav class="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a href="#home" class="text-xl font-bold text-gray-900">${content.hero?.title || '光影与代码'}</a>
          </div>
          
          <!-- 桌面导航 -->
          <nav class="hidden md:flex items-center gap-6">
            <a href="#home" class="nav-link">首页</a>
            <a href="#about" class="nav-link">关于我</a>
            <a href="#photography" class="nav-link">摄影作品</a>
            <a href="#tech" class="nav-link">技术分享</a>
            <a href="#contact" class="nav-link">联系我</a>
          </nav>
          
          <!-- 移动端菜单按钮 -->
          <button class="md:hidden mobile-menu-toggle">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      <!-- 移动端导航菜单 -->
      <div class="mobile-menu md:hidden hidden bg-white border-t">
        <div class="container mx-auto px-4 py-3 flex flex-col gap-3">
          <a href="#home" class="py-2 hover:text-primary transition-colors">首页</a>
          <a href="#about" class="py-2 hover:text-primary transition-colors">关于我</a>
          <a href="#photography" class="py-2 hover:text-primary transition-colors">摄影作品</a>
          <a href="#tech" class="py-2 hover:text-primary transition-colors">技术分享</a>
          <a href="#contact" class="py-2 hover:text-primary transition-colors">联系我</a>
        </div>
      </div>
    </nav>
    `;
  }

  // 生成首页横幅
  generateHeroSection(hero) {
    if (!hero) return '';
    
    return `
    <section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden"
             style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${hero.backgroundImage}'); background-size: cover; background-position: center;">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 typing-effect">${hero.title}</h1>
        <p class="text-xl md:text-2xl mb-4 text-gray-200">${hero.subtitle}</p>
        <p class="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">${hero.description}</p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          ${hero.buttons.map(button => `
            <a href="${button.link}" class="btn ${button.type === 'primary' ? 'btn-primary' : 'btn-secondary'}">
              ${button.text}
            </a>
          `).join('')}
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </section>
    `;
  }

  // 生成关于我部分
  generateAboutSection(about) {
    if (!about) return '';
    
    return `
    <section id="about" class="section-padding bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">${about.title}</h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="order-2 lg:order-1">
            <p class="text-lg text-gray-600 mb-8 leading-relaxed">${about.content}</p>
            
            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4">技能专长</h3>
              <div class="flex flex-wrap gap-3">
                ${about.skills.map(skill => `
                  <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">${skill}</span>
                `).join('')}
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              ${about.stats.map(stat => `
                <div class="text-center">
                  <div class="counter text-3xl font-bold text-blue-600" data-target="${stat.value}">0</div>
                  <div class="text-sm text-gray-600">${stat.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="order-1 lg:order-2 text-center">
            <div class="relative inline-block">
              <img src="${about.image}" alt="个人照片" 
                   class="w-80 h-80 object-cover rounded-full shadow-2xl">
              <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }

  // 生成摄影作品部分
  generatePhotographySection(photography) {
    if (!photography) return '';
    
    return `
    <section id="photography" class="section-padding bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">${photography.title}</h2>
          <p class="text-lg text-gray-600">${photography.subtitle}</p>
        </div>
        
        <!-- 分类过滤 -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button class="filter-btn active" data-filter="all">全部</button>
          ${photography.categories.map(category => `
            <button class="filter-btn" data-filter="${category}">${category}</button>
          `).join('')}
        </div>
        
        <!-- 作品网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.generatePhotoWorks(photography.works || [])}
        </div>
      </div>
    </section>
    `;
  }

  // 生成摄影作品项目
  generatePhotoWorks(works) {
    const defaultWorks = [
      {
        title: '城市夜景',
        description: '繁华都市的夜晚灯火',
        image: 'https://picsum.photos/400/300?random=1',
        category: '风景',
        date: '2023-06-01',
        tags: ['夜景', '城市', '灯光']
      },
      {
        title: '自然风光',
        description: '大自然的壮美景色',
        image: 'https://picsum.photos/400/300?random=2',
        category: '风景',
        date: '2023-06-02',
        tags: ['自然', '风景', '山水']
      },
      {
        title: '人文纪实',
        description: '记录生活中的真实瞬间',
        image: 'https://picsum.photos/400/300?random=3',
        category: '人像',
        date: '2023-06-03',
        tags: ['人文', '纪实', '生活']
      }
    ];

    const worksToRender = works.length > 0 ? works : defaultWorks;

    return worksToRender.map(work => `
      <div class="photo-item card-hover" data-category="${work.category}">
        <div class="bg-white rounded-xl overflow-hidden shadow-md">
          <div class="aspect-w-4 aspect-h-3 image-zoom">
            <img src="${work.image}" alt="${work.title}" class="w-full h-full object-cover">
          </div>
          <div class="p-5">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-lg">${work.title}</h3>
              <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">${work.category}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">${work.description}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">${work.date}</span>
              <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium">查看详情 →</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 生成技术分享部分
  generateTechSection(tech) {
    if (!tech) return '';
    
    return `
    <section id="tech" class="section-padding bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">${tech.title}</h2>
          <p class="text-lg text-gray-600">${tech.subtitle}</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          ${this.generateTechArticles(tech.articles || [])}
        </div>
      </div>
    </section>
    `;
  }

  // 生成技术文章
  generateTechArticles(articles) {
    const defaultArticles = [
      {
        title: 'React Hooks 最佳实践',
        description: '深入理解React Hooks的使用方法和最佳实践',
        image: 'https://picsum.photos/400/200?random=4',
        category: '前端开发',
        author: '摄影程序员',
        readTime: '5分钟阅读',
        date: '2023-06-01',
        tags: ['React', 'Hooks', '前端']
      },
      {
        title: 'Node.js 性能优化指南',
        description: '提升Node.js应用性能的实用技巧',
        image: 'https://picsum.photos/400/200?random=5',
        category: '后端技术',
        author: '摄影程序员',
        readTime: '8分钟阅读',
        date: '2023-06-02',
        tags: ['Node.js', '性能优化', '后端']
      }
    ];

    const articlesToRender = articles.length > 0 ? articles : defaultArticles;

    return articlesToRender.map(article => `
      <div class="tech-article card-hover">
        <div class="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div class="md:w-1/3 image-zoom">
            <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
          </div>
          <div class="md:w-2/3 p-6 flex flex-col">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">${article.category}</span>
              ${article.tags ? article.tags.slice(0, 2).map(tag => `
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${tag}</span>
              `).join('') : ''}
            </div>
            <h3 class="font-semibold text-xl mb-3">${article.title}</h3>
            <p class="text-gray-600 text-sm mb-4 flex-grow">${article.description}</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img src="https://picsum.photos/32/32?random=author" alt="作者头像" class="w-8 h-8 rounded-full">
                <span class="text-sm">${article.author}</span>
              </div>
              <span class="text-sm text-gray-500">${article.date} · ${article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 生成联系方式部分
  generateContactSection(contact) {
    if (!contact) return '';
    
    return `
    <section id="contact" class="section-padding bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">${contact.title}</h2>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 class="text-xl font-semibold mb-6">联系信息</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-envelope text-blue-600"></i>
                  </div>
                  <div>
                    <p class="font-medium">邮箱</p>
                    <a href="mailto:${contact.email}" class="text-blue-600 hover:text-blue-800">${contact.email}</a>
                  </div>
                </div>
              </div>
              
              <h4 class="text-lg font-semibold mt-8 mb-4">社交媒体</h4>
              <div class="flex gap-4">
                ${contact.social.map(social => `
                  <a href="${social.url}" target="_blank" 
                     class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <i class="${social.icon}"></i>
                  </a>
                `).join('')}
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-6">发送消息</h3>
              <form class="space-y-4">
                <div>
                  <input type="text" placeholder="您的姓名" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <input type="email" placeholder="您的邮箱" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <textarea placeholder="您的消息" rows="5" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                </div>
                <button type="submit" class="w-full btn btn-primary">
                  发送消息
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }

  // 生成页脚
  generateFooter(content) {
    return `
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">${content.hero?.title || '光影与代码'}</h3>
            <p class="text-gray-400">${content.hero?.description || '融合摄影艺术与编程技术的个人博客'}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-4">快速链接</h3>
            <ul class="space-y-2">
              <li><a href="#home" class="text-gray-400 hover:text-white transition-colors">首页</a></li>
              <li><a href="#about" class="text-gray-400 hover:text-white transition-colors">关于我</a></li>
              <li><a href="#photography" class="text-gray-400 hover:text-white transition-colors">摄影作品</a></li>
              <li><a href="#tech" class="text-gray-400 hover:text-white transition-colors">技术分享</a></li>
              <li><a href="#contact" class="text-gray-400 hover:text-white transition-colors">联系我</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-4">关注我</h3>
            <div class="flex gap-4">
              ${content.contact?.social.map(social => `
                <a href="${social.url}" target="_blank" 
                   class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <i class="${social.icon}"></i>
                </a>
              `).join('') || ''}
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400">&copy; ${new Date().getFullYear()} ${content.hero?.title || '光影与代码'}. 保留所有权利.</p>
        </div>
      </div>
    </footer>
    `;
  }

  // 生成脚本
  generateScripts() {
    return `
    <!-- Components -->
    <script src="js/components/ui-enhancements.js"></script>
    <script src="js/components/ux-optimizer.js"></script>
    <script src="js/components/responsive-navigation.js"></script>
    <script src="js/components/image-optimizer.js"></script>
    <script src="js/components/click-handlers.js"></script>
    <script src="js/components/homepage-optimizer.js"></script>
    <script src="js/components/social-features.js"></script>
    <script src="js/components/theme-system.js"></script>
    <script src="js/components/search-system.js"></script>
    <script src="js/components/comment-system.js"></script>

    <!-- Security -->
    <script src="js/security/secret-access.js"></script>

    <!-- Main App -->
    <script src="js/app-simple.js"></script>
    `;
  }

  // 预览页面
  previewPage(content) {
    const pageHTML = this.generatePage(content);
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(pageHTML);
    previewWindow.document.close();
  }

  // 下载页面
  downloadPage(content, filename = 'index.html') {
    const pageHTML = this.generatePage(content);
    const blob = new Blob([pageHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // 应用到当前页面
  applyToCurrentPage(content) {
    // 这里可以实现实时更新当前页面的逻辑
    console.log('应用内容到当前页面:', content);
    
    // 发送消息到主页面
    if (window.opener) {
      window.opener.postMessage({
        type: 'updateContent',
        content: content
      }, '*');
    }
  }
}

// 导出到全局
window.PageGenerator = PageGenerator;
