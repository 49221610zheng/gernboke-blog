// 文章详情页面功能
class ArticleDetail {
  constructor() {
    this.articles = {
      'python-raw-processing': {
        title: '使用Python批量处理RAW照片',
        category: 'Python',
        image: 'https://picsum.photos/id/0/1200/600',
        date: '2023-06-12',
        readTime: '8分钟阅读',
        author: '摄影程序员',
        tags: ['Python', '图像处理', 'RAW', '摄影', '自动化']
      },
      'javascript-async': {
        title: 'JavaScript异步编程全解析',
        category: 'JavaScript',
        image: 'https://picsum.photos/id/180/1200/600',
        date: '2023-06-05',
        readTime: '12分钟阅读',
        author: '摄影程序员',
        tags: ['JavaScript', '异步编程', 'Promise', 'async/await']
      },
      'photography-management': {
        title: '摄影作品管理系统设计思路',
        category: '全栈开发',
        image: 'https://picsum.photos/id/96/1200/600',
        date: '2023-05-28',
        readTime: '15分钟阅读',
        author: '摄影程序员',
        tags: ['全栈开发', '项目设计', '数据库', 'API']
      },
      'css-layout': {
        title: '现代CSS布局技巧与实践',
        category: 'CSS',
        image: 'https://picsum.photos/id/48/1200/600',
        date: '2023-05-18',
        readTime: '10分钟阅读',
        author: '摄影程序员',
        tags: ['CSS', '响应式设计', 'Grid', 'Flexbox']
      }
    };
    
    this.init();
  }

  init() {
    // 从URL获取文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || 'python-raw-processing';
    
    // 加载文章内容
    this.loadArticle(articleId);
    
    // 设置移动端菜单
    this.setupMobileMenu();
    
    // 设置滚动进度条
    this.setupScrollProgress();
    
    // 设置代码高亮
    this.setupCodeHighlight();
    
    console.log('📖 文章详情页面已初始化');
  }

  loadArticle(articleId) {
    const article = this.articles[articleId];
    if (!article) {
      console.error('文章未找到:', articleId);
      return;
    }

    // 更新页面标题
    document.title = `${article.title} - 光影与代码`;
    
    // 更新文章信息
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-image').src = article.image;
    document.getElementById('article-image').alt = article.title;
    document.getElementById('article-category').textContent = article.category;
    
    // 更新分类样式
    this.updateCategoryStyle(article.category);
    
    // 更新元信息
    const metaInfo = document.querySelector('.flex.flex-wrap.items-center.gap-3');
    if (metaInfo) {
      const dateSpan = metaInfo.children[2];
      const readTimeSpan = metaInfo.children[3];
      if (dateSpan) dateSpan.textContent = article.date;
      if (readTimeSpan) readTimeSpan.textContent = article.readTime;
    }
    
    // 加载文章内容
    this.loadArticleContent(articleId);
    
    console.log('📄 文章已加载:', article.title);
  }

  updateCategoryStyle(category) {
    const categoryElement = document.getElementById('article-category');
    
    // 移除所有分类样式
    categoryElement.className = 'text-xs px-3 py-1 rounded-full';
    
    // 根据分类添加对应样式
    switch (category) {
      case 'Python':
        categoryElement.classList.add('bg-blue-100', 'text-blue-600');
        break;
      case 'JavaScript':
        categoryElement.classList.add('bg-yellow-100', 'text-yellow-600');
        break;
      case '全栈开发':
        categoryElement.classList.add('bg-green-100', 'text-green-600');
        break;
      case 'CSS':
        categoryElement.classList.add('bg-purple-100', 'text-purple-600');
        break;
      default:
        categoryElement.classList.add('bg-primary/10', 'text-primary');
    }
  }

  loadArticleContent(articleId) {
    // 这里可以从API或其他数据源加载具体的文章内容
    // 目前使用默认内容，实际项目中应该从后端获取
    
    const contentMap = {
      'javascript-async': this.getJavaScriptAsyncContent(),
      'photography-management': this.getPhotographyManagementContent(),
      'css-layout': this.getCSSLayoutContent()
    };
    
    const content = contentMap[articleId];
    if (content) {
      document.getElementById('article-content').innerHTML = content;
    }
  }

  getJavaScriptAsyncContent() {
    return `
      <p class="text-lg text-gray-700 mb-6">
        JavaScript的异步编程是现代Web开发中的核心概念。从最初的回调函数到现在的async/await，异步编程的方式在不断演进，让我们的代码更加优雅和易于维护。
      </p>
      
      <h2>回调函数时代</h2>
      <p>
        在早期的JavaScript中，异步操作主要通过回调函数来处理。虽然简单直接，但容易产生"回调地狱"的问题。
      </p>
      
      <pre><code>// 回调函数示例
function fetchData(callback) {
  setTimeout(() => {
    callback(null, '数据获取成功');
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error('错误:', error);
  } else {
    console.log('数据:', data);
  }
});</code></pre>
      
      <h2>Promise的革命</h2>
      <p>
        Promise的出现解决了回调地狱的问题，提供了更清晰的异步代码结构。
      </p>
      
      <pre><code>// Promise示例
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('数据获取成功');
    }, 1000);
  });
}

fetchData()
  .then(data => console.log('数据:', data))
  .catch(error => console.error('错误:', error));</code></pre>
      
      <h2>async/await的优雅</h2>
      <p>
        async/await让异步代码看起来像同步代码，大大提高了代码的可读性。
      </p>
      
      <pre><code>// async/await示例
async function getData() {
  try {
    const data = await fetchData();
    console.log('数据:', data);
  } catch (error) {
    console.error('错误:', error);
  }
}

getData();</code></pre>
      
      <blockquote>
        <p>提示：async/await是Promise的语法糖，本质上还是基于Promise实现的。</p>
      </blockquote>
      
      <h2>最佳实践</h2>
      <ul>
        <li>优先使用async/await，代码更清晰</li>
        <li>合理使用Promise.all()处理并发请求</li>
        <li>始终处理错误情况</li>
        <li>避免在循环中使用await</li>
      </ul>
    `;
  }

