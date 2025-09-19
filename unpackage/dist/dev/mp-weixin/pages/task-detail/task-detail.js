"use strict";
const common_vendor = require("../../common/vendor.js");
const components_request = require("../../components/request.js");
const _sfc_main = {
  data() {
    return {
      task: { id: "", taskName: "", position: "", description: "" },
      trid: "",
      showPopup: false,
      newImageUrl: "",
      formAltitude: "",
      formBlockId: "",
      longitude: "",
      latitude: "",
      taskStatus: "new",
      imageAreaHeight: "80vh",
      taskType: "",
      images: []
    };
  },
  async onLoad(options) {
    var _a;
    this.task.id = options.id;
    this.taskStatus = options.status || "new";
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.imageAreaHeight = systemInfo.windowHeight - 400;
    common_vendor.index.__f__("log", "at pages/task-detail/task-detail.vue:113", "接收到参数：", options);
    if (options.type === "phenotype" || options.type === "roast") {
      this.taskType = options.type;
    } else {
      const typeMap = { "表型采集": "phenotype", "玉米烤种": "roast" };
      this.taskType = typeMap[options.type] || "phenotype";
    }
    let tridFromServer = null;
    const token = common_vendor.index.getStorageSync("token");
    try {
      const res = await components_request.request({
        url: `/taskReceipt/get?taskId=${this.task.id}`,
        method: "GET",
        header: { "Authorization": token }
      });
      tridFromServer = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.trid) || null;
    } catch (err) {
      common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:139", "获取回执失败", err);
    }
    const storedTridMap = common_vendor.index.getStorageSync("tridMap") || {};
    if (tridFromServer) {
      this.trid = tridFromServer;
      storedTridMap[this.task.id] = this.trid;
      common_vendor.index.setStorageSync("tridMap", storedTridMap);
    } else if (storedTridMap[this.task.id]) {
      this.trid = storedTridMap[this.task.id];
    } else {
      try {
        const createRes = await components_request.request({
          url: `/taskReceipt/create?taskId=${this.task.id}`,
          method: "POST",
          header: { "Authorization": token }
        });
        this.trid = createRes.data;
        storedTridMap[this.task.id] = this.trid;
        common_vendor.index.setStorageSync("tridMap", storedTridMap);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:159", "任务回执创建失败", err);
      }
    }
    if (this.task.id) {
      try {
        const res = await components_request.request({
          url: "/task/getTask",
          method: "GET",
          data: { id: this.task.id },
          header: { "Authorization": token }
        });
        if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
          const targetTask = res.data.find((task) => task.id == this.task.id);
          if (targetTask) {
            this.task = {
              id: targetTask.id,
              taskName: targetTask.taskName,
              position: targetTask.create_time,
              description: targetTask.uploadImage
            };
          } else {
            common_vendor.index.showToast({ title: "未找到对应ID的任务", icon: "none" });
          }
        } else {
          common_vendor.index.showToast({ title: "未查询到任务", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:188", "获取任务详情失败:", err);
        common_vendor.index.showToast({ title: "加载任务失败", icon: "none" });
      }
    }
    const localImgs = common_vendor.index.getStorageSync(`localImages_${this.task.id}`);
    if (localImgs && Array.isArray(localImgs)) {
      this.images = localImgs;
    }
  },
  methods: {
    async requestLocationPermission() {
      if (typeof common_vendor.index.getSetting === "function" && typeof common_vendor.index.authorize === "function") {
        try {
          const res = await common_vendor.index.getSetting();
          if (!res.authSetting["scope.userLocation"]) {
            await common_vendor.index.authorize({ scope: "scope.userLocation" });
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:215", "位置权限授权失败：", err);
          common_vendor.index.showToast({ title: "请手动开启定位权限", icon: "none" });
        }
      }
    },
    // App端权限申请（增加API存在检查）
    async requestAppPermissions() {
      try {
        if (typeof common_vendor.index.requestPermissions === "function") {
          const albumAuth = await common_vendor.index.requestPermissions({
            scope: "scope.album"
          });
          if (albumAuth[0].authResult !== "granted") {
            common_vendor.index.showToast({ title: "请授予相册权限以使用上传功能", icon: "none" });
          }
        }
        if (typeof common_vendor.index.requestPermissions === "function") {
          const locationAuth = await common_vendor.index.requestPermissions({
            scope: "scope.userLocation"
          });
          if (locationAuth[0].authResult !== "granted") {
            common_vendor.index.showToast({ title: "请授予位置权限以获取定位信息", icon: "none" });
          }
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:244", "权限申请失败:", err);
      }
    },
    // 状态文本转换
    statusLabel(status) {
      const labels = { new: "新建", started: "已开始", ended: "已结束" };
      return labels[status] || "未知状态";
    },
    // 切换任务状态
    changeTaskStatus(newStatus) {
      if (this.taskStatus !== newStatus) {
        this.taskStatus = newStatus;
        common_vendor.index.showToast({ title: `状态已切换为：${this.statusLabel(newStatus)}`, icon: "none" });
      }
    },
    // 切换影像选中状态
    toggleSelect(img) {
      if (img.uploadStatus === "notUploaded") {
        img.selected = !img.selected;
      }
    },
    // 上传状态文本
    uploadStatusText(status) {
      const texts = { notUploaded: "未上传", uploaded: "已上传", settled: "已结算" };
      return texts[status] || "";
    },
    // 上传选中影像（统一跨平台逻辑）
    async uploadSelectedImages() {
      const selectedImages = this.images.filter((img) => img.selected);
      if (selectedImages.length === 0) {
        common_vendor.index.showToast({ title: "请先选中影像", icon: "none" });
        return;
      }
      for (const img of selectedImages) {
        if (img.uploadStatus !== "notUploaded")
          continue;
        common_vendor.index.showLoading({ title: "上传中..." });
        img.showProgress = true;
        img.progress = 0;
        try {
          const formData = {
            jsonData: JSON.stringify({
              trId: this.trid,
              content: {
                content: img.blockId,
                otherField: `纬度:${img.latitude || "未知"}, 经度:${img.longitude || "未知"}, 高程:${img.altitude || "未知"}`
              }
            })
          };
          await new Promise((resolve, reject) => {
            common_vendor.index.uploadFile({
              url: "https://leaf.yuntong.work:1314/dataCollection/upload",
              filePath: img.url,
              name: "file",
              formData,
              header: {
                "Authorization": common_vendor.index.getStorageSync("token") || ""
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
          img.uploadStatus = "uploaded";
          img.selected = false;
          common_vendor.index.showToast({ title: "上传成功", icon: "success" });
          const timer = setInterval(() => {
            img.progress += 20;
            if (img.progress >= 100) {
              clearInterval(timer);
              img.uploadStatus = "settled";
              img.showProgress = false;
              common_vendor.index.setStorageSync(`localImages_${this.task.id}`, this.images);
              common_vendor.index.showToast({ title: "已结算", icon: "none" });
            }
          }, 1e3);
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:347", "上传失败:", err);
          common_vendor.index.showToast({ title: err.message || "上传失败", icon: "none" });
          img.showProgress = false;
        } finally {
          common_vendor.index.hideLoading();
        }
      }
    },
    // 查看结果
    viewResult(img) {
      if (img.uploadStatus !== "settled") {
        common_vendor.index.showToast({ title: "仅支持查看已结算影像", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/result/result?id=${this.task.id}&type=${this.taskType}&trid=${this.trid}`
      });
    },
    // 从图库选择图片（增加API存在检查）
    async chooseFromAlbum() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          this.newImageUrl = res.tempFilePaths[0];
          this.showPopup = true;
          if (this.taskType === "phenotype" || this.taskType === "roast") {
            this.getLocationForImage();
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:396", "选择图片失败:", err);
          common_vendor.index.showToast({ title: "选择图片失败", icon: "none" });
        }
      });
    },
    async getLocationForImage() {
      var _a, _b, _c;
      try {
        await this.requestLocationPermission();
        const res = await common_vendor.index.getLocation({ type: "wgs84" });
        this.longitude = ((_a = res.longitude) == null ? void 0 : _a.toFixed(6)) || "";
        this.latitude = ((_b = res.latitude) == null ? void 0 : _b.toFixed(6)) || "";
        if (!this.formAltitude) {
          this.formAltitude = (res.altitude || 0).toFixed(2);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/task-detail/task-detail.vue:413", "getLocation fail:", err);
        if ((_c = err.errMsg) == null ? void 0 : _c.includes("denied")) {
          common_vendor.index.showModal({
            title: "定位权限被拒绝",
            content: "请在设置中开启定位权限",
            showCancel: false
          });
        } else {
          common_vendor.index.showToast({ title: "获取定位失败", icon: "none" });
        }
      }
    },
    // 提交弹窗信息
    submitPopup() {
      const newImg = {
        id: Date.now(),
        url: this.newImageUrl,
        uploadStatus: "notUploaded",
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
      common_vendor.index.setStorageSync(`localImages_${this.task.id}`, this.images);
      common_vendor.index.showToast({ title: "添加成功", icon: "success" });
    },
    // 取消弹窗
    cancelPopup() {
      this.resetPopup();
    },
    // 重置弹窗
    resetPopup() {
      this.showPopup = false;
      this.newImageUrl = "";
      this.formAltitude = "";
      this.formBlockId = "";
      this.longitude = "";
      this.latitude = "";
    },
    // 删除影像
    deleteImage(idx) {
      this.images.splice(idx, 1);
      common_vendor.index.setStorageSync(`localImages_${this.task.id}`, this.images);
    },
    // 采集图像
    addImages() {
      common_vendor.index.navigateTo({
        url: `/pages/collect/collect?type=${this.taskType}&plotId=${this.task.position}`
      });
    },
    onReady() {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.on("imageAdded", (img) => {
          this.images.push(img);
          common_vendor.index.setStorageSync(`localImages_${this.task.id}`, this.images);
          common_vendor.index.showToast({ title: "采集影像添加成功", icon: "success" });
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showPopup
  }, $data.showPopup ? {
    b: $data.longitude,
    c: $data.latitude,
    d: $data.formAltitude,
    e: common_vendor.o(($event) => $data.formAltitude = $event.detail.value),
    f: $data.formBlockId,
    g: common_vendor.o(($event) => $data.formBlockId = $event.detail.value),
    h: common_vendor.o((...args) => $options.submitPopup && $options.submitPopup(...args)),
    i: common_vendor.o((...args) => $options.cancelPopup && $options.cancelPopup(...args))
  } : {}, {
    j: common_vendor.n($data.taskStatus === "new" ? "active" : ""),
    k: common_vendor.o(($event) => $options.changeTaskStatus("new")),
    l: common_vendor.n($data.taskStatus === "started" ? "active" : ""),
    m: common_vendor.o(($event) => $options.changeTaskStatus("started")),
    n: common_vendor.n($data.taskStatus === "ended" ? "active" : ""),
    o: common_vendor.o(($event) => $options.changeTaskStatus("ended")),
    p: common_vendor.t($data.task.taskName),
    q: common_vendor.t($data.task.id),
    r: common_vendor.t($data.task.description),
    s: common_vendor.t($data.task.position),
    t: common_vendor.f($data.images, (img, idx, i0) => {
      return common_vendor.e({
        a: img.url,
        b: img.showProgress
      }, img.showProgress ? {
        c: img.progress
      } : {}, {
        d: img.selected ? 1 : "",
        e: common_vendor.o(($event) => $options.toggleSelect(img), img.id),
        f: common_vendor.t($options.uploadStatusText(img.uploadStatus)),
        g: img.uploadStatus !== "settled",
        h: common_vendor.o(($event) => $options.viewResult(img), img.id),
        i: common_vendor.o(($event) => $options.deleteImage(idx), img.id),
        j: img.id
      });
    }),
    v: $data.imageAreaHeight + "px",
    w: common_vendor.o((...args) => $options.uploadSelectedImages && $options.uploadSelectedImages(...args)),
    x: common_vendor.o((...args) => $options.addImages && $options.addImages(...args)),
    y: common_vendor.o((...args) => $options.chooseFromAlbum && $options.chooseFromAlbum(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fb7e27ab"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/task-detail/task-detail.js.map
