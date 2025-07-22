// 数据种子脚本 - 初始化示例数据
const admin = require('firebase-admin');
const path = require('path');

// 初始化 Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json'); // 需要下载服务账户密钥

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com' // 替换为您的项目ID
});

const db = admin.firestore();

// 示例数据
const seedData = {
  // 系统设置
  settings: {
    site_settings: {
      siteName: '光影与代码',
      siteDescription: '融合摄影艺术与编程技术的个人博客',
      logoUrl: '',
      faviconUrl: '',
      contactEmail: 'contact@lightandcode.com',
      socialLinks: {
        github: 'https://github.com/username',
        instagram: 'https://instagram.com/username',
        twitter: 'https://twitter.com/username',
        linkedin: 'https://linkedin.com/in/username'
      },
      theme: {
        primaryColor: '#165DFF',
        accentColor: '#36CFC9'
      },
      seo: {
        keywords: ['摄影', '编程', '技术博客', '前端开发'],
        ogImage: '/images/og-image.jpg'
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  },

  // 分类数据
  categories: [
    {
      id: 'landscape',
      name: '风光摄影',
      description: '自然风光摄影作品',
      type: 'photography',
      order: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'portrait',
      name: '人像摄影',
      description: '人像摄影作品',
      type: 'photography',
      order: 2,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'street',
      name: '街头摄影',
      description: '街头摄影作品',
      type: 'photography',
      order: 3,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'frontend',
      name: '前端开发',
      description: '前端技术相关文章',
      type: 'article',
      order: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'backend',
      name: '后端开发',
      description: '后端技术相关文章',
      type: 'article',
      order: 2,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'devops',
      name: 'DevOps',
      description: '运维和部署相关文章',
      type: 'article',
      order: 3,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // 标签数据
  tags: [
    { id: 'javascript', name: 'JavaScript', color: '#F7DF1E' },
    { id: 'react', name: 'React', color: '#61DAFB' },
    { id: 'vue', name: 'Vue.js', color: '#4FC08D' },
    { id: 'nodejs', name: 'Node.js', color: '#339933' },
    { id: 'firebase', name: 'Firebase', color: '#FFCA28' },
    { id: 'css', name: 'CSS', color: '#1572B6' },
    { id: 'html', name: 'HTML', color: '#E34F26' },
    { id: 'photography', name: '摄影技巧', color: '#8B5CF6' },
    { id: 'tutorial', name: '教程', color: '#10B981' },
    { id: 'tips', name: '技巧', color: '#F59E0B' }
  ],

  // 示例摄影作品
  photography: [
    {
      title: '城市夜景',
      description: '城市夜晚的霓虹灯光，展现现代都市的繁华与美丽。使用长曝光技术捕捉车流轨迹，营造动感效果。',
      imageUrl: 'https://picsum.photos/1200/800?random=1',
      thumbnailUrl: 'https://picsum.photos/400/300?random=1',
      category: 'landscape',
      shootingParams: {
        camera: 'Canon EOS R5',
        lens: '24-70mm f/2.8',
        iso: 100,
        aperture: 'f/8',
        shutterSpeed: '30s',
        focalLength: '35mm'
      },
      postProcessing: '使用Lightroom调整色温和对比度，增强夜景氛围',
      location: '上海外滩',
      tags: ['夜景', '城市', '长曝光'],
      viewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: '山间晨雾',
      description: '清晨山间的薄雾缭绕，阳光透过云层洒向大地，呈现出梦幻般的自然景象。',
      imageUrl: 'https://picsum.photos/1200/800?random=2',
      thumbnailUrl: 'https://picsum.photos/400/300?random=2',
      category: 'landscape',
      shootingParams: {
        camera: 'Sony A7R IV',
        lens: '70-200mm f/2.8',
        iso: 200,
        aperture: 'f/5.6',
        shutterSpeed: '1/125s',
        focalLength: '135mm'
      },
      postProcessing: '轻微调整曝光和阴影，保持自然色彩',
      location: '黄山',
      tags: ['风光', '山景', '晨雾'],
      viewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // 示例文章
  articles: [
    {
      title: 'Firebase 在现代Web开发中的应用',
      content: `# Firebase 在现代Web开发中的应用

Firebase 是 Google 提供的一个全面的应用开发平台，为开发者提供了构建高质量应用所需的工具和基础设施。

## 主要特性

### 1. Firestore 数据库
Firestore 是一个灵活、可扩展的 NoSQL 云数据库，用于移动、Web 和服务器开发。

### 2. Authentication 认证
提供完整的身份验证解决方案，支持多种登录方式。

### 3. Cloud Storage 存储
安全的文件存储和共享服务。

## 实际应用案例

在本博客系统中，我们使用了 Firebase 的多个服务：

\`\`\`javascript
// 初始化 Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
\`\`\`

## 总结

Firebase 为现代Web应用提供了强大的后端支持，大大简化了开发流程。`,
      excerpt: 'Firebase 是 Google 提供的一个全面的应用开发平台，本文介绍了其在现代Web开发中的应用和最佳实践。',
      coverImageUrl: 'https://picsum.photos/800/400?random=3',
      category: 'frontend',
      tags: ['firebase', 'javascript', 'tutorial'],
      author: {
        name: '摄影程序员',
        avatarUrl: 'https://picsum.photos/100/100?random=10',
        bio: '全栈开发者，摄影爱好者'
      },
      status: 'published',
      readTime: 8,
      viewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: '摄影构图的基本原则',
      content: `# 摄影构图的基本原则

构图是摄影艺术的基础，好的构图能够让照片更具视觉冲击力和艺术感染力。

## 三分法则

将画面分为九个相等的部分，将主体放在交叉点上。

## 引导线

利用线条引导观者的视线，创造深度感。

## 对称与平衡

通过对称或非对称的平衡来创造和谐的画面。

## 实践建议

1. 多观察，多练习
2. 学会减法，简化画面
3. 注意光线和色彩
4. 培养自己的风格

构图没有绝对的规则，重要的是表达你想要传达的情感和故事。`,
      excerpt: '摄影构图是摄影艺术的基础，本文介绍了几种基本的构图原则和实践技巧。',
      coverImageUrl: 'https://picsum.photos/800/400?random=4',
      category: 'frontend',
      tags: ['photography', 'tips', 'tutorial'],
      author: {
        name: '摄影程序员',
        avatarUrl: 'https://picsum.photos/100/100?random=10',
        bio: '全栈开发者，摄影爱好者'
      },
      status: 'published',
      readTime: 5,
      viewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

// 执行数据种子
async function seedDatabase() {
  try {
    console.log('开始初始化数据...');

    // 创建系统设置
    for (const [docId, data] of Object.entries(seedData.settings)) {
      await db.collection('settings').doc(docId).set(data);
      console.log(`✓ 创建系统设置: ${docId}`);
    }

    // 创建分类
    for (const category of seedData.categories) {
      await db.collection('categories').doc(category.id).set(category);
      console.log(`✓ 创建分类: ${category.name}`);
    }

    // 创建标签
    for (const tag of seedData.tags) {
      await db.collection('tags').doc(tag.id).set(tag);
      console.log(`✓ 创建标签: ${tag.name}`);
    }

    // 创建摄影作品
    for (const photo of seedData.photography) {
      await db.collection('photography').add(photo);
      console.log(`✓ 创建摄影作品: ${photo.title}`);
    }

    // 创建文章
    for (const article of seedData.articles) {
      await db.collection('articles').add(article);
      console.log(`✓ 创建文章: ${article.title}`);
    }

    console.log('\n🎉 数据初始化完成！');
    console.log('请在 Firebase Console 中查看创建的数据。');

  } catch (error) {
    console.error('❌ 数据初始化失败:', error);
  } finally {
    process.exit(0);
  }
}

// 运行脚本
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedData };
