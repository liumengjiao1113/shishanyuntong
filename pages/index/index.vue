<template>
  <view class="container">
    <!-- 遍历所有任务分类 -->
    <view v-for="category in taskCategories" :key="category.id" class="category-wrapper">


      <view class="category-card" @click="toggleCategory(category.id)">
        <text class="category-title">{{ category.name }}</text>
        <view class="arrow" :class="{ 'is-open': activeCategoryId === category.id }"></view>
      </view>
      
      <!-- 这是任务列表 (来自旧的 task-list.vue), 只有当分类展开时才显示 -->
    <view v-if="activeCategoryId === category.id" class="task-list-container">
        <view v-if="!category.tasks || !category.tasks.length" class="task-card empty">
          暂无任务
        </view>
        <view v-else v-for="task in category.tasks" :key="task.id" class="task-card" @click="goToDetail(task, category.value)">
          <text class="task-title">{{ task.taskName }}</text>
        </view>
      </view>
		<view v-if="activeCategoryId === category.id" class="task-list-container">
		        <view v-if="category.loading" class="task-card empty">
		          加载中...
		        </view>
		        <view v-else-if="category.error" class="task-card empty">
		          加载失败: {{ category.error }}
		        </view>
		         <view v-else-if="!category.tasks || !category.tasks.length" class="task-card empty">
		          暂无任务
		        </view>
		       <!-- <view v-else v-for="task in category.tasks" :key="task.id" class="task-card" @click="goToDetail(task, category.value)">
		          <text class="task-title">{{ task.taskName }}</text>
		        </view> -->
		      </view>
    </view>
  </view>
  <CustomTabBar current="index" />
</template>

<script>
import CustomTabBar from '@/components/tabBar/tabBar.vue'
import { request } from '../../components/request'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      // 合并后的数据结构
      taskCategories: [
        {
          id: 1,
          name: '表型采集',
          value: 'phenotype',
          tasks: [
          ],
          loading: false,
          error: null
        },
        {
          id: 2,
          name: '玉米拷种',
          value: 'roast',
          tasks: [],
          loading: false,
          error: null
        },
        {
          id: 3,
          name: '其他',
          value: 'other',
          tasks: [],
          loading: false,
          error: null
        }
      ],
      activeCategoryId: null
    }
  },
  methods: {
    // 展开/收起分类
    async toggleCategory(categoryId) {
      if (this.activeCategoryId === categoryId) {
        this.activeCategoryId = null
        return
      }

      this.activeCategoryId = categoryId

      const category = this.taskCategories.find(c => c.id === categoryId)
      if (!category) return

      // 如果已有数据或正在加载，则不重复请求
      if (category.tasks.length > 0 || category.loading) return

      await this.fetchTasks(category)
    },

    async fetchTasks(category) {
      category.loading = true
      category.error = null

      try {
        const res = await request({
          url: '/task/getTask',
          method: 'GET',
          header: {
            'Authorization':  uni.getStorageSync('token')||'',
            'Content-Type': 'application/json'
          },
          data: {
            typeId: category.id
          }
        })

        category.tasks = res.data
      } catch (error) {
        console.error('获取任务失败:', error)
        category.error = error.message || '获取任务失败，请稍后重试'
      } finally {
        category.loading = false
      }
    },

    // 跳转到任务详情页
    goToDetail(task, typeValue) {
      uni.navigateTo({
        url: `/pages/task-detail/task-detail?id=${task.id}&type=${typeValue}`
      })
    }
  }
}
</script>


<style scoped>
.container {
  padding: 50rpx 30rpx 120rpx;
  background: rgba(239, 242, 235, 1);
  height: 100vh;
}

.category-wrapper {
  margin-bottom: 30rpx;
}

.category-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ghostwhite;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
  background: rgba(148, 166, 66, 0.9);
  color: #fff;
}

.category-title {
  font-size: 48rpx;
  font-weight: bold;
}


.arrow {
  border: solid #555;
  border-width: 0 4rpx 4rpx 0;
  display: inline-block;
  padding: 8rpx;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.arrow.is-open {
  transform: rotate(-135deg);
}

.task-list-container {
  margin-top: -15rpx;
  padding-top: 25rpx; 
  background-color: #ffffff;
  border-radius: 0 0 16rpx 16rpx;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.01);
  animation: slideDown 0.3s ease-out; 
}

.task-card {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  border-bottom:black;
  text-align: center ;
}

.task-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}


.task-card.empty {
  color: #999;
  border: 1rpx dashed #ddd;
}


@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>