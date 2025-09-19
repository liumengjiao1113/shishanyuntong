<template>
  <view class="container">
    <!-- 弹窗 -->
    <view v-if="showPopup" class="popup-overlay">
      <view class="popup-card">
        <view class="popup-title">填写影像信息</view>
        <view class="popup-field">
          <text>经度：</text>
          <input type="text" :value="longitude" disabled />
        </view>
        <view class="popup-field">
          <text>纬度：</text>
          <input type="text" :value="latitude" disabled />
        </view>
        <view class="popup-field">
          <text>高程：</text>
          <input type="number" v-model="formAltitude" placeholder="请输入高程" />
        </view>
        <view class="popup-field">
          <text>小区ID：</text>
          <input type="text" v-model="formBlockId" placeholder="请输入小区ID" />
        </view>
        <view class="popup-buttons">
          <button @click="submitPopup">确认</button>
          <button @click="cancelPopup">取消</button>
        </view>
      </view>
    </view>

    <!-- 任务状态管理 -->
    <view class="status-bar">
      <button :class="['status-btn', taskStatus === 'new' ? 'active' : '']" @click="changeTaskStatus('new')">新建</button>
      <button :class="['status-btn', taskStatus === 'started' ? 'active' : '']" @click="changeTaskStatus('started')">开始</button>
      <button :class="['status-btn', taskStatus === 'ended' ? 'active' : '']" @click="changeTaskStatus('ended')">结束</button>
    </view>

    <!-- 任务基本信息 -->
    <view class="info-card">
      <view class="info-item">
        <text class="info-label">任务名：</text>
        <text class="info-value">{{ task.taskName }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">任务 ID：</text>
        <text class="info-value">{{ task.id }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">任务描述：</text>
        <text class="info-value">{{ task.description }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">小区ID：</text>
        <text class="info-value">{{ task.position }}</text>
      </view>
    </view>

    <!-- 网格布局影像列表 -->
    <scroll-view class="images-scroll" scroll-y :style="{ height: imageAreaHeight + 'px' }">
      <view class="image-grid">
        <view v-for="(img, idx) in images" :key="img.id" class="image-item">
          <view class="image-wrapper" :class="{ selected: img.selected }" @click="toggleSelect(img)">
            <image :src="img.url" mode="aspectFill" class="thumb-image" />
            <progress
              :percent="img.progress"
              show-info
              stroke-width="6"
              activeColor="#00c3ff"
              v-if="img.showProgress"
            />
          </view>
          <view class="status-text">{{ uploadStatusText(img.uploadStatus) }}</view>
          <view class="ops-bar">
            <button class="op-btn" :disabled="img.uploadStatus !== 'settled'" @click="viewResult(img)">查看</button>
            <button class="op-btn btn-delete" @click="deleteImage(idx)">删除</button>
          </view>
        </view>
      </view>
    </scroll-view>

    <view style="margin-bottom: 20rpx;">
      <button class="op-btn" @click="uploadSelectedImages">上传选中影像</button>
      <button class="op-btn" @click="addImages">采集图像</button>
      <button class="op-btn" @click="chooseFromAlbum">从图库上传</button>
    </view>
  </view>
</template>

<script>
import { request } from '../../components/request'
export default {
  data() {
    return {
      task: { id: '', taskName: '', position: '', description: '' },
      trid: '',
      showPopup: false,
      newImageUrl: '',
      formAltitude: '',
      formBlockId: '',
      longitude: '',
      latitude: '',
      taskStatus: 'new',
      imageAreaHeight: '80vh',
      taskType: '',
      images: []
    };
  },

  async onLoad(options) {
    this.task.id = options.id;
    this.taskStatus = options.status || 'new';
    const systemInfo = uni.getSystemInfoSync();
    this.imageAreaHeight = systemInfo.windowHeight - 400;
    console.log('接收到参数：', options);

    // 初始化任务类型
    if (options.type === 'phenotype' || options.type === 'roast') {
      this.taskType = options.type;
    } else {
      const typeMap = { '表型采集': 'phenotype', '玉米烤种': 'roast' };
      this.taskType = typeMap[options.type] || 'phenotype';
    }

    // 权限申请（App端）
    if (process.env.UNI_PLATFORM === 'app' && typeof uni.requestPermissions === 'function') {
      await this.requestAppPermissions();
    }

    // 获取回执ID逻辑
    let tridFromServer = null;
    const token = uni.getStorageSync('token');
    try {
      const res = await request({
        url: `/taskReceipt/get?taskId=${this.task.id}`,
        method: 'GET',
        header: { 'Authorization': token }
      });
      tridFromServer = res?.data?.trid || null;
    } catch (err) {
      console.error('获取回执失败', err);
    }
    const storedTridMap = uni.getStorageSync('tridMap') || {};
    if (tridFromServer) {
      this.trid = tridFromServer;
      storedTridMap[this.task.id] = this.trid;
      uni.setStorageSync('tridMap', storedTridMap);
    } else if (storedTridMap[this.task.id]) {
      this.trid = storedTridMap[this.task.id];
    } else {
      try {
        const createRes = await request({
          url: `/taskReceipt/create?taskId=${this.task.id}`,
          method: 'POST',
          header: { 'Authorization': token }
        });
        this.trid = createRes.data;
        storedTridMap[this.task.id] = this.trid;
        uni.setStorageSync('tridMap', storedTridMap);
      } catch (err) {
        console.error('任务回执创建失败', err);
      }
    }

    // 获取任务详情
    if (this.task.id) {
      try {
        const res = await request({
          url: '/task/getTask',
          method: 'GET',
          data: { id: this.task.id },
          header: { 'Authorization': token }
        });
        if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
          const targetTask = res.data.find(task => task.id == this.task.id);
          if (targetTask) {
            this.task = {
              id: targetTask.id,
              taskName: targetTask.taskName,
              position: targetTask.create_time,
              description: targetTask.uploadImage
            };
          } else {
            uni.showToast({ title: '未找到对应ID的任务', icon: 'none' });
          }
        } else {
          uni.showToast({ title: '未查询到任务', icon: 'none' });
        }
      } catch (err) {
        console.error('获取任务详情失败:', err);
        uni.showToast({ title: '加载任务失败', icon: 'none' });
      }
    }

    // 加载本地缓存影像
    const localImgs = uni.getStorageSync(`localImages_${this.task.id}`);
    if (localImgs && Array.isArray(localImgs)) {
      this.images = localImgs;
    }
	  const eventChannel = this.getOpenerEventChannel();
	  if (eventChannel) {
	    console.log('上一页：开始监听imageAdded事件');
	    eventChannel.on('imageAdded', (img) => {
	      console.log('上一页：收到imageAdded事件，数据：', img);
	      this.newImageUrl = img.url; // 赋值图片路径
	      this.formBlockId = img.blockId || ''; // 预填小区ID
	      this.showPopup = true; // 显示弹窗
	      console.log('上一页：弹窗状态设置为', this.showPopup);
	    });
	  } else {
	    console.error('上一页：无法获取eventChannel');
	  }
	
	
  },

  methods: {
	
	async requestLocationPermission() {
	  if (process.env.UNI_PLATFORM === 'h5') {
	    // H5 平台无需申请权限，但浏览器会弹窗
	    return;
	  }
	
	  // App / 小程序平台
	  if (typeof uni.getSetting === 'function' && typeof uni.authorize === 'function') {
	    try {
	      const res = await uni.getSetting();
	      if (!res.authSetting['scope.userLocation']) {
	        await uni.authorize({ scope: 'scope.userLocation' });
	      }
	    } catch (err) {
	      console.error('位置权限授权失败：', err);
	      uni.showToast({ title: '请手动开启定位权限', icon: 'none' });
	    }
	  }
	},

    // App端权限申请（增加API存在检查）
    async requestAppPermissions() {
      try {
        // 申请相册权限
        if (typeof uni.requestPermissions === 'function') {
          const albumAuth = await uni.requestPermissions({
            scope: 'scope.album'
          });
          if (albumAuth[0].authResult !== 'granted') {
            uni.showToast({ title: '请授予相册权限以使用上传功能', icon: 'none' });
          }
        }

        // 如果是表型采集，申请位置权限
        if ( typeof uni.requestPermissions === 'function') {
          const locationAuth = await uni.requestPermissions({
            scope: 'scope.userLocation'
          });
          if (locationAuth[0].authResult !== 'granted') {
            uni.showToast({ title: '请授予位置权限以获取定位信息', icon: 'none' });
          }
        }
      } catch (err) {
        console.error('权限申请失败:', err);
      }
    },

    // 状态文本转换
    statusLabel(status) {
      const labels = { new: '新建', started: '已开始', ended: '已结束' };
      return labels[status] || '未知状态';
    },

    // 切换任务状态
    changeTaskStatus(newStatus) {
      if (this.taskStatus !== newStatus) {
        this.taskStatus = newStatus;
        uni.showToast({ title: `状态已切换为：${this.statusLabel(newStatus)}`, icon: 'none' });
      }
    },

    // 切换影像选中状态
    toggleSelect(img) {
      if (img.uploadStatus === 'notUploaded') {
        img.selected = !img.selected;
      }
    },

    // 上传状态文本
    uploadStatusText(status) {
      const texts = { notUploaded: '未上传', uploaded: '已上传', settled: '已结算' };
      return texts[status] || '';
    },

    // 上传选中影像（统一跨平台逻辑）
    async uploadSelectedImages() {
      const selectedImages = this.images.filter(img => img.selected);
      if (selectedImages.length === 0) {
        uni.showToast({ title: '请先选中影像', icon: 'none' });
        return;
      }

      for (const img of selectedImages) {
        if (img.uploadStatus !== 'notUploaded') continue;

        uni.showLoading({ title: '上传中...' });
        img.showProgress = true;
        img.progress = 0;

        try {
          // 构造上传参数
          const formData = {
            jsonData: JSON.stringify({
              trId: this.trid,
              content: {
                content: img.blockId,
                otherField: `纬度:${img.latitude || '未知'}, 经度:${img.longitude || '未知'}, 高程:${img.altitude || '未知'}`
              }
            })
          };

          // 使用uni.uploadFile统一处理上传（跨平台支持）
          await new Promise((resolve, reject) => {
            uni.uploadFile({
              url: 'https://leaf.yuntong.work:1314/dataCollection/upload',
              filePath: img.url,
              name: 'file',
              formData,
              header: {
                'Authorization': uni.getStorageSync('token') || ''
              },
              // 监听上传进度
              onProgressUpdate: (progress) => {
                img.progress = progress.progress;
              },
              success: (res) => {
                if (res.statusCode === 200) {
                  resolve(res);
                } else {
                  reject(new Error(`上传失败：${res.statusCode}`));
                }
              },
              fail: (err) => {
                reject(new Error(`上传失败：${err.errMsg}`));
              }
            });
          });

          // 上传成功后处理
          img.uploadStatus = 'uploaded';
          img.selected = false;
          uni.showToast({ title: '上传成功', icon: 'success' });

          // 模拟结算进度
          const timer = setInterval(() => {
            img.progress += 20;
            if (img.progress >= 100) {
              clearInterval(timer);
              img.uploadStatus = 'settled';
              img.showProgress = false;
              uni.setStorageSync(`localImages_${this.task.id}`, this.images);
              uni.showToast({ title: '已结算', icon: 'none' });
            }
          }, 1000);

        } catch (err) {
          console.error('上传失败:', err);
          uni.showToast({ title: err.message || '上传失败', icon: 'none' });
          img.showProgress = false;
        } finally {
          uni.hideLoading();
        }
      }
    },

    // 查看结果
    viewResult(img) {
      if (img.uploadStatus !== 'settled') {
        uni.showToast({ title: '仅支持查看已结算影像', icon: 'none' });
        return;
      }
      uni.navigateTo({
        url: `/pages/result/result?id=${this.task.id}&type=${this.taskType}&trid=${this.trid}`
      });
    },

    // 从图库选择图片（增加API存在检查）
    async chooseFromAlbum() {
      // 检查相册权限（仅App端）
      if (process.env.UNI_PLATFORM === 'app' && typeof uni.getSetting === 'function') {
        try {
          const auth = await uni.getSetting();
          if (!auth.authSetting['scope.album']) {
            uni.showToast({ title: '请先授予相册权限', icon: 'none' });
            return;
          }
        } catch (err) {
          console.error('检查相册权限失败:', err);
          // 权限检查失败仍尝试打开相册
        }
      }

      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.newImageUrl = res.tempFilePaths[0];
          this.showPopup = true;

          // 预获取定位（表型采集类型）
          if (this.taskType === 'phenotype' || this.taskType==='roast') {
            this.getLocationForImage();
          }
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.showToast({ title: '选择图片失败', icon: 'none' });
        }
      });
    },

 async getLocationForImage() {
   try {
     await this.requestLocationPermission();
     const res = await uni.getLocation({ type: 'wgs84' });
 
     this.longitude = res.longitude?.toFixed(6) || '';
     this.latitude = res.latitude?.toFixed(6) || '';
     if (!this.formAltitude) {
       this.formAltitude = (res.altitude || 0).toFixed(2);
     }
   } catch (err) {
     console.error('getLocation fail:', err);
     if (err.errMsg?.includes('denied')) {
       uni.showModal({
         title: "定位权限被拒绝",
         content: "请在设置中开启定位权限",
         showCancel: false
       });
     } else {
       uni.showToast({ title: "获取定位失败", icon: "none" });
     }
   }
 },



    // 提交弹窗信息
    submitPopup() {
      const newImg = {
        id: Date.now(),
        url: this.newImageUrl,
        uploadStatus: 'notUploaded',
        selected: false,
        altitude: this.formAltitude,
        blockId: this.formBlockId,
        longitude: this.longitude,
        latitude: this.latitude,
        progress: 0,
        showProgress: false
      };

      this.images.push(newImg);
      this.resetPopup();
      uni.setStorageSync(`localImages_${this.task.id}`, this.images);
      uni.showToast({ title: '添加成功', icon: 'success' });
    },

    // 取消弹窗
    cancelPopup() {
      this.resetPopup();
    },

    // 重置弹窗
    resetPopup() {
      this.showPopup = false;
      this.newImageUrl = '';
      this.formAltitude = '';
      this.formBlockId = '';
      this.longitude = '';
      this.latitude = '';
    },

    // 删除影像
    deleteImage(idx) {
      this.images.splice(idx, 1);
      uni.setStorageSync(`localImages_${this.task.id}`, this.images);
    },

    // 采集图像
    addImages() {
      const that = this;
      uni.navigateTo({
        url: `/pages/collect/collect?type=${this.taskType}&plotId=${this.task.position}`,
        events: {
          imageAdded: (img) => {
            console.log('收到 imageAdded:', img);
            that.newImageUrl = img.url;
            that.formBlockId = img.blockId || '';
            that.formAltitude = img.altitude || '';
            that.longitude = img.longitude || '';
            that.latitude = img.latitude || '';
            that.showPopup = true;
          }
        }
      });
    }

	
  }
};

