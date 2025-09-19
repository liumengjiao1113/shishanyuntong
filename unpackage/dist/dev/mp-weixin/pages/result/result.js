"use strict";
const common_vendor = require("../../common/vendor.js");
const components_request = require("../../components/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      taskType: "",
      dataId: "",
      trId: "",
      mainImage: "",
      longitude: "",
      latitude: "",
      altitude: "",
      plotId: "",
      plantHeight: "",
      stemDiameter: "",
      leafAngle: "",
      earHeight: "",
      value: 0,
      range: [{ value: 1 }, { value: 2 }],
      roasttype: "",
      roastid: "",
      length: "",
      grainCount: "",
      width: "",
      grainType: "",
      rowCount: "",
      diseaseRate: "",
      columnCount: "",
      arrangement: "",
      shape: "",
      topSize: "",
      color: "",
      sideSize: "",
      idOptions: [
        { value: "pp2_0", text: "玉米ID: pp2_0" },
        { value: "pp2_1", text: "玉米ID: pp2_1" },
        { value: "pp2_2", text: "玉米ID: pp2_2" },
        { value: "pp2_3", text: "玉米ID: pp2_3" },
        { value: "pp2_4", text: "玉米ID: pp2_4" }
      ],
      cornType: "",
      // 玉米类型
      proportion: "",
      // 类型占比
      size: "",
      // 玉米尺寸
      hardGrainCount: "",
      // 硬粒型籽粒数
      马齿GrainCount: "",
      // 马齿型籽粒数
      selectedCornText: "1"
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/result/result.vue:164", "页面参数:", options);
    this.taskType = options.type || "phenotype";
    this.dataId = options.dataId || "pp2_0";
    this.trId = options.trid || "";
    common_vendor.index.__f__("log", "at pages/result/result.vue:168", "当前数据项ID:", this.dataId);
    this.init();
  },
  methods: {
    // 玉米ID选择事件处理
    handleIdChange(e) {
      const selectedId = e;
      this.roastid = selectedId;
      const mockData = this.getMockData(selectedId);
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
      this.rowCount = "8行";
      this.diseaseRate = "5%";
      this.columnCount = "16列";
      this.arrangement = "规则排列";
      this.shape = "椭圆形";
      this.topSize = "中等";
      this.color = "黄色";
      this.sideSize = "中等";
    },
    // 初始化虚拟数据选项
    initMockOptions() {
      this.idOptions = [
        { value: "pp2_0", text: "1" },
        { value: "pp2_1", text: "2" },
        { value: "pp2_2", text: "3" },
        { value: "pp2_3", text: "4" },
        { value: "pp2_4", text: "5" }
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
      const mockServerData = {
        "pp2_0": {
          type: "混合类型",
          cornType: "混合类型",
          proportion: "0.57",
          size: "615.09x176.56像素",
          hardGrains: 77,
          softGrains: 102,
          totalGrains: 179,
          lengthCm: 61.51,
          widthCm: 17.66,
          grainType: "硬粒型+马齿型"
        },
        "pp2_1": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.74",
          size: "566.26x160.03像素",
          hardGrains: 102,
          softGrains: 36,
          totalGrains: 138,
          lengthCm: 56.63,
          widthCm: 16,
          grainType: "硬粒型"
        },
        "pp2_2": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.89",
          size: "603.55x153.03像素",
          hardGrains: 191,
          softGrains: 23,
          totalGrains: 214,
          lengthCm: 60.36,
          widthCm: 15.3,
          grainType: "硬粒型"
        },
        "pp2_3": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.95",
          size: "532.23x168.36像素",
          hardGrains: 106,
          softGrains: 5,
          totalGrains: 111,
          lengthCm: 53.22,
          widthCm: 16.84,
          grainType: "硬粒型"
        },
        "pp2_4": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.97",
          size: "524.67x156.08像素",
          hardGrains: 166,
          softGrains: 5,
          totalGrains: 171,
          lengthCm: 52.47,
          widthCm: 15.61,
          grainType: "硬粒型"
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
        "pp2_0": {
          type: "混合类型",
          cornType: "混合类型",
          proportion: "0.57",
          size: "615.09x176.56像素",
          hardGrains: 77,
          softGrains: 102,
          totalGrains: 179,
          lengthCm: (615.09 / 10).toFixed(2),
          widthCm: (176.56 / 10).toFixed(2),
          grainType: "硬粒型+马齿型"
        },
        "pp2_1": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.74",
          size: "566.26x160.03像素",
          hardGrains: 102,
          softGrains: 36,
          totalGrains: 138,
          lengthCm: (566.26 / 10).toFixed(2),
          widthCm: (160.03 / 10).toFixed(2),
          grainType: "硬粒型"
        },
        "pp2_2": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.89",
          size: "603.55x153.03像素",
          hardGrains: 191,
          softGrains: 23,
          totalGrains: 214,
          lengthCm: (603.55 / 10).toFixed(2),
          widthCm: (153.03 / 10).toFixed(2),
          grainType: "硬粒型"
        },
        "pp2_3": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.95",
          size: "532.23x168.36像素",
          hardGrains: 106,
          softGrains: 5,
          totalGrains: 111,
          lengthCm: (532.23 / 10).toFixed(2),
          widthCm: (168.36 / 10).toFixed(2),
          grainType: "硬粒型"
        },
        "pp2_4": {
          type: "硬粒型",
          cornType: "硬粒型",
          proportion: "0.97",
          size: "524.67x156.08像素",
          hardGrains: 166,
          softGrains: 5,
          totalGrains: 171,
          lengthCm: (524.67 / 10).toFixed(2),
          widthCm: (156.08 / 10).toFixed(2),
          grainType: "硬粒型"
        }
      };
      return mockDataMap[id] || mockDataMap["pp2_0"];
    },
    // 添加时间戳避免图片缓存
    addTimestamp(url) {
      if (!url || url.startsWith("data:"))
        return url;
      return url + (url.includes("?") ? "&" : "?") + Date.now();
    },
    async init() {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const res = await components_request.request({
          url: `/dataCollection/getList?trId=${this.trId}`,
          method: "GET",
          header: {
            "Authorization": token || "",
            "Content-Type": "application/json"
          }
        });
        if (res.code === 200) {
          const resultList = res.data;
          common_vendor.index.__f__("log", "at pages/result/result.vue:397", "所有数据项:", resultList);
          let targetData = resultList.find((item) => item.id + "" === this.dataId);
          if (!targetData) {
            this.initMockOptions();
            this.loadMockData(this.dataId);
            return;
          }
          common_vendor.index.__f__("log", "at pages/result/result.vue:409", "匹配到的数据项:", targetData);
          const acm = targetData.answerContentMap || {};
          const cm = targetData.contentMap || {};
          this.mainImage = acm.图片 || acm.url || cm.url || "@/static/img/pp2.jpg";
          this.longitude = acm.经度 || cm.longitude;
          this.latitude = acm.纬度 || cm.latitude;
          this.altitude = acm.高程 || cm.altitude;
          this.plotId = cm.blockId;
          if (this.taskType === "phenotype") {
            this.plantHeight = acm.株高;
            this.stemDiameter = acm.茎粗;
            this.leafAngle = acm.叶夹角;
            this.earHeight = acm.穗位高;
          }
          if (this.taskType === "roast") {
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
            this.cornType = acm.玉米类型 || "未知";
            this.proportion = acm.类型占比 || "0";
            this.size = acm.玉米尺寸 || "0x0像素";
            this.hardGrainCount = acm.硬粒型籽粒 || "0粒";
            this.马齿GrainCount = acm.马齿型籽粒 || "0粒";
            if (!this.roastid || !this.roasttype) {
              this.supplementMockData(this.dataId);
            }
          }
        } else {
          this.initMockOptions();
          this.loadMockData(this.dataId);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/result/result.vue:459", "请求失败:", err);
        this.initMockOptions();
        this.loadMockData(this.dataId);
      }
    },
    // 补充不完整的烤种数据
    supplementMockData(id) {
      const mockData = this.getMockData(id);
      if (!this.roastid)
        this.roastid = id;
      if (!this.roasttype)
        this.roasttype = mockData.type;
      if (!this.length)
        this.length = `${mockData.lengthCm}cm`;
      if (!this.width)
        this.width = `${mockData.widthCm}cm`;
      if (!this.grainCount)
        this.grainCount = `${mockData.totalGrains}粒`;
      if (!this.grainType)
        this.grainType = mockData.grainType;
      if (!this.cornType)
        this.cornType = mockData.cornType;
      if (!this.proportion)
        this.proportion = mockData.proportion;
      if (!this.size)
        this.size = mockData.size;
      if (!this.hardGrainCount)
        this.hardGrainCount = `${mockData.hardGrains}粒`;
      if (!this.马齿GrainCount)
        this.马齿GrainCount = `${mockData.softGrains}粒`;
    },
    // 根据ID获取默认类型
    getMockType(id) {
      const mockTypes = {
        "pp2_0": "混合类型",
        "pp2_1": "硬粒型",
        "pp2_2": "硬粒型",
        "pp2_3": "硬粒型",
        "pp2_4": "硬粒型"
      };
      return mockTypes[id] || "普通型";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    b: common_assets._imports_0$1
  } : {}, {
    c: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    d: common_assets._imports_1
  } : {}, {
    e: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    f: common_vendor.t($data.longitude || "120.1234")
  } : {}, {
    g: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    h: common_vendor.t($data.latitude || "30.1234")
  } : {}, {
    i: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    j: common_vendor.t($data.altitude || "50m")
  } : {}, {
    k: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    l: common_vendor.t($data.plotId || "A-01")
  } : {}, {
    m: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    n: common_vendor.t($data.plantHeight || "81.85433197cm")
  } : {}, {
    o: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    p: common_vendor.t($data.stemDiameter || "3cm")
  } : {}, {
    q: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    r: common_vendor.t($data.leafAngle || "162.320892333°")
  } : {}, {
    s: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    t: common_vendor.t($data.earHeight || "0cm")
  } : {}, {
    v: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    w: common_vendor.t($data.selectedCornText),
    x: $data.idOptions,
    y: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args))
  } : {}, {
    z: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    A: common_vendor.t($data.roasttype || "请选择玉米ID")
  } : {}, {
    B: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    C: common_vendor.t($data.cornType || "未知"),
    D: common_vendor.t($data.proportion || "0")
  } : {}, {
    E: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    F: common_vendor.t($data.size || "0x0像素")
  } : {}, {
    G: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    H: common_vendor.t($data.hardGrainCount || "0粒")
  } : {}, {
    I: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    J: common_vendor.t($data.马齿GrainCount || "0粒")
  } : {}, {
    K: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    L: common_vendor.t($data.grainCount || "0粒")
  } : {}, {
    M: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    N: common_vendor.t($data.length || "15cm")
  } : {}, {
    O: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    P: common_vendor.t($data.width || "3cm")
  } : {}, {
    Q: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    R: common_vendor.t($data.grainType || "普通型")
  } : {}, {
    S: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    T: common_vendor.t($data.rowCount || "8行")
  } : {}, {
    U: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    V: common_vendor.t($data.diseaseRate || "5%")
  } : {}, {
    W: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    X: common_vendor.t($data.columnCount || "16列")
  } : {}, {
    Y: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    Z: common_vendor.t($data.arrangement || "规则排列")
  } : {}, {
    aa: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    ab: common_vendor.t($data.shape || "椭圆形")
  } : {}, {
    ac: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    ad: common_vendor.t($data.topSize || "中等")
  } : {}, {
    ae: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    af: common_vendor.t($data.color || "黄色")
  } : {}, {
    ag: $data.taskType === "roast"
  }, $data.taskType === "roast" ? {
    ah: common_vendor.t($data.sideSize || "中等")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b615976f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/result/result.js.map
