<template>
  <view class="container">
    <!-- 表型采集 -->
    <view v-if="taskType === 'phenotype'">
      <!-- 双目相机图像展示 -->
      <view class="camera-preview">
        <image :src="leftImage" class="camera-image" mode="aspectFill" />
        <image :src="rightImage" class="camera-image" mode="aspectFill" />
      </view>

      <!-- 图像信息 -->
      <view class="info-panel">
        <view class="info-item"><text>经度：</text>{{ longitude }}</view>
        <view class="info-item"><text>纬度：</text>{{ latitude }}</view>
        <view class="info-item"><text>高程：</text>{{ altitude }}</view>
        <view class="info-item"><text>小区 ID：</text>{{ plotId }}</view>
      </view>
    </view>

    <!-- 玉米烤种 -->
    <view v-else-if="taskType === 'roast'">
      <!-- 图像展示 -->
      <view class="image-preview">
        <image :src="imageSrc" class="display-image" mode="aspectFill" />
		    
		      
      </view>
    </view>

    <!-- 操作按钮（通用） -->
    <view class="button-group">
      <button @click="takePhoto">拍照</button>
      <button @click="confirmAndSend">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      taskType: '',

      // 表型采集
      leftImage: '/static/placeholder-left.jpg',
      rightImage: '/static/placeholder-right.jpg',
      longitude: '',
      latitude: '',
      altitude: '',
      plotId: 'A-01',

      // 玉米烤种
      imageSrc: '',
      tempImagePaths: {
        left: '',
        right: '',
        single: ''
      },

      // 页面间通信
      eventChannel: null
    };
  },

  onLoad(options) {
    this.taskType = options.type || 'phenotype';
    this.plotId = options.plotId || 'A-01';

    // 预先获取 eventChannel
    this.eventChannel = this.getOpenerEventChannel?.();
  },

  methods: {
    // 拍照方法
   takePhoto() {
     const getLocation = () => {
       return new Promise((resolve, reject) => {
         uni.getLocation({
           type: 'wgs84',
           success: resolve,
           fail: reject
         });
       });
     };
   
     if (this.taskType === 'phenotype') {
       uni.chooseImage({
         count: 2,
         sourceType: ['camera'],
         success: async (res) => {
           this.leftImage = res.tempFilePaths[0];
           this.rightImage = res.tempFilePaths[1] || res.tempFilePaths[0];
           this.tempImagePaths.left = res.tempFilePaths[0];
           this.tempImagePaths.right = res.tempFilePaths[1] || res.tempFilePaths[0];
   
           try {
             const loc = await getLocation();
             this.longitude = loc.longitude?.toFixed(6) || '';
             this.latitude = loc.latitude?.toFixed(6) || '';
             this.altitude = (loc.altitude || 0).toFixed(2);
           } catch (err) {
             console.warn('定位失败：', err);
             uni.showToast({ title: '定位失败', icon: 'none' });
           }
         }
       });
     } else if (this.taskType === 'roast') {
       uni.chooseImage({
         count: 1,
         sourceType: ['camera'],
         success: async (res) => {
           this.imageSrc = res.tempFilePaths[0];
           this.tempImagePaths.single = res.tempFilePaths[0];
   
           try {
             const loc = await getLocation();
             this.longitude = loc.longitude?.toFixed(6) || '';
             this.latitude = loc.latitude?.toFixed(6) || '';
             this.altitude = (loc.altitude || 0).toFixed(2);
           } catch (err) {
             console.warn('定位失败：', err);
             uni.showToast({ title: '定位失败', icon: 'none' });
           }
         }
       });
     }
   },


  confirmAndSend() {
    const imageUrl = this.taskType === 'phenotype'
      ? this.tempImagePaths.left
      : this.tempImagePaths.single;
  
    if (!imageUrl) {
      uni.showToast({ title: '请先拍照', icon: 'none' });
      return;
    }
  
    if (!this.longitude || !this.latitude) {
      uni.showToast({ title: '定位失败', icon: 'none' });
      return;
    }
  
    const imageData = {
      id: Date.now(),
      url: imageUrl,
      blockId: this.plotId,
      longitude: this.longitude,
      latitude: this.latitude,
      altitude: this.altitude,
      uploadStatus: 'notUploaded',
      selected: false,
      progress: 0,
      showProgress: false
    };
  

    const eventChannel = this.getOpenerEventChannel?.();
    if (eventChannel) {
      eventChannel.emit('imageAdded', imageData);
    }
  
    uni.navigateBack();
  }

  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.camera-preview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
 
  
}
.camera-image {
  width: 48%;
  height: 500rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
}
.image-preview {
  width: 100%;
  height: 400rpx;
  background-color: #f0f0f0;
  margin-bottom: 40rpx;
  border-radius: 12rpx;
}
.display-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}
.info-panel {
  margin-top: 100rpx;
  font-size: 40rpx;
  color: #333;
  text-align: center;
}
.info-item {
  margin-bottom: 30rpx;
}
.button-group {
  margin-top: 90rpx;
  display: flex;
  justify-content: space-around;
}
button {
  width: 95%;
  height: 80rpx;
  font-size: 36rpx;
  background-color: #f8e620;
  color: black;
  border-radius: 12rpx;
}
/* 九宫格样式 */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.grid-line {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
}
.vertical-line-1 {
  width: 1px;
  height: 100%;
  left: 33.33%;
}
.vertical-line-2 {
  width: 1px;
  height: 100%;
  left: 66.66%;
}
.horizontal-line-1 {
  width: 100%;
  height: 1px;
  top: 33.33%;
}
.horizontal-line-2 {
  width: 100%;
  height: 1px;
  top: 66.66%;
}
.camera-container{
	position: relative;
}
</style>
