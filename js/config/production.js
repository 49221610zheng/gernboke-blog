// 生产环境配置
export const PRODUCTION_CONFIG = {
  // 性能优化
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCaching: true,
    enableCompression: true,
    enableMinification: true
  },
  
  // 监控和分析
  monitoring: {
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    enableAnalytics: true,
    enableUserFeedback: true
  },
  
  // 安全配置
  security: {
    enableCSP: true,
    enableHTTPS: true,
    enableSecurityHeaders: true,
    enableRateLimiting: true
  },
  
  // SEO 优化
  seo: {
    enableSitemap: true,
    enableRobotsTxt: true,
    enableStructuredData: true,
    enableOpenGraph: true,
    enableTwitterCards: true
  },
  
  // 缓存策略
  cache: {
    staticAssets: '1y',      // 静态资源缓存1年
    htmlPages: '1h',         // HTML页面缓存1小时
    apiResponses: '5m',      // API响应缓存5分钟
    images: '1y'             // 图片缓存1年
  },
  
  // CDN 配置
  cdn: {
    enabled: true,
    baseUrl: 'https://cdn.your-domain.com',
    regions: ['us-central1', 'asia-east1', 'europe-west1']
  },
  
  // 备份策略
  backup: {
    enableAutoBackup: true,
    backupInterval: '24h',
    retentionPeriod: '30d',
    backupLocation: 'gs://your-backup-bucket'
  }
};

// 生产环境检查清单
export const PRODUCTION_CHECKLIST = [
  {
    category: 'Firebase 配置',
    items: [
      '✅ Firebase 项目已创建',
      '✅ Firestore 数据库已配置',
      '✅ Storage 存储已设置',
      '✅ Authentication 已启用',
      '✅ 安全规则已部署',
      '✅ 索引已创建'
    ]
  },
  {
    category: '域名和SSL',
    items: [
      '⏳ 自定义域名已配置',
      '⏳ SSL 证书已生成',
      '⏳ DNS 记录已更新',
      '⏳ 域名验证已完成'
    ]
  },
  {
    category: '性能优化',
    items: [
      '✅ 图片已优化',
      '✅ 代码已压缩',
      '✅ 缓存策略已配置',
      '✅ CDN 已启用'
    ]
  },
  {
    category: '监控和分析',
    items: [
      '⏳ Google Analytics 已配置',
      '⏳ Firebase Performance 已启用',
      '⏳ 错误监控已设置',
      '⏳ 用户反馈已集成'
    ]
  },
  {
    category: '安全检查',
    items: [
      '✅ 安全规则已测试',
      '✅ 用户权限已验证',
      '✅ API 密钥已保护',
      '✅ HTTPS 已强制启用'
    ]
  },
  {
    category: '内容管理',
    items: [
      '⏳ 管理员账户已创建',
      '⏳ 初始内容已添加',
      '⏳ SEO 信息已配置',
      '⏳ 社交媒体链接已设置'
    ]
  }
];

// 部署后验证
export const POST_DEPLOYMENT_TESTS = [
  {
    name: '网站可访问性',
    url: 'https://your-domain.com',
    expectedStatus: 200
  },
  {
    name: '管理后台',
    url: 'https://your-domain.com/admin',
    expectedStatus: 200
  },
  {
    name: 'API 连接',
    test: 'Firebase 连接测试'
  },
  {
    name: '图片上传',
    test: '文件上传功能测试'
  },
  {
    name: '用户认证',
    test: '登录功能测试'
  },
  {
    name: '响应式设计',
    test: '移动端适配测试'
  }
];

export default PRODUCTION_CONFIG;
