// uploader.js
export async function uploadImage({ filePath, trId, blockId, latitude, longitude, altitude }) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'https://leaf.yuntong.work:1314/dataCollection/upload',
      filePath,
      name: 'file',
      formData: {
        jsonData: JSON.stringify({
          trId,
          content: {
            content: blockId,
            otherField: `纬度:${latitude}, 经度:${longitude}, 高程:${altitude}`
          }
        })
      },
      header: {
        Authorization: uni.getStorageSync('token') || ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(new Error('上传失败：' + res.errMsg));
        }
      },
      fail: reject
    });
  });
}
