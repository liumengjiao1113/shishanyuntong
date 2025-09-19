<template>
  <view class="container">
    <!-- 背景图作为层级最低层 -->
    <image class="bg-img" src="/static/bg.jpg" mode="aspectFill" />

    <view class="img-a">
      <view class="t-b">狮山云瞳</view>
      <view class="t-c">双目智采秒析玉米表型，一键开启智慧育种新范式！</view>
    </view>

    <view class="logo">
      <image 
        :src="logoUrl" 
        alt="狮山云瞳logo" 
        mode="aspectFill" 
        class="logo-img" 
        @load="onLogoLoad" 
        @error="onLogoError"
      />
    </view>

    <view class="login-view">
      <view class="t-login">
        <form class="cl">
          <view class="t-a">
            <input type="text" name="phone" placeholder="请输入您的用户名" maxlength="11" v-model="phone" />
          </view>
          <view class="t-a">
            <input type="password" name="code" maxlength="18" placeholder="请输入您的密码" v-model="pwd" />
          </view>
          <button @tap="login()">登 录</button>
        </form>
      </view>
    </view>
  </view>
</template>


<script>
import { request } from '@/components/request.js'
export default {
	data() {
		return {
			phone: '', // 用户名
			pwd: '', // 密码
			logoUrl: '/static/logo.jpg', // 确保图片路径正确（区分大小写）
			systemInfo: {}
		};
	},
	onLoad() {
		this.calculateLayout();
		uni.getSystemInfo({
			success: (res) => {
				this.systemInfo = res;
				console.log('系统信息:', res); // 调试用
			}
		});
		uni.onWindowResize((res) => {
			this.systemInfo = res;
			this.calculateLayout();
		});
	},
	methods: {
		calculateLayout() {
			// 可根据屏幕宽度动态调整logo大小（可选优化）
			// if (this.systemInfo.windowWidth) {
			//   const logoSize = this.systemInfo.windowWidth * 0.3; // 占屏幕宽度30%
			//   this.logoStyle = { width: `${logoSize}px`, height: `${logoSize}px` };
			// }
		},
		async login() {
			// 登录逻辑保持不变
			if (!this.phone) {
				uni.showToast({ title: '请输入您的用户名', icon: 'none' });
				return;
			}
			if (!this.pwd) {
				uni.showToast({ title: '请输入您的密码', icon: 'none' });
				return;
			}
			try {
				const res = await request({
					url: '/user/login',
					method: 'POST',
					data: {
						username: this.phone,
						password: this.pwd
					}
				});
				if (res.code === 200 || res.status === 'success') {
					uni.setStorageSync('token', res.data);
					uni.showToast({ title: '登录成功', icon: 'none', duration: 1000 });
					setTimeout(() => {
						uni.reLaunch({ url: '/pages/index/index' });
					}, 1000);
				} else {
					uni.showToast({ title: res.message || '登录失败，请检查用户名和密码', icon: 'none' });
				}
			} catch (error) {
				uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' });
				console.error('登录失败:', error);
			}
		},
		// 图片加载成功回调（调试用）
		onLogoLoad(e) {
			console.log('logo加载成功', e);
		},
		// 图片加载失败回调（关键调试）
		onLogoError(e) {
			console.error('logo加载失败:', e);
			// 失败时尝试备用路径（如果有）
			// this.logoUrl = '/static/logo-backup.png';
		}
	}
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bg-img {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1; /* 让背景图位于所有内容之下 */
}

.img-a {
	padding-top: 80rpx;
	width: 100%;
	height: 200rpx;
	margin-left: 40rpx;
	display: flex;
	flex-direction: column;
}
.img-a .t-c{
	font-size: 28rpx;
	font-weight: 400;
	line-height: 40rpx;
	color: rgba(56, 56, 56, 1);
	text-align: left;
}
.logo{
	margin: 0 auto;
	margin-top: 30rpx;
	margin-bottom: 70rpx;
	width: 200rpx;
	height: 200rpx;
	opacity: 1;
	border-radius: 50%;
	background: rgba(250, 239, 210, 1);
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	/* 调试用：添加边框确认容器位置 */
	/* border: 1px solid red; */
}
.logo-img {
	width: 100%;
	height: 100%;
	object-fit: cover; /* 确保图片填满容器且不变形 */
}
/* 其余样式保持不变 */
.login-view {
	width: 100%;
	position: relative;
	flex: 1;
	display: flex;
	align-items: center;
}
.t-login {
	width: 80%;
	max-width: 600rpx;
	margin: 0 auto;
	font-size: 28rpx;
	padding-top: 40rpx;
}
.t-login button {
	font-size: 28rpx;
	color: #fff;
	height: 90rpx;
	line-height: 90rpx;
	font-weight: bold;
	width: 100%;
	border-radius: 45rpx;
	background: rgba(148, 166, 66, 1);
	margin-top: 60rpx;
}
.t-login input {
	height: 90rpx;
	line-height: 90rpx;
	margin-bottom: 60rpx;
	border-bottom: 1px solid #e9e9e9;
	font-size: 28rpx;
	border-radius: 45rpx;
	background: rgb(232, 240, 254);
	padding: 0 30rpx;
}
.t-b {
	width: 200rpx;
	height: 70rpx;
	font-size: 48rpx;
	font-weight: 700;
	line-height: 70rpx;
	color: rgba(0, 0, 0, 1);
	text-align: left;
}
</style>