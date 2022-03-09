// pages/test1/test.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReport()
    this.getReport1()
  },
  getReport() {
    var url = 'api/users/advertisement'
    var data = {
      pid: 1
    }
    http.postReq(url, data, (res) => {
      console.log("轮播post", res)
      if (res.code == 200) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].image = http.rootDocment + res.data[i].ad_image
        }
        this.setData({
          background: res.data
        })
      }
    })
  },
  getReport1() {
    var url = 'api/users/advertisement?pid=1'
    http.getReq(url, (res) => {
      console.log("轮播get", res)
      if (res.code == 200) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].image = http.rootDocment + res.data[i].ad_image
        }
        this.setData({
          background: res.data
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