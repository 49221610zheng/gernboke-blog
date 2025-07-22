// 数据分析管理模块
class AnalyticsManager {
  constructor() {
    this.analytics = {
      overview: {
        totalViews: 15234,
        uniqueVisitors: 8567,
        pageViews: 23456,
        bounceRate: 0.35,
        avgSessionDuration: 245
      },
      traffic: {
        daily: [],
        weekly: [],
        monthly: []
      },
      content: {
        topArticles: [],
        topPhotos: [],
        categories: []
      },
      sources: {
        direct: 0.45,
        search: 0.32,
        social: 0.15,
        referral: 0.08
      },
      devices: {
        desktop: 0.58,
        mobile: 0.35,
        tablet: 0.07
      },
      locations: []
    };
    this.init();
  }
  
  init() {
    this.loadAnalytics();
  }
  
  async loadAnalytics() {
    try {
      // 模拟加载分析数据
      await this.generateMockData();
      this.renderAnalytics();
    } catch (error) {
      console.error('加载分析数据失败:', error);
    }
  }
  
  async generateMockData() {
    // 生成模拟的流量数据
    const now = new Date();
    const dailyData = [];
    const weeklyData = [];
    const monthlyData = [];
    
    // 生成30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 300) + 50
      });
    }
    
    // 生成12周的数据
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      
      weeklyData.push({
        week: `第${12-i}周`,
        views: Math.floor(Math.random() * 3000) + 1000,
        visitors: Math.floor(Math.random() * 2000) + 500
      });
    }
    
    // 生成12个月的数据
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      monthlyData.push({
        month: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
        views: Math.floor(Math.random() * 10000) + 5000,
        visitors: Math.floor(Math.random() * 6000) + 2000
      });
    }
    
    this.analytics.traffic = { daily: dailyData, weekly: weeklyData, monthly: monthlyData };
    
    // 生成热门内容数据
    this.analytics.content.topArticles = [
      { title: 'React Hooks 深度解析', views: 2345, comments: 23 },
      { title: 'JavaScript 异步编程指南', views: 1876, comments: 18 },
      { title: 'CSS Grid 布局完全指南', views: 1654, comments: 15 },
      { title: 'Vue 3 组合式API详解', views: 1432, comments: 12 },
      { title: 'Node.js 性能优化技巧', views: 1234, comments: 9 }
    ];
    
    this.analytics.content.topPhotos = [
      { title: '城市夜景', views: 3456, likes: 234 },
      { title: '山间晨雾', views: 2876, likes: 198 },
      { title: '街头人像', views: 2654, likes: 176 },
      { title: '建筑几何', views: 2432, likes: 154 },
      { title: '自然风光', views: 2234, likes: 132 }
    ];
    
    this.analytics.content.categories = [
      { name: '技术文章', count: 45, percentage: 0.45 },
      { name: '摄影作品', count: 35, percentage: 0.35 },
      { name: '开发日记', count: 20, percentage: 0.20 }
    ];
    
    // 生成地理位置数据
    this.analytics.locations = [
      { country: '中国', visitors: 5234, percentage: 0.61 },
      { country: '美国', visitors: 1234, percentage: 0.14 },
      { country: '日本', visitors: 876, percentage: 0.10 },
      { country: '德国', visitors: 654, percentage: 0.08 },
      { country: '其他', visitors: 567, percentage: 0.07 }
    ];
  }
  
  renderAnalytics() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">数据分析</h1>
          <div class="flex items-center space-x-4">
            <select id="date-range" onchange="analyticsManager.changeDateRange()" 
                    class="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="7">最近7天</option>
              <option value="30" selected>最近30天</option>
              <option value="90">最近90天</option>
              <option value="365">最近一年</option>
            </select>
            <button onclick="analyticsManager.exportData()" class="btn-secondary text-sm">
              <i class="fas fa-download mr-2"></i>导出数据
            </button>
          </div>
        </div>
        
        <!-- 概览统计 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="fas fa-eye text-blue-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">总浏览量</p>
                <p class="text-2xl font-bold text-gray-900">${this.formatNumber(this.analytics.overview.totalViews)}</p>
                <p class="text-sm text-green-600">+12.5%</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="fas fa-users text-green-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">独立访客</p>
                <p class="text-2xl font-bold text-gray-900">${this.formatNumber(this.analytics.overview.uniqueVisitors)}</p>
                <p class="text-sm text-green-600">+8.3%</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <i class="fas fa-file-alt text-purple-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">页面浏览</p>
                <p class="text-2xl font-bold text-gray-900">${this.formatNumber(this.analytics.overview.pageViews)}</p>
                <p class="text-sm text-green-600">+15.7%</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <i class="fas fa-chart-line text-yellow-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">跳出率</p>
                <p class="text-2xl font-bold text-gray-900">${(this.analytics.overview.bounceRate * 100).toFixed(1)}%</p>
                <p class="text-sm text-red-600">+2.1%</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-indigo-100 rounded-lg">
                <i class="fas fa-clock text-indigo-600"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">平均停留</p>
                <p class="text-2xl font-bold text-gray-900">${this.formatDuration(this.analytics.overview.avgSessionDuration)}</p>
                <p class="text-sm text-green-600">+5.2%</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 流量趋势图 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">流量趋势</h3>
            <div class="flex space-x-2">
              <button onclick="analyticsManager.showTrafficChart('daily')" 
                      class="traffic-tab active px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">日</button>
              <button onclick="analyticsManager.showTrafficChart('weekly')" 
                      class="traffic-tab px-3 py-1 text-sm rounded-full text-gray-600 hover:bg-gray-100">周</button>
              <button onclick="analyticsManager.showTrafficChart('monthly')" 
                      class="traffic-tab px-3 py-1 text-sm rounded-full text-gray-600 hover:bg-gray-100">月</button>
            </div>
          </div>
          <div class="h-80">
            <canvas id="traffic-chart"></canvas>
          </div>
        </div>
        
        <!-- 内容分析 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 热门文章 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">热门文章</h3>
            <div class="space-y-4">
              ${this.analytics.content.topArticles.map((article, index) => `
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-500 rounded-full">
                      ${index + 1}
                    </span>
                    <span class="text-sm font-medium text-gray-900 truncate">${article.title}</span>
                  </div>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-eye mr-1"></i>${this.formatNumber(article.views)}</span>
                    <span><i class="fas fa-comments mr-1"></i>${article.comments}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- 热门摄影作品 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">热门摄影作品</h3>
            <div class="space-y-4">
              ${this.analytics.content.topPhotos.map((photo, index) => `
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-green-500 rounded-full">
                      ${index + 1}
                    </span>
                    <span class="text-sm font-medium text-gray-900 truncate">${photo.title}</span>
                  </div>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-eye mr-1"></i>${this.formatNumber(photo.views)}</span>
                    <span><i class="fas fa-heart mr-1"></i>${photo.likes}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- 流量来源和设备分析 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 流量来源 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">流量来源</h3>
            <div class="space-y-3">
              ${Object.entries(this.analytics.sources).map(([source, percentage]) => `
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">${this.getSourceName(source)}</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: ${percentage * 100}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">${(percentage * 100).toFixed(1)}%</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- 设备分析 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">设备分析</h3>
            <div class="space-y-3">
              ${Object.entries(this.analytics.devices).map(([device, percentage]) => `
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">${this.getDeviceName(device)}</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div class="bg-green-500 h-2 rounded-full" style="width: ${percentage * 100}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">${(percentage * 100).toFixed(1)}%</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- 地理位置 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">访客地区</h3>
            <div class="space-y-3">
              ${this.analytics.locations.map(location => `
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">${location.country}</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div class="bg-purple-500 h-2 rounded-full" style="width: ${location.percentage * 100}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">${this.formatNumber(location.visitors)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 初始化图表
    this.initTrafficChart();
  }
  
  initTrafficChart() {
    // 这里应该使用Chart.js或其他图表库
    // 暂时显示占位符
    const canvas = document.getElementById('traffic-chart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('流量趋势图 (需要Chart.js)', canvas.width / 2, canvas.height / 2);
    }
  }
  
  showTrafficChart(period) {
    // 更新图表显示
    document.querySelectorAll('.traffic-tab').forEach(tab => {
      tab.classList.remove('active', 'bg-blue-100', 'text-blue-700');
      tab.classList.add('text-gray-600');
    });
    
    event.target.classList.add('active', 'bg-blue-100', 'text-blue-700');
    event.target.classList.remove('text-gray-600');
    
    // 这里应该更新图表数据
    console.log(`显示${period}数据`);
  }
  
  changeDateRange() {
    const range = document.getElementById('date-range').value;
    console.log(`更改日期范围为: ${range}天`);
    // 这里应该重新加载数据
  }
  
  exportData() {
    // 导出数据功能
    const data = {
      overview: this.analytics.overview,
      traffic: this.analytics.traffic,
      content: this.analytics.content,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showMessage('数据导出成功', 'success');
  }
  
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
  
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  getSourceName(source) {
    const names = {
      direct: '直接访问',
      search: '搜索引擎',
      social: '社交媒体',
      referral: '外部链接'
    };
    return names[source] || source;
  }
  
  getDeviceName(device) {
    const names = {
      desktop: '桌面端',
      mobile: '移动端',
      tablet: '平板端'
    };
    return names[device] || device;
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
window.AnalyticsManager = AnalyticsManager;
