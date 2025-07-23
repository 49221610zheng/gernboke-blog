// Service Worker for offline support
const CACHE_NAME = 'blog-cache-v1';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/css/production-styles.css',
  '/css/enhanced-styles.css',
  '/js/app-simple.js',
  '/js/firebase-config.js',
  '/js/components/ui-enhancements.js',
  '/js/components/ux-optimizer.js',
  '/js/components/responsive-navigation.js',
  '/js/components/image-optimizer.js',
  '/js/components/click-handlers.js',
  '/js/components/search-system.js',
  '/js/components/comment-system.js',
  '/js/admin/admin-main.js',
  '/js/security/admin-auth.js',
  '/js/security/secret-access.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap'
];

// 安装事件
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('缓存静态资源...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('静态资源缓存完成');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('缓存静态资源失败:', error);
      })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker 激活完成');
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过Chrome扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // 跳过Firebase相关请求（避免跟踪防护冲突）
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebaseio.com') ||
      url.pathname.includes('/api/') ||
      url.pathname.includes('firebase')) {
    // 直接让浏览器处理这些请求，不进行缓存
    return;
  }
  
  // 静态资源缓存策略
  if (STATIC_ASSETS.includes(url.pathname) || 
      url.hostname.includes('cdnjs.cloudflare.com') ||
      url.hostname.includes('fonts.googleapis.com')) {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
        .catch(() => {
          // 返回离线页面
          if (request.destination === 'document') {
            return caches.match('/offline.html') || 
                   new Response('<h1>离线模式</h1><p>请检查网络连接</p>', {
                     headers: { 'Content-Type': 'text/html' }
                   });
          }
        })
    );
    return;
  }
  
  // 动态内容缓存策略（网络优先）
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // 返回离线页面
            if (request.destination === 'document') {
              return new Response(`
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>离线模式 - 光影与代码</title>
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      margin: 0;
                      padding: 0;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      text-align: center;
                    }
                    .container {
                      max-width: 500px;
                      padding: 2rem;
                    }
                    .icon {
                      font-size: 4rem;
                      margin-bottom: 1rem;
                      opacity: 0.8;
                    }
                    h1 {
                      font-size: 2rem;
                      margin-bottom: 1rem;
                      font-weight: 600;
                    }
                    p {
                      font-size: 1.1rem;
                      line-height: 1.6;
                      opacity: 0.9;
                      margin-bottom: 2rem;
                    }
                    .btn {
                      background: rgba(255, 255, 255, 0.2);
                      border: 2px solid rgba(255, 255, 255, 0.3);
                      color: white;
                      padding: 0.75rem 1.5rem;
                      border-radius: 0.5rem;
                      text-decoration: none;
                      display: inline-block;
                      transition: all 0.3s ease;
                      backdrop-filter: blur(10px);
                    }
                    .btn:hover {
                      background: rgba(255, 255, 255, 0.3);
                      border-color: rgba(255, 255, 255, 0.5);
                    }
                    .features {
                      margin-top: 2rem;
                      text-align: left;
                    }
                    .feature {
                      margin-bottom: 0.5rem;
                      opacity: 0.8;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="icon">📱</div>
                    <h1>离线模式</h1>
                    <p>您当前处于离线状态，但仍可以浏览已缓存的内容。</p>
                    
                    <div class="features">
                      <div class="feature">✓ 已缓存的页面可正常访问</div>
                      <div class="feature">✓ 离线时保存的数据会在联网后同步</div>
                      <div class="feature">✓ 基本功能仍然可用</div>
                    </div>
                    
                    <a href="/" class="btn" onclick="window.location.reload()">重新连接</a>
                  </div>
                  
                  <script>
                    // 检测网络状态
                    window.addEventListener('online', () => {
                      window.location.reload();
                    });
                    
                    // 定期检查网络
                    setInterval(() => {
                      if (navigator.onLine) {
                        window.location.reload();
                      }
                    }, 5000);
                  </script>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              });
            }
            
            return new Response('资源不可用', { status: 404 });
          });
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  console.log('后台同步:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncOfflineData()
    );
  }
});

// 推送通知
self.addEventListener('push', (event) => {
  console.log('收到推送消息:', event);
  
  const options = {
    body: event.data ? event.data.text() : '您有新的消息',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('光影与代码', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('通知被点击:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 同步离线数据
async function syncOfflineData() {
  try {
    // 获取离线存储的数据
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // 发送到服务器
      for (const data of offlineData) {
        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
      
      // 清除已同步的数据
      await clearOfflineData();
      console.log('离线数据同步完成');
    }
  } catch (error) {
    console.error('数据同步失败:', error);
  }
}

// 获取离线数据
async function getOfflineData() {
  // 这里应该从IndexedDB或其他存储中获取离线数据
  return [];
}

// 清除离线数据
async function clearOfflineData() {
  // 清除已同步的离线数据
}

// 缓存管理
async function cleanupCache() {
  const cacheNames = await caches.keys();
  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  const requests = await dynamicCache.keys();
  
  // 限制动态缓存大小
  if (requests.length > 50) {
    await dynamicCache.delete(requests[0]);
  }
}

// 定期清理缓存
setInterval(cleanupCache, 60000); // 每分钟清理一次
