// 状态管理器单元测试
import StateManager from '../../js/utils/state-manager.js';

describe('StateManager', () => {
  let stateManager;

  beforeEach(() => {
    stateManager = new StateManager({
      count: 0,
      user: null,
      loading: false
    });
  });

  afterEach(() => {
    stateManager = null;
  });

  describe('初始化', () => {
    test('应该使用初始状态创建实例', () => {
      expect(stateManager.getState()).toEqual({
        count: 0,
        user: null,
        loading: false
      });
    });

    test('应该初始化空的监听器映射', () => {
      expect(stateManager.listeners.size).toBe(0);
    });
  });

  describe('状态获取和设置', () => {
    test('getState 应该返回当前状态的副本', () => {
      const state = stateManager.getState();
      state.count = 10;
      
      expect(stateManager.getState().count).toBe(0);
    });

    test('setState 应该更新状态', () => {
      stateManager.setState({ count: 5 });
      
      expect(stateManager.getState().count).toBe(5);
    });

    test('setState 应该合并状态而不是替换', () => {
      stateManager.setState({ count: 5 });
      
      expect(stateManager.getState()).toEqual({
        count: 5,
        user: null,
        loading: false
      });
    });

    test('get 应该返回特定键的值', () => {
      stateManager.setState({ count: 10 });
      
      expect(stateManager.get('count')).toBe(10);
      expect(stateManager.get('user')).toBeNull();
    });

    test('set 应该设置特定键的值', () => {
      stateManager.set('count', 15);
      
      expect(stateManager.get('count')).toBe(15);
    });
  });

  describe('状态监听', () => {
    test('subscribe 应该添加监听器', () => {
      const callback = jest.fn();
      stateManager.subscribe('count', callback);
      
      expect(stateManager.listeners.get('count')).toContain(callback);
    });

    test('状态变化应该触发监听器', () => {
      const callback = jest.fn();
      stateManager.subscribe('count', callback);
      
      stateManager.setState({ count: 10 });
      
      expect(callback).toHaveBeenCalledWith(10, 0, expect.any(Object), expect.any(Object));
    });

    test('全局监听器应该监听所有状态变化', () => {
      const globalCallback = jest.fn();
      stateManager.subscribe('*', globalCallback);
      
      stateManager.setState({ count: 5, loading: true });
      
      expect(globalCallback).toHaveBeenCalledWith(
        expect.objectContaining({ count: 5, loading: true }),
        expect.objectContaining({ count: 0, loading: false }),
        { count: 5, loading: true }
      );
    });

    test('unsubscribe 应该移除监听器', () => {
      const callback = jest.fn();
      stateManager.subscribe('count', callback);
      stateManager.unsubscribe('count', callback);
      
      stateManager.setState({ count: 10 });
      
      expect(callback).not.toHaveBeenCalled();
    });

    test('subscribe 应该返回取消订阅函数', () => {
      const callback = jest.fn();
      const unsubscribe = stateManager.subscribe('count', callback);
      
      unsubscribe();
      stateManager.setState({ count: 10 });
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('批量操作', () => {
    test('batch 应该一次性更新多个状态', () => {
      const callback = jest.fn();
      stateManager.subscribe('*', callback);
      
      stateManager.batch({
        count: 10,
        loading: true,
        user: { name: 'Test User' }
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(stateManager.getState()).toEqual({
        count: 10,
        loading: true,
        user: { name: 'Test User' }
      });
    });
  });

  describe('重置功能', () => {
    test('reset 应该重置状态', () => {
      stateManager.setState({ count: 10, loading: true });
      stateManager.reset({ count: 0, user: null, loading: false });
      
      expect(stateManager.getState()).toEqual({
        count: 0,
        user: null,
        loading: false
      });
    });

    test('reset 应该触发监听器', () => {
      const callback = jest.fn();
      stateManager.subscribe('*', callback);
      
      stateManager.setState({ count: 10 });
      callback.mockClear();
      
      stateManager.reset({ count: 0 });
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('中间件', () => {
    test('addMiddleware 应该添加中间件', () => {
      const middleware = jest.fn((prevState, updates) => updates);
      stateManager.addMiddleware(middleware);
      
      stateManager.setState({ count: 5 });
      
      expect(middleware).toHaveBeenCalledWith(
        expect.objectContaining({ count: 0 }),
        { count: 5 },
        expect.objectContaining({ count: 0 })
      );
    });

    test('中间件应该能够修改更新', () => {
      const middleware = (prevState, updates) => ({
        ...updates,
        count: updates.count * 2
      });
      stateManager.addMiddleware(middleware);
      
      stateManager.setState({ count: 5 });
      
      expect(stateManager.get('count')).toBe(10);
    });

    test('removeMiddleware 应该移除中间件', () => {
      const middleware = jest.fn((prevState, updates) => updates);
      stateManager.addMiddleware(middleware);
      stateManager.removeMiddleware(middleware);
      
      stateManager.setState({ count: 5 });
      
      expect(middleware).not.toHaveBeenCalled();
    });
  });

  describe('错误处理', () => {
    test('监听器中的错误不应该影响其他监听器', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Test error');
      });
      const normalCallback = jest.fn();
      
      stateManager.subscribe('count', errorCallback);
      stateManager.subscribe('count', normalCallback);
      
      // 模拟console.error以避免测试输出中的错误信息
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      stateManager.setState({ count: 5 });
      
      expect(normalCallback).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
