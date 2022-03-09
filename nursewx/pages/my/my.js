// pages/my/my.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
const app = getApp()
var qqmapsdk = new QQMapWX({
  key: 'U4GBZ-3VJKW-DXORK-OSCOG-SHEO6-LJBWO'
});
Page({
 
  /**
   * 页面的初始数据 mysubmit
   */
  data: {
    showLogin:false,
    myorder: false,
    show: false,
    show1: false,
    isLogin: false,
    user: '',
    province: '',
    city: '',
    district: '',
    id: '',
    openid: '',
    signtext: true,
    reward: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求接口判断签到没有，没有签到弹出签到框

  },
  getmylocation() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) { 
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: latitude, 
          longitude: longitude
        })
        // 根据地图来请求获取定位
        qqmapsdk.reverseGeocoder({ 
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) { //成功后的回调
            var res = res.result;
            wx.setStorageSync("province", res.address_component.province)
            wx.setStorageSync("city", res.address_component.city)
            wx.setStorageSync("district", res.address_component.district)
          }
        }) 
      }
    })
  },
  /** 
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    this.getmylocation()
    that.setData({
      user: wx.getStorageSync('user'),
      province: wx.getStorageSync('province'),
      city: wx.getStorageSync('city'),
      district: wx.getStorageSync('district')
    });
    console.log('地址', that.data.province)
    console.log('用户', that.data.user)
    // 判断是否登录
    const openid = wx.getStorageSync('openid');
    console.log("openid", openid);
    if (openid == undefined || openid == undefined || openid.length == 0) {
      that.setData({
        isLogin: true
      });
      console.log("未登录");
    } else {
      that.setData({
        isLogin: false
      });
      that.getnurseOrder()
      that.getuserdetail()
      console.log("已登录", that.data.user.username);
    }
  },

  // 跳转到我的订单
  gettakeorder() {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return
    }
    wx.navigateTo({
      url: '/pages/takeorder/takeorder',
    })
  },

  login() {
    // 微信登录
    const that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("用户信息", res);
        const iv = res.iv;
        const encryptedData = res.encryptedData;
        const avatarUrl = res.userInfo.avatarUrl;
        const nickName = res.userInfo.nickName;
        // 获取定位
        wx.login({
          success: function (res) {
            console.log(res)
            const code = res.code
            console.log(code, 'code')
            // const upper_openid=wx.getStorageSync('upper_openid');
            // const upper_openid = '';
            const url = 'api/login/login2';
            const data = {
              code: code, 
              nickName: nickName,
              avatarUrl: avatarUrl,
              iv: iv,
              encryptedData: encryptedData,
              lng: that.data.longitude,
              lat: that.data.latitude
            }
            console.log('shujju', data)
            http.postReq(url, data, function (res) {
              console.log("登录接口", res)
              if (res.code == 200) {
                wx.setStorageSync("user", res.user)
                // wx.setStorageSync("integral", res.user.integral)
                if (res.user.openid != '' && res.user.openid != undefined) {
                  wx.setStorageSync("openid", res.user.openid)
                }

                that.setData({
                  isLogin: false,
                  user: res.user,
                  id: res.user.id,
                  openid: res.user.openid,
                })
              }

            })
          }
        })
      },
      fail: (err) => {
        console.log(err, "1111");
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    })
  },
  // 跳转到消息中心
  getmessage() {
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  // 获取个人数据
  getuserdetail() {
    var that = this
    var url = 'api/users/userData'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, function (res) {
      that.setData({
        user: res,
      })
    })
  },
  // 获取护士订单
  getnurseOrder() {
    const that = this
    var url = "api/users/nurseOrder"
    var data = {
      openid: wx.getStorageSync('openid'),
      is_type: 1,
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      if (res.data != '' || res.data.lengt > 0) {
        res.data.map(function (item, index, arr) {
          item.add_time = time.formatTimeTwo(item.add_time, 'M-D h:m:s')
        })
        that.setData({
          myorder: true,
          reward: res.data
        })
      }
    })
  },
  //到设置页面
  getsetting() {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return
    }
    wx.navigateTo({
      url: '/pages/information/information',
    })
  },
  Login1: function(e){
    this.setData({
      showLogin: e.detail.showLogin,
    })
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {
    } else {
      this.getnurseOrder()
      this.getuserdetail()
    }
  },
  // 跳转到提现
  getwithdraw() {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return
    }
    var that = this
    wx.navigateTo({
      url: '/pages/withdraw/withdraw?money=' + that.data.user.user_money,
    })
  },
  gettomap(e) {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return
    }
    var id = e.currentTarget.dataset.index
    wx.redirectTo({
      url: '/pages/map/map?id=' + id,
    })
  },
  getcapital() {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return
    }
    wx.navigateTo({
      url: '/pages/capital/capital',
    })
  },
  //下线
  getline() {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return
    }
    var that = this
    var url = 'api/users/line'
    var data = {
      openid: wx.getStorageSync('openid'),
      line: 0
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: '已成功下线',
          icon: 'none',
          duration: 2000
        })
      }
    })
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