"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      taskType: "",
      // 表型采集
      leftImage: "/static/placeholder-left.jpg",
      rightImage: "/static/placeholder-right.jpg",
      longitude: "120.123456",
      latitude: "30.654321",
      altitude: "50.3m",
      plotId: "A-01",
      // 玉米烤种
      imageSrc: "",
      showCamera: true
    };
  },
  onLoad(options) {
    this.taskType = options.type || "phenotype";
    this.plotId = options.plotId || "A-01";
    if (this.taskType === "roast") {
      this.getLocation();
    }
  },
  methods: {
    getLocation() {
      common_vendor.index.getLocation({
        type: "wgs84",
        success: (res) => {
          this.longitude = res.longitude.toFixed(6);
          this.latitude = res.latitude.toFixed(6);
          this.altitude = (res.altitude || 0).toFixed(1) + "m";
        },
        fail: () => {
          common_vendor.index.showToast({ title: "定位失败", icon: "none" });
        }
      });
    },
    takePhoto() {
      if (this.taskType === "phenotype") {
        common_vendor.index.chooseImage({
          count: 2,
          sourceType: ["camera"],
          success: (res) => {
            this.leftImage = res.tempFilePaths[0];
            this.rightImage = res.tempFilePaths[1] || res.tempFilePaths[0];
          }
        });
      } else if (this.taskType === "roast") {
        const cameraCtx = common_vendor.index.createCameraContext();
        cameraCtx.takePhoto({
          quality: "high",
          success: (res) => {
            this.imageSrc = res.tempImagePath;
            this.showCamera = false;
            const imageData = {
              id: Date.now(),
              url: res.tempImagePath,
              longitude: this.longitude,
              latitude: this.latitude,
              altitude: this.altitude,
              blockId: this.plotId,
              uploadStatus: "notUploaded",
              selected: false,
              progress: 0,
              showProgress: false
            };
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            common_vendor.index.navigateBack();
            setTimeout(() => {
              prevPage.$emit("imageAdded", imageData);
            }, 100);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/collect/collect.vue:210", "拍照失败", err);
            common_vendor.index.showToast({ title: "拍照失败", icon: "none" });
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.taskType === "phenotype"
  }, $data.taskType === "phenotype" ? {
    b: $data.leftImage,
    c: $data.rightImage,
    d: common_vendor.t($data.longitude),
    e: common_vendor.t($data.latitude),
    f: common_vendor.t($data.altitude),
    g: common_vendor.t($data.plotId)
  } : $data.taskType === "roast" ? common_vendor.e({
    i: $data.imageSrc,
    j: $data.showCamera
  }, $data.showCamera ? {} : {}) : {}, {
    h: $data.taskType === "roast",
    k: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b24c290b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collect/collect.js.map
