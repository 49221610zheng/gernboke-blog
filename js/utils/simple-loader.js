// 简化的模块加载器 - 兼容CDN版本

// 全局模块缓存
window.moduleCache = window.moduleCache || new Map();

// 简化的模块加载函数
async function loadModule(moduleName) {
  // 检查缓存
  if (window.moduleCache.has(moduleName)) {
    return window.moduleCache.get(moduleName);
  }
  
  let module = null;
  
  try {
    switch (moduleName) {
      case 'stateManager':
        module = await loadStateManager();
        break;
      case 'errorHandler':
        module = await loadErrorHandler();
        break;
      case 'databaseService':
        module = await loadDatabaseService();
        break;
      default:
        throw new Error(`Unknown module: ${moduleName}`);
    }
    
    // 缓存模块
    window.moduleCache.set(moduleName, module);
    console.log(`✅ Module loaded: ${moduleName}`);
    return module;
    
  } catch (error) {
    console.error(`❌ Failed to load module "${moduleName}":`, error);
    throw error;
  }
}

// 加载状态管理器
async function loadStateManager() {
  if (window.StateManager) {
    return new window.StateManager();
  }
  
  await loadScript('js/utils/state-manager.js');
  return new window.StateManager();
}

// 加载错误处理器
async function loadErrorHandler() {
  if (window.ErrorHandler) {
    return new window.ErrorHandler();
  }
  
  await loadScript('js/utils/error-handler.js');
  return new window.ErrorHandler();
}

// 加载数据库服务
async function loadDatabaseService() {
  if (window.databaseService) {
    return window.databaseService;
  }
  
  await loadScript('js/services/database-simple.js');
  return window.databaseService;
}

// 加载脚本文件
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log(`✅ Script loaded: ${src}`);
      resolve();
    };
    script.onerror = (error) => {
      console.error(`❌ Failed to load script: ${src}`, error);
      reject(error);
    };
    document.head.appendChild(script);
  });
}

// 导出到全局
window.loadModule = loadModule;
window.loadScript = loadScript;
