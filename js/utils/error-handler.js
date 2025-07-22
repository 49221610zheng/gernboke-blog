// 错误处理工具
class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.setupGlobalErrorHandling();
  }
  
  // 设置全局错误处理
  setupGlobalErrorHandling() {
    // 捕获未处理的错误
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      });
    });
    
    // 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }
  
  // 处理错误
  handleError(errorInfo) {
    // 记录错误
    console.error('Error caught by ErrorHandler:', errorInfo);
    
    // 通知错误监听器
    this.notifyErrorListeners(errorInfo);
    
    // 显示用户友好的错误信息
    this.showUserError(errorInfo);
    
    // 可以在这里添加错误上报逻辑
    this.reportError(errorInfo);
  }
  
  // 添加错误监听器
  addErrorListener(callback) {
    this.errorListeners.push(callback);
  }
  
  // 移除错误监听器
  removeErrorListener(callback) {
    const index = this.errorListeners.indexOf(callback);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }
  
  // 通知错误监听器
  notifyErrorListeners(errorInfo) {
    this.errorListeners.forEach(callback => {
      try {
        callback(errorInfo);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }
  
  // 显示用户友好的错误信息
  showUserError(errorInfo) {
    const message = this.getUserFriendlyMessage(errorInfo);
    this.showNotification(message, 'error');
  }
  
  // 获取用户友好的错误信息
  getUserFriendlyMessage(errorInfo) {
    const errorMessages = {
      'network': '网络连接失败，请检查您的网络连接',
      'auth': '认证失败，请重新登录',
      'permission': '您没有执行此操作的权限',
      'validation': '输入的数据格式不正确',
      'server': '服务器暂时无法响应，请稍后重试',
      'storage': '存储空间不足或文件操作失败',
      'javascript': '页面出现了一些问题，请刷新页面重试',
      'promise': '操作失败，请重试'
    };
    
    return errorMessages[errorInfo.type] || '发生了未知错误，请联系技术支持';
  }
  
  // 显示通知
  showNotification(message, type = 'info', duration = 5000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    // 设置样式
    const styles = {
      'success': 'bg-green-500 text-white',
      'error': 'bg-red-500 text-white',
      'warning': 'bg-yellow-500 text-white',
      'info': 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${styles[type] || styles.info}`;
    
    // 设置内容
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${this.getNotificationIcon(type)}
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button class="inline-flex text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.parentElement.remove()">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, duration);
    }
    
    return notification;
  }
  
  // 获取通知图标
  getNotificationIcon(type) {
    const icons = {
      'success': '<i class="fa fa-check-circle"></i>',
      'error': '<i class="fa fa-exclamation-circle"></i>',
      'warning': '<i class="fa fa-exclamation-triangle"></i>',
      'info': '<i class="fa fa-info-circle"></i>'
    };
    
    return icons[type] || icons.info;
  }
  
  // 上报错误（可以集成第三方错误监控服务）
  reportError(errorInfo) {
    // 这里可以集成 Sentry、LogRocket 等错误监控服务
    // 或者发送到自己的错误收集接口
    
    // 示例：发送到自定义接口
    if (this.shouldReportError(errorInfo)) {
      try {
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     ...errorInfo,
        //     userAgent: navigator.userAgent,
        //     url: window.location.href,
        //     userId: this.getCurrentUserId()
        //   })
        // });
      } catch (error) {
        console.error('Failed to report error:', error);
      }
    }
  }
  
  // 判断是否应该上报错误
  shouldReportError(errorInfo) {
    // 过滤掉一些不需要上报的错误
    const ignoredErrors = [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded'
    ];
    
    return !ignoredErrors.some(ignored => 
      errorInfo.message && errorInfo.message.includes(ignored)
    );
  }
  
  // 获取当前用户ID（需要根据实际认证系统实现）
  getCurrentUserId() {
    // 这里应该从认证系统获取用户ID
    return null;
  }
  
  // 手动报告错误
  reportManualError(error, context = {}) {
    const errorInfo = {
      type: 'manual',
      message: error.message || error,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString()
    };
    
    this.handleError(errorInfo);
  }
  
  // 包装异步函数以捕获错误
  wrapAsync(fn, context = {}) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.reportManualError(error, { ...context, args });
        throw error;
      }
    };
  }
  
  // 包装同步函数以捕获错误
  wrapSync(fn, context = {}) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.reportManualError(error, { ...context, args });
        throw error;
      }
    };
  }
}

// 创建全局错误处理器实例
const errorHandler = new ErrorHandler();

// 导出便捷方法
export const showSuccess = (message, duration) => errorHandler.showNotification(message, 'success', duration);
export const showError = (message, duration) => errorHandler.showNotification(message, 'error', duration);
export const showWarning = (message, duration) => errorHandler.showNotification(message, 'warning', duration);
export const showInfo = (message, duration) => errorHandler.showNotification(message, 'info', duration);

export const reportError = (error, context) => errorHandler.reportManualError(error, context);
export const wrapAsync = (fn, context) => errorHandler.wrapAsync(fn, context);
export const wrapSync = (fn, context) => errorHandler.wrapSync(fn, context);

export const addErrorListener = (callback) => errorHandler.addErrorListener(callback);
export const removeErrorListener = (callback) => errorHandler.removeErrorListener(callback);

// 导出错误处理器类
export default ErrorHandler;
