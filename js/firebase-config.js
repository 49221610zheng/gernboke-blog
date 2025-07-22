// Firebase 配置文件
// 请在 Firebase Console 中获取您的配置信息并替换以下占位符

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

// 检查配置是否已更新
if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn("⚠️ Firebase 配置尚未更新，请在 Firebase Console 中获取正确的配置信息");
}

// 初始化 Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);

// 初始化服务
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// 开发环境下连接模拟器（可选）
if (location.hostname === 'localhost') {
  // 连接 Firestore 模拟器
  if (!db._delegate._databaseId.projectId.includes('demo-')) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      console.log('Firestore emulator already connected');
    }
  }

  // 连接 Auth 模拟器
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Auth emulator already connected');
  }

  // 连接 Storage 模拟器
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Storage emulator already connected');
  }
}

// 初始化 Analytics（生产环境）
let analytics = null;
if (typeof window !== 'undefined' && location.hostname !== 'localhost') {
  analytics = getAnalytics(app);
}

export { analytics };

// 导出 Firebase 应用实例
export default app;
