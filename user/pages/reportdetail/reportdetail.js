// pages/reportdetail/reportdetail.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    indent:'',
    id:'',
  },
  getdetail(e){
    const that=this
    that.setData({
      detail: e.detail.value
    })
  },
  submit(){
    let that=this
    let url = 'api/users/myReportOrder'
    let data = {
      openid: wx.getStorageSync('openid'),
      avatar:this.data.indent.avatar,
      username:this.data.indent.username,
      order_id:this.data.id,
      order:this.data.indent.order,
      content:this.data.detail,
      nurse_username:this.data.nurse_name,
      nurse_openid:this.data.nurse_openid,
    }
    http.postReq(url, data, (res)=>{
      if (res.code == 200) {
        wx.showToast({
          title: '举报成功',
          icon:'none',
          duration:2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 2,
          })
        }, 2000);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 根据订单id获取订单信息
  myorderdetail() {
    var that = this
    var url = 'api/users/orderDetails'
    var data = {
      id: that.data.id
    }
    http.postReq(url, data, (res) => {
      if (res.code == 200) {
          that.setData({
            indent: res.data,
          })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.myorderdetail()
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