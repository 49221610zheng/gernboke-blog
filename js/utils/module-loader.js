// 模块加载器 - 管理模块依赖和初始化
class ModuleLoader {
  constructor() {
    this.modules = new Map();
    this.loadedModules = new Set();
    this.loadingModules = new Set();
    this.dependencies = new Map();
  }
  
  // 注册模块
  register(name, moduleFactory, dependencies = []) {
    this.modules.set(name, {
      factory: moduleFactory,
      dependencies: dependencies,
      instance: null
    });
    
    this.dependencies.set(name, dependencies);
  }
  
  // 加载模块
  async load(name) {
    if (this.loadedModules.has(name)) {
      return this.modules.get(name)?.instance;
    }
    
    if (this.loadingModules.has(name)) {
      // 等待模块加载完成
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.loadedModules.has(name)) {
            resolve(this.modules.get(name)?.instance);
          } else {
            setTimeout(checkLoaded, 10);
          }
        };
        checkLoaded();
      });
    }
    
    const moduleInfo = this.modules.get(name);
    if (!moduleInfo) {
      throw new Error(`Module "${name}" not found`);
    }
    
    this.loadingModules.add(name);
    
    try {
      // 加载依赖
      const dependencies = await this.loadDependencies(moduleInfo.dependencies);
      
      // 创建模块实例
      const instance = await moduleInfo.factory(...dependencies);
      moduleInfo.instance = instance;
      
      this.loadedModules.add(name);
      this.loadingModules.delete(name);
      
      return instance;
    } catch (error) {
      this.loadingModules.delete(name);
      throw new Error(`Failed to load module "${name}": ${error.message}`);
    }
  }
  
  // 加载依赖
  async loadDependencies(dependencies) {
    const loadedDeps = [];
    
    for (const dep of dependencies) {
      const depInstance = await this.load(dep);
      loadedDeps.push(depInstance);
    }
    
    return loadedDeps;
  }
  
  // 批量加载模块
  async loadAll(moduleNames) {
    const results = {};
    
    for (const name of moduleNames) {
      try {
        results[name] = await this.load(name);
      } catch (error) {
        console.error(`Failed to load module "${name}":`, error);
        results[name] = null;
      }
    }
    
    return results;
  }
  
  // 获取模块实例
  get(name) {
    return this.modules.get(name)?.instance;
  }
  
  // 检查模块是否已加载
  isLoaded(name) {
    return this.loadedModules.has(name);
  }
  
  // 卸载模块
  unload(name) {
    const moduleInfo = this.modules.get(name);
    if (moduleInfo && moduleInfo.instance) {
      // 如果模块有清理方法，调用它
      if (typeof moduleInfo.instance.destroy === 'function') {
        moduleInfo.instance.destroy();
      }
      
      moduleInfo.instance = null;
      this.loadedModules.delete(name);
    }
  }
  
  // 重新加载模块
  async reload(name) {
    this.unload(name);
    return await this.load(name);
  }
  
  // 获取依赖图
  getDependencyGraph() {
    const graph = {};
    
    for (const [name, deps] of this.dependencies) {
      graph[name] = deps;
    }
    
    return graph;
  }
  
  // 检查循环依赖
  checkCircularDependencies() {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];
    
    const dfs = (node, path = []) => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        cycles.push(path.slice(cycleStart).concat(node));
        return;
      }
      
      if (visited.has(node)) {
        return;
      }
      
      visited.add(node);
      recursionStack.add(node);
      
      const deps = this.dependencies.get(node) || [];
      for (const dep of deps) {
        dfs(dep, path.concat(node));
      }
      
      recursionStack.delete(node);
    };
    
    for (const moduleName of this.modules.keys()) {
      if (!visited.has(moduleName)) {
        dfs(moduleName);
      }
    }
    
    return cycles;
  }
  
  // 获取加载顺序
  getLoadOrder() {
    const visited = new Set();
    const order = [];
    
    const visit = (node) => {
      if (visited.has(node)) {
        return;
      }
      
      visited.add(node);
      
      const deps = this.dependencies.get(node) || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      order.push(node);
    };
    
    for (const moduleName of this.modules.keys()) {
      visit(moduleName);
    }
    
    return order;
  }
}

// 创建全局模块加载器实例
const moduleLoader = new ModuleLoader();

// 注册核心模块
moduleLoader.register('errorHandler', async () => {
  const { default: ErrorHandler } = await import('./error-handler.js');
  return new ErrorHandler();
});

moduleLoader.register('stateManager', async () => {
  const { default: StateManager } = await import('./state-manager.js');
  return new StateManager({
    loading: false,
    error: null,
    user: null,
    data: {}
  });
});

moduleLoader.register('firebaseConfig', async () => {
  return await import('../firebase-config.js');
});

moduleLoader.register('databaseService', async (firebaseConfig) => {
  return await import('../services/database.js');
}, ['firebaseConfig']);

moduleLoader.register('authService', async (firebaseConfig) => {
  const { default: authService } = await import('../services/auth.js');
  return authService;
}, ['firebaseConfig']);

moduleLoader.register('storageService', async (firebaseConfig) => {
  const { default: storageService } = await import('../services/storage.js');
  return storageService;
}, ['firebaseConfig']);

// 导出便捷方法
export const loadModule = (name) => moduleLoader.load(name);
export const getModule = (name) => moduleLoader.get(name);
export const registerModule = (name, factory, deps) => moduleLoader.register(name, factory, deps);
export const isModuleLoaded = (name) => moduleLoader.isLoaded(name);

// 导出模块加载器
export default moduleLoader;
