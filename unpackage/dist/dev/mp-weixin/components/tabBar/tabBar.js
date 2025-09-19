"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    current: String
  },
  data() {
    return {
      home: "/static/tabs/home.png",
      homeActive: "/static/tabs/home-active.png",
      msg: "/static/tabs/member.png",
      msgActive: "/static/tabs/member-active.png"
    };
  },
  methods: {
    goTo(page) {
      if (this.current !== page) {
        common_vendor.index.reLaunch({ url: `/pages/${page}/${page}` });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.current === "index" ? $data.homeActive : $data.home,
    b: $props.current === "index" ? 1 : "",
    c: common_vendor.o(($event) => $options.goTo("index")),
    d: $props.current === "message" ? $data.msgActive : $data.msg,
    e: $props.current === "message" ? 1 : "",
    f: common_vendor.o(($event) => $options.goTo("message"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tabBar/tabBar.js.map
