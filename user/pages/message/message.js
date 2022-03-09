// pages/message/message.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmessage()
  },
  getmessage(){
    var url = 'api/users/userRemind'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url,data,(res)=> {
      console.log(res)
      for(var i=0;i<res.data.length;i++){
        res.data[i].time=time.formatTimeTwo(res.data[i].time, 'Y-M-D h:m:s')
      }
        this.setData({
          message: res.data,
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