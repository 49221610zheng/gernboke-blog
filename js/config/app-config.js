// 应用程序配置文件
export const APP_CONFIG = {
  // 应用基本信息
  app: {
    name: '光影与代码',
    version: '1.0.0',
    description: '融合摄影艺术与编程技术的个人博客',
    author: '摄影程序员',
    keywords: ['摄影', '编程', '技术', '博客', '艺术']
  },
  
  // API 配置
  api: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.example.com' : 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  
  // Firebase 配置（从环境变量或配置文件读取）
  firebase: {
    // 这些值应该从 firebase-config.js 中读取
    // 或者从环境变量中读取
    emulator: {
      enabled: location.hostname === 'localhost',
      firestore: {
        host: 'localhost',
        port: 8080
      },
      auth: {
        url: 'http://localhost:9099'
      },
      storage: {
        host: 'localhost',
        port: 9199
      }
    }
  },
  
  // 分页配置
  pagination: {
    photography: {
      pageSize: 12,
      loadMoreThreshold: 3
    },
    articles: {
      pageSize: 10,
      loadMoreThreshold: 2
    },
    comments: {
      pageSize: 20,
      loadMoreThreshold: 5
    }
  },
  
  // 文件上传配置
  upload: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    compression: {
      enabled: true,
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8
    },
    thumbnail: {
      enabled: true,
      maxWidth: 400,
      maxHeight: 300,
      quality: 0.7
    }
  },
  
  // UI 配置
  ui: {
    theme: {
      primary: '#165DFF',
      secondary: '#36CFC9',
      dark: '#1D2129',
      light: '#F7F8FA',
      grayMedium: '#86909C'
    },
    animation: {
      duration: 300,
      easing: 'ease-out'
    },
    notification: {
      duration: 5000,
      position: 'top-right'
    },
    loading: {
      showDelay: 200, // 延迟显示加载指示器，避免闪烁
      minDuration: 500 // 最小显示时间
    }
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    ttl: {
      photography: 5 * 60 * 1000, // 5分钟
      articles: 10 * 60 * 1000,   // 10分钟
      comments: 2 * 60 * 1000,    // 2分钟
      settings: 30 * 60 * 1000    // 30分钟
    },
    maxSize: 100 // 最大缓存条目数
  },
  
  // 错误处理配置
  errorHandling: {
    enableReporting: process.env.NODE_ENV === 'production',
    reportingUrl: '/api/errors',
    ignoredErrors: [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded'
    ],
    maxReports: 10, // 每个会话最大错误报告数
    reportingInterval: 60000 // 错误报告间隔（毫秒）
  },
  
  // 性能监控配置
  performance: {
    enabled: true,
    sampleRate: 0.1, // 采样率
    metrics: {
      fcp: true,  // First Contentful Paint
      lcp: true,  // Largest Contentful Paint
      fid: true,  // First Input Delay
      cls: true   // Cumulative Layout Shift
    }
  },
  
  // SEO 配置
  seo: {
    defaultTitle: '光影与代码 | 摄影与技术博客',
    titleTemplate: '%s | 光影与代码',
    defaultDescription: '融合摄影艺术与编程技术的个人博客，分享摄影作品、技术文章和开发心得',
    defaultKeywords: ['摄影', '编程', '技术博客', '前端开发', '后端开发'],
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // 社交媒体配置
  social: {
    github: 'https://github.com/username',
    instagram: 'https://instagram.com/username',
    twitter: 'https://twitter.com/username',
    linkedin: 'https://linkedin.com/in/username',
    email: 'contact@example.com'
  },
  
  // 分析配置
  analytics: {
    google: {
      enabled: process.env.NODE_ENV === 'production',
      trackingId: 'GA_TRACKING_ID'
    },
    custom: {
      enabled: true,
      endpoint: '/api/analytics'
    }
  },
  
  // 开发配置
  development: {
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableMockData: false,
    enablePerformanceLogging: true,
    enableStateLogging: true
  },
  
  // 安全配置
  security: {
    enableCSP: true,
    allowedDomains: [
      'https://cdn.tailwindcss.com',
      'https://cdn.jsdelivr.net',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    rateLimiting: {
      enabled: true,
      maxRequests: 100,
      windowMs: 15 * 60 * 1000 // 15分钟
    }
  },
  
  // 国际化配置
  i18n: {
    defaultLocale: 'zh-CN',
    supportedLocales: ['zh-CN', 'en-US'],
    fallbackLocale: 'zh-CN'
  }
};

// 环境特定配置
export const ENV_CONFIG = {
  development: {
    api: {
      baseUrl: 'http://localhost:3000'
    },
    firebase: {
      emulator: {
        enabled: true
      }
    },
    errorHandling: {
      enableReporting: false
    }
  },
  
  production: {
    api: {
      baseUrl: 'https://api.lightandcode.com'
    },
    firebase: {
      emulator: {
        enabled: false
      }
    },
    errorHandling: {
      enableReporting: true
    }
  }
};

// 获取当前环境配置
export function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = ENV_CONFIG[env] || ENV_CONFIG.development;
  
  // 深度合并配置
  return deepMerge(APP_CONFIG, envConfig);
}

// 深度合并对象
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// 导出默认配置
export default getConfig();
