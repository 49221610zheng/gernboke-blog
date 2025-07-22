// 网站设置管理模块
class SettingsManager {
  constructor() {
    this.settings = {
      site: {
        title: '光影与代码',
        subtitle: '记录技术与摄影的美好时光',
        description: '一个专注于技术分享和摄影创作的个人博客',
        keywords: '摄影,编程,技术,博客,前端,后端',
        author: '摄影程序员',
        logo: '',
        favicon: '',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai'
      },
      seo: {
        googleAnalytics: '',
        baiduAnalytics: '',
        googleSiteVerification: '',
        baiduSiteVerification: '',
        enableSitemap: true,
        enableRobots: true
      },
      social: {
        github: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        weibo: '',
        email: ''
      },
      comments: {
        enabled: true,
        provider: 'native', // native, disqus, gitalk
        disqusShortname: '',
        gitalkClientId: '',
        gitalkClientSecret: '',
        gitalkRepo: '',
        gitalkOwner: '',
        autoApprove: false,
        requireModeration: true
      },
      appearance: {
        theme: 'light',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        fontFamily: 'Inter',
        enableDarkMode: true,
        enableAnimations: true
      },
      performance: {
        enableCaching: true,
        enableCompression: true,
        enableLazyLoading: true,
        enablePWA: false
      }
    };
    this.init();
  }
  
  init() {
    this.loadSettings();
  }
  
  async loadSettings() {
    try {
      const services = getFirebaseServices();
      if (services && services.db) {
        const doc = await services.db.collection('settings').doc('site').get();
        if (doc.exists) {
          this.settings = { ...this.settings, ...doc.data() };
        }
      }
      this.renderSettings();
    } catch (error) {
      console.error('加载设置失败:', error);
      this.renderSettings();
    }
  }
  
