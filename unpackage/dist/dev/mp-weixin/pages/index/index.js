"use strict";
const common_vendor = require("../../common/vendor.js");
const components_request = require("../../components/request.js");
const CustomTabBar = () => "../../components/tabBar/tabBar.js";
const _sfc_main = {
  components: {
    CustomTabBar
  },
  data() {
    return {
      // 合并后的数据结构
      taskCategories: [
        {
          id: 1,
          name: "表型采集",
          value: "phenotype",
          tasks: [],
          loading: false,
          error: null
        },
        {
          id: 2,
          name: "玉米拷种",
          value: "roast",
          tasks: [],
          loading: false,
          error: null
        },
        {
          id: 3,
          name: "其他",
          value: "other",
          tasks: [],
          loading: false,
          error: null
        }
      ],
      activeCategoryId: null
    };
  },
  methods: {
    // 展开/收起分类
    async toggleCategory(categoryId) {
      if (this.activeCategoryId === categoryId) {
        this.activeCategoryId = null;
        return;
      }
      this.activeCategoryId = categoryId;
      const category = this.taskCategories.find((c) => c.id === categoryId);
      if (!category)
        return;
      if (category.tasks.length > 0 || category.loading)
        return;
      await this.fetchTasks(category);
    },
    async fetchTasks(category) {
      category.loading = true;
      category.error = null;
      try {
        const res = await components_request.request({
          url: "/task/getTask",
          method: "GET",
          header: {
            "Authorization": common_vendor.index.getStorageSync("token") || "",
            "Content-Type": "application/json"
          },
          data: {
            typeId: category.id
          }
        });
        category.tasks = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:119", "获取任务失败:", error);
        category.error = error.message || "获取任务失败，请稍后重试";
      } finally {
        category.loading = false;
      }
    },
    // 跳转到任务详情页
    goToDetail(task, typeValue) {
      common_vendor.index.navigateTo({
        url: `/pages/task-detail/task-detail?id=${task.id}&type=${typeValue}`
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
    a: common_vendor.f($data.taskCategories, (category, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(category.name),
        b: $data.activeCategoryId === category.id ? 1 : "",
        c: common_vendor.o(($event) => $options.toggleCategory(category.id), category.id),
        d: $data.activeCategoryId === category.id
      }, $data.activeCategoryId === category.id ? common_vendor.e({
        e: !category.tasks || !category.tasks.length
      }, !category.tasks || !category.tasks.length ? {} : {
        f: common_vendor.f(category.tasks, (task, k1, i1) => {
          return {
            a: common_vendor.t(task.taskName),
            b: task.id,
            c: common_vendor.o(($event) => $options.goToDetail(task, category.value), task.id)
          };
        })
      }) : {}, {
        g: $data.activeCategoryId === category.id
      }, $data.activeCategoryId === category.id ? common_vendor.e({
        h: category.loading
      }, category.loading ? {} : category.error ? {
        j: common_vendor.t(category.error)
      } : !category.tasks || !category.tasks.length ? {} : {}, {
        i: category.error,
        k: !category.tasks || !category.tasks.length
      }) : {}, {
        l: category.id
      });
    }),
    b: common_vendor.p({
      current: "index"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