</script>

<style scoped>
/* 样式保持不变 */
.container {
  padding: 20rpx;
}

.status-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
}
.status-btn {
  flex: 1;
  margin: 0 10rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #e0e0e0;
  color: #000000;
  text-align: center;
  border-radius: 20rpx;
  font-size: 28rpx;
}
.status-btn.active {
  background: rgba(148, 166, 66, 1);
  color: #000000;
}
.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  color: #000;
}
.info-item {
  display: flex;
  margin-bottom: 20rpx;
}
.info-label {
  font-size: 28rpx;
  color: #555;
  width: 140rpx;
}
.info-value {
  font-size: 28rpx;
  color: #333;
}
.images-scroll {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 10rpx;
  box-sizing: border-box;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-start;
}

.image-item {
  width: 200rpx;
  margin-bottom: 20rpx;
  margin-left: 20rpx;
}

.image-wrapper {
  position: relative;
  border: 4rpx solid transparent;
  border-radius: 12rpx;
  overflow: hidden;
}

.image-wrapper.selected {
  border-color: #007AFF;
}

.thumb-image {
  width: 100%;
  height: 200rpx;
  background-color: #ddd;
  border-radius: 8rpx;
}

.status-text {
  font-size: 24rpx;
  color: #666;
  text-align: center;
  margin-top: 10rpx;
}

.ops-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  height: 30px;
}

.op-btn {
  font-size: 24rpx;
  border-radius: 8rpx;
  color: #000;
  border: none;
}

.op-btn:disabled {
  background-color: #ccc;
  color: #fff;
}

.btn-delete {
  background: rgba(250, 165, 165, 1);
  color: #333;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-card {
  width: 80%;
  background: #fff;
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.2);
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
}

.popup-field {
  margin-bottom: 30rpx;
  font-size: 28rpx;
}

.popup-field input {
  width: 100%;
  border: 1px solid #ccc;
  padding: 10rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}
</style>