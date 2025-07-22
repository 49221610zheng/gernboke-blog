// 简单的状态管理系统
class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Map();
    this.middleware = [];
  }
  
  // 获取状态
  getState() {
    return { ...this.state };
  }
  
  // 设置状态
  setState(updates, silent = false) {
    const prevState = { ...this.state };
    
    // 应用中间件
    let finalUpdates = updates;
    for (const middleware of this.middleware) {
      finalUpdates = middleware(prevState, finalUpdates, this.state) || finalUpdates;
    }
    
    // 更新状态
    this.state = { ...this.state, ...finalUpdates };
    
    // 通知监听器
    if (!silent) {
      this.notifyListeners(prevState, this.state, finalUpdates);
    }
    
    return this.state;
  }
  
  // 订阅状态变化
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key).push(callback);
    
    // 返回取消订阅函数
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }
  
  // 取消订阅
  unsubscribe(key, callback) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  // 通知监听器
  notifyListeners(prevState, newState, updates) {
    // 通知全局监听器
    const globalListeners = this.listeners.get('*') || [];
    globalListeners.forEach(callback => {
      try {
        callback(newState, prevState, updates);
      } catch (error) {
        console.error('Error in global state listener:', error);
      }
    });
    
    // 通知特定键的监听器
    Object.keys(updates).forEach(key => {
      const keyListeners = this.listeners.get(key) || [];
      keyListeners.forEach(callback => {
        try {
          callback(newState[key], prevState[key], newState, prevState);
        } catch (error) {
          console.error(`Error in state listener for key "${key}":`, error);
        }
      });
    });
  }
  
  // 添加中间件
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }
  
  // 移除中间件
  removeMiddleware(middleware) {
    const index = this.middleware.indexOf(middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
    }
  }
  
  // 重置状态
  reset(newState = {}) {
    const prevState = { ...this.state };
    this.state = { ...newState };
    this.notifyListeners(prevState, this.state, this.state);
  }
  
  // 获取特定键的值
  get(key) {
    return this.state[key];
  }
  
  // 设置特定键的值
  set(key, value, silent = false) {
    this.setState({ [key]: value }, silent);
  }
  
  // 批量更新
  batch(updates) {
    this.setState(updates);
  }
  
  // 计算属性
  computed(key, computeFn, dependencies = []) {
    const compute = () => {
      const depValues = dependencies.map(dep => this.get(dep));
      return computeFn(...depValues, this.getState());
    };
    
    // 初始计算
    this.set(key, compute(), true);
    
    // 监听依赖变化
    dependencies.forEach(dep => {
      this.subscribe(dep, () => {
        this.set(key, compute(), true);
      });
    });
    
    return this.get(key);
  }
}

// 创建日志中间件
export const loggerMiddleware = (prevState, updates, currentState) => {
  console.group('State Update');
  console.log('Previous State:', prevState);
  console.log('Updates:', updates);
  console.log('New State:', { ...currentState, ...updates });
  console.groupEnd();
  return updates;
};

// 创建持久化中间件
export const persistenceMiddleware = (storageKey = 'app-state') => {
  return (prevState, updates, currentState) => {
    try {
      const newState = { ...currentState, ...updates };
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
    return updates;
  };
};

// 从本地存储恢复状态
export const restoreFromStorage = (storageKey = 'app-state', defaultState = {}) => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch (error) {
    console.error('Failed to restore state from storage:', error);
    return defaultState;
  }
};

// 创建验证中间件
export const validationMiddleware = (validators = {}) => {
  return (prevState, updates, currentState) => {
    const validatedUpdates = { ...updates };
    
    Object.keys(updates).forEach(key => {
      const validator = validators[key];
      if (validator && typeof validator === 'function') {
        try {
          const isValid = validator(updates[key], currentState);
          if (!isValid) {
            console.warn(`Validation failed for key "${key}", update ignored`);
            delete validatedUpdates[key];
          }
        } catch (error) {
          console.error(`Validation error for key "${key}":`, error);
          delete validatedUpdates[key];
        }
      }
    });
    
    return validatedUpdates;
  };
};

// 创建防抖中间件
export const debounceMiddleware = (delay = 300) => {
  let timeoutId = null;
  let pendingUpdates = {};
  
  return (prevState, updates, currentState) => {
    // 合并待处理的更新
    pendingUpdates = { ...pendingUpdates, ...updates };
    
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 设置新的定时器
    timeoutId = setTimeout(() => {
      const finalUpdates = { ...pendingUpdates };
      pendingUpdates = {};
      timeoutId = null;
      
      // 这里需要手动触发状态更新，因为中间件不能直接更新状态
      // 实际使用时需要配合状态管理器的特殊处理
    }, delay);
    
    // 暂时阻止更新
    return null;
  };
};

// 导出状态管理器类
export default StateManager;
