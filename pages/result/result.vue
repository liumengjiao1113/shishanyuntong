<template>
  <view class="container">
    <!-- 统一图片展示区域 -->
    <!-- <view class="image-container">
      <image class="result-image" :src="addTimestamp(mainImage)" mode="aspectFill" />
    </view> -->
    
	<view class="image-container">
	  <image class="result-image" v-if="taskType === 'phenotype'" src="/static/text1.jpg" />
	</view>
	<view class="image-container">
	  <image class="result-image" v-if="taskType === 'roast'" src="/static/text2.jpg" />
	</view>
    <!-- 信息展示区域 -->
    <view class="info-container">
      <view class="info-grid">
        <!-- 表型采集特有信息 -->
        <view class="info-item" v-if="taskType === 'phenotype'"><text>经度：</text>{{ longitude || '120.1234' }}</view>
        <view class="info-item" v-if="taskType === 'phenotype'"><text>纬度：</text>{{ latitude || '30.1234' }}</view>
        <view class="info-item" v-if="taskType === 'phenotype'"><text>高程：</text>{{ altitude || '50m' }}</view>
        <view class="info-item" v-if="taskType === 'phenotype'"><text>小区 ID：</text>{{ plotId || 'A-01' }}</view>
        
        <view class="info-item" v-if="taskType === 'phenotype'">
          <text>株高：</text>{{ plantHeight || '81.85433197cm' }}
        </view>
        <view class="info-item" v-if="taskType === 'phenotype'">
          <text>茎粗：</text>{{ stemDiameter || '3cm' }}
        </view>
        <view class="info-item" v-if="taskType === 'phenotype'">
          <text>叶夹角：</text>{{ leafAngle || '162.320892333°' }}
        </view>
        <view class="info-item" v-if="taskType === 'phenotype'">
          <text>穗位高：</text>{{ earHeight || '0cm' }}
        </view>
        
        <!-- 玉米烤种特有信息 -->
		
       <!-- <view class="info-item" v-if="taskType === 'roast'">
          <text>玉米ID：</text>
		  <uni-data-checkbox v-model="roastid" :localdata="idOptions" @change="handleIdChange"  placeholder="请选择玉米ID"></uni-data-checkbox>
         <uni-select v-model="roastid" :localdata="idOptions" @change="handleIdChange" placeholder="请选择玉米ID" />
        </view> -->
	<!-- 	<view class="info-item" v-if="taskType === 'roast'">
		  <text>玉米ID：</text>
		  <uni-data-select
		    v-model="roastid"
		    :localdata="idOptions"
		    placeholder="请选择玉米ID"
		    @change="handleIdChange"
		  />
		</view> -->
		<view class="info-item" v-if="taskType === 'roast'">
		  <text>玉米ID：</text>
		  <picker :range="idOptions" range-key="text" @change="onPickerChange">
		    <view class="picker-input">{{ selectedCornText }}</view>
		  </picker>
		</view>


        <view class="info-item" v-if="taskType === 'roast'">
          <text>品种：</text>{{ roasttype || '请选择玉米ID' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>玉米类型：</text>{{ cornType || '未知' }} (占比: {{ proportion || '0' }})
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>玉米尺寸：</text>{{ size || '0x0像素' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>硬粒型籽粒：</text>{{ hardGrainCount || '0粒' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>马齿型籽粒：</text>{{ 马齿GrainCount || '0粒' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>籽粒总计：</text>{{ grainCount || '0粒' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>长度：</text>{{ length || '15cm' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>宽度：</text>{{ width || '3cm' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>籽粒种类：</text>{{ grainType || '普通型' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>行数：</text>{{ rowCount || '8行' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>患病概率：</text>{{ diseaseRate || '5%' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>列数：</text>{{ columnCount || '16列' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>排列方式：</text>{{ arrangement || '规则排列' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>形状：</text>{{ shape || '椭圆形' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>顶面大小：</text>{{ topSize || '中等' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>颜色：</text>{{ color || '黄色' }}
        </view>
        <view class="info-item" v-if="taskType === 'roast'">
          <text>侧面大小：</text>{{ sideSize || '中等' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '@/components/request.js'
export default {
  data() {
    return {
      taskType: '',
      dataId: '',
      trId: '',
      mainImage: '',
      longitude: '',
      latitude: '',
      altitude: '',
      plotId: '',
      plantHeight: '',
      stemDiameter: '',
      leafAngle: '',
      earHeight: '',
      value: 0,
      range: [{ value: 1 }, { value: 2 }],
      roasttype: '',
      roastid: '',
      length: '',
      grainCount: '',
      width: '',
      grainType: '',
      rowCount: '',
      diseaseRate: '',
      columnCount: '',
      arrangement: '',
      shape: '',
      topSize: '',
      color: '',
      sideSize: '',
      idOptions: [ { value: 'pp2_0', text: '玉米ID: pp2_0' },
      { value: 'pp2_1', text: '玉米ID: pp2_1' },
	  { value: 'pp2_2', text: '玉米ID: pp2_2' },
	  { value: 'pp2_3', text: '玉米ID: pp2_3' },
	  { value: 'pp2_4', text: '玉米ID: pp2_4' },
	  ],
      cornType: '',       // 玉米类型
      proportion: '',     // 类型占比
      size: '',           // 玉米尺寸
      hardGrainCount: '', // 硬粒型籽粒数
      马齿GrainCount: '', // 马齿型籽粒数
	   selectedCornText: '1',
    };
  },
  onLoad(options) {
    console.log('页面参数:', options);
    this.taskType = options.type || 'phenotype';
    this.dataId = options.dataId || 'pp2_0'; // 使用字符串ID
    this.trId = options.trid || '';
    console.log('当前数据项ID:', this.dataId);
    this.init();
  },

  methods: {
    // 玉米ID选择事件处理
    handleIdChange(e) {
      const selectedId = e;
      this.roastid = selectedId;
      const mockData = this.getMockData(selectedId);
      
      // 更新所有相关数据
      this.roasttype = mockData.type;
      this.cornType = mockData.cornType;
      this.proportion = mockData.proportion;
      this.size = mockData.size;
      this.hardGrainCount = `${mockData.hardGrains}粒`;
      this.马齿GrainCount = `${mockData.softGrains}粒`;
      this.grainCount = `${mockData.totalGrains}粒`;
      this.length = `${mockData.lengthCm}cm`;
      this.width = `${mockData.widthCm}cm`;
      this.grainType = mockData.grainType;
      
      // 同步更新其他字段
      this.rowCount = '8行';
      this.diseaseRate = '5%';
      this.columnCount = '16列';
      this.arrangement = '规则排列';
      this.shape = '椭圆形';
      this.topSize = '中等';
      this.color = '黄色';
      this.sideSize = '中等';
    },
    
    // 初始化虚拟数据选项
    initMockOptions() {
      this.idOptions = [
        { value: 'pp2_0', text: '1' },
        { value: 'pp2_1', text: '2' },
        { value: 'pp2_2', text: '3' },
        { value: 'pp2_3', text: '4' },
        { value: 'pp2_4', text: '5' }
      ];
    },
    
	  onPickerChange(e) {
	    const index = e.detail.value;
	    const selected = this.idOptions[index];
	    this.roastid = selected.value;
	    this.selectedCornText = selected.text;
	    this.handleIdChange(this.roastid);
	  },
    // 从服务器加载数据
    loadDataFromServer(id) {
      // 服务器数据示例（实际需根据接口调整）
      const mockServerData = {
        'pp2_0': { 
          type: '混合类型', 
          cornType: '混合类型', 
          proportion: '0.57',
          size: '615.09x176.56像素',
          hardGrains: 77,
          softGrains: 102,
          totalGrains: 179,
          lengthCm: 61.51,
          widthCm: 17.66,
          grainType: '硬粒型+马齿型'
        },
        'pp2_1': { 
          type: '硬粒型', 
          cornType: '硬粒型', 
          proportion: '0.74',
          size: '566.26x160.03像素',
          hardGrains: 102,
          softGrains: 36,
          totalGrains: 138,
          lengthCm: 56.63,
          widthCm: 16.00,
          grainType: '硬粒型'
        },
        'pp2_2': { 
          type: '硬粒型', 
          cornType: '硬粒型', 
          proportion: '0.89',
          size: '603.55x153.03像素',
          hardGrains: 191,
          softGrains: 23,
          totalGrains: 214,
          lengthCm: 60.36,
          widthCm: 15.30,
          grainType: '硬粒型'
        },
        'pp2_3': { 
          type: '硬粒型', 
          cornType: '硬粒型', 
          proportion: '0.95',
          size: '532.23x168.36像素',
          hardGrains: 106,
          softGrains: 5,
          totalGrains: 111,
          lengthCm: 53.22,
          widthCm: 16.84,
          grainType: '硬粒型'
        },
        'pp2_4': { 
          type: '硬粒型', 
          cornType: '硬粒型', 
          proportion: '0.97',
          size: '524.67x156.08像素',
          hardGrains: 166,
          softGrains: 5,
          totalGrains: 171,
          lengthCm: 52.47,
          widthCm: 15.61,
          grainType: '硬粒型'
        }
      };
      
      const data = mockServerData[id] || this.getMockData(id);
      this.updateAllFields(data);
    },
    
    // 加载虚拟数据
    loadMockData(id) {
      const mockData = this.getMockData(id);
      this.updateAllFields(mockData);
    },
    
    // 统一更新所有字段
    updateAllFields(data) {
      this.roasttype = data.type;
      this.cornType = data.cornType;
      this.proportion = data.proportion;
      this.size = data.size;
      this.hardGrainCount = `${data.hardGrains}粒`;
      this.马齿GrainCount = `${data.softGrains}粒`;
      this.grainCount = `${data.totalGrains}粒`;
      this.length = `${data.lengthCm}cm`;
      this.width = `${data.widthCm}cm`;
      this.grainType = data.grainType;
    },
    
    // 获取虚拟数据
    getMockData(id) {
      const mockDataMap = {
        'pp2_0': {
          type: '混合类型',
          cornType: '混合类型',
          proportion: '0.57',
          size: '615.09x176.56像素',
          hardGrains: 77,
          softGrains: 102,
          totalGrains: 179,
          lengthCm: (615.09 / 10).toFixed(2),
          widthCm: (176.56 / 10).toFixed(2),
          grainType: '硬粒型+马齿型'
        },
        'pp2_1': {
          type: '硬粒型',
          cornType: '硬粒型',
          proportion: '0.74',
          size: '566.26x160.03像素',
          hardGrains: 102,
          softGrains: 36,
          totalGrains: 138,
          lengthCm: (566.26 / 10).toFixed(2),
          widthCm: (160.03 / 10).toFixed(2),
          grainType: '硬粒型'
        },
        'pp2_2': {
          type: '硬粒型',
          cornType: '硬粒型',
          proportion: '0.89',
          size: '603.55x153.03像素',
          hardGrains: 191,
          softGrains: 23,
          totalGrains: 214,
          lengthCm: (603.55 / 10).toFixed(2),
          widthCm: (153.03 / 10).toFixed(2),
          grainType: '硬粒型'
        },
        'pp2_3': {
          type: '硬粒型',
          cornType: '硬粒型',
          proportion: '0.95',
          size: '532.23x168.36像素',
          hardGrains: 106,
          softGrains: 5,
          totalGrains: 111,
          lengthCm: (532.23 / 10).toFixed(2),
          widthCm: (168.36 / 10).toFixed(2),
          grainType: '硬粒型'
        },
        'pp2_4': {
          type: '硬粒型',
          cornType: '硬粒型',
          proportion: '0.97',
          size: '524.67x156.08像素',
          hardGrains: 166,
          softGrains: 5,
          totalGrains: 171,
          lengthCm: (524.67 / 10).toFixed(2),
          widthCm: (156.08 / 10).toFixed(2),
          grainType: '硬粒型'
        }
      };
      return mockDataMap[id] || mockDataMap['pp2_0'];
    },
    
    // 添加时间戳避免图片缓存
    addTimestamp(url) {
      if (!url || url.startsWith('data:')) return url;
      return url + (url.includes('?') ? '&' : '?') + Date.now();
    },
    
    async init() {
      try {
        const token = uni.getStorageSync('token');
        const res = await request({
          url: `/dataCollection/getList?trId=${this.trId}`,
          method: 'GET',
          header: {
            'Authorization': token || '',
            'Content-Type': 'application/json'
          },
        });

        if (res.code === 200) {
          const resultList = res.data;
          console.log('所有数据项:', resultList);

          // 根据返回数据中的id匹配
          let targetData = resultList.find(item => item.id + '' === this.dataId);
          
          if (!targetData) {
         
            this.initMockOptions();
            this.loadMockData(this.dataId);
            return;
          }
          
          console.log('匹配到的数据项:', targetData);
          const acm = targetData.answerContentMap || {};
          const cm = targetData.contentMap || {};
          this.mainImage = acm.图片 || acm.url || cm.url || '@/static/img/pp2.jpg';
          // this.mainImage = acm.图片 || acm.url || cm.url || 'https://via.placeholder.com/400x300?text=暂无图片';
          this.longitude = acm.经度 || cm.longitude;
          this.latitude = acm.纬度 || cm.latitude;
          this.altitude = acm.高程 || cm.altitude;
          this.plotId = cm.blockId;
          
          if (this.taskType === 'phenotype') {
            this.plantHeight = acm.株高;
            this.stemDiameter = acm.茎粗;
            this.leafAngle = acm.叶夹角;
            this.earHeight = acm.穗位高;
          }
          
          if (this.taskType === 'roast') {
            this.roastid = acm.玉米id || this.dataId;
            this.roasttype = acm.玉米品种 || this.getMockType(this.dataId);
            this.length = acm.长度;
            this.grainCount = acm.籽粒数量;
            this.width = acm.宽度;
            this.grainType = acm.籽粒种类;
            this.rowCount = acm.行数;
            this.diseaseRate = acm.患病概率;
            this.columnCount = acm.列数;
            this.arrangement = acm.排列方式;
            this.shape = acm.形状;
            this.topSize = acm.顶面大小;
            this.color = acm.颜色;
            this.sideSize = acm.侧面大小;
            
            // 补充分类结果数据
            this.cornType = acm.玉米类型 || '未知';
            this.proportion = acm.类型占比 || '0';
            this.size = acm.玉米尺寸 || '0x0像素';
            this.hardGrainCount = acm.硬粒型籽粒 || '0粒';
            this.马齿GrainCount = acm.马齿型籽粒 || '0粒';
            
            if (!this.roastid || !this.roasttype) {
              this.supplementMockData(this.dataId);
            }
          }
        } else {
          // uni.showToast({ title: '数据获取失败，使用虚拟数据', icon: 'none' });
          this.initMockOptions();
          this.loadMockData(this.dataId);
        }
      } catch (err) {
        console.error('请求失败:', err);
        // uni.showToast({ title: '加载失败，使用虚拟数据', icon: 'none' });
        this.initMockOptions();
        this.loadMockData(this.dataId);
      }
    },
    
    // 补充不完整的烤种数据
    supplementMockData(id) {
      const mockData = this.getMockData(id);
      
      if (!this.roastid) this.roastid = id;
      if (!this.roasttype) this.roasttype = mockData.type;
      if (!this.length) this.length = `${mockData.lengthCm}cm`;
      if (!this.width) this.width = `${mockData.widthCm}cm`;
      if (!this.grainCount) this.grainCount = `${mockData.totalGrains}粒`;
      if (!this.grainType) this.grainType = mockData.grainType;
      if (!this.cornType) this.cornType = mockData.cornType;
      if (!this.proportion) this.proportion = mockData.proportion;
      if (!this.size) this.size = mockData.size;
      if (!this.hardGrainCount) this.hardGrainCount = `${mockData.hardGrains}粒`;
      if (!this.马齿GrainCount) this.马齿GrainCount = `${mockData.softGrains}粒`;
    },
    
    // 根据ID获取默认类型
    getMockType(id) {
      const mockTypes = {
        'pp2_0': '混合类型',
        'pp2_1': '硬粒型',
        'pp2_2': '硬粒型',
        'pp2_3': '硬粒型',
        'pp2_4': '硬粒型'
      };
      return mockTypes[id] || '普通型';
    }
  }
}
</script>

<style scoped>
	.picker-input {
	  width: 100%;
	  padding: 10rpx;
	  background-color: #fff;
	  border: 1px solid #ddd;
	  border-radius: 8rpx;
	  color: #333;
	}

.container {
  padding: 20rpx;
}

.image-container {
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.result-image {
  width: 100%;
  height: 400rpx;
  background: #eee;
  display: block;
}

.info-container {
  background: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
}

.info-item {
  font-size: 28rpx;
  margin-bottom: 20rpx;
  color: #333;
  width: 50%;
  display: flex;
  align-items: center;
  padding: 0 10rpx;
  box-sizing: border-box;
}

.info-item text {
  font-weight: bold;
  margin-right: 10rpx;
  color: #666;
}

.info-item uni-select {
  width: 100%;
}

@media (max-width: 375px) {
  .info-item {
    font-size: 26rpx;
  }
}
</style>