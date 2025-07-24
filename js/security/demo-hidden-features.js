// 隐藏管理功能演示脚本
// 展示隐藏管理系统的各种功能

class HiddenFeaturesDemo {
  constructor() {
    this.demoMode = false;
    this.demoSteps = [];
    this.currentStep = 0;
    
    this.init();
  }

  init() {
    // 检查是否启用演示模式
    if (window.location.search.includes('demo=true')) {
      this.enableDemoMode();
    }
    
    // 添加演示快捷键
    document.addEventListener('keydown', (e) => {
      // Ctrl + Shift + D 启用演示模式
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        this.toggleDemoMode();
      }
    });
    
    console.log('🎭 隐藏功能演示系统已初始化');
  }

  enableDemoMode() {
    this.demoMode = true;
    this.setupDemoSteps();
    this.createDemoUI();
    
    console.log('🎭 演示模式已启用');
  }

  setupDemoSteps() {
    this.demoSteps = [
      {
        title: '步骤 1: 激活隐藏管理端口',
        description: '使用 Konami Code (上上下下左右左右) 激活隐藏管理功能',
        action: () => this.demoKonamiCode(),
        duration: 3000
      },
      {
        title: '步骤 2: 显示管理入口',
        description: '隐藏的管理入口按钮将出现在左下角',
        action: () => this.demoShowAdminEntry(),
        duration: 2000
      },
      {
        title: '步骤 3: 打开管理面板',
        description: '点击管理入口按钮打开控制面板',
        action: () => this.demoOpenAdminPanel(),
        duration: 3000
      },
      {
        title: '步骤 4: 前后端联动',
        description: '展示前后端数据同步功能',
        action: () => this.demoBackendSync(),
        duration: 2000
      },
      {
        title: '步骤 5: 访问完整管理后台',
        description: '通过安全令牌访问完整的管理后台',
        action: () => this.demoFullAdmin(),
        duration: 2000
      }
    ];
  }

  createDemoUI() {
    // 创建演示控制面板
    const demoPanel = document.createElement('div');
    demoPanel.id = 'demo-panel';
    demoPanel.className = 'demo-panel';
    demoPanel.innerHTML = `
      <div class="demo-header">
        <h3><i class="fa fa-play-circle"></i> 隐藏管理功能演示</h3>
        <button class="demo-close" onclick="window.hiddenDemo.closeDemoMode()">
          <i class="fa fa-times"></i>
        </button>
      </div>
      
      <div class="demo-content">
        <div class="demo-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <span class="progress-text">0 / ${this.demoSteps.length}</span>
        </div>
        
        <div class="demo-step">
          <h4 id="demo-step-title">准备开始演示</h4>
          <p id="demo-step-description">点击开始按钮开始演示隐藏管理功能</p>
        </div>
        
        <div class="demo-controls">
          <button class="demo-btn demo-btn-primary" onclick="window.hiddenDemo.startDemo()">
            <i class="fa fa-play"></i> 开始演示
          </button>
          <button class="demo-btn demo-btn-secondary" onclick="window.hiddenDemo.nextStep()" disabled>
            <i class="fa fa-step-forward"></i> 下一步
          </button>
          <button class="demo-btn demo-btn-secondary" onclick="window.hiddenDemo.resetDemo()">
            <i class="fa fa-refresh"></i> 重置
          </button>
        </div>
        
        <div class="demo-info">
          <h5>演示说明：</h5>
          <ul>
            <li>本演示将展示隐藏管理系统的完整功能</li>
            <li>包括 Konami Code 激活、前后端联动等</li>
            <li>演示过程中请勿刷新页面</li>
            <li>可以随时点击重置按钮重新开始</li>
          </ul>
        </div>
      </div>
    `;

    // 添加演示样式
    const style = document.createElement('style');
    style.textContent = `
      .demo-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
      }

      .demo-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 12px 12px 0 0;
      }

      .demo-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .demo-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s ease;
      }

      .demo-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .demo-content {
        padding: 20px;
      }

      .demo-progress {
        margin-bottom: 20px;
      }

      .progress-bar {
        width: 100%;
        height: 6px;
        background: #e5e7eb;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transition: width 0.3s ease;
      }

      .progress-text {
        font-size: 12px;
        color: #6b7280;
      }

      .demo-step {
        margin-bottom: 20px;
      }

      .demo-step h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
      }

      .demo-step p {
        margin: 0;
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
      }

      .demo-controls {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .demo-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s ease;
        flex: 1;
        justify-content: center;
      }

      .demo-btn-primary {
        background: #3b82f6;
        color: white;
      }

      .demo-btn-primary:hover {
        background: #2563eb;
      }

      .demo-btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .demo-btn-secondary:hover {
        background: #e5e7eb;
      }

      .demo-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .demo-info {
        background: #f8fafc;
        border-radius: 8px;
        padding: 16px;
      }

      .demo-info h5 {
        margin: 0 0 12px 0;
        font-size: 13px;
        font-weight: 600;
        color: #374151;
      }

      .demo-info ul {
        margin: 0;
        padding-left: 16px;
      }

      .demo-info li {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 4px;
        line-height: 1.4;
      }

      .demo-highlight {
        animation: demoHighlight 2s ease-in-out;
        position: relative;
      }

      .demo-highlight::after {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid #fbbf24;
        border-radius: 8px;
        animation: demoPulse 1s ease-in-out infinite;
      }

      @keyframes demoHighlight {
        0%, 100% { background: transparent; }
        50% { background: rgba(251, 191, 36, 0.1); }
      }

      @keyframes demoPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.02); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(demoPanel);
  }

  startDemo() {
    this.currentStep = 0;
    this.updateDemoUI();
    this.executeCurrentStep();
    
    // 启用下一步按钮
    const nextBtn = document.querySelector('.demo-controls .demo-btn-secondary');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  nextStep() {
    if (this.currentStep < this.demoSteps.length - 1) {
      this.currentStep++;
      this.updateDemoUI();
      this.executeCurrentStep();
    } else {
      this.completDemo();
    }
  }

  executeCurrentStep() {
    const step = this.demoSteps[this.currentStep];
    if (step && step.action) {
      setTimeout(() => {
        step.action();
      }, 500);
    }
  }

  updateDemoUI() {
    const step = this.demoSteps[this.currentStep];
    
    // 更新进度条
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
      const progress = ((this.currentStep + 1) / this.demoSteps.length) * 100;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${this.currentStep + 1} / ${this.demoSteps.length}`;
    }
    
    // 更新步骤信息
    const titleElement = document.getElementById('demo-step-title');
    const descElement = document.getElementById('demo-step-description');
    
    if (titleElement && descElement && step) {
      titleElement.textContent = step.title;
      descElement.textContent = step.description;
    }
  }

  // 演示步骤实现
  demoKonamiCode() {
    console.log('🎭 演示: 模拟 Konami Code 输入');
    
    // 模拟按键序列
    const keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    
    keys.forEach((key, index) => {
      setTimeout(() => {
        const event = new KeyboardEvent('keydown', { code: key });
        document.dispatchEvent(event);
        
        if (index === keys.length - 1) {
          // 最后一个按键后，高亮显示激活通知
          setTimeout(() => {
            const notification = document.querySelector('.admin-activation-notification');
            if (notification) {
              notification.classList.add('demo-highlight');
            }
          }, 500);
        }
      }, index * 200);
    });
  }

  demoShowAdminEntry() {
    console.log('🎭 演示: 高亮显示管理入口');
    
    setTimeout(() => {
      const adminEntry = document.getElementById('hidden-admin-entry');
      if (adminEntry) {
        adminEntry.classList.add('demo-highlight');
      }
    }, 500);
  }

  demoOpenAdminPanel() {
    console.log('🎭 演示: 打开管理面板');
    
    if (window.hiddenAdmin) {
      window.hiddenAdmin.openAdminPanel();
      
      setTimeout(() => {
        const modal = document.getElementById('admin-modal');
        if (modal) {
          modal.classList.add('demo-highlight');
        }
      }, 1000);
    }
  }

  demoBackendSync() {
    console.log('🎭 演示: 前后端数据同步');
    
    if (window.frontendBackendBridge) {
      const status = window.frontendBackendBridge.getConnectionStatus();
      console.log('🔗 连接状态:', status);
      
      // 显示连接状态信息
      this.showDemoMessage('前后端联动状态', `
        连接状态: ${status.connected ? '已连接' : '未连接'}<br>
        后端类型: ${status.type}<br>
        会话ID: ${status.sessionId.substring(0, 20)}...
      `);
    }
  }

  demoFullAdmin() {
    console.log('🎭 演示: 生成管理后台访问令牌');
    
    if (window.hiddenAdmin) {
      const token = window.hiddenAdmin.generateSecureToken();
      const adminUrl = `/admin.html?token=${token}`;
      
      this.showDemoMessage('管理后台访问', `
        安全令牌已生成<br>
        访问地址: <a href="${adminUrl}" target="_blank">${adminUrl}</a><br>
        令牌有效期: 5分钟
      `);
    }
  }

  showDemoMessage(title, content) {
    const message = document.createElement('div');
    message.className = 'demo-message';
    message.innerHTML = `
      <div class="demo-message-content">
        <h4>${title}</h4>
        <div>${content}</div>
        <button onclick="this.parentElement.parentElement.remove()">关闭</button>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .demo-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: demoMessageSlide 0.3s ease-out;
      }
      
      .demo-message-content {
        padding: 24px;
        text-align: center;
      }
      
      .demo-message h4 {
        margin: 0 0 16px 0;
        color: #374151;
      }
      
      .demo-message button {
        margin-top: 16px;
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      
      @keyframes demoMessageSlide {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    // 5秒后自动关闭
    setTimeout(() => {
      if (message.parentElement) {
        message.remove();
      }
    }, 5000);
  }

  completDemo() {
    console.log('🎭 演示完成');
    
    this.showDemoMessage('演示完成', `
      隐藏管理功能演示已完成！<br><br>
      您已了解了：<br>
      • Konami Code 激活方式<br>
      • 隐藏管理入口<br>
      • 前后端联动系统<br>
      • 安全令牌访问<br><br>
      现在您可以自己尝试这些功能了！
    `);
  }

  resetDemo() {
    this.currentStep = 0;
    this.updateDemoUI();
    
    // 重置按钮状态
    const nextBtn = document.querySelector('.demo-controls .demo-btn-secondary');
    if (nextBtn) {
      nextBtn.disabled = true;
    }
    
    // 清除高亮
    document.querySelectorAll('.demo-highlight').forEach(el => {
      el.classList.remove('demo-highlight');
    });
    
    console.log('🎭 演示已重置');
  }

  toggleDemoMode() {
    if (this.demoMode) {
      this.closeDemoMode();
    } else {
      this.enableDemoMode();
    }
  }

  closeDemoMode() {
    this.demoMode = false;
    
    const demoPanel = document.getElementById('demo-panel');
    if (demoPanel) {
      demoPanel.remove();
    }
    
    // 清除高亮
    document.querySelectorAll('.demo-highlight').forEach(el => {
      el.classList.remove('demo-highlight');
    });
    
    console.log('🎭 演示模式已关闭');
  }
}

// 全局初始化
window.hiddenDemo = new HiddenFeaturesDemo();
