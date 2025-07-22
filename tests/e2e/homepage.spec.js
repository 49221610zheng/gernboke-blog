// 首页端到端测试
import { test, expect } from '@playwright/test';

test.describe('首页功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('页面标题和基本元素', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/光影与代码/);
    
    // 检查导航栏
    const navbar = page.locator('#navbar');
    await expect(navbar).toBeVisible();
    
    // 检查主要导航链接
    await expect(page.locator('a[href="#home"]')).toBeVisible();
    await expect(page.locator('a[href="#photography"]')).toBeVisible();
    await expect(page.locator('a[href="#tech"]')).toBeVisible();
    await expect(page.locator('a[href="#about"]')).toBeVisible();
  });

  test('响应式导航菜单', async ({ page }) => {
    // 调整到移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 检查汉堡菜单按钮
    const menuToggle = page.locator('#menu-toggle');
    await expect(menuToggle).toBeVisible();
    
    // 检查移动菜单初始状态（隐藏）
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveClass(/hidden/);
    
    // 点击汉堡菜单
    await menuToggle.click();
    
    // 检查移动菜单显示
    await expect(mobileMenu).not.toHaveClass(/hidden/);
    
    // 再次点击关闭菜单
    await menuToggle.click();
    await expect(mobileMenu).toHaveClass(/hidden/);
  });

  test('英雄区域内容', async ({ page }) => {
    // 检查英雄区域
    const heroSection = page.locator('#home');
    await expect(heroSection).toBeVisible();
    
    // 检查主标题
    await expect(page.locator('h1')).toContainText('光影与代码');
    
    // 检查副标题
    await expect(page.locator('.text-xl')).toContainText('融合摄影艺术与编程技术');
    
    // 检查CTA按钮
    const ctaButton = page.locator('text=探索作品');
    await expect(ctaButton).toBeVisible();
    
    // 测试CTA按钮点击
    await ctaButton.click();
    await expect(page.url()).toContain('#photography');
  });

  test('摄影作品展示', async ({ page }) => {
    // 导航到摄影作品区域
    await page.locator('a[href="#photography"]').click();
    
    // 检查摄影作品区域
    const photographySection = page.locator('#photography');
    await expect(photographySection).toBeVisible();
    
    // 检查作品网格
    const photoGrid = photographySection.locator('.grid');
    await expect(photoGrid).toBeVisible();
    
    // 检查是否有作品卡片（如果有数据的话）
    const photoCards = photoGrid.locator('.card-hover');
    const cardCount = await photoCards.count();
    
    if (cardCount > 0) {
      // 检查第一张作品卡片
      const firstCard = photoCards.first();
      await expect(firstCard).toBeVisible();
      
      // 检查图片
      const image = firstCard.locator('img');
      await expect(image).toBeVisible();
      
      // 测试悬停效果
      await firstCard.hover();
      await expect(firstCard).toHaveClass(/card-hover/);
    }
  });

  test('技术文章区域', async ({ page }) => {
    // 导航到技术文章区域
    await page.locator('a[href="#tech"]').click();
    
    // 检查技术文章区域
    const techSection = page.locator('#tech');
    await expect(techSection).toBeVisible();
    
    // 检查文章网格
    const articleGrid = techSection.locator('.grid');
    await expect(articleGrid).toBeVisible();
    
    // 检查是否有文章卡片
    const articleCards = articleGrid.locator('.card-hover');
    const cardCount = await articleCards.count();
    
    if (cardCount > 0) {
      // 检查第一篇文章
      const firstArticle = articleCards.first();
      await expect(firstArticle).toBeVisible();
      
      // 检查文章标题
      const title = firstArticle.locator('h3');
      await expect(title).toBeVisible();
      
      // 检查作者信息
      const author = firstArticle.locator('img[alt="作者头像"]');
      await expect(author).toBeVisible();
    }
  });

  test('平滑滚动导航', async ({ page }) => {
    // 测试导航链接的平滑滚动
    const sections = ['#photography', '#tech', '#about'];
    
    for (const section of sections) {
      await page.locator(`a[href="${section}"]`).click();
      
      // 等待滚动完成
      await page.waitForTimeout(1000);
      
      // 检查URL是否包含锚点
      await expect(page.url()).toContain(section);
      
      // 检查对应区域是否可见
      await expect(page.locator(section)).toBeInViewport();
    }
  });

  test('返回顶部按钮', async ({ page }) => {
    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 等待返回顶部按钮出现
    const backToTopButton = page.locator('#back-to-top');
    await expect(backToTopButton).toBeVisible();
    await expect(backToTopButton).toHaveClass(/opacity-100/);
    
    // 点击返回顶部
    await backToTopButton.click();
    
    // 等待滚动完成
    await page.waitForTimeout(1000);
    
    // 检查是否回到顶部
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
    
    // 检查按钮是否隐藏
    await expect(backToTopButton).toHaveClass(/opacity-0/);
  });

  test('图片懒加载', async ({ page }) => {
    // 检查页面中的图片
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // 检查第一张图片是否加载
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // 检查图片是否有src属性
      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toBe('');
    }
  });

  test('页面性能检查', async ({ page }) => {
    // 监听网络请求
    const responses = [];
    page.on('response', response => {
      responses.push(response);
    });
    
    // 重新加载页面
    await page.reload();
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 检查是否有失败的请求
    const failedRequests = responses.filter(response => !response.ok());
    expect(failedRequests.length).toBe(0);
    
    // 检查页面加载时间
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart
      };
    });
    
    // 页面加载时间应该在合理范围内
    expect(navigationTiming.domContentLoaded).toBeLessThan(3000);
    expect(navigationTiming.loadComplete).toBeLessThan(5000);
  });

  test('无障碍访问检查', async ({ page }) => {
    // 检查页面是否有主要的无障碍元素
    
    // 检查主要标题
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // 检查导航地标
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // 检查主要内容区域
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // 检查图片是否有alt属性
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // 检查链接是否有可访问的文本
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});