  getPhotographyManagementContent() {
    return `
      <p class="text-lg text-gray-700 mb-6">
        设计一个摄影作品管理系统需要考虑多个方面：用户体验、性能优化、数据安全等。本文将分享我在开发个人摄影作品管理系统时的设计思路和技术选型。
      </p>
      
      <h2>系统架构设计</h2>
      <p>
        采用前后端分离的架构，前端使用React构建用户界面，后端使用Node.js + Express提供API服务，数据库选择MongoDB存储作品信息。
      </p>
      
      <h2>数据库设计</h2>
      <p>主要包含以下几个核心集合：</p>
      <ul>
        <li><strong>photos</strong>：存储照片基本信息、EXIF数据、标签等</li>
        <li><strong>albums</strong>：相册信息，支持照片分组管理</li>
        <li><strong>tags</strong>：标签系统，便于照片分类和搜索</li>
        <li><strong>users</strong>：用户信息和权限管理</li>
      </ul>
      
      <h2>核心功能实现</h2>
      <h3>图片上传与处理</h3>
      <pre><code>// 图片上传处理
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  try {
    // 生成缩略图
    const thumbnail = await sharp(req.file.buffer)
      .resize(400, 300)
      .jpeg({ quality: 80 })
      .toBuffer();
    
    // 保存到云存储
    const photoUrl = await uploadToCloud(req.file.buffer);
    const thumbnailUrl = await uploadToCloud(thumbnail);
    
    // 保存到数据库
    const photo = new Photo({
      title: req.body.title,
      url: photoUrl,
      thumbnail: thumbnailUrl,
      uploadDate: new Date()
    });
    
    await photo.save();
    res.json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});</code></pre>
      
      <h2>性能优化策略</h2>
      <ol>
        <li><strong>图片懒加载</strong>：只加载可视区域的图片</li>
        <li><strong>CDN加速</strong>：使用CDN分发图片资源</li>
        <li><strong>缓存策略</strong>：合理设置浏览器和服务器缓存</li>
        <li><strong>图片压缩</strong>：自动生成多种尺寸的图片</li>
      </ol>
      
      <blockquote>
        <p>建议：在设计初期就要考虑性能问题，后期优化成本会更高。</p>
      </blockquote>
    `;
  }

  getCSSLayoutContent() {
    return `
      <p class="text-lg text-gray-700 mb-6">
        现代CSS提供了强大的布局工具，Grid和Flexbox让我们能够轻松创建复杂而灵活的布局。本文将探讨这些布局技术的实际应用。
      </p>
      
      <h2>Flexbox：一维布局的王者</h2>
      <p>
        Flexbox非常适合处理一维布局，无论是水平还是垂直方向的排列都能轻松应对。
      </p>
      
      <pre><code>/* Flexbox基础用法 */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* 响应式Flex */
.flex-container {
  display: flex;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1 1 300px; /* 增长 收缩 基础宽度 */
}</code></pre>
      
      <h2>Grid：二维布局的利器</h2>
      <p>
        CSS Grid专为二维布局设计，能够同时控制行和列的排列。
      </p>
      
      <pre><code>/* Grid基础布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

/* 复杂Grid布局 */
.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }</code></pre>
      
      <h2>响应式设计最佳实践</h2>
      <ul>
        <li>移动端优先的设计思路</li>
        <li>使用相对单位（rem、em、%、vw、vh）</li>
        <li>合理设置断点</li>
        <li>利用CSS变量提高可维护性</li>
      </ul>
      
      <h2>实用技巧</h2>
      <pre><code>/* CSS变量 */
:root {
  --primary-color: #165DFF;
  --spacing-unit: 1rem;
  --border-radius: 0.5rem;
}

/* 容器查询（现代浏览器） */
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}</code></pre>
      
      <blockquote>
        <p>记住：选择合适的布局方法比掌握所有技巧更重要。</p>
      </blockquote>
    `;
  }

  setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        // 这里可以添加移动端菜单逻辑
        console.log('移动端菜单点击');
      });
    }
  }

  setupScrollProgress() {
    // 创建滚动进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    // 监听滚动事件
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  setupCodeHighlight() {
    // 为代码块添加复制功能
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      const pre = block.parentElement;
      pre.style.position = 'relative';
      
      const copyButton = document.createElement('button');
      copyButton.innerHTML = '<i class="fa fa-copy"></i>';
      copyButton.className = 'absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-500 transition-colors';
      copyButton.onclick = () => this.copyCode(block.textContent, copyButton);
      
      pre.appendChild(copyButton);
    });
  }

  copyCode(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fa fa-check"></i>';
      button.classList.add('bg-green-500');
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-green-500');
      }, 2000);
    });
  }
}

// 初始化文章详情页面
document.addEventListener('DOMContentLoaded', () => {
  new ArticleDetail();
});
