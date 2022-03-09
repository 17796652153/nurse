// pages/withdraw/withdraw.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
var soket = require('../../utils/soket.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allmoney: '150.35',
    amoney: '',
    wxNumber: '',
    name: '',
    creditCard: "",
    openBank: '',
    timer:'',
  },
 debounce(fn, wait) {
   var that=this
    let timer= this.data.timer
    console.log(timer)
    return function () {
      console.log(1,wait)
        clearTimeout(timer);
        console.log(wait)
        timer = setTimeout(fn, wait);
        that.setData({
          timer: timer
        })
    }
}, 

  getall() {
    console.log(231)
    this.setData({
      amoney: this.data.allmoney
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allmoney: options.money
    })
  },
  // 监听输入提现多少
  getmoney(e) {
    this.setData({
      amoney: e.detail.value
    })
  },
  getwxNumber(e) {
    this.setData({
      wxNumber: e.detail.value
    })
  },
  getname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 银行卡号
  getcreditCard(e) {
    this.setData({
      creditCard: e.detail.value
    })
  },
  // 开户行
  getopenBank(e) {
    this.setData({
      openBank: e.detail.value
    })
  },
  //  执行防抖提现
  deposit() {
    var that=this 
    that.debounce(that.gowithdraw(), 5000)
  },
  // 申请提现
  gowithdraw() {
    const that = this
    if (this.data.amoney > this.data.allmoney) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能超过总金额',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    } else if (this.data.amoney == 0) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能为0',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    } else if (this.data.amoney > 200) {
      wx.showModal({
        title: '提示',
        content: '根据微信官方要求，每日提现上线为200元',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }
    // else if(this.data.amoney<20){
    //   wx.showModal({
    //     title: '提示',
    //     content: '提现金额不能小于20元',
    //     showCancel:false,
    //     success (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       }
    //     }
    //   })
    //   return
    // }
    var url = 'api/users/carryMoney'
    var data = {
      openid: wx.getStorageSync('openid'),
      carry_money: that.data.amoney,
      username: wx.getStorageSync('user').username,
      avatar: wx.getStorageSync('user').avatar,
    }
    // if(data.openid==''){
    //   wx.showModal({
    //     title: '警告',
    //     content: '请您登陆后在进行提现',
    //     showCancel: false,
    //     confirmText: '确定',
    //     success: function (res) {
    //       // 用户没有授权成功，不需要改变 isHide 的值
    //     }
    //   })
    //   return ;
    // }
    // console.log(data)
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
        wx.navigateTo({
          url: '/pages/withdraw/withdrawtrue',
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