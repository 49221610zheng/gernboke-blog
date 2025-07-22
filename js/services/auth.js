// 认证服务层
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase-config.js';
import { userService } from './database.js';

// 认证状态管理
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAdmin = false;
    this.authStateListeners = [];
    
    // 监听认证状态变化
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.checkAdminStatus(user);
      this.notifyAuthStateChange(user);
    });
  }
  
  // 检查管理员状态
  async checkAdminStatus(user) {
    if (user) {
      try {
        const userProfile = await userService.getProfile(user.uid);
        this.isAdmin = userProfile?.role === 'admin';
      } catch (error) {
        console.log('User profile not found, creating default profile');
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }
  
  // 添加认证状态监听器
  addAuthStateListener(callback) {
    this.authStateListeners.push(callback);
  }
  
  // 移除认证状态监听器
  removeAuthStateListener(callback) {
    const index = this.authStateListeners.indexOf(callback);
    if (index > -1) {
      this.authStateListeners.splice(index, 1);
    }
  }
  
  // 通知认证状态变化
  notifyAuthStateChange(user) {
    this.authStateListeners.forEach(callback => {
      try {
        callback(user, this.isAdmin);
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
  }
  
  // 管理员登录
  async adminLogin(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 检查是否为管理员
      await this.checkAdminStatus(user);
      
      if (!this.isAdmin) {
        await this.logout();
        throw new Error('您没有管理员权限');
      }
      
      // 更新最后登录时间
      await userService.updateProfile(user.uid, {
        lastLoginAt: new Date()
      });
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }
      };
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }
  
  // 用户注册（仅管理员可用）
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 更新用户显示名称
      await updateProfile(user, {
        displayName: displayName
      });
      
      // 创建用户资料
      await userService.createProfile(user.uid, {
        email: email,
        name: displayName,
        role: 'admin', // 默认为管理员
        avatarUrl: '',
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }
  
  // 登出
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.isAdmin = false;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('登出失败，请重试');
    }
  }
  
  // 发送密码重置邮件
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: '密码重置邮件已发送' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }
  
  // 获取当前用户
  getCurrentUser() {
    return this.currentUser;
  }
  
  // 检查是否已登录
  isAuthenticated() {
    return !!this.currentUser;
  }
  
  // 检查是否为管理员
  isAdminUser() {
    return this.isAdmin;
  }
  
  // 等待认证状态初始化
  waitForAuthInit() {
    return new Promise((resolve) => {
      if (this.currentUser !== null) {
        resolve(this.currentUser);
      } else {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      }
    });
  }
  
  // 获取错误信息
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': '用户不存在',
      'auth/wrong-password': '密码错误',
      'auth/email-already-in-use': '邮箱已被使用',
      'auth/weak-password': '密码强度不够',
      'auth/invalid-email': '邮箱格式不正确',
      'auth/too-many-requests': '请求过于频繁，请稍后再试',
      'auth/network-request-failed': '网络连接失败',
      'auth/user-disabled': '用户账户已被禁用'
    };
    
    return errorMessages[errorCode] || '认证失败，请重试';
  }
}

// 创建认证服务实例
const authService = new AuthService();

// 导出认证服务
export default authService;

// 导出常用方法
export const {
  adminLogin,
  register,
  logout,
  resetPassword,
  getCurrentUser,
  isAuthenticated,
  isAdminUser,
  waitForAuthInit,
  addAuthStateListener,
  removeAuthStateListener
} = authService;