  async saveSettings() {
    try {
      const services = getFirebaseServices();
      if (!services || !services.db) {
        throw new Error('数据库服务未初始化');
      }
      
      await services.db.collection('settings').doc('site').set({
        ...this.settings,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      this.showMessage('设置保存成功', 'success');
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showMessage('保存失败: ' + error.message, 'error');
      return false;
    }
  }
  
  renderSettings() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">网站设置</h1>
          <button onclick="settingsManager.saveSettings()" class="btn-primary">
            <i class="fas fa-save mr-2"></i>保存设置
          </button>
        </div>
        
        <!-- 设置导航 -->
        <div class="bg-white rounded-lg shadow">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6" aria-label="Tabs">
              <button onclick="settingsManager.showTab('site')" 
                      class="settings-tab active py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                网站信息
              </button>
              <button onclick="settingsManager.showTab('seo')" 
                      class="settings-tab py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                SEO设置
              </button>
              <button onclick="settingsManager.showTab('social')" 
                      class="settings-tab py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                社交媒体
              </button>
              <button onclick="settingsManager.showTab('comments')" 
                      class="settings-tab py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                评论设置
              </button>
              <button onclick="settingsManager.showTab('appearance')" 
                      class="settings-tab py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                外观主题
              </button>
              <button onclick="settingsManager.showTab('performance')" 
                      class="settings-tab py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                性能优化
              </button>
            </nav>
          </div>
          
          <div id="settings-content" class="p-6">
            ${this.renderSiteSettings()}
          </div>
        </div>
      </div>
    `;
  }
  
  showTab(tabName) {
    // 更新导航状态
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.classList.remove('active', 'border-blue-500', 'text-blue-600');
      tab.classList.add('border-transparent', 'text-gray-500');
    });
    
    event.target.classList.add('active', 'border-blue-500', 'text-blue-600');
    event.target.classList.remove('border-transparent', 'text-gray-500');
    
    // 显示对应内容
    const content = document.getElementById('settings-content');
    switch (tabName) {
      case 'site':
        content.innerHTML = this.renderSiteSettings();
        break;
      case 'seo':
        content.innerHTML = this.renderSEOSettings();
        break;
      case 'social':
        content.innerHTML = this.renderSocialSettings();
        break;
      case 'comments':
        content.innerHTML = this.renderCommentSettings();
        break;
      case 'appearance':
        content.innerHTML = this.renderAppearanceSettings();
        break;
      case 'performance':
        content.innerHTML = this.renderPerformanceSettings();
        break;
    }
    
    this.bindFormEvents();
  }
  
  renderSiteSettings() {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">基本信息</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">网站标题</label>
            <input type="text" id="site-title" value="${this.settings.site.title}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">副标题</label>
            <input type="text" id="site-subtitle" value="${this.settings.site.subtitle}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
            <textarea id="site-description" rows="3" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${this.settings.site.description}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">关键词</label>
            <input type="text" id="site-keywords" value="${this.settings.site.keywords}" 
                   placeholder="用逗号分隔多个关键词"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">作者</label>
            <input type="text" id="site-author" value="${this.settings.site.author}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input type="url" id="site-logo" value="${this.settings.site.logo}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
            <input type="url" id="site-favicon" value="${this.settings.site.favicon}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>
    `;
  }
  
  renderSEOSettings() {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">SEO优化</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
            <input type="text" id="google-analytics" value="${this.settings.seo.googleAnalytics}" 
                   placeholder="G-XXXXXXXXXX"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">百度统计ID</label>
            <input type="text" id="baidu-analytics" value="${this.settings.seo.baiduAnalytics}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Google站点验证</label>
            <input type="text" id="google-verification" value="${this.settings.seo.googleSiteVerification}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">百度站点验证</label>
            <input type="text" id="baidu-verification" value="${this.settings.seo.baiduSiteVerification}" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input type="checkbox" id="enable-sitemap" ${this.settings.seo.enableSitemap ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-sitemap" class="ml-2 text-sm text-gray-700">启用站点地图</label>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="enable-robots" ${this.settings.seo.enableRobots ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-robots" class="ml-2 text-sm text-gray-700">启用robots.txt</label>
          </div>
        </div>
      </div>
    `;
  }
  
  renderSocialSettings() {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">社交媒体链接</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fab fa-github mr-2"></i>GitHub
            </label>
            <input type="url" id="social-github" value="${this.settings.social.github}" 
                   placeholder="https://github.com/username"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fab fa-twitter mr-2"></i>Twitter
            </label>
            <input type="url" id="social-twitter" value="${this.settings.social.twitter}" 
                   placeholder="https://twitter.com/username"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fab fa-linkedin mr-2"></i>LinkedIn
            </label>
            <input type="url" id="social-linkedin" value="${this.settings.social.linkedin}" 
                   placeholder="https://linkedin.com/in/username"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fab fa-instagram mr-2"></i>Instagram
            </label>
            <input type="url" id="social-instagram" value="${this.settings.social.instagram}" 
                   placeholder="https://instagram.com/username"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fab fa-weibo mr-2"></i>微博
            </label>
            <input type="url" id="social-weibo" value="${this.settings.social.weibo}" 
                   placeholder="https://weibo.com/username"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-envelope mr-2"></i>邮箱
            </label>
            <input type="email" id="social-email" value="${this.settings.social.email}" 
                   placeholder="your@email.com"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>
    `;
  }
  
  renderCommentSettings() {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">评论系统</h3>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input type="checkbox" id="comments-enabled" ${this.settings.comments.enabled ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="comments-enabled" class="ml-2 text-sm text-gray-700">启用评论功能</label>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">评论提供商</label>
            <select id="comments-provider" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="native" ${this.settings.comments.provider === 'native' ? 'selected' : ''}>原生评论</option>
              <option value="disqus" ${this.settings.comments.provider === 'disqus' ? 'selected' : ''}>Disqus</option>
              <option value="gitalk" ${this.settings.comments.provider === 'gitalk' ? 'selected' : ''}>Gitalk</option>
            </select>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="auto-approve" ${this.settings.comments.autoApprove ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="auto-approve" class="ml-2 text-sm text-gray-700">自动通过评论</label>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="require-moderation" ${this.settings.comments.requireModeration ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="require-moderation" class="ml-2 text-sm text-gray-700">需要审核</label>
          </div>
        </div>
      </div>
    `;
  }
  
  renderAppearanceSettings() {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">外观设置</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">主题模式</label>
            <select id="theme-mode" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="light" ${this.settings.appearance.theme === 'light' ? 'selected' : ''}>浅色主题</option>
              <option value="dark" ${this.settings.appearance.theme === 'dark' ? 'selected' : ''}>深色主题</option>
              <option value="auto" ${this.settings.appearance.theme === 'auto' ? 'selected' : ''}>跟随系统</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">主色调</label>
            <input type="color" id="primary-color" value="${this.settings.appearance.primaryColor}" 
                   class="w-full h-10 border border-gray-300 rounded-md">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">辅助色</label>
            <input type="color" id="secondary-color" value="${this.settings.appearance.secondaryColor}" 
                   class="w-full h-10 border border-gray-300 rounded-md">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">字体</label>
            <select id="font-family" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Inter" ${this.settings.appearance.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
              <option value="Roboto" ${this.settings.appearance.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
              <option value="Noto Sans SC" ${this.settings.appearance.fontFamily === 'Noto Sans SC' ? 'selected' : ''}>Noto Sans SC</option>
            </select>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input type="checkbox" id="enable-dark-mode" ${this.settings.appearance.enableDarkMode ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-dark-mode" class="ml-2 text-sm text-gray-700">启用深色模式切换</label>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="enable-animations" ${this.settings.appearance.enableAnimations ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-animations" class="ml-2 text-sm text-gray-700">启用动画效果</label>
          </div>
        </div>
      </div>
    `;
  }
  
  renderPerformanceSettings() {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">性能优化</h3>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input type="checkbox" id="enable-caching" ${this.settings.performance.enableCaching ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-caching" class="ml-2 text-sm text-gray-700">启用缓存</label>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="enable-compression" ${this.settings.performance.enableCompression ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-compression" class="ml-2 text-sm text-gray-700">启用压缩</label>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="enable-lazy-loading" ${this.settings.performance.enableLazyLoading ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-lazy-loading" class="ml-2 text-sm text-gray-700">启用懒加载</label>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="enable-pwa" ${this.settings.performance.enablePWA ? 'checked' : ''} 
                   class="rounded border-gray-300">
            <label for="enable-pwa" class="ml-2 text-sm text-gray-700">启用PWA</label>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-info-circle text-blue-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">性能提示</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>启用缓存可以显著提高页面加载速度</li>
                  <li>图片懒加载可以减少初始页面加载时间</li>
                  <li>PWA功能可以让网站像原生应用一样使用</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  bindFormEvents() {
    // 绑定表单字段变化事件
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateSettingsFromForm();
      });
    });
  }
  
  updateSettingsFromForm() {
    // 更新设置对象
    const getValue = (id) => {
      const element = document.getElementById(id);
      if (!element) return '';
      
      if (element.type === 'checkbox') {
        return element.checked;
      }
      return element.value;
    };
    
    // 网站信息
    this.settings.site.title = getValue('site-title');
    this.settings.site.subtitle = getValue('site-subtitle');
    this.settings.site.description = getValue('site-description');
    this.settings.site.keywords = getValue('site-keywords');
    this.settings.site.author = getValue('site-author');
    this.settings.site.logo = getValue('site-logo');
    this.settings.site.favicon = getValue('site-favicon');
    
    // SEO设置
    this.settings.seo.googleAnalytics = getValue('google-analytics');
    this.settings.seo.baiduAnalytics = getValue('baidu-analytics');
    this.settings.seo.googleSiteVerification = getValue('google-verification');
    this.settings.seo.baiduSiteVerification = getValue('baidu-verification');
    this.settings.seo.enableSitemap = getValue('enable-sitemap');
    this.settings.seo.enableRobots = getValue('enable-robots');
    
    // 社交媒体
    this.settings.social.github = getValue('social-github');
    this.settings.social.twitter = getValue('social-twitter');
    this.settings.social.linkedin = getValue('social-linkedin');
    this.settings.social.instagram = getValue('social-instagram');
    this.settings.social.weibo = getValue('social-weibo');
    this.settings.social.email = getValue('social-email');
    
    // 评论设置
    this.settings.comments.enabled = getValue('comments-enabled');
    this.settings.comments.provider = getValue('comments-provider');
    this.settings.comments.autoApprove = getValue('auto-approve');
    this.settings.comments.requireModeration = getValue('require-moderation');
    
    // 外观设置
    this.settings.appearance.theme = getValue('theme-mode');
    this.settings.appearance.primaryColor = getValue('primary-color');
    this.settings.appearance.secondaryColor = getValue('secondary-color');
    this.settings.appearance.fontFamily = getValue('font-family');
    this.settings.appearance.enableDarkMode = getValue('enable-dark-mode');
    this.settings.appearance.enableAnimations = getValue('enable-animations');
    
    // 性能设置
    this.settings.performance.enableCaching = getValue('enable-caching');
    this.settings.performance.enableCompression = getValue('enable-compression');
    this.settings.performance.enableLazyLoading = getValue('enable-lazy-loading');
    this.settings.performance.enablePWA = getValue('enable-pwa');
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
window.SettingsManager = SettingsManager;
