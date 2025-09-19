"use strict";
const common_vendor = require("../../common/vendor.js");
const components_request = require("../../components/request.js");
const CustomTabBar = () => "../../components/tabBar/tabBar.js";
const _sfc_main = {
  components: { CustomTabBar },
  data() {
    return {
      userInfo: {
        username: "",
        password: ""
        // 密码通常不返回明文，这里做默认处理
      }
    };
  },
  async onLoad() {
    const token = common_vendor.index.getStorageSync("token");
    if (!token) {
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
      return;
    }
    try {
      const res = await components_request.request({
        url: "/user/getUserInfo",
        method: "GET",
        header: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      this.userInfo.username = res.data.username || "";
      this.userInfo.password = res.data.password ? "******" : "";
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/message/message.vue:52", "获取信息失败:", error);
      common_vendor.index.clearStorageSync("token");
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    }
  },
  methods: {
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认退出登录？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.showToast({
              title: "退出登录成功",
              icon: "success"
            });
            common_vendor.index.reLaunch({ url: "/pages/login/login" });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_CustomTabBar = common_vendor.resolveComponent("CustomTabBar");
  _component_CustomTabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.userInfo.username),
    b: common_vendor.t($data.userInfo.password),
    c: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    d: common_vendor.p({
      current: "message"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4c1b26cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
