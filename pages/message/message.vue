<template>
  <view class="container">
    <view class="card">
      <text class="label">账号：</text>
      <text class="value">{{ userInfo.username }}</text>
    </view>
	<view class="card">
      <text class="label">密码：</text>
      <text class="value">{{ userInfo.password }}</text>
    </view>

    <button class="btn btn-danger" @click="logout">退出登录</button>
    
  </view>
  <CustomTabBar current="message" />
</template>

<script>
import CustomTabBar from '@/components/tabBar/tabBar.vue'
import { request } from '../../components/request.js'
export default {
  components: { CustomTabBar },
  data() {
    return {
      userInfo: {
        username: '',
        password: '' // 密码通常不返回明文，这里做默认处理
      }
    }
  },
  async onLoad() { // 修正生命周期函数名
    const token = uni.getStorageSync('token');
    // 判断是否有token，没有则跳转登录
    if (!token) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
    try {
      const res = await request({
        url: '/user/getUserInfo',
        method: 'GET',
        header: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      })
      // 注意要使用this访问组件实例属性
      this.userInfo.username = res.data.username || ''
      // 密码通常不返回明文，这里仅做展示处理
      this.userInfo.password = res.data.password ? '******' : ''
    } catch (error) {
      console.error('获取信息失败:', error)
      // 接口报错时清除token并跳转登录
      uni.clearStorageSync('token')
      uni.reLaunch({ url: '/pages/login/login' })
    }
  },
  methods: {
    logout() {
      uni.showModal({
        title: '提示',
        content: '确认退出登录？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地缓存
           uni.removeStorageSync('token');
             uni.showToast({
               title: '退出登录成功',
               icon:'success'
             });
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  padding-bottom: 120rpx;
background-color: rgb(239, 242, 235);
  min-height: 100vh;
  box-sizing: border-box;
}
.card {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-size: 28rpx;
  color: #333;
}
.value {
  font-size: 28rpx;
  color: #666;
}

.btn-danger {
 background: rgba(148, 166, 66, 0.9);
 color: #fff;
}
</style>
