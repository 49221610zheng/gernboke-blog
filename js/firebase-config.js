// Firebase 配置文件 - CDN版本
// 兼容浏览器直接使用，无需模块打包

// Firebase 配置对象
const firebaseConfig = {
  apiKey: "AIzaSyCVQcYB3f3Jou_jPHkmf7HU76Rvn5-jtFc",
  authDomain: "gernboke.firebaseapp.com",
  projectId: "gernboke",
  storageBucket: "gernboke.firebasestorage.app",
  messagingSenderId: "967881622779",
  appId: "1:967881622779:web:d99758c33a5cf3ad141c5e",
  measurementId: "G-C48SG3R7ZN"
};

// Firebase应用实例
let app = null;
let db = null;
let auth = null;
let storage = null;
let analytics = null;

// 初始化Firebase的函数
function initializeFirebase() {
  try {
    // 检查Firebase是否已加载
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK未加载，请确保已包含Firebase CDN');
      return false;
    }

    // 检查是否已经初始化
    if (firebase.apps && firebase.apps.length > 0) {
      console.log('Firebase已经初始化，使用现有实例');
      app = firebase.apps[0];
    } else {
      // 初始化Firebase应用
      app = firebase.initializeApp(firebaseConfig);
    }

    // 初始化服务
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();

    // 初始化Analytics（生产环境）
    if (location.hostname !== 'localhost') {
      analytics = firebase.analytics();
    }

    console.log('✅ Firebase初始化成功');
    return true;
  } catch (error) {
    console.error('❌ Firebase初始化失败:', error);
    return false;
  }
}

// 获取Firebase服务的函数
function getFirebaseServices() {
  if (!app) {
    console.error('Firebase未初始化，请先调用initializeFirebase()');
    return null;
  }

  return {
    app,
    db,
    auth,
    storage,
    analytics
  };
}

// 等待Firebase SDK加载完成
function waitForFirebase() {
  return new Promise((resolve) => {
    if (typeof firebase !== 'undefined') {
      resolve(true);
      return;
    }

    // 检查Firebase是否通过script标签加载
    const checkFirebase = () => {
      if (typeof firebase !== 'undefined') {
        resolve(true);
      } else {
        setTimeout(checkFirebase, 100);
      }
    };

    checkFirebase();
  });
}

// 导出配置和函数
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;
window.getFirebaseServices = getFirebaseServices;
window.waitForFirebase = waitForFirebase;

// 自动初始化（当DOM加载完成时）
document.addEventListener('DOMContentLoaded', async () => {
  await waitForFirebase();
  initializeFirebase();
});
