// pages/route/route.js
// 引入SDK核心类
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'U4GBZ-3VJKW-DXORK-OSCOG-SHEO6-LJBWO'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Height: 0,
    scale: 13,
    latitude: "",
    longitude: "",
    address: '',
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserLocation();
    const _locationChangeFn = res=> {
      console.log('location change', res.latitude, res.longitude)
    } 
    wx.onLocationChange(_locationChangeFn);
  }, 
  getUserLocation() {
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userLocationBackground']) {
          console.log(123)
          wx.startLocationUpdateBackground({
            success: (res) => {
              console.log('startLocationUpdate-res11', res)
            },
            fail: (err) => {
              console.log('startLocationUpdate-err22', err)
            }
          })
        } else {
          if (res.authSetting['scope.userLocation']==false) {
            console.log('打开设置页面去授权')
          } else {  
            wx.startLocationUpdateBackground({
              success: (res) => {
                console.log('startLocationUpdate-res333', res)
              },
              fail: (err) => {
                wx.showModal({
                  title: '警告',
                  content: '实时定位失败，请设置位置为使用时和离开后',
                  showCancel: false,
                  confirmText: '返回授权',
                  success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                      wx.openSetting({
                        success (res) {
                          console.log(res.authSetting)
                          // res.authSetting = {
                          //   "scope.userInfo": true,
                          //   "scope.userLocation": true
                          // }
                        }
                      })
                    }
                  }
                });
                console.log('startLocationUpdate-err444', err)
              }
            })
          }
        }
      }
    })
  },
  formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: e.detail.value.start,
      to: e.detail.value.dest, 
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;

        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        // 设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})