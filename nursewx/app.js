// app.js
const http = require('/utils/http.js');
const QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
// const soket = require('/utils/soket.js');
const qqmapsdk = new QQMapWX({
  key: 'U4GBZ-3VJKW-DXORK-OSCOG-SHEO6-LJBWO'
});
App({ 
  onLaunch() { 
    this.getmylocation() 
    const updateManager = wx.getUpdateManager()
    //console.log = () => {}
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
      })
    })
  },
  getmylocation() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // that.setData({
        //   latitude: latitude,
        //   longitude: longitude
        // })
        wx.setStorageSync("lat", latitude)
        wx.setStorageSync("lon", longitude)
        // 根据地图来请求获取定位
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) { //成功后的回调
            console.log(res)
            var res = res.result;

            wx.setStorageSync("province", res.address_component.province)
            wx.setStorageSync("city", res.address_component.city)
            wx.setStorageSync("district", res.address_component.district)
          }
        })
      }
    })
  },
  banned() {
    var that = this
    var url = 'api/users/userData?openid=' + wx.getStorageSync('openid');
    http.getReq(url, function (res) {
      console.log(res.data)
      if (res.code == 200) {
        if (res.data.status == 0) {
          wx.redirectTo({
            url: '/pages/banned/banned',
          })
        }
      }
    })
  },


  globalData: {
    userInfo: null,
  }
})