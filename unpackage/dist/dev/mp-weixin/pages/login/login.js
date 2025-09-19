"use strict";
const common_vendor = require("../../common/vendor.js");
const components_request = require("../../components/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      // 用户名
      pwd: "",
      // 密码
      logoUrl: "/static/logo.png",
      // 确保图片路径正确（区分大小写）
      systemInfo: {}
    };
  },
  onLoad() {
    this.calculateLayout();
    common_vendor.index.getSystemInfo({
      success: (res) => {
        this.systemInfo = res;
        common_vendor.index.__f__("log", "at pages/login/login.vue:55", "系统信息:", res);
      }
    });
    common_vendor.index.onWindowResize((res) => {
      this.systemInfo = res;
      this.calculateLayout();
    });
  },
  methods: {
    calculateLayout() {
    },
    async login() {
      if (!this.phone) {
        common_vendor.index.showToast({ title: "请输入您的用户名", icon: "none" });
        return;
      }
      if (!this.pwd) {
        common_vendor.index.showToast({ title: "请输入您的密码", icon: "none" });
        return;
      }
      try {
        const res = await components_request.request({
          url: "/user/login",
          method: "POST",
          data: {
            username: this.phone,
            password: this.pwd
          }
        });
        if (res.code === 200 || res.status === "success") {
          common_vendor.index.setStorageSync("token", res.data);
          common_vendor.index.showToast({ title: "登录成功", icon: "none", duration: 1e3 });
          setTimeout(() => {
            common_vendor.index.reLaunch({ url: "/pages/index/index" });
          }, 1e3);
        } else {
          common_vendor.index.showToast({ title: res.message || "登录失败，请检查用户名和密码", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.showToast({ title: "网络错误，请稍后重试", icon: "none" });
        common_vendor.index.__f__("error", "at pages/login/login.vue:101", "登录失败:", error);
      }
    },
    // 图片加载成功回调（调试用）
    onLogoLoad(e) {
      common_vendor.index.__f__("log", "at pages/login/login.vue:106", "logo加载成功", e);
    },
    // 图片加载失败回调（关键调试）
    onLogoError(e) {
      common_vendor.index.__f__("error", "at pages/login/login.vue:110", "logo加载失败:", e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.logoUrl,
    c: common_vendor.o((...args) => $options.onLogoLoad && $options.onLogoLoad(...args)),
    d: common_vendor.o((...args) => $options.onLogoError && $options.onLogoError(...args)),
    e: $data.phone,
    f: common_vendor.o(($event) => $data.phone = $event.detail.value),
    g: $data.pwd,
    h: common_vendor.o(($event) => $data.pwd = $event.detail.value),
    i: common_vendor.o(($event) => $options.login())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
