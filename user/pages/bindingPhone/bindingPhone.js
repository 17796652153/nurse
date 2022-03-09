// pages/bindingPhone/bindingPhone.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 60,
    hide: 2,
    phone: '',
    code: '',
    upper_openid: '',
    istrue: false,
  },
  // 监听离开界面

  //获取电话
  getphone(e) {
    const that = this
    that.setData({
      phone: e.detail.value
    })
  },
  getcode(e) {
    const that = this
    that.setData({
      code: e.detail.value
    })
  },
  //获取验证码
  sendPhone: function () {
    const that = this
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(that.data.phone)) {
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
        phone: that.data.phone
      }
      http.postReq(url, data, function (res) {
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
  // 保存数据
  getsubmit() {
    const that = this
    var url = 'api/users/upPhone'
    // 正则判断手机号是否符合规范
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '号码不符合规范',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var data = {
      phone: that.data.phone,
      code: that.data.code,
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          istrue: true
        })
        wx.showToast({
          title: '成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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