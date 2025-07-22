// 测试数据工厂
export class TestDataFactory {
  static createUser(overrides = {}) {
    return {
      uid: 'test-user-' + Math.random().toString(36).substr(2, 9),
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      avatarUrl: 'https://picsum.photos/100/100',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      ...overrides
    };
  }
  
  static createAdmin(overrides = {}) {
    return this.createUser({
      email: 'admin@example.com',
      name: 'Test Admin',
      role: 'admin',
      ...overrides
    });
  }
  
  static createArticle(overrides = {}) {
    const id = 'article-' + Math.random().toString(36).substr(2, 9);
    return {
      id,
      title: 'Test Article Title',
      content: '# Test Article\n\nThis is a test article content.',
      excerpt: 'This is a test article excerpt.',
      coverImageUrl: 'https://picsum.photos/800/400',
      category: 'frontend',
      tags: ['test', 'javascript'],
      author: {
        name: 'Test Author',
        avatarUrl: 'https://picsum.photos/100/100',
        bio: 'Test author bio'
      },
      status: 'published',
      readTime: 5,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
  
  static createPhotography(overrides = {}) {
    const id = 'photo-' + Math.random().toString(36).substr(2, 9);
    return {
      id,
      title: 'Test Photography',
      description: 'This is a test photography description.',
      imageUrl: 'https://picsum.photos/1200/800',
      thumbnailUrl: 'https://picsum.photos/400/300',
      category: 'landscape',
      shootingParams: {
        camera: 'Canon EOS R5',
        lens: '24-70mm f/2.8',
        iso: 100,
        aperture: 'f/8',
        shutterSpeed: '1/125s',
        focalLength: '35mm'
      },
      postProcessing: 'Lightroom adjustments',
      location: 'Test Location',
      tags: ['landscape', 'nature'],
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
  
  static createComment(overrides = {}) {
    const id = 'comment-' + Math.random().toString(36).substr(2, 9);
    return {
      id,
      content: 'This is a test comment.',
      author: {
        name: 'Test Commenter',
        email: 'commenter@example.com',
        avatarUrl: 'https://picsum.photos/50/50'
      },
      targetType: 'article',
      targetId: 'test-article-id',
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
  
  static createSettings(overrides = {}) {
    return {
      siteName: 'Test Blog',
      siteDescription: 'Test blog description',
      logoUrl: 'https://picsum.photos/200/100',
      faviconUrl: 'https://picsum.photos/32/32',
      contactEmail: 'contact@test.com',
      socialLinks: {
        github: 'https://github.com/test',
        instagram: 'https://instagram.com/test',
        twitter: 'https://twitter.com/test'
      },
      theme: {
        primaryColor: '#165DFF',
        accentColor: '#36CFC9'
      },
      seo: {
        keywords: ['test', 'blog'],
        ogImage: 'https://picsum.photos/1200/630'
      },
      updatedAt: new Date(),
      ...overrides
    };
  }
  
  static createCategory(overrides = {}) {
    const id = 'category-' + Math.random().toString(36).substr(2, 9);
    return {
      id,
      name: 'Test Category',
      description: 'Test category description',
      type: 'article',
      order: 1,
      createdAt: new Date(),
      ...overrides
    };
  }
  
  static createTag(overrides = {}) {
    const id = 'tag-' + Math.random().toString(36).substr(2, 9);
    return {
      id,
      name: 'Test Tag',
      color: '#165DFF',
      ...overrides
    };
  }
  
  // 批量创建数据
  static createMultipleArticles(count = 5, overrides = {}) {
    return Array.from({ length: count }, (_, index) => 
      this.createArticle({
        title: `Test Article ${index + 1}`,
        ...overrides
      })
    );
  }
  
  static createMultiplePhotography(count = 5, overrides = {}) {
    return Array.from({ length: count }, (_, index) => 
      this.createPhotography({
        title: `Test Photo ${index + 1}`,
        ...overrides
      })
    );
  }
  
  static createMultipleComments(count = 5, overrides = {}) {
    return Array.from({ length: count }, (_, index) => 
      this.createComment({
        content: `Test comment ${index + 1}`,
        ...overrides
      })
    );
  }
  
  // 创建完整的测试数据集
  static createCompleteDataset() {
    return {
      users: [
        this.createAdmin({ uid: 'admin-1' }),
        this.createUser({ uid: 'user-1' }),
        this.createUser({ uid: 'user-2' })
      ],
      articles: this.createMultipleArticles(10),
      photography: this.createMultiplePhotography(15),
      comments: this.createMultipleComments(20),
      categories: [
        this.createCategory({ id: 'frontend', name: '前端开发', type: 'article' }),
        this.createCategory({ id: 'backend', name: '后端开发', type: 'article' }),
        this.createCategory({ id: 'landscape', name: '风光摄影', type: 'photography' }),
        this.createCategory({ id: 'portrait', name: '人像摄影', type: 'photography' })
      ],
      tags: [
        this.createTag({ id: 'javascript', name: 'JavaScript' }),
        this.createTag({ id: 'react', name: 'React' }),
        this.createTag({ id: 'photography', name: '摄影技巧' }),
        this.createTag({ id: 'tutorial', name: '教程' })
      ],
      settings: this.createSettings()
    };
  }
}

// 预定义的测试数据
export const TEST_DATA = {
  ADMIN_USER: TestDataFactory.createAdmin({
    uid: 'test-admin',
    email: 'admin@test.com'
  }),
  
  REGULAR_USER: TestDataFactory.createUser({
    uid: 'test-user',
    email: 'user@test.com'
  }),
  
  SAMPLE_ARTICLE: TestDataFactory.createArticle({
    id: 'sample-article',
    title: 'Sample Article for Testing'
  }),
  
  SAMPLE_PHOTO: TestDataFactory.createPhotography({
    id: 'sample-photo',
    title: 'Sample Photo for Testing'
  }),
  
  SAMPLE_COMMENT: TestDataFactory.createComment({
    id: 'sample-comment',
    targetId: 'sample-article'
  })
};

// 测试数据加载器
export class TestDataLoader {
  constructor(mockFirestore) {
    this.firestore = mockFirestore;
  }
  
  async loadCompleteDataset() {
    const dataset = TestDataFactory.createCompleteDataset();
    
    // 加载用户数据
    for (const user of dataset.users) {
      await this.firestore.collection('users').doc(user.uid).set(user);
    }
    
    // 加载文章数据
    for (const article of dataset.articles) {
      await this.firestore.collection('articles').doc(article.id).set(article);
    }
    
    // 加载摄影作品数据
    for (const photo of dataset.photography) {
      await this.firestore.collection('photography').doc(photo.id).set(photo);
    }
    
    // 加载评论数据
    for (const comment of dataset.comments) {
      await this.firestore.collection('comments').doc(comment.id).set(comment);
    }
    
    // 加载分类数据
    for (const category of dataset.categories) {
      await this.firestore.collection('categories').doc(category.id).set(category);
    }
    
    // 加载标签数据
    for (const tag of dataset.tags) {
      await this.firestore.collection('tags').doc(tag.id).set(tag);
    }
    
    // 加载设置数据
    await this.firestore.collection('settings').doc('site_settings').set(dataset.settings);
    
    return dataset;
  }
  
  async loadMinimalDataset() {
    // 加载最小测试数据集
    await this.firestore.collection('users').doc(TEST_DATA.ADMIN_USER.uid).set(TEST_DATA.ADMIN_USER);
    await this.firestore.collection('articles').doc(TEST_DATA.SAMPLE_ARTICLE.id).set(TEST_DATA.SAMPLE_ARTICLE);
    await this.firestore.collection('photography').doc(TEST_DATA.SAMPLE_PHOTO.id).set(TEST_DATA.SAMPLE_PHOTO);
    
    return {
      admin: TEST_DATA.ADMIN_USER,
      article: TEST_DATA.SAMPLE_ARTICLE,
      photo: TEST_DATA.SAMPLE_PHOTO
    };
  }
  
  async clearAllData() {
    this.firestore.clearData();
  }
}

export default TestDataFactory;
