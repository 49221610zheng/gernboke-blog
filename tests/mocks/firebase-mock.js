// Firebase Mock 服务
class MockFirestore {
  constructor() {
    this.data = new Map();
    this.listeners = new Map();
  }
  
  collection(path) {
    return new MockCollection(this, path);
  }
  
  doc(path) {
    return new MockDocument(this, path);
  }
  
  // 设置测试数据
  setData(path, data) {
    this.data.set(path, data);
  }
  
  // 获取数据
  getData(path) {
    return this.data.get(path);
  }
  
  // 清除所有数据
  clearData() {
    this.data.clear();
  }
  
  // 触发监听器
  triggerListener(path, data) {
    const listeners = this.listeners.get(path) || [];
    listeners.forEach(callback => callback(data));
  }
}

class MockCollection {
  constructor(firestore, path) {
    this.firestore = firestore;
    this.path = path;
    this.queries = [];
  }
  
  doc(id) {
    return new MockDocument(this.firestore, `${this.path}/${id}`);
  }
  
  add(data) {
    const id = 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const docPath = `${this.path}/${id}`;
    
    const docData = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.firestore.setData(docPath, docData);
    
    return Promise.resolve({
      id,
      get: () => Promise.resolve({
        id,
        data: () => docData,
        exists: true
      })
    });
  }
  
  where(field, operator, value) {
    this.queries.push({ type: 'where', field, operator, value });
    return this;
  }
  
  orderBy(field, direction = 'asc') {
    this.queries.push({ type: 'orderBy', field, direction });
    return this;
  }
  
  limit(count) {
    this.queries.push({ type: 'limit', count });
    return this;
  }
  
  get() {
    // 模拟查询执行
    const allData = Array.from(this.firestore.data.entries())
      .filter(([path]) => path.startsWith(this.path + '/'))
      .map(([path, data]) => ({
        id: path.split('/').pop(),
        data: () => data,
        exists: true
      }));
    
    // 应用查询条件
    let filteredData = allData;
    
    this.queries.forEach(query => {
      switch (query.type) {
        case 'where':
          filteredData = filteredData.filter(doc => {
            const data = doc.data();
            const fieldValue = data[query.field];
            
            switch (query.operator) {
              case '==':
                return fieldValue === query.value;
              case '!=':
                return fieldValue !== query.value;
              case '>':
                return fieldValue > query.value;
              case '>=':
                return fieldValue >= query.value;
              case '<':
                return fieldValue < query.value;
              case '<=':
                return fieldValue <= query.value;
              case 'array-contains':
                return Array.isArray(fieldValue) && fieldValue.includes(query.value);
              case 'in':
                return Array.isArray(query.value) && query.value.includes(fieldValue);
              default:
                return true;
            }
          });
          break;
          
        case 'orderBy':
          filteredData.sort((a, b) => {
            const aValue = a.data()[query.field];
            const bValue = b.data()[query.field];
            
            if (query.direction === 'desc') {
              return bValue > aValue ? 1 : -1;
            } else {
              return aValue > bValue ? 1 : -1;
            }
          });
          break;
          
        case 'limit':
          filteredData = filteredData.slice(0, query.count);
          break;
      }
    });
    
    return Promise.resolve({
      docs: filteredData,
      size: filteredData.length,
      empty: filteredData.length === 0,
      forEach: (callback) => filteredData.forEach(callback)
    });
  }
  
  onSnapshot(callback) {
    const listenerId = Math.random().toString(36);
    const listeners = this.firestore.listeners.get(this.path) || [];
    listeners.push(callback);
    this.firestore.listeners.set(this.path, listeners);
    
    // 立即调用一次
    this.get().then(callback);
    
    // 返回取消监听函数
    return () => {
      const currentListeners = this.firestore.listeners.get(this.path) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
      }
    };
  }
}

class MockDocument {
  constructor(firestore, path) {
    this.firestore = firestore;
    this.path = path;
    this.id = path.split('/').pop();
  }
  
  get() {
    const data = this.firestore.getData(this.path);
    
    return Promise.resolve({
      id: this.id,
      exists: !!data,
      data: () => data || null
    });
  }
  
