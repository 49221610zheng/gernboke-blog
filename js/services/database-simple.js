// 简化的数据库服务 - 兼容Firebase CDN版本

// 获取数据库实例
function getDB() {
  if (typeof getFirebaseServices !== 'undefined') {
    const services = getFirebaseServices();
    return services ? services.db : null;
  }
  return null;
}

// 通用查询函数
async function getCollection(collectionName, options = {}) {
  try {
    const db = getDB();
    if (!db) {
      console.error('Database not initialized');
      return [];
    }
    
    let query = db.collection(collectionName);
    
    // 添加查询条件
    if (options.where) {
      options.where.forEach(condition => {
        query = query.where(condition.field, condition.operator, condition.value);
      });
    }
    
    // 添加排序
    if (options.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
    }
    
    // 添加限制
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    return [];
  }
}

// 获取单个文档
async function getDocument(collectionName, docId) {
  try {
    const db = getDB();
    if (!db) {
      console.error('Database not initialized');
      return null;
    }
    
    const doc = await db.collection(collectionName).doc(docId).get();
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${docId}:`, error);
    return null;
  }
}

// 添加文档
async function addDocument(collectionName, data) {
  try {
    const db = getDB();
    if (!db) {
      console.error('Database not initialized');
      return null;
    }
    
    const docRef = await db.collection(collectionName).add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

// 更新文档
async function updateDocument(collectionName, docId, data) {
  try {
    const db = getDB();
    if (!db) {
      console.error('Database not initialized');
      return false;
    }
    
    await db.collection(collectionName).doc(docId).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId}:`, error);
    return false;
  }
}

// 删除文档
async function deleteDocument(collectionName, docId) {
  try {
    const db = getDB();
    if (!db) {
      console.error('Database not initialized');
      return false;
    }
    
    await db.collection(collectionName).doc(docId).delete();
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId}:`, error);
    return false;
  }
}

// 摄影作品服务
const photographyService = {
  async getAll(options = {}) {
    return await getCollection('photography', {
      orderBy: { field: 'createdAt', direction: 'desc' },
      ...options
    });
  },
  
  async getById(id) {
    return await getDocument('photography', id);
  },
  
  async add(data) {
    return await addDocument('photography', data);
  },
  
  async update(id, data) {
    return await updateDocument('photography', id, data);
  },
  
  async delete(id) {
    return await deleteDocument('photography', id);
  }
};

// 文章服务
const articleService = {
  async getAll(options = {}) {
    return await getCollection('articles', {
      orderBy: { field: 'publishedAt', direction: 'desc' },
      ...options
    });
  },
  
  async getPublished(options = {}) {
    return await getCollection('articles', {
      where: [{ field: 'status', operator: '==', value: 'published' }],
      orderBy: { field: 'publishedAt', direction: 'desc' },
      ...options
    });
  },
  
  async getById(id) {
    return await getDocument('articles', id);
  },
  
  async add(data) {
    return await addDocument('articles', data);
  },
  
  async update(id, data) {
    return await updateDocument('articles', id, data);
  },
  
  async delete(id) {
    return await deleteDocument('articles', id);
  }
};

// 导出服务
window.databaseService = {
  photographyService,
  articleService,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument
};

// 兼容模块加载
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    photographyService,
    articleService
  };
}
