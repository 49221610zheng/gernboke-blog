// 个人资料管理模块
class ProfileManager {
  constructor() {
    this.profileData = {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
      skills: [],
      experience: [],
      education: [],
      projects: []
    };
    this.init();
  }
  
  init() {
    this.loadProfile();
    this.bindEvents();
  }
  
  async loadProfile() {
    try {
      const services = getFirebaseServices();
      if (!services || !services.db) {
        console.error('Firebase服务未初始化');
        return;
      }
      
      const doc = await services.db.collection('profile').doc('main').get();
      if (doc.exists) {
        this.profileData = { ...this.profileData, ...doc.data() };
        this.renderProfile();
      } else {
        // 创建默认资料
        await this.saveProfile();
      }
    } catch (error) {
      console.error('加载个人资料失败:', error);
    }
  }
  
  async saveProfile() {
    try {
      const services = getFirebaseServices();
      if (!services || !services.db) {
        console.error('Firebase服务未初始化');
        return false;
      }
      
      await services.db.collection('profile').doc('main').set({
        ...this.profileData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      this.showMessage('个人资料保存成功', 'success');
      return true;
    } catch (error) {
      console.error('保存个人资料失败:', error);
      this.showMessage('保存失败: ' + error.message, 'error');
      return false;
    }
  }
  
  renderProfile() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">个人资料管理</h1>
          <button onclick="profileManager.saveProfile()" class="btn-primary">
            <i class="fas fa-save mr-2"></i>保存资料
          </button>
        </div>
        
        <!-- 基本信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
              <input type="text" id="profile-name" value="${this.profileData.name}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">职位/标题</label>
              <input type="text" id="profile-title" value="${this.profileData.title}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
              <textarea id="profile-bio" rows="4" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${this.profileData.bio}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">头像URL</label>
              <input type="url" id="profile-avatar" value="${this.profileData.avatar}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input type="email" id="profile-email" value="${this.profileData.email}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
        
        <!-- 联系信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">联系信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">电话</label>
              <input type="tel" id="profile-phone" value="${this.profileData.phone}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">位置</label>
              <input type="text" id="profile-location" value="${this.profileData.location}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">个人网站</label>
              <input type="url" id="profile-website" value="${this.profileData.website}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
              <input type="url" id="profile-github" value="${this.profileData.github}" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
        
        <!-- 技能管理 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">技能标签</h2>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2" id="skills-container">
              ${this.renderSkills()}
            </div>
            <div class="flex gap-2">
              <input type="text" id="new-skill" placeholder="添加新技能" 
                     class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button onclick="profileManager.addSkill()" class="btn-primary">添加</button>
            </div>
          </div>
        </div>
        
        <!-- 工作经历 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">工作经历</h2>
            <button onclick="profileManager.addExperience()" class="btn-secondary">
              <i class="fas fa-plus mr-2"></i>添加经历
            </button>
          </div>
          <div id="experience-container" class="space-y-4">
            ${this.renderExperience()}
          </div>
        </div>
        
        <!-- 教育背景 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">教育背景</h2>
            <button onclick="profileManager.addEducation()" class="btn-secondary">
              <i class="fas fa-plus mr-2"></i>添加教育
            </button>
          </div>
          <div id="education-container" class="space-y-4">
            ${this.renderEducation()}
          </div>
        </div>
      </div>
    `;
    
    this.bindFormEvents();
  }
  
  renderSkills() {
    return this.profileData.skills.map((skill, index) => `
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
        ${skill}
        <button onclick="profileManager.removeSkill(${index})" class="ml-2 text-blue-600 hover:text-blue-800">
          <i class="fas fa-times"></i>
        </button>
      </span>
    `).join('');
  }
  
  renderExperience() {
    return this.profileData.experience.map((exp, index) => `
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="公司名称" value="${exp.company || ''}" 
                 onchange="profileManager.updateExperience(${index}, 'company', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
          <input type="text" placeholder="职位" value="${exp.position || ''}" 
                 onchange="profileManager.updateExperience(${index}, 'position', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
          <input type="text" placeholder="开始时间" value="${exp.startDate || ''}" 
                 onchange="profileManager.updateExperience(${index}, 'startDate', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
          <input type="text" placeholder="结束时间" value="${exp.endDate || ''}" 
                 onchange="profileManager.updateExperience(${index}, 'endDate', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <textarea placeholder="工作描述" rows="3" 
                  onchange="profileManager.updateExperience(${index}, 'description', this.value)"
                  class="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md">${exp.description || ''}</textarea>
        <button onclick="profileManager.removeExperience(${index})" 
                class="mt-2 text-red-600 hover:text-red-800 text-sm">
          <i class="fas fa-trash mr-1"></i>删除
        </button>
      </div>
    `).join('');
  }
  
  renderEducation() {
    return this.profileData.education.map((edu, index) => `
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="学校名称" value="${edu.school || ''}" 
                 onchange="profileManager.updateEducation(${index}, 'school', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
          <input type="text" placeholder="专业" value="${edu.degree || ''}" 
                 onchange="profileManager.updateEducation(${index}, 'degree', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
          <input type="text" placeholder="开始时间" value="${edu.startDate || ''}" 
                 onchange="profileManager.updateEducation(${index}, 'startDate', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
          <input type="text" placeholder="结束时间" value="${edu.endDate || ''}" 
                 onchange="profileManager.updateEducation(${index}, 'endDate', this.value)"
                 class="px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <button onclick="profileManager.removeEducation(${index})" 
                class="mt-2 text-red-600 hover:text-red-800 text-sm">
          <i class="fas fa-trash mr-1"></i>删除
        </button>
      </div>
    `).join('');
  }
  
  bindFormEvents() {
    // 绑定基本信息字段
    const fields = ['name', 'title', 'bio', 'avatar', 'email', 'phone', 'location', 'website', 'github'];
    fields.forEach(field => {
      const element = document.getElementById(`profile-${field}`);
      if (element) {
        element.addEventListener('change', (e) => {
          this.profileData[field] = e.target.value;
        });
      }
    });
  }
  
  bindEvents() {
    // 绑定全局事件
  }
  
  addSkill() {
    const input = document.getElementById('new-skill');
    const skill = input.value.trim();
    if (skill && !this.profileData.skills.includes(skill)) {
      this.profileData.skills.push(skill);
      input.value = '';
      document.getElementById('skills-container').innerHTML = this.renderSkills();
    }
  }
  
  removeSkill(index) {
    this.profileData.skills.splice(index, 1);
    document.getElementById('skills-container').innerHTML = this.renderSkills();
  }
  
  addExperience() {
    this.profileData.experience.push({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    document.getElementById('experience-container').innerHTML = this.renderExperience();
  }
  
  updateExperience(index, field, value) {
    this.profileData.experience[index][field] = value;
  }
  
  removeExperience(index) {
    this.profileData.experience.splice(index, 1);
    document.getElementById('experience-container').innerHTML = this.renderExperience();
  }
  
  addEducation() {
    this.profileData.education.push({
      school: '',
      degree: '',
      startDate: '',
      endDate: ''
    });
    document.getElementById('education-container').innerHTML = this.renderEducation();
  }
  
  updateEducation(index, field, value) {
    this.profileData.education[index][field] = value;
  }
  
  removeEducation(index) {
    this.profileData.education.splice(index, 1);
    document.getElementById('education-container').innerHTML = this.renderEducation();
  }
  
  showMessage(message, type) {
    // 创建消息提示
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}

// 导出到全局
window.ProfileManager = ProfileManager;
