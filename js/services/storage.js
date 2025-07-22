// 存储服务层 - 处理文件上传
import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../firebase-config.js';

// 存储服务类
class StorageService {
  constructor() {
    this.uploadTasks = new Map(); // 存储上传任务
  }
  
  // 上传图片
  async uploadImage(file, folder = 'images', onProgress = null) {
    try {
      // 验证文件类型
      if (!this.isValidImageFile(file)) {
        throw new Error('不支持的文件格式，请上传 JPG、PNG 或 WebP 格式的图片');
      }
      
      // 验证文件大小 (20MB)
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('文件大小不能超过 20MB');
      }
      
      // 生成唯一文件名
      const fileName = this.generateFileName(file);
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      // 如果提供了进度回调，使用可恢复上传
      if (onProgress) {
        return await this.uploadWithProgress(storageRef, file, onProgress);
      } else {
        // 简单上传
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          url: downloadURL,
          path: filePath,
          name: fileName,
          size: file.size
        };
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
  
  // 带进度的上传
  async uploadWithProgress(storageRef, file, onProgress) {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // 存储上传任务以便取消
      const taskId = Date.now().toString();
      this.uploadTasks.set(taskId, uploadTask);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          // 计算上传进度
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress({
            progress: Math.round(progress),
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state,
            taskId: taskId
          });
        },
        (error) => {
          // 上传失败
          this.uploadTasks.delete(taskId);
          console.error('Upload failed:', error);
          reject(this.getUploadErrorMessage(error.code));
        },
        async () => {
          // 上传成功
          try {
            this.uploadTasks.delete(taskId);
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              name: file.name,
              size: file.size,
              taskId: taskId
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
  
  // 批量上传图片
  async uploadMultipleImages(files, folder = 'images', onProgress = null) {
    const results = [];
    const errors = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const progressCallback = onProgress ? 
          (progress) => onProgress({ ...progress, fileIndex: i, totalFiles: files.length }) : 
          null;
          
        const result = await this.uploadImage(files[i], folder, progressCallback);
        results.push(result);
      } catch (error) {
        errors.push({ file: files[i].name, error: error.message });
      }
    }
    
    return { results, errors };
  }
  
  // 删除文件
  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('删除文件失败');
    }
  }
  
  // 获取文件夹中的所有文件
  async listFiles(folder) {
    try {
      const folderRef = ref(storage, folder);
      const result = await listAll(folderRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url: url
          };
        })
      );
      
      return files;
    } catch (error) {
      console.error('List files error:', error);
      throw new Error('获取文件列表失败');
    }
  }
  
  // 取消上传任务
  cancelUpload(taskId) {
    const uploadTask = this.uploadTasks.get(taskId);
    if (uploadTask) {
      uploadTask.cancel();
      this.uploadTasks.delete(taskId);
      return true;
    }
    return false;
  }
  
  // 生成唯一文件名
  generateFileName(file) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop().toLowerCase();
    return `${timestamp}_${randomString}.${extension}`;
  }
  
  // 验证图片文件类型
  isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }
  
  // 压缩图片（客户端压缩）
  async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // 计算新尺寸
        let { width, height } = this.calculateNewDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        );
        
        canvas.width = width;
        canvas.height = height;
        
        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为 Blob
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          }));
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  // 计算新尺寸
  calculateNewDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;
    
    // 如果图片尺寸超过最大限制，按比例缩放
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;
      
      if (width > height) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }
  
  // 获取上传错误信息
  getUploadErrorMessage(errorCode) {
    const errorMessages = {
      'storage/unauthorized': '没有上传权限',
      'storage/canceled': '上传已取消',
      'storage/unknown': '上传失败，请重试',
      'storage/invalid-format': '不支持的文件格式',
      'storage/invalid-event-name': '无效的事件名称',
      'storage/invalid-url': '无效的下载链接',
      'storage/invalid-argument': '无效的参数',
      'storage/no-default-bucket': '未配置存储桶',
      'storage/cannot-slice-blob': '文件读取失败',
      'storage/server-file-wrong-size': '文件大小不匹配'
    };
    
    return errorMessages[errorCode] || '上传失败，请重试';
  }
}

// 创建存储服务实例
const storageService = new StorageService();

// 导出存储服务
export default storageService;

// 导出常用方法
export const {
  uploadImage,
  uploadMultipleImages,
  deleteFile,
  listFiles,
  cancelUpload,
  compressImage
} = storageService;
