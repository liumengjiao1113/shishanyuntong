// // const BASE_URL = 'http://172.20.10.2:1314';
// const BASE_URL = 'https://leaf.yuntong.work:1314';

// export const request = (options) => {
//   return new Promise(async (resolve, reject) => {
//     const isFormData = options.isFormData === true;
//     const method = options.method || 'GET';
//     const headers = {
//       'Authorization': uni.getStorageSync('token') || ''
//     };

//     if (!isFormData) {
//       headers['Content-Type'] = 'application/json';
//     }

//     // ✅ H5 下的 FormData 请求用 fetch 处理
//     if (isFormData && typeof FormData !== 'undefined' && typeof window !== 'undefined') {
//       try {
//         const res = await fetch(BASE_URL + options.url, {
//           method,
//           headers, // ⚠️ 不手动设置 Content-Type，浏览器会自动附加 multipart/form-data 边界
//           body: options.data
//         });

//         const data = await res.json();

//         if (res.ok) {
//           resolve(data);
//         } else {
//           uni.showToast({
//             title: data.message || data.msg || '服务器错误',
//             icon: 'none'
//           });
//           reject(data);
//         }
//       } catch (err) {
//         uni.showToast({ title: '请求失败，请检查网络', icon: 'none' });
//         reject(err);
//       }
//       return;
//     }

//     // 非 FormData 或非 H5 平台使用 uni.request
//     uni.request({
//       url: BASE_URL + options.url,
//       method,
//       data: options.data || {},
//       header: headers,
//       success: (res) => {
//         if (res.statusCode === 200) {
//           resolve(res.data);
//         } else {
//           uni.showToast({
//             title: res.data.message || res.data.msg || '服务器错误',
//             icon: 'none'
//           });
//           reject(res);
//         }
//       },
//       fail: (err) => {
//         uni.showToast({ title: '请求失败，请检查网络', icon: 'none' });
//         reject(err);
//       }
//     });
//   });
// };
// 支持 App、H5、小程序的 request 封装
// ⚠️ 若用于小程序端，https://leaf.yuntong.work:1314 必须已配置到微信后台 request 合法域名列表中

const BASE_URL = 'https://leaf.yuntong.work:1314';

export const request = (options) => {
  return new Promise(async (resolve, reject) => {
    const isFormData = options.isFormData === true;
    const method = options.method || 'GET';
    const headers = {
      'Authorization': uni.getStorageSync('token') || ''
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // 判断是否 H5 平台，并且使用的是 FormData（浏览器 fetch 支持自动 multipart）
    const isH5 = typeof window !== 'undefined' && typeof FormData !== 'undefined';

    if (isFormData && isH5) {
      try {
        const res = await fetch(BASE_URL + options.url, {
          method,
          headers, // 不手动设置 Content-Type，让浏览器自动附带 multipart/form-data 边界
          body: options.data
        });

        const data = await res.json();
        if (res.ok) {
          resolve(data);
        } else {
          uni.showToast({ title: data.message || data.msg || '服务器错误', icon: 'none' });
          reject(data);
        }
      } catch (err) {
        uni.showToast({ title: '请求失败，请检查网络', icon: 'none' });
        reject(err);
      }
      return;
    }

    // 非 H5 FormData 情况下（App、小程序等）
    uni.request({
      url: BASE_URL + options.url,
      method,
      data: options.data || {},
      header: headers,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          uni.showToast({
            title: res.data.message || res.data.msg || '服务器错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '请求失败，请检查网络', icon: 'none' });
        reject(err);
      }
    });
  });
};
