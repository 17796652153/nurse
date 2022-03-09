// pages/bindingPhone/bindingPhone.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 60,
    hide: 2,
    user: '',
    hospital:'',
    username:'',
    date: '请选择就业时间'
  },


  sendPhone: function () {
    const that = this
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(that.data.user.phone)) {
      wx.showToast({
        title: '号码不符合规范',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      var num = 60;
      this.setData({
        hide: 1
      })
      var times = setInterval(function () {
        num--
        that.setData({
          num: num
        })
        if (num <= 0) {
          clearInterval(times);
          that.setData({
            hide: 2,
            num: 60
          })
        }
      }, 1000)
      var url = 'api/users/sendCode'
      var data = {
        phone: that.data.user.phone
      }
      http.postReq(url, data, function (res) {
        console.log("登录接口", res)
        if (res.code == 200) {
          wx.showToast({
            title: '请等待',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (that.data.user.username == that.data.username && that.data.user.hospital==that.data.hospital  && that.data.user.trade_time==that.data.date) {
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // } else {
    //   wx.enableAlertBeforeUnload({
    //     message: "是否放弃当前修改",
    //     success: function (res) {
    //       console.log("方法注册成功：", res);
    //     },
    //     fail: function (errMsg) {
    //       console.log("方法注册失败：", errMsg);
    //     },
    //   });
    // }
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 获取个人信息详情

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getuserdetail()
  },
  getuser(e) {
    const that = this
    that.setData({
      username:e.detail.value,
    })
  },
  gethospital(e){
    const that = this
    that.setData({
      hospital: e.detail.value,
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
      console.log(res)
      var username = res.nurse_name
      that.setData({
        date: res.trade_time,
        hospital: res.hospital,
        user: res,
        username: username
      })
    })
  },
  // 修改电话
  getbindphone: function () {
    wx.navigateTo({
      url: '/pages/bindingPhone/bindingPhone',
    })
  },
  cancelBtn: function () {
    var that = this
    console.log(that.data.user.username)
    console.log(that.data.username)
    console.log(that.data.user.hospital)
    console.log(that.data.hospital )
    console.log(that.data.user.trade_time)
    console.log(that.data.date)
    if (that.data.user.username == that.data.username && that.data.user.hospital==that.data.hospital  && that.data.user.trade_time==that.data.date) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        content: '是否放弃当前修改',
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  confirmBtn: function () {
    var url = 'api/users/userUpdate'
    var data = {
      openid: wx.getStorageSync('openid'),
      nurse_name: this.data.username,
      trade_time: this.data.date,
      hospital:this.data.hospital
    }
    http.postReq(url, data, (res) => {
      console.log(res)
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
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