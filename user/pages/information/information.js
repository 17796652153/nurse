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
    alipay_name: '',
    alipay_number: '',
    wechat_number: '',
    phone_code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(){
    wx.enableAlertBeforeUnload({
      message: "是否放弃当前修改",
      success: function (res) {
        console.log("方法注册成功：", res);
      },
      fail: function (errMsg) {
        console.log("方法注册失败：", errMsg);
      },
    });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取电话
  getuser(e) {
    const that = this
    that.data.user.username=e.detail.value
    that.setData({
      user: that.data.user,
    })
  },
  getname(e) {
    const that = this
    that.data.user.name=e.detail.value
    that.setData({
      user: that.data.user,
    })
  },
  getbindphone: function () {
    wx.navigateTo({
      url: '/pages/bindingPhone/bindingPhone',
    })
  },
  cancelBtn: function () {
    var that=this
    if(that.data.user.username==that.data.username){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showModal({
        content: '是否放弃当前修改',
        success (res) {
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
  confirmBtn:function(){
    var url = 'api/users/userUpdate'
    var data = {
      openid: wx.getStorageSync('openid'),
      username:this.data.user.username,
      name:this.data.user.name
    }
    http.postReq(url, data, (res)=> {
      console.log(res)
      if(res.code==200){
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  // username
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getuserdetail()

  },
  // 获取个人数据
  getuserdetail() {
    console.log(231)
    var that = this
    var url = 'api/users/userData'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      var username=res.username
      that.setData({
        user: res,
        username:username
      })
    })
  },
  // getsubmit
  //获取用户输入支付宝名字
  alipayNameInput: function (e) {
    this.setData({
      alipay_name: e.detail.value
    })
  },
  //获取用户输支付宝账号
  alipayNumberInput: function (e) {
    this.setData({
      alipay_number: e.detail.value
    })
  },
  //获取用户输微信名
  wechatNumberInput: function (e) {
    this.setData({
      wechat_number: e.detail.value
    })
  },
  //获取用户输入的验证码
  codeInput: function (e) {
    this.setData({
      phone_code: e.detail.value
    })
  },
  getsubmit() {
    var that = this
    console.log(that.data.alipay_name)
    console.log(that.data.alipay_number)
    console.log(that.data.wechat_number)
    console.log(that.data.phone_code)

    //     openid	是	string	用户openid
    // phone_code	是	string	验证码
    // phone	是	string	手机号
    // alipay_name	是	string	支付宝姓名
    // alipay_number	是	string	支付宝账号
    // wechat_number
    var url = "api/users/updateUserData"
    var data = {
      openid: wx.getStorageSync('openid'),
      phone_code: that.data.phone_code,
      phone: that.data.user.phone,
      alipay_name: that.data.alipay_name,
      alipay_number: that.data.alipay_number,
      wechat_number: that.data.wechat_number,
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: '修改成功',
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
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.cancelBtn()
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