// 错误处理器单元测试
import ErrorHandler, { showError, showSuccess, reportError } from '../../js/utils/error-handler.js';

describe('ErrorHandler', () => {
  let errorHandler;
  let originalAddEventListener;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
    
    // Mock addEventListener
    originalAddEventListener = window.addEventListener;
    window.addEventListener = jest.fn();
    
    // Mock document.body.appendChild
    document.body.appendChild = jest.fn();
    
    // Mock setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    window.addEventListener = originalAddEventListener;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    test('应该设置全局错误监听器', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });

    test('应该初始化空的错误监听器数组', () => {
      expect(errorHandler.errorListeners).toEqual([]);
    });
  });

  describe('错误处理', () => {
    test('handleError 应该记录错误信息', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const errorInfo = {
        type: 'javascript',
        message: 'Test error',
        timestamp: new Date().toISOString()
      };
      
      errorHandler.handleError(errorInfo);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error caught by ErrorHandler:', errorInfo);
      
      consoleSpy.mockRestore();
    });

    test('handleError 应该通知错误监听器', () => {
      const listener = jest.fn();
      errorHandler.addErrorListener(listener);
      
      const errorInfo = { type: 'test', message: 'Test error' };
      errorHandler.handleError(errorInfo);
      
      expect(listener).toHaveBeenCalledWith(errorInfo);
    });

    test('handleError 应该显示用户友好的错误信息', () => {
      const showUserErrorSpy = jest.spyOn(errorHandler, 'showUserError').mockImplementation();
      
      const errorInfo = { type: 'network', message: 'Network error' };
      errorHandler.handleError(errorInfo);
      
      expect(showUserErrorSpy).toHaveBeenCalledWith(errorInfo);
      
      showUserErrorSpy.mockRestore();
    });
  });

  describe('错误监听器管理', () => {
    test('addErrorListener 应该添加监听器', () => {
      const listener = jest.fn();
      errorHandler.addErrorListener(listener);
      
      expect(errorHandler.errorListeners).toContain(listener);
    });

    test('removeErrorListener 应该移除监听器', () => {
      const listener = jest.fn();
      errorHandler.addErrorListener(listener);
      errorHandler.removeErrorListener(listener);
      
      expect(errorHandler.errorListeners).not.toContain(listener);
    });

    test('notifyErrorListeners 应该调用所有监听器', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      errorHandler.addErrorListener(listener1);
      errorHandler.addErrorListener(listener2);
      
      const errorInfo = { type: 'test', message: 'Test error' };
      errorHandler.notifyErrorListeners(errorInfo);
      
      expect(listener1).toHaveBeenCalledWith(errorInfo);
      expect(listener2).toHaveBeenCalledWith(errorInfo);
    });

    test('监听器中的错误不应该影响其他监听器', () => {
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();
      
      errorHandler.addErrorListener(errorListener);
      errorHandler.addErrorListener(normalListener);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const errorInfo = { type: 'test', message: 'Test error' };
      errorHandler.notifyErrorListeners(errorInfo);
      
      expect(normalListener).toHaveBeenCalledWith(errorInfo);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('用户友好错误信息', () => {
    test('getUserFriendlyMessage 应该返回对应的错误信息', () => {
      const testCases = [
        { type: 'network', expected: '网络连接失败，请检查您的网络连接' },
        { type: 'auth', expected: '认证失败，请重新登录' },
        { type: 'permission', expected: '您没有执行此操作的权限' },
        { type: 'unknown', expected: '发生了未知错误，请联系技术支持' }
      ];

      testCases.forEach(({ type, expected }) => {
        const result = errorHandler.getUserFriendlyMessage({ type });
        expect(result).toBe(expected);
      });
    });
  });

  describe('通知显示', () => {
    test('showNotification 应该创建通知元素', () => {
      const message = 'Test notification';
      const type = 'success';
      
      const notification = errorHandler.showNotification(message, type);
      
      expect(notification).toBeInstanceOf(HTMLElement);
      expect(notification.textContent).toContain(message);
      expect(document.body.appendChild).toHaveBeenCalledWith(notification);
    });

    test('showNotification 应该自动隐藏通知', () => {
      const message = 'Test notification';
      const duration = 1000;
      
      const notification = errorHandler.showNotification(message, 'info', duration);
      
      // 快进时间
      jest.advanceTimersByTime(duration + 300);
      
      expect(notification.classList.contains('translate-x-full')).toBe(true);
    });

    test('getNotificationIcon 应该返回正确的图标', () => {
      const testCases = [
        { type: 'success', expected: '<i class="fa fa-check-circle"></i>' },
        { type: 'error', expected: '<i class="fa fa-exclamation-circle"></i>' },
        { type: 'warning', expected: '<i class="fa fa-exclamation-triangle"></i>' },
        { type: 'info', expected: '<i class="fa fa-info-circle"></i>' }
      ];

      testCases.forEach(({ type, expected }) => {
        const result = errorHandler.getNotificationIcon(type);
        expect(result).toBe(expected);
      });
    });
  });

  describe('错误上报', () => {
    test('shouldReportError 应该过滤忽略的错误', () => {
      const ignoredError = { message: 'Script error' };
      const normalError = { message: 'Normal error' };
      
      expect(errorHandler.shouldReportError(ignoredError)).toBe(false);
      expect(errorHandler.shouldReportError(normalError)).toBe(true);
    });

    test('reportManualError 应该处理手动报告的错误', () => {
      const handleErrorSpy = jest.spyOn(errorHandler, 'handleError').mockImplementation();
      
      const error = new Error('Manual error');
      const context = { component: 'TestComponent' };
      
      errorHandler.reportManualError(error, context);
      
      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'manual',
          message: 'Manual error',
          context: context
        })
      );
      
      handleErrorSpy.mockRestore();
    });
  });

  describe('函数包装', () => {
    test('wrapAsync 应该捕获异步函数中的错误', async () => {
      const reportManualErrorSpy = jest.spyOn(errorHandler, 'reportManualError').mockImplementation();
      
      const asyncFn = async () => {
        throw new Error('Async error');
      };
      
      const wrappedFn = errorHandler.wrapAsync(asyncFn);
      
      await expect(wrappedFn()).rejects.toThrow('Async error');
      expect(reportManualErrorSpy).toHaveBeenCalled();
      
      reportManualErrorSpy.mockRestore();
    });

    test('wrapSync 应该捕获同步函数中的错误', () => {
      const reportManualErrorSpy = jest.spyOn(errorHandler, 'reportManualError').mockImplementation();
      
      const syncFn = () => {
        throw new Error('Sync error');
      };
      
      const wrappedFn = errorHandler.wrapSync(syncFn);
      
      expect(() => wrappedFn()).toThrow('Sync error');
      expect(reportManualErrorSpy).toHaveBeenCalled();
      
      reportManualErrorSpy.mockRestore();
    });
  });
});

describe('导出的便捷函数', () => {
  beforeEach(() => {
    document.body.appendChild = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('showSuccess 应该显示成功通知', () => {
    showSuccess('Success message');
    
    expect(document.body.appendChild).toHaveBeenCalled();
  });

  test('showError 应该显示错误通知', () => {
    showError('Error message');
    
    expect(document.body.appendChild).toHaveBeenCalled();
  });

  test('reportError 应该报告错误', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    reportError(new Error('Test error'), { context: 'test' });
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