  set(data, options = {}) {
    const existingData = this.firestore.getData(this.path);
    
    let newData;
    if (options.merge && existingData) {
      newData = { ...existingData, ...data, updatedAt: new Date() };
    } else {
      newData = { ...data, updatedAt: new Date() };
      if (!existingData) {
        newData.createdAt = new Date();
      }
    }
    
    this.firestore.setData(this.path, newData);
    return Promise.resolve();
  }
  
  update(data) {
    const existingData = this.firestore.getData(this.path);
    if (!existingData) {
      throw new Error('Document does not exist');
    }
    
    const newData = { ...existingData, ...data, updatedAt: new Date() };
    this.firestore.setData(this.path, newData);
    return Promise.resolve();
  }
  
  delete() {
    this.firestore.data.delete(this.path);
    return Promise.resolve();
  }
  
  onSnapshot(callback) {
    const listenerId = Math.random().toString(36);
    const listeners = this.firestore.listeners.get(this.path) || [];
    listeners.push(callback);
    this.firestore.listeners.set(this.path, listeners);
    
    // 立即调用一次
    this.get().then(callback);
    
    // 返回取消监听函数
    return () => {
      const currentListeners = this.firestore.listeners.get(this.path) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
      }
    };
  }
}

class MockAuth {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }
  
  signInWithEmailAndPassword(email, password) {
    // 模拟登录验证
    if (email === 'admin@test.com' && password === 'password123') {
      this.currentUser = {
        uid: 'test-admin-uid',
        email: email,
        displayName: 'Test Admin',
        emailVerified: true
      };
      
      this.notifyListeners(this.currentUser);
      return Promise.resolve({ user: this.currentUser });
    } else {
      return Promise.reject(new Error('Invalid credentials'));
    }
  }
  
  signOut() {
    this.currentUser = null;
    this.notifyListeners(null);
    return Promise.resolve();
  }
  
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    
    // 立即调用一次
    callback(this.currentUser);
    
    // 返回取消监听函数
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  notifyListeners(user) {
    this.listeners.forEach(callback => callback(user));
  }
  
  // 设置当前用户（用于测试）
  setCurrentUser(user) {
    this.currentUser = user;
    this.notifyListeners(user);
  }
}

class MockStorage {
  constructor() {
    this.files = new Map();
  }
  
  ref(path) {
    return new MockStorageRef(this, path);
  }
  
  setFile(path, file) {
    this.files.set(path, file);
  }
  
  getFile(path) {
    return this.files.get(path);
  }
  
  deleteFile(path) {
    this.files.delete(path);
  }
  
  clearFiles() {
    this.files.clear();
  }
}

class MockStorageRef {
  constructor(storage, path) {
    this.storage = storage;
    this.path = path;
  }
  
  put(file) {
    const mockUrl = `https://mock-storage.com/${this.path}`;
    this.storage.setFile(this.path, { file, url: mockUrl });
    
    return Promise.resolve({
      ref: this,
      metadata: {
        name: this.path.split('/').pop(),
        fullPath: this.path,
        size: file.size || 1024,
        contentType: file.type || 'image/jpeg'
      },
      task: {
        snapshot: {
          bytesTransferred: file.size || 1024,
          totalBytes: file.size || 1024,
          state: 'success'
        }
      }
    });
  }
  
  getDownloadURL() {
    const fileData = this.storage.getFile(this.path);
    if (fileData) {
      return Promise.resolve(fileData.url);
    } else {
      return Promise.reject(new Error('File not found'));
    }
  }
  
  delete() {
    this.storage.deleteFile(this.path);
    return Promise.resolve();
  }
}

// 创建全局 Mock 实例
const mockFirestore = new MockFirestore();
const mockAuth = new MockAuth();
const mockStorage = new MockStorage();

// 导出 Mock 服务
export {
  MockFirestore,
  MockAuth,
  MockStorage,
  mockFirestore,
  mockAuth,
  mockStorage
};

// 设置全局 Mock
export function setupFirebaseMocks() {
  global.mockFirestore = mockFirestore;
  global.mockAuth = mockAuth;
  global.mockStorage = mockStorage;
  
  // 重置所有数据
  mockFirestore.clearData();
  mockAuth.setCurrentUser(null);
  mockStorage.clearFiles();
}

// 清理 Mock
export function cleanupFirebaseMocks() {
  mockFirestore.clearData();
  mockAuth.setCurrentUser(null);
  mockStorage.clearFiles();
}
