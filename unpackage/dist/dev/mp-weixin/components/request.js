"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://leaf.yuntong.work:1314";
const request = (options) => {
  return new Promise(async (resolve, reject) => {
    const isFormData = options.isFormData === true;
    const method = options.method || "GET";
    const headers = {
      "Authorization": common_vendor.index.getStorageSync("token") || ""
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    const isH5 = typeof window !== "undefined" && typeof FormData !== "undefined";
    if (isFormData && isH5) {
      try {
        const res = await fetch(BASE_URL + options.url, {
          method,
          headers,
          // 不手动设置 Content-Type，让浏览器自动附带 multipart/form-data 边界
          body: options.data
        });
        const data = await res.json();
        if (res.ok) {
          resolve(data);
        } else {
          common_vendor.index.showToast({ title: data.message || data.msg || "服务器错误", icon: "none" });
          reject(data);
        }
      } catch (err) {
        common_vendor.index.showToast({ title: "请求失败，请检查网络", icon: "none" });
        reject(err);
      }
      return;
    }
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method,
      data: options.data || {},
      header: headers,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          common_vendor.index.showToast({
            title: res.data.message || res.data.msg || "服务器错误",
            icon: "none"
          });
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({ title: "请求失败，请检查网络", icon: "none" });
        reject(err);
      }
    });
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/request.js.map
