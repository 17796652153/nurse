// pages/nurse/nurse.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    user:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
        this.setData({
          id:options.id
        })
        this.getnurseType()
  },
    // 获取个人数据
    getnurseType() {
      var that = this
      var url = 'api/users/userData'
      var data = {
        openid: this.data.id
      }
      http.postReq(url, data, function (res) {
        console.log(res)
        // 获取工作年限
        let date=new Date()
        let year = date.getFullYear();
        console.log(year)
        let trade=res.trade_time.split('-')
        res.trade_time=parseInt(year)-parseInt(trade)+1
        console.log(res.trade_time)
        that.setData({
          user: res,
        })
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