// 数据库服务层 - 实现所有数据操作
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase-config.js';

// 通用查询函数
async function getCollection(collectionName, options = {}) {
  try {
    const collectionRef = collection(db, collectionName);
    let q = collectionRef;
    
    // 添加查询条件
    if (options.where) {
      options.where.forEach(condition => {
        q = query(q, where(...condition));
      });
    }
    
    // 添加排序
    if (options.orderBy) {
      q = query(q, orderBy(...options.orderBy));
    }
    
    // 添加限制
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    // 添加分页
    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    throw error;
  }
}

// 获取单个文档
async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error(`Error getting document ${docId}:`, error);
    throw error;
  }
}

// 创建文档
async function createDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

// 更新文档
async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId}:`, error);
    throw error;
  }
}

// 删除文档
async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId}:`, error);
    throw error;
  }
}

// 增加浏览次数
async function incrementViewCount(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      viewCount: increment(1)
    });
    return true;
  } catch (error) {
    console.error(`Error incrementing view count for ${docId}:`, error);
    throw error;
  }
}

// 摄影作品相关函数
export const photographyService = {
  // 获取摄影作品列表
  async getList(page = 1, pageSize = 12, category = null) {
    const options = {
      orderBy: ['createdAt', 'desc'],
      limit: pageSize
    };
    
    if (category) {
      options.where = [['category', '==', category]];
    }
    
    return await getCollection('photography', options);
  },
  
  // 获取单张作品详情
  async getDetail(id) {
    return await getDocument('photography', id);
  },
  
  // 创建摄影作品
  async create(data) {
    return await createDocument('photography', data);
  },
  
  // 更新摄影作品
  async update(id, data) {
    return await updateDocument('photography', id, data);
  },
  
  // 删除摄影作品
  async delete(id) {
    return await deleteDocument('photography', id);
  },
  
  // 增加浏览次数
  async incrementView(id) {
    return await incrementViewCount('photography', id);
  }
};

// 文章相关函数
export const articleService = {
  // 获取文章列表
  async getList(page = 1, pageSize = 10, category = null, tag = null) {
    const options = {
      orderBy: ['createdAt', 'desc'],
      limit: pageSize
    };
    
    const whereConditions = [];
    if (category) {
      whereConditions.push(['category', '==', category]);
    }
    if (tag) {
      whereConditions.push(['tags', 'array-contains', tag]);
    }
    
    if (whereConditions.length > 0) {
      options.where = whereConditions;
    }
    
    return await getCollection('articles', options);
  },
  
  // 获取文章详情
  async getDetail(id) {
    return await getDocument('articles', id);
  },
  
  // 创建文章
  async create(data) {
    return await createDocument('articles', data);
  },
  
  // 更新文章
  async update(id, data) {
    return await updateDocument('articles', id, data);
  },
  
  // 删除文章
  async delete(id) {
    return await deleteDocument('articles', id);
  },
  
  // 增加浏览次数
  async incrementView(id) {
    return await incrementViewCount('articles', id);
  }
};

// 评论相关函数
export const commentService = {
  // 获取评论列表
  async getList(targetType, targetId, page = 1, pageSize = 20) {
    const options = {
      where: [
        ['targetType', '==', targetType],
        ['targetId', '==', targetId],
        ['isApproved', '==', true]
      ],
      orderBy: ['createdAt', 'desc'],
      limit: pageSize
    };
    
    return await getCollection('comments', options);
  },
  
  // 提交评论
  async create(comment) {
    return await createDocument('comments', {
      ...comment,
      isApproved: false // 默认需要审核
    });
  },
  
  // 审核评论
  async approve(id) {
    return await updateDocument('comments', id, { isApproved: true });
  },
  
  // 删除评论
  async delete(id) {
    return await deleteDocument('comments', id);
  }
};

// 用户相关函数
export const userService = {
  // 获取用户信息
  async getProfile(uid) {
    return await getDocument('users', uid);
  },
  
  // 创建用户资料
  async createProfile(uid, data) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  },
  
  // 更新用户资料
  async updateProfile(uid, data) {
    return await updateDocument('users', uid, data);
  }
};

// 系统设置相关函数
export const settingsService = {
  // 获取系统设置
  async get() {
    return await getDocument('settings', 'site_settings');
  },
  
  // 更新系统设置
  async update(data) {
    return await updateDocument('settings', 'site_settings', data);
  }
};
